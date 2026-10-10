export declare class CreateCustomerDto {
    firstName: string;
    lastName?: string;
    displayName?: string;
    phone: string;
    email?: string;
    branchId?: string;
    gender?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    city?: string;
    country?: string;
    emergencyContact?: string;
    profileImage?: string;
    notes?: string;
    preferredLanguage?: string;
}
export declare class UpdateCustomerDto {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    phone?: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    city?: string;
    country?: string;
    emergencyContact?: string;
    profileImage?: string;
    notes?: string;
    preferredLanguage?: string;
    status?: string;
}
export declare class AddCustomerNoteDto {
    note: string;
}
