export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    branchId?: string;
    roleNames: string[];
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    isActive?: boolean;
    branchId?: string;
    roleNames?: string[];
    password?: string;
}
