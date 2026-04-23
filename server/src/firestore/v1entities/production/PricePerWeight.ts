import { Type } from 'class-transformer';
import AmountUnit from '../utis/AmountUnit';

export default class PricePerWeight {
  @Type(() => AmountUnit)
  price: AmountUnit;

  @Type(() => AmountUnit)
  perWeight: AmountUnit;
}
