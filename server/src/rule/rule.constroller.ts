import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { Rule } from './models/rule.model';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';

@Controller('rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Get()
  async getRules(): Promise<Rule[]> {
    return this.ruleService.getAllRules();
  }

  @Get('/:id')
  async getRuleById(@Param('id') id: string): Promise<Rule> {
    return this.ruleService.getOne(id);
  }

  @Post()
  async createRule(@Body() createRuleDto: CreateRuleDto): Promise<Rule> {
    return this.ruleService.createRule(createRuleDto);
  }

  @Patch('/:id')
  async updateRule(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
  ): Promise<Rule> {
    return this.ruleService.updateRule(id, updateRuleDto);
  }

  @Delete('/:id')
  async deleteRule(@Param('id') id: string): Promise<boolean> {
    return this.ruleService.deleteRule(id);
  }
}
