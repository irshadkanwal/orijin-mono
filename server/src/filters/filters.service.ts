import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import 'reflect-metadata';
import {
  DataTableFilter,
  FilterClasses,
  filterClassMap,
} from './models/filters.model';
import { PaginationAndSortingDto } from '../common/dto/paginationAndSorting.dto';
import { getFilterMetadata } from '../common/prisma.helper';
import { promiseObject } from '../common/utils';
import { SeasonsService } from '../seasons/seasons.service';
import { LocationsService } from '../locations/locations.service';
import { Location, Season } from '@prisma/client';

@Injectable()
export class FiltersService {
  logger = new Logger(FiltersService.name);
  constructor(
    private prisma: PrismaService,
    private seasonService: SeasonsService,
    private locationService: LocationsService,
  ) {}

  getPaginationAndSortingProperties(): string[] {
    const paginationDtoPrototype = Object.getPrototypeOf(
      new PaginationAndSortingDto(),
    );
    return Object.getOwnPropertyNames(paginationDtoPrototype).filter(
      (prop) => prop !== 'constructor',
    );
  }

  extractFiltersFromClass(filterClass: any): DataTableFilter[] {
    const filters: DataTableFilter[] = [];
    const className = filterClass.name;

    // console.log(`Inspecting prototype for class: ${className}`);
    const metadata = getFilterMetadata(className);
    if (metadata) {
      for (const [key, meta] of metadata.entries()) {
        filters.push({
          key,
          ...meta,
        });
      }
    }

    return filters;
  }

  /** Globally for every filter out there, add appropriate options based on the key (id) of a filter */
  async appendOptionsToFilters(orgId: string, filters: DataTableFilter[]) {
    const data = await promiseObject({
      locations: filters.find((filter) => filter.key === 'location')
        ? this.locationService.getAllForFilterOptions({
            organisation: orgId,
            mainType: 'GLOBAL',
          })
        : Promise.resolve([] as Location[]),
      customLocations: filters.find((filter) => filter.key === 'customLocation')
        ? this.locationService.getAllForFilterOptions({
            organisation: orgId,
            mainType: 'CUSTOM',
          })
        : Promise.resolve([] as Location[]),
      seasons: filters.find((filter) => filter.key === 'seasonCode')
        ? this.seasonService.getMany({
            organisation: orgId,
            sort: 'shortCode',
            sortOrder: 'desc',
          })
        : Promise.resolve({ data: [] as Season[], count: 0 }),
    });

    return filters.map((filter: DataTableFilter) => {
      if (filter.key === 'location') {
        filter.options = data.locations.map((loc) => ({
          value: loc.name,
          label: loc.type,
        }));
      } else if (filter.key === 'customLocation') {
        filter.options = data.customLocations.map((loc) => ({
          value: loc.name,
          label: loc.type,
        }));
      } else if (filter.key === 'seasonCode') {
        filter.options = data.seasons.data.map((season) => ({
          value: season.shortCode,
          label: season.shortCode,
        }));
      } else if (filter.key === 'polygonStatus') {
        filter.options = [
          { value: 'OK', label: 'OK' },
          { value: 'WARNINGS', label: 'Warnings' },
          { value: 'FAILED', label: 'Failed' },
          { value: 'NONE', label: 'Missing' },
        ];
      } else if (filter.key === 'deforestation') {
        filter.options = [
          { value: 'NOT_DONE', label: 'Not analyzed' },
          { value: 'OK', label: 'OK' },
          { value: 'RISK', label: 'Has risk' },
        ];
      } else if (filter.key === 'updatedWithin') {
        filter.options = [
          { value: 'DAY', label: '1 day' },
          { value: 'WEEK', label: '7 days' },
          { value: 'MONTH', label: '30 days' },
        ];
      }
      return filter;
    });
  }

  async getFilters(filterKey: string, orgId?: string) {
    const filterClass = filterClassMap[filterKey as FilterClasses];
    if (!filterClass) {
      this.logger.error(`No filter class found for key: ${filterKey}`);
      return [];
    }

    const filters = this.extractFiltersFromClass(filterClass);
    return orgId
      ? this.appendOptionsToFilters(orgId, filters)
      : Promise.resolve(filters);
  }
}
