import { IsNotEmpty, ValidateNested } from 'class-validator';
import { FirebaseMetaData } from '../../common/models/firebase-metadata.model';
import {
  CertificationStatus,
  CountCategory,
  CountSubType,
  CountType,
  CreationStatus,
  ReviewStatus,
} from '../models/farms.model';
import { Type } from 'class-transformer';
import { Plot, PlotCoordinateSources, PlotType } from '../models/plots.model';
import {
  FacilitiesDto,
  FacilitiesDtoCsv,
} from '../../facilities/dto/facilities.dto';

export class FarmInputValues {
  id?: string;
  firestoreId?: string;

  seasonCode?: string;
  seasonId?: string;

  cultivationStartDate?: Date;
  contractDate?: Date;
  registrationDate?: Date;
  certificationStartDate?: Date;
  lastChemicalUseDate?: Date;
  lastInspectionDate?: Date;
  firstVisitDate?: Date;

  certificationStatus?: CertificationStatus;
  approvalStatus?: ReviewStatus;
  creationStatus?: CreationStatus;
  parentFacilityName?: string;

  plots?: PlotDto[];
}

export class CountItemDto {
  @IsNotEmpty()
  category: CountCategory;

  @IsNotEmpty()
  type: CountType;

  subType?: CountSubType;

  @IsNotEmpty()
  count: number;

  farmId?: string;
  farmCode?: string;

  plotId?: string;
  plotCode?: string;
}

export class FarmsDtoCSv extends FacilitiesDtoCsv {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  seasonCode: string;

  cultivationStartDate?: string;
  contractDate?: string;
  registrationDate?: string;
  certificationStartDate?: string;
  lastChemicalUseDate?: string;
  lastInspectionDate?: string;
  firstVisitDate?: string;

  certificationStatus?: string;
  approvalStatus?: string;
  creationStatus?: string;

  longitude?: string;
  latitude?: string;
  altitude?: string;
}

// TODO: What's the best way to handle this? Just extending the model and keeping everything in one data set causes issues when they'd need to be
// separated at prisma.create() stage..
export class FarmsDto {
  //TODO: these are here just to satisfy the compiler for now
  organisation: string;
  id?: string;

  @ValidateNested()
  @Type(() => FarmInputValues)
  @IsNotEmpty()
  farmValues: FarmInputValues;

  @ValidateNested()
  @Type(() => FacilitiesDto)
  @IsNotEmpty()
  facilityValues: FacilitiesDto;
}

export class PlotDto {
  // NOTE! Not really required, only because PlotService extends AbstractService..
  @IsNotEmpty()
  organisation: string;

  id?: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: PlotType;

  farmId?: string;
  farmCode?: string;

  status?: string;

  polygonSource?: PlotCoordinateSources;
  polygonCoordinates?: number[][]; // [poly.lat, poly.long]

  yieldEstimateRaw?: number;

  yieldEstimateProcessed?: number;
  cultivationStartDate?: Date;
  registrationDate?: Date;
  lastChemicalUseDate?: Date;
  principalOwnsLand?: boolean;
  principalLeasesLand?: boolean;
  hasRightToLand?: boolean;
  hasLandTitle?: boolean;
  ownerName?: string;
  establishedBefore2020?: boolean;
  hasShadeTrees?: boolean;
  distanceToForestKnown?: boolean;
  distanceToForest?: number;
  traditionalOwnersPresent?: boolean;

  areaSizeManual?: number;
  areaSizeOrganicManual?: number;
  interCropped?: boolean;
  active?: boolean;

  countItems?: CountItemDto[];
}

export class PlotDtoCsv {
  @IsNotEmpty()
  organisation: string;

  id?: string;

  @IsNotEmpty()
  shortCode: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: PlotType;

  farmId?: string;
  farmCode?: string;

  status?: string;

  polygonSource?: PlotCoordinateSources;
  polygonCoordinates?: number[][]; // [poly.lat, poly.long]

  yieldEstimateRaw?: string;

  yieldEstimateProcessed?: number;
  cultivationStartDate?: string;
  registrationDate?: string;
  lastChemicalUseDate?: string;
  principalOwnsLand?: boolean;
  principalLeasesLand?: boolean;
  hasRightToLand?: boolean;
  hasLandTitle?: boolean;
  ownerName?: string;
  establishedBefore2020?: boolean;
  hasShadeTrees?: boolean;
  distanceToForestKnown?: boolean;
  distanceToForest?: number;
  traditionalOwnersPresent?: boolean;

  areaSizeManual?: string;
  areaSizeOrganicManual?: number;
  interCropped?: string;
  active?: string;
}

export class PlotDtoConnected extends PlotDto {
  farm: {
    connect: {
      id: string;
    };
  };
}
