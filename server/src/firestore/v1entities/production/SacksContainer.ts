import { IAmountUnit } from '../utis/types';

export default class SacksContainer {
  totalMaterialWeight: IAmountUnit = null;
  sackCount: number = null;
  sackWeight: IAmountUnit = null;
  sackCountRemainderWeight: IAmountUnit = null;
  sackCountRemainderWeightInSackUnit: IAmountUnit = null;
}
