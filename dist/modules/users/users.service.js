var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException, } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user, query) {
        const effectiveBranchId = resolveBranchId(user, query?.branchId);
        const where = {};
        if (effectiveBranchId) {
            where.branchId = effectiveBranchId;
        }
        if (query?.search) {
            where.OR = [
                { email: { contains: query.search, mode: 'insensitive' } },
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const users = await this.prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                branchId: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
                branch: {
                    select: {
                        id: true,
                        branchCode: true,
                        name: true,
                        city: true,
                        country: true,
                    },
                },
                userRoles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });
        return users.map((u) => ({
            ...u,
            roles: u.userRoles.map((ur) => ur.role.name),
        }));
    }
    async findOne(id, user) {
        const targetUser = await this.prisma.user.findUnique({
            where: { id },
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
        if (!targetUser) {
            throw new NotFoundException('User not found');
        }
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && targetUser.branchId !== user.branchId) {
            throw new ForbiddenException('Access denied to user in another branch');
        }
        return {
            id: targetUser.id,
            email: targetUser.email,
            firstName: targetUser.firstName,
            lastName: targetUser.lastName,
            phone: targetUser.phone,
            branchId: targetUser.branchId,
            branch: targetUser.branch,
            isActive: targetUser.isActive,
            lastLoginAt: targetUser.lastLoginAt,
            createdAt: targetUser.createdAt,
            roles: targetUser.userRoles.map((ur) => ur.role.name),
        };
    }
    async create(dto, actor) {
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        let branchId = dto.branchId;
        if (!isSuperAdmin) {
            if (!actor.branchId) {
                throw new ForbiddenException('Branch manager has no branch assigned');
            }
            branchId = actor.branchId;
        }
        if (!isSuperAdmin) {
            const forbiddenRoles = ['SUPER_ADMIN', 'ADMIN'];
            const hasForbiddenRole = dto.roleNames.some((r) => forbiddenRoles.includes(r));
            if (hasForbiddenRole) {
                throw new ForbiddenException('Cannot assign administrative roles');
            }
        }
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (existing) {
            throw new ConflictException(`User with email '${dto.email}' already exists`);
        }
        const roles = await this.prisma.role.findMany({
            where: { name: { in: dto.roleNames } },
        });
        if (roles.length === 0) {
            throw new BadRequestException('No valid roles provided');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase().trim(),
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                branchId,
                isActive: true,
                userRoles: {
                    create: roles.map((role) => ({ roleId: role.id })),
                },
            },
            include: {
                branch: true,
                userRoles: { include: { role: true } },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId,
                action: 'USER_CREATED',
                entityType: 'User',
                entityId: newUser.id,
                afterData: { email: newUser.email, roles: dto.roleNames, branchId },
            },
        });
        return {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phone: newUser.phone,
            branchId: newUser.branchId,
            branch: newUser.branch,
            roles: newUser.userRoles.map((ur) => ur.role.name),
        };
    }
    async update(id, dto, actor) {
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        const existing = await this.prisma.user.findUnique({
            where: { id },
            include: { userRoles: { include: { role: true } } },
        });
        if (!existing) {
            throw new NotFoundException('User not found');
        }
        if (!isSuperAdmin && existing.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot edit user in another branch');
        }
        const updateData = {};
        if (dto.firstName !== undefined)
            updateData.firstName = dto.firstName;
        if (dto.lastName !== undefined)
            updateData.lastName = dto.lastName;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        if (isSuperAdmin && dto.branchId !== undefined) {
            updateData.branchId = dto.branchId || null;
        }
        if (dto.password) {
            updateData.passwordHash = await bcrypt.hash(dto.password, 10);
        }
        if (dto.roleNames && dto.roleNames.length > 0) {
            if (!isSuperAdmin && dto.roleNames.some((r) => ['SUPER_ADMIN', 'ADMIN'].includes(r))) {
                throw new ForbiddenException('Cannot assign administrative roles');
            }
            const roles = await this.prisma.role.findMany({
                where: { name: { in: dto.roleNames } },
            });
            await this.prisma.$transaction([
                this.prisma.userRole.deleteMany({ where: { userId: id } }),
                this.prisma.userRole.createMany({
                    data: roles.map((r) => ({ userId: id, roleId: r.id })),
                }),
            ]);
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                branch: true,
                userRoles: { include: { role: true } },
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId: updated.branchId,
                action: 'USER_UPDATED',
                entityType: 'User',
                entityId: updated.id,
                beforeData: existing,
                afterData: updated,
            },
        });
        return {
            id: updated.id,
            email: updated.email,
            firstName: updated.firstName,
            lastName: updated.lastName,
            phone: updated.phone,
            branchId: updated.branchId,
            branch: updated.branch,
            isActive: updated.isActive,
            roles: updated.userRoles.map((ur) => ur.role.name),
        };
    }
    async getRoles() {
        return this.prisma.role.findMany({
            orderBy: { name: 'asc' },
            include: {
                rolePermissions: {
                    include: { permission: true },
                },
            },
        });
    }
    async getPermissions() {
        return this.prisma.permission.findMany({
            orderBy: [{ module: 'asc' }, { name: 'asc' }],
        });
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map