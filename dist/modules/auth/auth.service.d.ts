import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            phone: any;
            branchId: any;
            branch: {
                id: any;
                branchCode: any;
                name: any;
                currency: any;
                timezone: any;
                country: any;
                city: any;
            } | null;
            roles: any;
            permissions: string[];
        };
    }>;
    refreshToken(rawRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        phone: any;
        branchId: any;
        branch: any;
        roles: any;
        permissions: string[];
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
