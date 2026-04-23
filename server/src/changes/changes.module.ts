import { Module } from '@nestjs/common';
import { ChangesService } from './changes.service';
import { ChangesController } from './changes.controller';

@Module({
  imports: [],
  providers: [ChangesService],
  controllers: [ChangesController],
  exports: [ChangesService],
})
export class ChangesModule {}
