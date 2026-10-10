import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email.toLowerCase().trim() },
      include: {
        branch: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissionSet = new Set<string>();
    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        if (rp.permission?.name) {
          permissionSet.add(rp.permission.name);
        }
      }
    }
    const permissions = Array.from(permissionSet);

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'blish-super-secure-jwt-secret-key-2026-production-grade',
      expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'blish-super-secure-refresh-jwt-secret-key-2026-production',
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        refreshTokenHash,
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorName: `${user.firstName} ${user.lastName}`,
        branchId: user.branchId,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        branchId: user.branchId,
        branch: user.branch
          ? {
              id: user.branch.id,
              branchCode: user.branch.branchCode,
              name: user.branch.name,
              currency: user.branch.currency,
              timezone: user.branch.timezone,
              country: user.branch.country,
              city: user.branch.city,
            }
          : null,
        roles,
        permissions,
      },
    };
  }

  async refreshToken(rawRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(rawRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'blish-super-secure-refresh-jwt-secret-key-2026-production',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh session');
      }

      const isMatch = await bcrypt.compare(rawRefreshToken, user.refreshTokenHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid or reused refresh token');
      }

      const newPayload = { sub: user.id, email: user.email };
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET || 'blish-super-secure-jwt-secret-key-2026-production-grade',
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET || 'blish-super-secure-refresh-jwt-secret-key-2026-production',
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
      });

      const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: newRefreshTokenHash },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        refreshTokenHash: null, // Invalidate all other sessions
      },
    });

    return { message: 'Password updated successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        branch: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissionSet = new Set<string>();
    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        if (rp.permission?.name) {
          permissionSet.add(rp.permission.name);
        }
      }
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      branchId: user.branchId,
      branch: user.branch,
      roles,
      permissions: Array.from(permissionSet),
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Logged out successfully' };
  }
}
