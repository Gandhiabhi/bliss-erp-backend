var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
import { Catch, HttpException, HttpStatus, Logger, } from '@nestjs/common';
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            }
            else if (typeof res === 'object' && res !== null) {
                const anyRes = res;
                message = anyRes.message || anyRes.error || exception.message;
                error = anyRes.error || exception.name;
            }
        }
        else if (exception instanceof Error) {
            this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
            message = exception.message;
        }
        let formattedMessage = message;
        if (Array.isArray(message)) {
            formattedMessage = message.join(', ');
        }
        response.status(status).json({
            success: false,
            statusCode: status,
            message: formattedMessage,
            error,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
};
HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    Catch()
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map