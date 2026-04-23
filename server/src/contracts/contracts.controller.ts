import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Contract } from './models/contracts.model';
import { ContractsService } from './contracts.service';

@Controller()
export class ContractsController {
  constructor(private readonly contactService: ContractsService) {}

  @Post('contacts')
  postContract(@Body() body): Promise<Contract> {
    return this.contactService.create(body);
  }

  @Get('contacts')
  getVarieties(): Promise<Contract[]> {
    return this.contactService.getAll();
  }

  @Get('contacts/:id')
  getContract(@Param('id') id: string): Promise<Contract> {
    return this.contactService.getOne(id);
  }
}
