import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('AppLoggerMiddleware');

  // eslint-disable-next-line class-methods-use-this
  logPayload = (request) =>
    request.body && (request.method === 'POST' || request.method === 'PUT');

  sanitizePayload = (rawBody) => {
    if (!rawBody) {
      return '';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (rawBody.password) {
      rawBody.password = '== SANITIZED == ';
    }
    if (rawBody.oldPassword) {
      rawBody.oldPassword = '== SANITIZED == ';
    }
    return JSON.stringify(rawBody, null, 4);
  };

  use(request: Request, response: Response, next: NextFunction): void {
    if (process.env.NO_LOG !== 'true') {
      const { ip, method, originalUrl: url } = request;
      const userAgent = request.get('user-agent') || '';

      response.on('close', () => {
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        const message = `${method} ${url} ${statusCode} ${contentLength}`; //- IP: ${ip}- ${userAgent}`;

        if (statusCode === 200 || statusCode === 304) {
          this.logger.log(message);
          if (this.logPayload(request)) {
            this.logger.log(this.sanitizePayload(request.body));
          }
        } else {
          // Warn about other codes - note: The exception-handler.ts should fire as well which prints out the actual error
          this.logger.warn(message);
          if (this.logPayload(request)) {
            this.logger.warn(this.sanitizePayload(request.body));
          }
        }
      });
    }

    next();
  }
}
