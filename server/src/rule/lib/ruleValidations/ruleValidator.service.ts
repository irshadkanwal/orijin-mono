import { Injectable } from '@nestjs/common';
import { RuleFunctionsService } from '../ruleFunctions.service';
import { Farm } from '../../../farms/models/farms.model';

export interface IRuleFunction {
  execute(...args: any[]): Promise<boolean>;
}

@Injectable()
export class FarmAreaValidator implements IRuleFunction {
  constructor(private readonly ruleFunctionsService: RuleFunctionsService) {}

  async execute(farm: Farm): Promise<boolean> {
    return this.ruleFunctionsService.isPolygonCorrect(farm);
  }
}
