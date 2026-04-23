import { ConsoleLogger, LoggerService } from '@nestjs/common';

export class TestsLogger extends ConsoleLogger implements LoggerService {
  private excludedContexts = [
    'RouterExplorer',
    'RoutesResolver',
    'NestApplication',
  ];

  private shouldLog(context?: string): boolean {
    return !context || !this.excludedContexts.includes(context);
  }

  log(message: any, context?: string) {
    if (this.shouldLog(context)) {
      super.log(message, context);
    }
  }

  error(message: any, stack?: string, context?: string) {
    if (this.shouldLog(context)) {
      super.error(message, stack, context);
    }
  }

  warn(message: any, context?: string) {
    if (this.shouldLog(context)) {
      super.warn(message, context);
    }
  }

  debug(message: any, context?: string) {
    if (this.shouldLog(context)) {
      super.debug(message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.shouldLog(context)) {
      super.verbose(message, context);
    }
  }
}
