export default class AmountUnit {
  amount: number;
  unit: string;

  constructor(amount?: number, unit?: string) {
    this.amount = amount;
    this.unit = unit;
  }
}
