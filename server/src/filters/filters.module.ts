import { Module } from '@nestjs/common';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';
import { FarmsFilter } from '../farms/dto/farms.filter.dto';
import { LocationsFilter } from '../locations/dto/locations.filter.dto';
import 'reflect-metadata';
import { FirestoreUsersFilter } from '../firestore/dto/firestore.users.filter.dto';
import { FirestoreOrganisationFilter } from '../firestore/dto/firestore.organisations.filter.dto';
import { SeasonsModule } from '../seasons/seasons.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [SeasonsModule, LocationsModule],
  controllers: [FiltersController],
  providers: [
    FiltersService,
    FarmsFilter,
    LocationsFilter,
    FirestoreUsersFilter,
    FirestoreOrganisationFilter,
  ],
  exports: [FiltersService],
})
export class FiltersModule {}
