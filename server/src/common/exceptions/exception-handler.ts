import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';
import { Prisma } from '@prisma/client';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  private logger = new Logger('ExceptionHandler');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal Server Error';

    // https://www.prisma.io/docs/orm/reference/error-reference
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (exception.code === 'P2002') {
        message =
          'Unique constraint violation at ' +
          exception.meta.modelName +
          '.' +
          exception.meta.target[0]; // TODO: Handle cases with more than 1 error..
      } else {
        message = ' NEW ERROR';
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      // Issues with Prisma schema usually, no need to communicate to client but needs
      // full print of stacktrace here to see what's wrong
      this.logger.error(exception);
    } else {
      message = exception.response?.message || exception.message || exception;
    }

    // TODO: Define which errors are useful to log, and which not (standard validation errors not, but actual errors yes)

    if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
      this.logger.warn(JSON.stringify(message, null, 4));
    } else {
      this.logger.error(
        `Error ${statusCode}: ${JSON.stringify(message, null, 4)}`,
      );
      this.logger.error(exception.stack);
    }

    response.status(statusCode).json({
      error: {
        timestamp: new Date().toISOString(),
        path: request.url,
        code: statusCode,
        message,
      },
    });
  }
}
