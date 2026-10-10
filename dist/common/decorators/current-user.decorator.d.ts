export interface AuthenticatedUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    branchId: string | null;
    roles: string[];
    permissions: string[];
}
export declare const CurrentUser: (...dataOrPipes: (keyof AuthenticatedUser | import("@nestjs/common").ParameterDecoratorOptions | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
