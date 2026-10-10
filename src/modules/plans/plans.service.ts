import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthenticatedUser, query?: { branchId?: string; search?: string; status?: string }) {
    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');

    const where: any = {
      deletedAt: null,
    };

    if (query?.status) {
      where.status = query.status;
    }

    if (isSuperAdmin) {
      if (query?.branchId) {
        where.OR = [{ branchId: query.branchId }, { branchId: null }];
      }
    } else {
      if (!user.branchId) {
        throw new ForbiddenException('User is not assigned to any branch');
      }
      // Branch user can see their branch plans AND global plans (branchId = null)
      where.OR = [{ branchId: user.branchId }, { branchId: null }];
    }

    if (query?.search) {
      where.AND = [
        {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { code: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    return this.prisma.planTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        branch: { select: { id: true, name: true, branchCode: true, currency: true } },
        services: {
          include: {
            service: true,
            serviceVariant: true,
          },
        },
        _count: { select: { memberships: true } },
      },
    });
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const plan = await this.prisma.planTemplate.findUnique({
      where: { id },
      include: {
        branch: true,
        services: {
          include: {
            service: true,
            serviceVariant: true,
          },
        },
        _count: { select: { memberships: true } },
      },
    });

    if (!plan || plan.deletedAt) {
      throw new NotFoundException('Plan template not found');
    }

    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && plan.branchId && plan.branchId !== user.branchId) {
      throw new ForbiddenException('Access denied to plan in another branch');
    }

    return plan;
  }

  async create(dto: CreatePlanDto, actor: AuthenticatedUser) {
    const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');

    let branchId = dto.branchId || null;
    if (!isSuperAdmin) {
      if (!actor.branchId) {
        throw new ForbiddenException('Actor has no branch assigned');
      }
      branchId = actor.branchId;
    }

    const existing = await this.prisma.planTemplate.findUnique({
      where: { code: dto.code.toUpperCase().trim() },
    });

    if (existing) {
      throw new ConflictException(`Plan code '${dto.code}' already exists`);
    }

    if (!dto.services || dto.services.length === 0) {
      throw new BadRequestException('At least one service must be added to the plan');
    }

    const plan = await this.prisma.planTemplate.create({
      data: {
        code: dto.code.toUpperCase().trim(),
        name: dto.name,
        branchId,
        description: dto.description,
        durationDays: dto.durationDays,
        price: dto.price,
        currency: (dto.currency || 'AED').toUpperCase(),
        status: 'ACTIVE',
        createdById: actor.id,
        services: {
          create: dto.services.map((s) => ({
            serviceId: s.serviceId,
            serviceVariantId: s.serviceVariantId || null,
            quantity: s.quantity,
          })),
        },
      },
      include: {
        services: {
          include: {
            service: true,
            serviceVariant: true,
          },
        },
        branch: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        branchId,
        action: 'PLAN_TEMPLATE_CREATED',
        entityType: 'PlanTemplate',
        entityId: plan.id,
        afterData: plan as any,
      },
    });

    return plan;
  }

  async update(id: string, dto: UpdatePlanDto, actor: AuthenticatedUser) {
    const existing = await this.prisma.planTemplate.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Plan template not found');
    }

    const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && existing.branchId && existing.branchId !== actor.branchId) {
      throw new ForbiddenException('Cannot edit plan belonging to another branch');
    }

    // If services array is updated
    if (dto.services) {
      await this.prisma.$transaction([
        this.prisma.planTemplateService.deleteMany({ where: { planTemplateId: id } }),
        this.prisma.planTemplateService.createMany({
          data: dto.services.map((s) => ({
            planTemplateId: id,
            serviceId: s.serviceId,
            serviceVariantId: s.serviceVariantId || null,
            quantity: s.quantity,
          })),
        }),
      ]);
    }

    const updated = await this.prisma.planTemplate.update({
      where: { id },
      data: {
        name: dto.name !== undefined ? dto.name : undefined,
        description: dto.description !== undefined ? dto.description : undefined,
        durationDays: dto.durationDays !== undefined ? dto.durationDays : undefined,
        price: dto.price !== undefined ? dto.price : undefined,
        currency: dto.currency ? dto.currency.toUpperCase() : undefined,
        status: dto.status !== undefined ? dto.status : undefined,
      },
      include: {
        services: {
          include: {
            service: true,
            serviceVariant: true,
          },
        },
        branch: true,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        branchId: existing.branchId,
        action: 'PLAN_TEMPLATE_UPDATED',
        entityType: 'PlanTemplate',
        entityId: updated.id,
        beforeData: existing as any,
        afterData: updated as any,
      },
    });

    return updated;
  }

  async remove(id: string, actor: AuthenticatedUser) {
    const existing = await this.prisma.planTemplate.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Plan template not found');
    }

    const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && existing.branchId && existing.branchId !== actor.branchId) {
      throw new ForbiddenException('Cannot delete plan from another branch');
    }

    await this.prisma.planTemplate.update({
      where: { id },
      data: { status: 'INACTIVE', deletedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        branchId: existing.branchId,
        action: 'PLAN_TEMPLATE_DEACTIVATED',
        entityType: 'PlanTemplate',
        entityId: id,
      },
    });

    return { message: 'Plan template deactivated successfully' };
  }
}
