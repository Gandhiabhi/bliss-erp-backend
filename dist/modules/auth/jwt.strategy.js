var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service.js';
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy) {
    prisma;
    constructor(prisma) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    if (request && request.cookies && request.cookies.access_token) {
                        return request.cookies.access_token;
                    }
                    return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'blish-super-secure-jwt-secret-key-2026-production-grade',
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!user || !user.isActive) {
            throw new UnauthorizedException('User account is inactive or not found');
        }
        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissionSet = new Set();
        for (const ur of user.userRoles) {
            for (const rp of ur.role.rolePermissions) {
                if (rp.permission?.name) {
                    permissionSet.add(rp.permission.name);
                }
            }
        }
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            branchId: user.branchId,
            roles,
            permissions: Array.from(permissionSet),
        };
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map