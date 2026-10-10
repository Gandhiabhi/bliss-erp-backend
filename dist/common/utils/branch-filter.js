import { ForbiddenException } from '@nestjs/common';
export function resolveBranchId(user, requestedBranchId) {
    const isSuperAdmin = user.roles && user.roles.includes('SUPER_ADMIN');
    if (isSuperAdmin) {
        return requestedBranchId || undefined;
    }
    if (!user.branchId) {
        throw new ForbiddenException('User is not assigned to any branch');
    }
    return user.branchId;
}
export function enforceBranchAccess(user, targetBranchId) {
    const isSuperAdmin = user.roles && user.roles.includes('SUPER_ADMIN');
    if (isSuperAdmin) {
        return;
    }
    if (!user.branchId || user.branchId !== targetBranchId) {
        throw new ForbiddenException('Access denied: You cannot access or modify resources from another branch');
    }
}
//# sourceMappingURL=branch-filter.js.map