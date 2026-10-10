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
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            branchId: string | null;
            branch: {
                id: string;
                branchCode: string;
                name: string;
                currency: string;
                timezone: string;
                country: string;
                city: string;
            } | null;
            roles: string[];
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
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        branchId: string | null;
        branch: {
            email: string | null;
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchCode: string;
            country: string;
            state: string | null;
            city: string;
            address: string | null;
            timezone: string;
            currency: string;
            logo: string | null;
            openingTime: string | null;
            closingTime: string | null;
            status: import(".prisma/client").$Enums.BranchStatus;
            deletedAt: Date | null;
        } | null;
        roles: string[];
        permissions: string[];
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
