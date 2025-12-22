import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException, NotFoundException, ValidationException } from '@shared/domain';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || message;
    } else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      code = 'NOT_FOUND';
    } else if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      code = 'VALIDATION_ERROR';
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      code = 'DOMAIN_ERROR';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
      },
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  }
}
