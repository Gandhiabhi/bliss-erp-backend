import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findAll(user: AuthenticatedUser, branchId?: string, customerId?: string, staffId?: string, date?: string, status?: string, search?: string): Promise<any>;
    findOne(id: string, user: AuthenticatedUser): Promise<any>;
    create(dto: CreateAppointmentDto, user: AuthenticatedUser): Promise<any>;
    update(id: string, dto: UpdateAppointmentDto, user: AuthenticatedUser): Promise<any>;
    cancel(id: string, user: AuthenticatedUser): Promise<{
        message: string;
    }>;
}
