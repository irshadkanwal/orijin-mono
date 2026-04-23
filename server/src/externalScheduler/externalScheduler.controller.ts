import {
  Body,
  Controller,
  Get,
  Header,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { EXTERNAL_SCHEDULER_URL } from '../common/constants';

@Controller()
export class ExternalSchedulerController {
  logger = new Logger(ExternalSchedulerController.name);

  @Post(EXTERNAL_SCHEDULER_URL)
  @Header('content-type', 'application/octet-stream')
  async runScheduler(
    @Body() payload,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<boolean> {
    this.logger.log(
      'Scheduler called with payload: ' + JSON.stringify(payload, null, 4),
    );
    this.logger.log('Scheduler raw body', req.rawBody);
    return true;
  }
}
