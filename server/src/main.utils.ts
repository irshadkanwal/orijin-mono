import { Logger } from '@nestjs/common';
import { getValidationPipeWithMessages } from './common/pipes/validation.pipe';
import { ExceptionHandler } from './common/exceptions/exception-handler';
import { json, urlencoded } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

/**
 * Shared with E2E tests
 *
 * @param app
 */
export const applyCommonAppSettings = (app) => {
  // Validation
  app.useGlobalPipes(getValidationPipeWithMessages());

  app.useGlobalFilters(new ExceptionHandler());

  // Damn that firebase..
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
};

export const logStartup = () => {
  const logger = new Logger('Bootstrap');
  const dbSplit = process.env.DATABASE_URL?.split('@');
  const dbUrl = dbSplit
    ? dbSplit[dbSplit.length - 1] // In case a @ exist in the password too
    : process.env.DB_HOST +
      ':' +
      process.env.DB_PORT +
      '/' +
      process.env.POSTGRES_DB;
  logger.log('===============');
  logger.log('App started');
  logger.log(`PORT:         ${process.env.PORT}`);
  logger.log(`NODE_ENV:     ${process.env.NODE_ENV}`);
  logger.log(`DB:           ${dbUrl}`);
  logger.log(`FIRESTORE:    ${process.env.FIREBASE_PROJECT_ID || 'disabled'}`);
  logger.log(`SENDGRID:     ${process.env.SENDGRID_API_KEY || 'disabled'}`);
  logger.log('===============');
};
