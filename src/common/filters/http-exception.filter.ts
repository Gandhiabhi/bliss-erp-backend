import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const anyRes = res as Record<string, any>;
        message = anyRes.message || anyRes.error || exception.message;
        error = anyRes.error || exception.name;
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
      message = exception.message;
    }

    // Format array of validation messages nicely if returned by class-validator
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
}
