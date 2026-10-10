import { BranchStatus } from '@prisma/client';
export declare class CreateBranchDto {
    branchCode: string;
    name: string;
    country: string;
    state?: string;
    city: string;
    address?: string;
    phone?: string;
    email?: string;
    timezone: string;
    currency: string;
    openingTime?: string;
    closingTime?: string;
    status?: BranchStatus;
}
export declare class UpdateBranchDto {
    name?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    timezone?: string;
    currency?: string;
    openingTime?: string;
    closingTime?: string;
    status?: BranchStatus;
}
