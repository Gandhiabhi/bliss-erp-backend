import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthenticatedUser, query?: { search?: string; status?: string }) {
    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');

    const where: any = {
      deletedAt: null,
    };

    if (!isSuperAdmin) {
      if (!user.branchId) {
        throw new ForbiddenException('User is not assigned to any branch');
      }
      where.id = user.branchId;
    }

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { branchCode: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { country: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const branches = await this.prisma.branch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            customers: true,
            staff: true,
            memberships: true,
            visits: true,
          },
        },
      },
    });

    return branches;
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && user.branchId !== id) {
      throw new ForbiddenException('Access denied to this branch');
    }

    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            userRoles: { include: { role: true } },
          },
        },
        staff: true,
        _count: {
          select: {
            customers: true,
            memberships: true,
            visits: true,
          },
        },
      },
    });

    if (!branch || branch.deletedAt) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async create(dto: CreateBranchDto, actor: AuthenticatedUser) {
    const existing = await this.prisma.branch.findUnique({
      where: { branchCode: dto.branchCode },
    });

    if (existing) {
      throw new ConflictException(`Branch code '${dto.branchCode}' is already in use`);
    }

    const branch = await this.prisma.branch.create({
      data: {
        branchCode: dto.branchCode.toUpperCase().trim(),
        name: dto.name,
        country: dto.country,
        state: dto.state,
        city: dto.city,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        timezone: dto.timezone,
        currency: dto.currency.toUpperCase(),
        openingTime: dto.openingTime,
        closingTime: dto.closingTime,
        status: dto.status || 'ACTIVE',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        branchId: branch.id,
        action: 'BRANCH_CREATED',
        entityType: 'Branch',
        entityId: branch.id,
        afterData: branch as any,
      },
    });

    return branch;
  }

  async update(id: string, dto: UpdateBranchDto, actor: AuthenticatedUser) {
    const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && actor.branchId !== id) {
      throw new ForbiddenException('You can only update your own branch');
    }

    const existing = await this.prisma.branch.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Branch not found');
    }

    const updated = await this.prisma.branch.update({
      where: { id },
      data: {
        ...dto,
        currency: dto.currency ? dto.currency.toUpperCase() : undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        branchId: updated.id,
        action: 'BRANCH_UPDATED',
        entityType: 'Branch',
        entityId: updated.id,
        beforeData: existing as any,
        afterData: updated as any,
      },
    });

    return updated;
  }

  async remove(id: string, actor: AuthenticatedUser) {
    const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admin can deactivate branches');
    }

    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    // Soft delete
    const updated = await this.prisma.branch.update({
      where: { id },
      data: {
        status: 'INACTIVE',
        deletedAt: new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        branchId: id,
        action: 'BRANCH_DEACTIVATED',
        entityType: 'Branch',
        entityId: id,
        afterData: updated as any,
      },
    });

    return { message: 'Branch deactivated successfully' };
  }
}
