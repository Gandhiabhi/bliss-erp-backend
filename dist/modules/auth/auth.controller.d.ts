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
    refresh(dto: RefreshTokenDto, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(user: AuthenticatedUser): Promise<{
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
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    logout(userId: string, res: Response): Promise<{
        message: string;
    }>;
}
