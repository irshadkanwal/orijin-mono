import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { ChangesModule } from '../changes/changes.module';
import { ContactsService } from './contacts.service';
import { WalletsService } from './wallets.service';

@Module({
  imports: [ChangesModule],
  controllers: [PersonsController],
  providers: [PersonsService, ContactsService, WalletsService],
  exports: [PersonsService, ContactsService, WalletsService],
})
export class PersonsModule {}
