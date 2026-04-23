import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Person } from './models/persons.model';
import { PersonsService } from './persons.service';
import { PersonsFilter } from './dto/persons.filter.dto';
import { PaginationAndSortingOutputDto } from '../common/dto/paginationAndSorting.dto';

@Controller()
export class PersonsController {
  constructor(private readonly personService: PersonsService) {}

  @Post(':org/persons')
  postPerson(
    @Param('org') org: string, //
    @Body() body,
  ): Promise<Person> {
    body.organisation = org;
    return this.personService.create(body);
  }

  @Get(':org/persons')
  getPersons(
    @Param('org') org: string,
    @Query() filters: PersonsFilter,
  ): Promise<PaginationAndSortingOutputDto<Person>> {
    filters.organisation = org;
    return this.personService.getMany(filters);
  }

  @Get(':org/persons/:id')
  getPerson(
    @Param('org') org: string,
    @Param('id') id: string,
    @Query() filters: PersonsFilter,
  ): Promise<Person> {
    return this.personService.getOne(
      {
        id,
        org: org,
      },
      this.personService.servicesActivitiesInclude(),
    );
  }

  @Post(':org/personsFilterByType')
  getPersonsFilter(
    @Param('org') org: string, //
    @Body() body,
  ): Promise<Person[]> {
    const types = Array.isArray(body) ? body : [body];
    return this.personService.getCustomizedMany({
      OR: types.map((type) => ({ type })),
    });
  }
}
