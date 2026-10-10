import { ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser } from '../decorators/current-user.decorator.js';

export function resolveBranchId(
  user: AuthenticatedUser,
  requestedBranchId?: string
): string | undefined {
  const isSuperAdmin = user.roles && user.roles.includes('SUPER_ADMIN');

  if (isSuperAdmin) {
    return requestedBranchId || undefined;
  }

  if (!user.branchId) {
    throw new ForbiddenException('User is not assigned to any branch');
  }

  // Branch user is strictly pinned to their assigned branch
  return user.branchId;
}

export function enforceBranchAccess(
  user: AuthenticatedUser,
  targetBranchId: string
): void {
  const isSuperAdmin = user.roles && user.roles.includes('SUPER_ADMIN');
  if (isSuperAdmin) {
    return;
  }

  if (!user.branchId || user.branchId !== targetBranchId) {
    throw new ForbiddenException(
      'Access denied: You cannot access or modify resources from another branch'
    );
  }
}
