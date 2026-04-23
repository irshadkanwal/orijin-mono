import { Injectable, Inject } from '@nestjs/common';
import { FarmAreaValidator, IRuleFunction } from '../ruleValidator.service';

@Injectable()
export class RuleFunctionFactory {
  private validators: Map<string, IRuleFunction> = new Map();

  constructor(
    @Inject(FarmAreaValidator)
    private readonly farmAreaValidator: FarmAreaValidator,
  ) {
    this.validators.set('FARM_AREA_VALIDATOR', this.farmAreaValidator);
  }
  getValidator(key: string): IRuleFunction | undefined {
    return this.validators.get(key);
  }
}
