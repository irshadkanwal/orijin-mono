import { Module } from '@nestjs/common';
import { FarmAreaValidator } from './ruleValidator.service';
import { RuleFunctionsModule } from '../ruleFunctions.module';
import { RuleFunctionsService } from '../ruleFunctions.service';

@Module({
  imports: [RuleFunctionsModule],
  providers: [RuleFunctionsService, FarmAreaValidator],
  exports: [FarmAreaValidator],
})
export class RuleValidationModule {}
