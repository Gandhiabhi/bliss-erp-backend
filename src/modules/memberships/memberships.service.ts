import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import {
  CreateMembershipDto,
  UpdateMembershipStatusDto,
} from './dto/membership.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    user: AuthenticatedUser,
    query?: {
      branchId?: string;
      customerId?: string;
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const effectiveBranchId = resolveBranchId(user, query?.branchId);

    const where: any = {};
    if (effectiveBranchId) {
      where.branchId = effectiveBranchId;
    }

    if (query?.customerId) {
      where.customerId = query.customerId;
    }

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.search) {
      where.OR = [
        { membershipCode: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
        { customer: { displayName: { contains: query.search, mode: 'insensitive' } } },
        { customer: { phone: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query?.limit) || 20));
    const skip = (page - 1) * limit;

    const [total, memberships] = await Promise.all([
      this.prisma.membership.count({ where }),
      this.prisma.membership.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, displayName: true, phone: true, customerCode: true } },
          branch: { select: { id: true, name: true, branchCode: true, currency: true } },
          planTemplate: { select: { id: true, code: true, name: true } },
          services: {
            include: {
              service: true,
              serviceVariant: true,
            },
          },
          _count: { select: { visits: true, payments: true } },
        },
      }),
    ]);

    const enhanced = memberships.map((m) => {
      let totalAllocated = 0;
      let totalConsumed = 0;

      for (const s of m.services) {
        totalAllocated += s.allocatedQuantity;
        totalConsumed += s.consumedQuantity;
      }

      return {
        ...m,
        totalAllocated,
        totalConsumed,
        totalRemaining: Math.max(0, totalAllocated - totalConsumed),
      };
    });

    return {
      data: enhanced,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        planTemplate: true,
        services: {
          include: {
            service: true,
            serviceVariant: true,
            visitServices: {
              include: {
                visit: true,
                staff: true,
              },
            },
          },
        },
        visits: {
          orderBy: { visitDate: 'desc' },
          include: {
            visitServices: {
              include: {
                service: true,
                serviceVariant: true,
                staff: true,
              },
            },
          },
        },
        invoices: {
          include: {
            items: true,
            payments: true,
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && membership.branchId !== user.branchId) {
      throw new ForbiddenException('Access denied to membership from another branch');
    }

    return membership;
  }

  async create(dto: CreateMembershipDto, actor: AuthenticatedUser) {
    // 1. Resolve customer and branch
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
      include: { branch: true },
    });

    if (!customer || customer.deletedAt) {
      throw new NotFoundException('Customer not found');
    }

    const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && customer.branchId !== actor.branchId) {
      throw new ForbiddenException('Cannot create membership for a customer from another branch');
    }

    const branchId = customer.branchId;
    const branch = customer.branch;

    // 2. Prepare service allocations
    let serviceAllocations: Array<{
      serviceId: string;
      serviceVariantId?: string | null;
      allocatedQuantity: number;
      notes?: string;
    }> = [];

    if (dto.services && dto.services.length > 0) {
      serviceAllocations = dto.services.map((s) => ({
        serviceId: s.serviceId,
        serviceVariantId: s.serviceVariantId || null,
        allocatedQuantity: s.allocatedQuantity,
        notes: s.notes,
      }));
    } else if (dto.planTemplateId) {
      const template = await this.prisma.planTemplate.findUnique({
        where: { id: dto.planTemplateId },
        include: { services: true },
      });

      if (!template || template.deletedAt) {
        throw new NotFoundException('Plan template not found');
      }

      serviceAllocations = template.services.map((s) => ({
        serviceId: s.serviceId,
        serviceVariantId: s.serviceVariantId,
        allocatedQuantity: s.quantity,
      }));
    } else {
      throw new BadRequestException('Membership must include service allocations or a valid plan template');
    }

    // 3. Financial calculations
    const price = Number(dto.price);
    const discount = Number(dto.discount || 0);
    const tax = Number(dto.tax || 0);
    const finalAmount = Math.max(0, price - discount + tax);
    const currency = (dto.currency || branch.currency || 'AED').toUpperCase();

    // Generate codes
    const count = await this.prisma.membership.count({ where: { branchId } });
    const codePrefix = branch.branchCode ? branch.branchCode.replace(/[^a-zA-Z0-9]/g, '') : 'BR';
    const year = new Date().getFullYear();
    const membershipCode = `MEM-${codePrefix}-${year}-${String(count + 1).padStart(4, '0')}`;
    const invoiceNumber = `INV-${codePrefix}-${year}-${String(count + 1).padStart(4, '0')}`;
    const paymentCode = `PAY-${codePrefix}-${year}-${String(count + 1).padStart(4, '0')}`;

    const initialPaymentStatus = dto.recordPayment ? PaymentStatus.PAID : PaymentStatus.PENDING;

    // 4. Atomic transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create membership with snapshot service entitlements
      const membership = await tx.membership.create({
        data: {
          membershipCode,
          customerId: customer.id,
          branchId,
          planTemplateId: dto.planTemplateId || null,
          isCustomPlan: dto.isCustomPlan ?? !dto.planTemplateId,
          name: dto.name,
          description: dto.description,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          price,
          currency,
          discount,
          tax,
          finalAmount,
          paymentStatus: initialPaymentStatus,
          status: 'ACTIVE',
          notes: dto.notes,
          createdById: actor.id,
          services: {
            create: serviceAllocations.map((sa) => ({
              serviceId: sa.serviceId,
              serviceVariantId: sa.serviceVariantId || null,
              allocatedQuantity: sa.allocatedQuantity,
              consumedQuantity: 0,
              notes: sa.notes,
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
        },
      });

      // Create snapshot invoice
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          branchId,
          customerId: customer.id,
          membershipId: membership.id,
          subtotal: price,
          discount,
          tax,
          total: finalAmount,
          paidAmount: dto.recordPayment ? finalAmount : 0,
          balanceAmount: dto.recordPayment ? 0 : finalAmount,
          currency,
          status: dto.recordPayment ? 'PAID' : 'ISSUED',
          issueDate: new Date(),
          dueDate: new Date(dto.startDate),
          items: {
            create: [
              {
                description: `${membership.name} (${membership.isCustomPlan ? 'Custom Plan' : 'Package'})`,
                quantity: 1,
                unitPriceSnapshot: price,
                discount,
                tax,
                total: finalAmount,
                currency,
              },
            ],
          },
        },
      });

      // Optional immediate payment
      if (dto.recordPayment) {
        await tx.payment.create({
          data: {
            paymentCode,
            branchId,
            customerId: customer.id,
            membershipId: membership.id,
            invoiceId: invoice.id,
            amount: finalAmount,
            currency,
            paymentMethod: dto.paymentMethod || PaymentMethod.CARD,
            transactionReference: dto.transactionReference || `TXN-${Date.now()}`,
            paymentDate: new Date(),
            status: PaymentStatus.PAID,
            notes: 'Processed during membership enrolment.',
            createdById: actor.id,
          },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          actorName: `${actor.firstName} ${actor.lastName}`,
          branchId,
          action: 'MEMBERSHIP_ENROLLED',
          entityType: 'Membership',
          entityId: membership.id,
          afterData: {
            code: membership.membershipCode,
            planName: membership.name,
            customer: customer.displayName,
            finalAmount,
            services: serviceAllocations,
          },
        },
      });

      return membership;
    });

    return result;
  }

  async updateStatus(id: string, dto: UpdateMembershipStatusDto, actor: AuthenticatedUser) {
    const existing = await this.prisma.membership.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Membership not found');
    }

    const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
    if (!isSuperAdmin && existing.branchId !== actor.branchId) {
      throw new ForbiddenException('Cannot edit membership from another branch');
    }

    const updated = await this.prisma.membership.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes ? `${existing.notes || ''}\n[${new Date().toISOString()}] ${dto.notes}` : existing.notes,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        actorName: `${actor.firstName} ${actor.lastName}`,
        branchId: existing.branchId,
        action: 'MEMBERSHIP_STATUS_CHANGED',
        entityType: 'Membership',
        entityId: id,
        beforeData: { status: existing.status },
        afterData: { status: dto.status },
      },
    });

    return updated;
  }

  async getExpiringSoon(user: AuthenticatedUser, days = 7) {
    const effectiveBranchId = resolveBranchId(user);
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const where: any = {
      status: 'ACTIVE',
      endDate: {
        gte: now,
        lte: threshold,
      },
    };

    if (effectiveBranchId) {
      where.branchId = effectiveBranchId;
    }

    return this.prisma.membership.findMany({
      where,
      orderBy: { endDate: 'asc' },
      include: {
        customer: true,
        branch: true,
        services: {
          include: { service: true },
        },
      },
    });
  }
}
