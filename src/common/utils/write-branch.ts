import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedUser } from '../decorators/current-user.decorator.js';

export async function resolveWriteBranch(
  prisma: PrismaService,
  actor: AuthenticatedUser,
  requestedBranchId?: string
) {
  const isSuperAdmin = actor.roles.includes('SUPER_ADMIN');

  if (!isSuperAdmin) {
    if (!actor.branchId) {
      throw new ForbiddenException('This login is not assigned to a branch');
    }
    const branch = await prisma.branch.findUnique({ where: { id: actor.branchId } });
    if (!branch || branch.deletedAt) {
      throw new NotFoundException('Assigned branch was not found');
    }
    return branch;
  }

  if (requestedBranchId) {
    const branch = await prisma.branch.findUnique({ where: { id: requestedBranchId } });
    if (!branch || branch.deletedAt) {
      throw new NotFoundException('Selected branch was not found');
    }
    return branch;
  }

  const active = await prisma.branch.findMany({
    where: { status: 'ACTIVE', deletedAt: null },
    orderBy: { createdAt: 'asc' },
  });

  if (active.length === 1) {
    return active[0];
  }

  if (active.length > 1) {
    throw new BadRequestException('Choose a branch in the header before saving this record.');
  }

  return prisma.branch.create({
    data: {
      branchCode: 'MAIN',
      name: 'Main Spa',
      country: 'India',
      city: 'Main',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      status: 'ACTIVE',
    },
  });
}
