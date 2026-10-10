import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: Request, res: Response): Promise<{
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
    refresh(dto: RefreshTokenDto, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(user: AuthenticatedUser): Promise<{
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
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    logout(userId: string, res: Response): Promise<{
        message: string;
    }>;
}
