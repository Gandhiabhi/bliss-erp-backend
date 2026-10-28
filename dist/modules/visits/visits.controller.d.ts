import { VisitsService } from './visits.service.js';
import { CreateVisitDto, UpdateVisitStatusDto } from './dto/visit.dto.js';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator.js';
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    findAll(user: AuthenticatedUser, branchId?: string, customerId?: string, date?: string, status?: string, search?: string, page?: number, limit?: number): Promise<{
        data: ({
            branch: {
                id: string;
                name: string;
                branchCode: string;
                timezone: string;
                currency: string;
            };
            customer: {
                id: string;
                phone: string;
                customerCode: string;
                displayName: string;
            };
            membership: {
                id: string;
                name: string;
                membershipCode: string;
            } | null;
            visitServices: ({
                staff: {
                    id: string;
                    name: string;
                    position: string | null;
                } | null;
                service: {
                    id: string;
                    name: string;
                    code: string;
                };
                serviceVariant: {
                    id: string;
                    name: string;
                    duration: number;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                status: string;
                notes: string | null;
                serviceId: string;
                quantity: number;
                serviceVariantId: string | null;
                serviceNameSnapshot: string;
                variantNameSnapshot: string | null;
                unitPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
                currencySnapshot: string;
                visitId: string;
                membershipServiceId: string | null;
                staffId: string | null;
            })[];
            createdBy: {
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            branchId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.VisitStatus;
            notes: string | null;
            membershipId: string | null;
            customerId: string;
            visitCode: string;
            visitDate: Date;
            checkInTime: Date;
            checkOutTime: Date | null;
            createdById: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: AuthenticatedUser): Promise<{
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
        };
        customer: {
            email: string | null;
            id: string;
            firstName: string;
            lastName: string | null;
            phone: string;
            branchId: string;
            createdAt: Date;
            updatedAt: Date;
            country: string | null;
            city: string | null;
            address: string | null;
            status: string;
            deletedAt: Date | null;
            gender: string | null;
            dateOfBirth: Date | null;
            emergencyContact: string | null;
            profileImage: string | null;
            notes: string | null;
            customerCode: string;
            displayName: string;
            nationality: string | null;
            preferredLanguage: string | null;
        };
        membership: ({
            services: ({
                service: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    currency: string;
                    status: string;
                    deletedAt: Date | null;
                    notes: string | null;
                    code: string;
                    categoryId: string | null;
                    defaultDuration: number;
                    defaultPrice: import("@prisma/client/runtime/library").Decimal;
                    image: string | null;
                };
                serviceVariant: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    currency: string;
                    status: string;
                    duration: number;
                    price: import("@prisma/client/runtime/library").Decimal;
                    serviceId: string;
                } | null;
            } & {
                id: string;
                notes: string | null;
                serviceId: string;
                serviceVariantId: string | null;
                allocatedQuantity: number;
                consumedQuantity: number;
                membershipId: string;
            })[];
        } & {
            id: string;
            branchId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            currency: string;
            status: import(".prisma/client").$Enums.MembershipStatus;
            notes: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            planTemplateId: string | null;
            customerId: string;
            createdById: string | null;
            membershipCode: string;
            isCustomPlan: boolean;
            startDate: Date;
            endDate: Date;
            discount: import("@prisma/client/runtime/library").Decimal;
            tax: import("@prisma/client/runtime/library").Decimal;
            finalAmount: import("@prisma/client/runtime/library").Decimal;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        }) | null;
        visitServices: ({
            staff: {
                email: string | null;
                id: string;
                phone: string | null;
                branchId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                userId: string | null;
                address: string | null;
                status: string;
                deletedAt: Date | null;
                staffCode: string;
                gender: string | null;
                dateOfBirth: Date | null;
                emergencyContact: string | null;
                profileImage: string | null;
                position: string | null;
                specialization: string | null;
                joiningDate: Date | null;
                notes: string | null;
            } | null;
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                currency: string;
                status: string;
                deletedAt: Date | null;
                notes: string | null;
                code: string;
                categoryId: string | null;
                defaultDuration: number;
                defaultPrice: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
            };
            serviceVariant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                status: string;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal;
                serviceId: string;
            } | null;
            membershipService: {
                id: string;
                notes: string | null;
                serviceId: string;
                serviceVariantId: string | null;
                allocatedQuantity: number;
                consumedQuantity: number;
                membershipId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: string;
            notes: string | null;
            serviceId: string;
            quantity: number;
            serviceVariantId: string | null;
            serviceNameSnapshot: string;
            variantNameSnapshot: string | null;
            unitPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
            currencySnapshot: string;
            visitId: string;
            membershipServiceId: string | null;
            staffId: string | null;
        })[];
        createdBy: {
            email: string;
            id: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            branchId: string | null;
            isActive: boolean;
            lastLoginAt: Date | null;
            refreshTokenHash: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VisitStatus;
        notes: string | null;
        membershipId: string | null;
        customerId: string;
        visitCode: string;
        visitDate: Date;
        checkInTime: Date;
        checkOutTime: Date | null;
        createdById: string | null;
    }>;
    create(dto: CreateVisitDto, user: AuthenticatedUser): Promise<{
        visitServices: ({
            staff: {
                email: string | null;
                id: string;
                phone: string | null;
                branchId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                userId: string | null;
                address: string | null;
                status: string;
                deletedAt: Date | null;
                staffCode: string;
                gender: string | null;
                dateOfBirth: Date | null;
                emergencyContact: string | null;
                profileImage: string | null;
                position: string | null;
                specialization: string | null;
                joiningDate: Date | null;
                notes: string | null;
            } | null;
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                currency: string;
                status: string;
                deletedAt: Date | null;
                notes: string | null;
                code: string;
                categoryId: string | null;
                defaultDuration: number;
                defaultPrice: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
            };
            serviceVariant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                status: string;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal;
                serviceId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: string;
            notes: string | null;
            serviceId: string;
            quantity: number;
            serviceVariantId: string | null;
            serviceNameSnapshot: string;
            variantNameSnapshot: string | null;
            unitPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
            currencySnapshot: string;
            visitId: string;
            membershipServiceId: string | null;
            staffId: string | null;
        })[];
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VisitStatus;
        notes: string | null;
        membershipId: string | null;
        customerId: string;
        visitCode: string;
        visitDate: Date;
        checkInTime: Date;
        checkOutTime: Date | null;
        createdById: string | null;
    }>;
    updateStatus(id: string, dto: UpdateVisitStatusDto, user: AuthenticatedUser): Promise<{
        visitServices: ({
            staff: {
                email: string | null;
                id: string;
                phone: string | null;
                branchId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                userId: string | null;
                address: string | null;
                status: string;
                deletedAt: Date | null;
                staffCode: string;
                gender: string | null;
                dateOfBirth: Date | null;
                emergencyContact: string | null;
                profileImage: string | null;
                position: string | null;
                specialization: string | null;
                joiningDate: Date | null;
                notes: string | null;
            } | null;
            service: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                currency: string;
                status: string;
                deletedAt: Date | null;
                notes: string | null;
                code: string;
                categoryId: string | null;
                defaultDuration: number;
                defaultPrice: import("@prisma/client/runtime/library").Decimal;
                image: string | null;
            };
            serviceVariant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                currency: string;
                status: string;
                duration: number;
                price: import("@prisma/client/runtime/library").Decimal;
                serviceId: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            status: string;
            notes: string | null;
            serviceId: string;
            quantity: number;
            serviceVariantId: string | null;
            serviceNameSnapshot: string;
            variantNameSnapshot: string | null;
            unitPriceSnapshot: import("@prisma/client/runtime/library").Decimal;
            currencySnapshot: string;
            visitId: string;
            membershipServiceId: string | null;
            staffId: string | null;
        })[];
    } & {
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.VisitStatus;
        notes: string | null;
        membershipId: string | null;
        customerId: string;
        visitCode: string;
        visitDate: Date;
        checkInTime: Date;
        checkOutTime: Date | null;
        createdById: string | null;
    }>;
}
