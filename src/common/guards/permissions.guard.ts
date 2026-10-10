import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';
import { AuthenticatedUser } from '../decorators/current-user.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();

    if (!user || !user.permissions) {
      throw new ForbiddenException('Access denied: no permissions found');
    }

    // SUPER_ADMIN has access to everything
    if (user.roles && user.roles.includes('SUPER_ADMIN')) {
      return true;
    }

    const hasAll = requiredPermissions.every((perm) =>
      user.permissions.includes(perm)
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Access denied: missing required permissions: ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }
}
