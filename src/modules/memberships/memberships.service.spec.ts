import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MembershipsService } from './memberships.service.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('MembershipsService - Snapshots & Branch Isolation', () => {
  let service: MembershipsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      customer: {
        findUnique: vi.fn(),
      },
      planTemplate: {
        findUnique: vi.fn(),
      },
      membership: {
        create: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn().mockResolvedValue(0),
      },
      invoice: {
        create: vi.fn(),
        count: vi.fn().mockResolvedValue(0),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn(async (cb) => cb(prismaMock)),
    };

    service = new MembershipsService(prismaMock);
  });

  it('should prevent branch user from creating a membership for a customer from another branch', async () => {
    // Customer belongs to branch-1
    prismaMock.customer.findUnique.mockResolvedValue({
      id: 'cust-1',
      branchId: 'branch-1',
      branch: { id: 'branch-1', branchCode: 'DXB' },
      deletedAt: null,
    });

    // Authenticated user belongs to branch-2 (London)
    const user: any = { id: 'u-2', roles: ['BRANCH_MANAGER'], branchId: 'branch-2' };
    const dto: any = {
      customerId: 'cust-1',
      name: 'Wellness Pass',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      price: 200,
    };

    await expect(service.create(dto, user)).rejects.toThrow(ForbiddenException);
  });

  it('should snapshot plan template services into membership_services without mutating original template', async () => {
    prismaMock.customer.findUnique.mockResolvedValue({
      id: 'cust-1',
      branchId: 'branch-1',
      branch: { id: 'branch-1', branchCode: 'DXB', currency: 'AED' },
      deletedAt: null,
    });

    prismaMock.planTemplate.findUnique.mockResolvedValue({
      id: 'plan-1',
      name: 'Royal Rejuvenation',
      services: [
        { serviceId: 'srv-1', serviceVariantId: null, quantity: 4 },
        { serviceId: 'srv-2', serviceVariantId: 'var-1', quantity: 2 },
      ],
      deletedAt: null,
    });

    prismaMock.membership.create.mockResolvedValue({
      id: 'mem-1',
      membershipCode: 'MEM-DXB-2026-0001',
      name: 'Royal Rejuvenation',
      price: 600,
      currency: 'AED',
    });

    const user: any = { id: 'u-1', roles: ['BRANCH_MANAGER'], branchId: 'branch-1' };
    const dto: any = {
      customerId: 'cust-1',
      planTemplateId: 'plan-1',
      name: 'Royal Rejuvenation',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      price: 600,
      discount: 0,
      tax: 30,
    };

    const result = await service.create(dto, user);
    expect(result.id).toBe('mem-1');
    expect(prismaMock.membership.create).toHaveBeenCalled();
  });
});
