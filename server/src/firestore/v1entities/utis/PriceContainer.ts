import { Type } from 'class-transformer';
import AmountUnit from './AmountUnit';

export default class PriceContainer {
  @Type(() => AmountUnit)
  price: AmountUnit = null;

  @Type(() => AmountUnit)
  perWeight: AmountUnit = null;
}
