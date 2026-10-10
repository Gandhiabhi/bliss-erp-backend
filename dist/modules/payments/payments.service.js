var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { resolveBranchId } from '../../common/utils/branch-filter.js';
import { PaymentStatus, InvoiceStatus } from '@prisma/client';
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllPayments(user, query) {
        const effectiveBranchId = resolveBranchId(user, query?.branchId);
        const where = {};
        if (effectiveBranchId) {
            where.branchId = effectiveBranchId;
        }
        if (query?.customerId) {
            where.customerId = query.customerId;
        }
        if (query?.status) {
            where.status = query.status;
        }
        if (query?.method) {
            where.paymentMethod = query.method;
        }
        if (query?.date) {
            const targetDate = new Date(query.date);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            where.paymentDate = { gte: startOfDay, lte: endOfDay };
        }
        if (query?.search) {
            where.OR = [
                { paymentCode: { contains: query.search, mode: 'insensitive' } },
                { transactionReference: { contains: query.search, mode: 'insensitive' } },
                { customer: { displayName: { contains: query.search, mode: 'insensitive' } } },
            ];
        }
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query?.limit) || 20));
        const skip = (page - 1) * limit;
        const [total, payments] = await Promise.all([
            this.prisma.payment.count({ where }),
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { paymentDate: 'desc' },
                include: {
                    customer: { select: { id: true, displayName: true, phone: true, customerCode: true } },
                    branch: { select: { id: true, name: true, branchCode: true, currency: true } },
                    membership: { select: { id: true, membershipCode: true, name: true } },
                    invoice: { select: { id: true, invoiceNumber: true, total: true, balanceAmount: true } },
                    createdBy: { select: { id: true, firstName: true, lastName: true } },
                },
            }),
        ]);
        return {
            data: payments,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOnePayment(id, user) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                customer: true,
                branch: true,
                membership: true,
                invoice: {
                    include: { items: true },
                },
                createdBy: true,
            },
        });
        if (!payment) {
            throw new NotFoundException('Payment record not found');
        }
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && payment.branchId !== user.branchId) {
            throw new ForbiddenException('Access denied to payment from another branch');
        }
        return payment;
    }
    async createPayment(dto, actor) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: dto.customerId },
            include: { branch: true },
        });
        if (!customer || customer.deletedAt) {
            throw new NotFoundException('Customer not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && customer.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot process payment for customer from another branch');
        }
        const branchId = customer.branchId;
        const branch = customer.branch;
        const amount = Number(dto.amount);
        const currency = (dto.currency || branch.currency || 'AED').toUpperCase();
        const count = await this.prisma.payment.count({ where: { branchId } });
        const codePrefix = branch.branchCode ? branch.branchCode.replace(/[^a-zA-Z0-9]/g, '') : 'BR';
        const year = new Date().getFullYear();
        const paymentCode = `PAY-${codePrefix}-${year}-${String(count + 1).padStart(4, '0')}`;
        const result = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    paymentCode,
                    branchId,
                    customerId: customer.id,
                    invoiceId: dto.invoiceId || null,
                    membershipId: dto.membershipId || null,
                    amount,
                    currency,
                    paymentMethod: dto.paymentMethod,
                    transactionReference: dto.transactionReference || `TXN-${Date.now()}`,
                    paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
                    status: PaymentStatus.PAID,
                    notes: dto.notes,
                    createdById: actor.id,
                },
            });
            if (dto.invoiceId) {
                const invoice = await tx.invoice.findUnique({
                    where: { id: dto.invoiceId },
                });
                if (invoice) {
                    const newPaid = Number(invoice.paidAmount) + amount;
                    const newBalance = Math.max(0, Number(invoice.total) - newPaid);
                    const newStatus = newBalance === 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;
                    await tx.invoice.update({
                        where: { id: invoice.id },
                        data: {
                            paidAmount: newPaid,
                            balanceAmount: newBalance,
                            status: newStatus,
                        },
                    });
                }
            }
            if (dto.membershipId) {
                await tx.membership.update({
                    where: { id: dto.membershipId },
                    data: { paymentStatus: PaymentStatus.PAID },
                });
            }
            await tx.auditLog.create({
                data: {
                    actorId: actor.id,
                    actorName: `${actor.firstName} ${actor.lastName}`,
                    branchId,
                    action: 'PAYMENT_RECEIVED',
                    entityType: 'Payment',
                    entityId: payment.id,
                    afterData: {
                        code: paymentCode,
                        amount,
                        currency,
                        customer: customer.displayName,
                        method: dto.paymentMethod,
                    },
                },
            });
            return payment;
        });
        return result;
    }
    async refundPayment(id, dto, actor) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { invoice: true },
        });
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && payment.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot refund payment from another branch');
        }
        if (payment.status === PaymentStatus.REFUNDED) {
            throw new BadRequestException('Payment has already been refunded');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.payment.update({
                where: { id },
                data: {
                    status: PaymentStatus.REFUNDED,
                    notes: `${payment.notes || ''}\n[REFUND]: ${dto.reason} (Refunded amount: ${dto.amount})`,
                },
            });
            if (payment.invoiceId) {
                const inv = await tx.invoice.findUnique({ where: { id: payment.invoiceId } });
                if (inv) {
                    const newPaid = Math.max(0, Number(inv.paidAmount) - dto.amount);
                    const newBalance = Number(inv.total) - newPaid;
                    await tx.invoice.update({
                        where: { id: inv.id },
                        data: {
                            paidAmount: newPaid,
                            balanceAmount: newBalance,
                            status: InvoiceStatus.REFUNDED,
                        },
                    });
                }
            }
            await tx.auditLog.create({
                data: {
                    actorId: actor.id,
                    actorName: `${actor.firstName} ${actor.lastName}`,
                    branchId: payment.branchId,
                    action: 'PAYMENT_REFUNDED',
                    entityType: 'Payment',
                    entityId: id,
                    afterData: { refundAmount: dto.amount, reason: dto.reason },
                },
            });
            return updated;
        });
        return result;
    }
    async findAllInvoices(user, query) {
        const effectiveBranchId = resolveBranchId(user, query?.branchId);
        const where = {};
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
                { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
                { customer: { displayName: { contains: query.search, mode: 'insensitive' } } },
            ];
        }
        const page = Math.max(1, Number(query?.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(query?.limit) || 20));
        const skip = (page - 1) * limit;
        const [total, invoices] = await Promise.all([
            this.prisma.invoice.count({ where }),
            this.prisma.invoice.findMany({
                where,
                skip,
                take: limit,
                orderBy: { issueDate: 'desc' },
                include: {
                    customer: { select: { id: true, displayName: true, phone: true, customerCode: true } },
                    branch: { select: { id: true, name: true, branchCode: true, currency: true } },
                    membership: { select: { id: true, membershipCode: true, name: true } },
                    items: true,
                    payments: { select: { id: true, paymentCode: true, amount: true, paymentDate: true, status: true } },
                },
            }),
        ]);
        return {
            data: invoices,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneInvoice(id, user) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                customer: true,
                branch: true,
                membership: true,
                items: true,
                payments: {
                    orderBy: { paymentDate: 'desc' },
                },
            },
        });
        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }
        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && invoice.branchId !== user.branchId) {
            throw new ForbiddenException('Access denied to invoice from another branch');
        }
        return invoice;
    }
    async createInvoice(dto, actor) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: dto.customerId },
            include: { branch: true },
        });
        if (!customer || customer.deletedAt) {
            throw new NotFoundException('Customer not found');
        }
        const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');
        if (!isSuperAdmin && customer.branchId !== actor.branchId) {
            throw new ForbiddenException('Cannot generate invoice for customer in another branch');
        }
        const branchId = customer.branchId;
        const branch = customer.branch;
        if (!dto.items || dto.items.length === 0) {
            throw new BadRequestException('Invoice must contain at least one line item');
        }
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        const itemsData = dto.items.map((it) => {
            const itemQty = Number(it.quantity || 1);
            const unitPrice = Number(it.unitPrice);
            const discount = Number(it.discount || 0);
            const tax = Number(it.tax || 0);
            const lineTotal = Math.max(0, unitPrice * itemQty - discount + tax);
            subtotal += unitPrice * itemQty;
            totalDiscount += discount;
            totalTax += tax;
            return {
                description: it.description,
                serviceId: it.serviceId || null,
                quantity: itemQty,
                unitPriceSnapshot: unitPrice,
                discount,
                tax,
                total: lineTotal,
                currency: (it.currency || branch.currency || 'AED').toUpperCase(),
            };
        });
        const total = Math.max(0, subtotal - totalDiscount + totalTax);
        const currency = (dto.currency || branch.currency || 'AED').toUpperCase();
        const count = await this.prisma.invoice.count({ where: { branchId } });
        const codePrefix = branch.branchCode ? branch.branchCode.replace(/[^a-zA-Z0-9]/g, '') : 'BR';
        const year = new Date().getFullYear();
        const invoiceNumber = `INV-${codePrefix}-${year}-${String(count + 1).padStart(4, '0')}`;
        const invoice = await this.prisma.invoice.create({
            data: {
                invoiceNumber,
                branchId,
                customerId: customer.id,
                membershipId: dto.membershipId || null,
                visitId: dto.visitId || null,
                subtotal,
                discount: totalDiscount,
                tax: totalTax,
                total,
                paidAmount: 0,
                balanceAmount: total,
                currency,
                status: InvoiceStatus.ISSUED,
                issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                notes: dto.notes,
                items: {
                    create: itemsData,
                },
            },
            include: {
                items: true,
                customer: true,
                branch: true,
            },
        });
        await this.prisma.auditLog.create({
            data: {
                actorId: actor.id,
                actorName: `${actor.firstName} ${actor.lastName}`,
                branchId,
                action: 'INVOICE_GENERATED',
                entityType: 'Invoice',
                entityId: invoice.id,
                afterData: { invoiceNumber, customer: customer.displayName, total, currency },
            },
        });
        return invoice;
    }
};
PaymentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], PaymentsService);
export { PaymentsService };
//# sourceMappingURL=payments.service.js.map