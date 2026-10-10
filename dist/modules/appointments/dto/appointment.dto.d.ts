import { AppointmentStatus } from '@prisma/client';
export declare class CreateAppointmentDto {
    customerId: string;
    branchId?: string;
    serviceId: string;
    serviceVariantId?: string;
    staffId?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
    status?: AppointmentStatus;
}
export declare class UpdateAppointmentDto {
    serviceId?: string;
    serviceVariantId?: string;
    staffId?: string;
    scheduledDate?: string;
    startTime?: string;
    endTime?: string;
    status?: AppointmentStatus;
    notes?: string;
}
