var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';
let PermissionsGuard = class PermissionsGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user || !user.permissions) {
            throw new ForbiddenException('Access denied: no permissions found');
        }
        if (user.roles && user.roles.includes('SUPER_ADMIN')) {
            return true;
        }
        const hasAll = requiredPermissions.every((perm) => user.permissions.includes(perm));
        if (!hasAll) {
            throw new ForbiddenException(`Access denied: missing required permissions: ${requiredPermissions.join(', ')}`);
        }
        return true;
    }
};
PermissionsGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector])
], PermissionsGuard);
export { PermissionsGuard };
//# sourceMappingURL=permissions.guard.js.map