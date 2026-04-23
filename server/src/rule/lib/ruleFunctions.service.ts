import { Injectable } from '@nestjs/common';
import { Farm } from '../../farms/models/farms.model';

@Injectable({})
export class RuleFunctionsService {
  private MIN_AREA = 0.1;
  private MAX_AREA = 10;

  //Main Function
  async isPolygonCorrect(farm: Farm) {
    return await this.farmPlotValid(farm);
  }

  private isAreaValid(area: number): boolean {
    return area >= this.MIN_AREA && area <= this.MAX_AREA;
  }
  private async farmPlotValid(farm: Farm): Promise<boolean> {
    return this.isAreaValid(farm.totalArea);
  }
}
