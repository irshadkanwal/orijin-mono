import { Module } from '@nestjs/common';
import { ExternalSchedulerController } from './externalScheduler.controller';

/**
 * This module is for receiving scheduler calls from Google Cloud Scheduler.
 *
 * NestJS's own cronjob feature is not used because there are always several instances
 * of servers running, and that would mean several cron jobs would start at the same time.
 *
 */
@Module({
  imports: [],
  controllers: [ExternalSchedulerController],
  providers: [],
  exports: [],
})
export class ExternalSchedulerModule {}
