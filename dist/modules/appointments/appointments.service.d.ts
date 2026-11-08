import { PrismaService } from '../../database/prisma.service.js';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(user: AuthenticatedUser, query?: {
        branchId?: string;
        customerId?: string;
        staffId?: string;
        date?: string;
        status?: string;
        search?: string;
    }): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateAppointmentDto, actor: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateAppointmentDto, actor: AuthenticatedUser): Promise<any>;
    cancel(id: string, actor: AuthenticatedUser): Promise<any>;
    remove(id: string, actor: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
