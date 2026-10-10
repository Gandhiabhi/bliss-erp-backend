import { AuthenticatedUser } from '../decorators/current-user.decorator.js';
export declare function resolveBranchId(user: AuthenticatedUser, requestedBranchId?: string): string | undefined;
export declare function enforceBranchAccess(user: AuthenticatedUser, targetBranchId: string): void;
