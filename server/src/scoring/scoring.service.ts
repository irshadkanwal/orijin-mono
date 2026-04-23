import { Injectable, NotFoundException } from '@nestjs/common';
import { FunctionTypes, ScoringResult } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RuleFunctionFactory } from '../rule/lib/ruleValidations/factory/ruleFunctionFactory.service';
import { RuleService } from '../rule/rule.service';
import { FarmsService } from '../farms/farms.service';
@Injectable()
export class ScoringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ruleFunctionFactory: RuleFunctionFactory,
    private readonly ruleService: RuleService,
    private readonly farmService: FarmsService,
  ) {}

  async runScoring(
    org: string,
    ruleIDs: string[],
    farmID: string,
  ): Promise<ScoringResult> {
    const farm = await this.farmService.getOne({ id: farmID, org });
    for (const ruleID of ruleIDs) {
      try {
        const rule = await this.ruleService.getOne(ruleID);
        if (!rule) {
          throw new NotFoundException(`Rule (${ruleID}) not found.`);
        }

        const score = await this.evaluateRule(rule.functionType, [farm]);

        const scoring = await this.prisma.scoringResult.create({
          data: {
            ruleName: rule.name,
            scoreValue: score,
          },
        });
        return scoring;
      } catch (error) {
        throw error;
      }
    }
  }
  async getScoringResults(scoringID: string) {
    return this.prisma.scoringResult.findMany({
      where: { id: scoringID },
    });
  }
  private async evaluateRule(
    type: FunctionTypes,
    args?: any[],
  ): Promise<number> {
    if (type === 'FARM_AREA_VALIDATOR') {
      const validator = this.ruleFunctionFactory.getValidator(type);
      const valid = await validator.execute(...args);
      if (valid) return 100;
      else return 0;
    } else {
      //TODO implement Custom function from rule.functionCode
      return 0;
    }
  }
}
