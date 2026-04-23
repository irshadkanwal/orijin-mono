import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { RuleModule } from '../rule/rule.module';
import { ScoringController } from './scoring.controller';
import { RuleValidationModule } from '../rule/lib/ruleValidations/ruleValidation.module';
import { FarmsModule } from '../farms/farms.module';
import { RuleFunctionFactoryModule } from '../rule/lib/ruleValidations/factory/ruleFunctionFactory.module';

@Module({
  imports: [
    RuleModule,
    RuleValidationModule,
    FarmsModule,
    RuleFunctionFactoryModule,
  ],
  controllers: [ScoringController],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
