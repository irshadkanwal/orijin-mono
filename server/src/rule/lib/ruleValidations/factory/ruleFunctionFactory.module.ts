import { Module } from '@nestjs/common';
import { RuleFunctionFactory } from './ruleFunctionFactory.service';
import { FarmAreaValidator } from '../ruleValidator.service';
import { RuleValidationModule } from '../ruleValidation.module';
import { RuleFunctionsService } from '../../ruleFunctions.service';

@Module({
  providers: [RuleFunctionFactory, FarmAreaValidator, RuleFunctionsService],
  exports: [RuleFunctionFactory],
  imports: [RuleValidationModule],
})
export class RuleFunctionFactoryModule {}
