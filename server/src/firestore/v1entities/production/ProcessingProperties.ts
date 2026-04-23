import { Transform, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { formatDatesForFS } from '../../v1utils/utils';
import AmountUnit from '../utis/AmountUnit';
import PriceContainer from '../utis/PriceContainer';
import SacksContainer from './SacksContainer';

export default class ProcessingProperties {
  @Transform(({ value }) => formatDatesForFS(value))
  activityStartDateTime: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  activityEndDateTime: Date = null;

  properties: { [key: string]: any } = {};
  defective: boolean;
  containerId: number;
  itemCount: number;
  temperature: number;
  ambientTemperature: number;
  ph: number;
  brix: number;
  brixLiquid: number;
  humidity: number;
  fermentationGrade: number;
  moistureContent: number;
  hoursToReach45: number;
  numberOfBeansIn100g: number;
  roastStyle: string;
  roastLevel: string;
  temperatureHigh: number;
  temperatureLow: number;
  pressure: number;
  viscosity: string;
  finess: string;
  numberOfPackages: number;
  packageWeight: number;

  ambientHumidity: number;
  @Type(() => ObjectId)
  originCollector: ObjectId;

  @Type(() => PriceContainer)
  pricePerWeight: PriceContainer;

  @Type(() => ObjectId)
  sackType: ObjectId;
  @Type(() => ObjectId)
  producer: ObjectId;
  sackCountAfter: number;
  paymentType: string;
  sackCountBefore: number;
  sackCountAvailable: number;
  sackCountUsed: number;
  sackWeight: AmountUnit;
  sackCountCeiling: number;
  sackCountRemainderWeight: AmountUnit;
  weight: number;

  beforeWeight: number;
  discardedWeight: number;
  afterWeight: number;
  weightAvailable: number;
  weightUsed: number;

  @Type(() => AmountUnit)
  money: AmountUnit;

  @Type(() => ObjectId)
  location: ObjectId;

  @Type(() => ObjectId)
  locationParent: ObjectId;

  @Type(() => SacksContainer)
  sacks: SacksContainer;

  @Type(() => ObjectId)
  targetBin: ObjectId;

  setPrimaryProperty(key: any, value: any): any {
    const flexible = this as any;
    flexible[key] = value;
  }

  getProperty(key: string) {
    return this.properties[key];
  }

  public setProperty(key: string, value: any) {
    this.properties[key] = value;
  }

  // copyPropertiesIntoMeFromFormSubmit(values: FormSubmitData) {
  //   const userInputData = values.userInputData;
  //   for (const e of Object.keys(userInputData)) {
  //     this.setProperty(e, userInputData[e]);
  //   }
  // }
}
