import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { formatDatesForFS } from '../../v1utils/utils';
import { Variety } from '../../../crops/models/crops.model';
import GeoDataV1 from '../refdata/GeoDataV1';
import Coordinates from '../utis/Coordinates';

export default class PlotV1 extends AbstractEntity {
  // certificationStatus: CertificationStatus = null;
  isOrganic: boolean = null;
  interCropped: boolean = null;
  isActive: boolean = null;

  principalOwnsLand: boolean = null;
  principalLeasesLand: boolean = null;
  hasRightToLand: boolean = null;
  hasLandTitle: boolean = null;
  ownerName: string = null;
  establishedBefore2020: boolean = null;
  hasShadeTrees: boolean = null;
  distanceToForestKnown: boolean = null;
  distanceToForest: number = null;
  traditionalOwners: boolean = null;

  isDecifientOfNutrition: boolean = null;
  shadeAmount: boolean = null;
  landInclination: string = null;
  shannonIndex: number = null;
  evennessIndex: number = null;

  name: string = null;
  type: string = null;
  numberOfPlants: number = null;
  numberOfPlantsProductive: number = null;
  numberOfPlantsNonProductive: number = null;
  numberOfPlantsYoung: number = null;
  numberOfPlantsStumped: number = null;
  numberOfPlantsTotal: number = null;
  numberOfPlantsShade: number = null;
  averageAgeOfPlants: number = null;
  minAgeOfPlants: number = null;
  maxAgeOfPlants: number = null;

  areaCrop: number = null;
  areaOrganic: number = null;
  areaSanctioned: number = null;
  areaInConversion: number = null;
  areaTotal: number = null;
  areaTotalManual: number = null;

  notes: string = null;

  @Transform(({ value }) => formatDatesForFS(value))
  cultivationStartDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  registrationDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  lastChemicalUseDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  lastInspectionDate: Date = null;

  @Type(() => ObjectId)
  varieties: Array<ObjectId> = <Array<ObjectId>>[];

  @Exclude()
  @expandFromId('varieties')
  varietiesFull: Array<Variety> = <Array<Variety>>[];

  @Type(() => ObjectId)
  polygon: ObjectId = null;

  @Exclude()
  @expandFromId('polygon')
  polygonFull: GeoDataV1 = null;

  @Type(() => ObjectId)
  geodatas: Array<ObjectId> = <Array<ObjectId>>[];

  @Exclude()
  @expandFromId('geodatas')
  geodatasFull: Array<GeoDataV1> = <Array<GeoDataV1>>[];

  primaryCrops: string[] = null;
  secondaryCrops: string[] = null;

  // @Type(() => CropHistoryItem)
  // cropHistory: Array<CropHistoryItem> = <Array<CropHistoryItem>>[];

  yieldEstimateRaw: number = null;
  yieldEstimateProcessed: number = null;

  quantityProcessedCurrentSeasonRaw: number;
  quantityProcessedCurrentSeasonProcessed: number;
  quantityProcessedLastSeason: number;
  maxQuantityProcessedLimitRaw: number;

  @Type(() => Coordinates)
  location: Coordinates = null;

  bioDiversityData = {};

  @Type(() => ObjectId)
  season: ObjectId = null;

  @Type(() => ObjectId)
  seasons: Array<ObjectId> = <Array<ObjectId>>[];

  @Type(() => ObjectId)
  facility: ObjectId = null;

  @Type(() => ObjectId)
  farm: ObjectId = null;

  constructor(name?: string) {
    super();
    this.name = name;
  }

  getCollection(): string {
    return collectionKeys.plots;
  }
}
