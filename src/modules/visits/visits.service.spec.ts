import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VisitsService } from './visits.service.js';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('VisitsService - Entitlement & Concurrency Protection', () => {
  let service: VisitsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      customer: {
        findUnique: vi.fn(),
      },
      membership: {
        findUnique: vi.fn(),
      },
      membershipService: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      service: {
        findUnique: vi.fn(),
      },
      serviceVariant: {
        findUnique: vi.fn(),
      },
      visit: {
        create: vi.fn(),
        count: vi.fn().mockResolvedValue(0),
      },
      visitService: {
        create: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn(async (cb) => cb(prismaMock)),
    };

    service = new VisitsService(prismaMock);
  });

  it('should throw ConflictException if requested entitlement quantity exceeds remaining balance', async () => {
    prismaMock.customer.findUnique.mockResolvedValue({
      id: 'cust-1',
      branchId: 'branch-1',
      branch: { id: 'branch-1', branchCode: 'DXB' },
      deletedAt: null,
    });

    prismaMock.membership.findUnique.mockResolvedValue({
      id: 'mem-1',
      status: 'ACTIVE',
      endDate: new Date(Date.now() + 86400000).toISOString(),
    });

    // Entitlement has 1 remaining (5 allocated - 4 consumed)
    prismaMock.membershipService.findUnique.mockResolvedValue({
      id: 'ms-1',
      allocatedQuantity: 5,
      consumedQuantity: 4,
      membership: {
        id: 'mem-1',
        membershipCode: 'MEM-DXB-001',
        status: 'ACTIVE',
        endDate: new Date(Date.now() + 86400000).toISOString(),
      },
    });

    prismaMock.service.findUnique.mockResolvedValue({
      id: 'srv-1',
      name: 'Swedish Massage',
      defaultPrice: 100,
      currency: 'USD',
    });

    const user: any = { id: 'u-1', roles: ['RECEPTIONIST'], branchId: 'branch-1' };
    const dto: any = {
      customerId: 'cust-1',
      membershipId: 'mem-1',
      services: [
        {
          serviceId: 'srv-1',
          membershipServiceId: 'ms-1',
          quantity: 2, // Requesting 2 when only 1 is remaining
        },
      ],
    };

    await expect(service.create(dto, user)).rejects.toThrow(ConflictException);
  });

  it('should successfully decrement remaining balance inside a transaction when balance is sufficient', async () => {
    prismaMock.customer.findUnique.mockResolvedValue({
      id: 'cust-1',
      branchId: 'branch-1',
      branch: { id: 'branch-1', branchCode: 'DXB' },
      deletedAt: null,
    });

    prismaMock.membership.findUnique.mockResolvedValue({
      id: 'mem-1',
      status: 'ACTIVE',
      endDate: new Date(Date.now() + 86400000).toISOString(),
    });

    // Entitlement has 3 remaining (5 allocated - 2 consumed)
    prismaMock.membershipService.findUnique.mockResolvedValue({
      id: 'ms-1',
      allocatedQuantity: 5,
      consumedQuantity: 2,
      membership: {
        id: 'mem-1',
        membershipCode: 'MEM-DXB-001',
        status: 'ACTIVE',
        endDate: new Date(Date.now() + 86400000).toISOString(),
      },
    });

    prismaMock.service.findUnique.mockResolvedValue({
      id: 'srv-1',
      name: 'Swedish Massage',
      defaultPrice: 100,
      currency: 'USD',
    });

    prismaMock.visit.create.mockResolvedValue({
      id: 'visit-1',
      visitCode: 'VST-DXB-2026-0001',
      status: 'CHECKED_IN',
    });

    prismaMock.visitService.create.mockResolvedValue({
      id: 'vs-1',
      serviceNameSnapshot: 'Swedish Massage',
      variantNameSnapshot: null,
      quantity: 1,
    });

    const user: any = { id: 'u-1', roles: ['RECEPTIONIST'], branchId: 'branch-1' };
    const dto: any = {
      customerId: 'cust-1',
      membershipId: 'mem-1',
      services: [
        {
          serviceId: 'srv-1',
          membershipServiceId: 'ms-1',
          quantity: 1, // 1 requested
        },
      ],
    };

    const result = await service.create(dto, user);
    expect(result.id).toBe('visit-1');
    expect(prismaMock.membershipService.update).toHaveBeenCalledWith({
      where: { id: 'ms-1' },
      data: { consumedQuantity: { increment: 1 } },
    });
  });
});
