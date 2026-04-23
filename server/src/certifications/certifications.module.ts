import { Module } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import { CertificationsController } from './certifications.controller';
import { CertificationTypeService } from './certificationType.service';

@Module({
  imports: [],
  controllers: [CertificationsController],
  providers: [CertificationsService, CertificationTypeService],
  exports: [CertificationsService, CertificationTypeService],
})
export class CertificationsModule {}
