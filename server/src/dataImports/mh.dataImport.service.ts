import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FileReaderService } from './fileReader.service';
import { PersonsService } from '../persons/persons.service';
import { FarmsService } from '../farms/farms.service';
import { PlotsService } from '../farms/plots.service';
import { LocationsService } from '../locations/locations.service';
import { SeasonsService } from '../seasons/seasons.service';
import { FacilitiesDto } from '../facilities/dto/facilities.dto';
import { FarmInputValues, PlotDto } from '../farms/dto/farms.dto';
import {
  Location,
  LocationLevels,
  LocationMainType,
  MhCustomLocationLevels,
} from '../locations/models/locations.model';
import { UserType } from '../users/models/user.model';
import { FacilityType } from '../facilities/models/facility.model';
import { PlotType } from '../farms/models/plots.model';
import { EnumMainType } from '@prisma/client';

export type MhFarm = {
  district: string;
  districtName: string;
  subCounty: string;
  subCountyName: string;
  region: string;
  zone: string;
  zoneName: string;
  parentFacility: string;
  parentFacilityName: string;
  idLabelShort: string;
  nameold: string;
  name: string;
  contactLastName: string;
  contactFirstName: string;
  contactGender: string;
  contactDob: string;
  contactDobCleaned: string;
  contactDobApproximate: string;
  dobOriginal: number;
  age_1: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  location: string;
  certificationStatus: string;
  'Certification Status': string;
  contractDate: string;
  contractDateCleaned: string;
  contractDateOriginal: number;
  plotCount: number;
  areaOrganic: number;
  areaCrop: number;
  areaTotal: number;
  numberOfPlantsProductive: number;
  numberOfPlantsNonProductive: number;
  numberOfPlantsTotal: number;
  numberOfPlantsShade: number;
  yieldEstimateRaw: number;
  yieldEstimateProcessed: number;
  pulperType: string;
  lastChemicalUseDate: string;
  inConversionStatus: string;
  phone: number;
  internalInspector: string;
  lastInspectionDate: string;
  reInspectionDateOriginal: string;
  firstVisitDate: string;
  firstVisitDateOriginal: string;
};

export type LocationExcelRow = {
  idLabelShort: string;
  name: string;
  parentLocation: string;
};

const parseDate = (dateString) => {
  const date = new Date(dateString + 'Z');
  if (
    isNaN(date.getTime()) ||
    dateString === '1970-01-01T00:00:00' ||
    dateString === 'NaN/NaN/NaN' ||
    dateString === ''
  ) {
    return null; // Invalid date
  }
  return date;
};

const ORG_MH = 'mh';

@Injectable()
export class MhDataImportService {
  logger = new Logger(MhDataImportService.name);

  constructor(
    private prisma: PrismaService,
    private excelImportServicel: FileReaderService,
    private personsService: PersonsService,
    private farmsService: FarmsService,
    private plotsService: PlotsService,
    private locationsService: LocationsService,
    private seasonsService: SeasonsService,
  ) {}

  async importMh(): Promise<any> {
    try {
      const file =
        '/importData/mh/MH Step 5  - Farms  - orijin-dataimport.xlsx';
      const excelContents = await this.excelImportServicel.readExcelFile(file);
      const farmData = excelContents['farms'];

      // Get all locations from their owns sheets + run through Farms to confirm all exist
      // const { customLocations, regularLocations } =
      //   await this.confirmLocationsExist(
      //     farmData,
      //     await this.addCustomLocations(excelContents),
      //     await this.addRegularLocations(excelContents),
      //   );

      // Version after initial run was complete and just 200 farms were remaining for re-run
      const regularLocations = await this.locationsService.getMany({
        organisation: ORG_MH,
        mainType: EnumMainType.GLOBAL,
      });
      const customLocations = await this.locationsService.getMany({
        organisation: ORG_MH,
        mainType: EnumMainType.CUSTOM,
      });

      // Process actual farms asynchronously
      const farms = await Promise.all(
        excelContents['farms'].map(async (farm) =>
          this.processFarm(
            farm,
            {
              farmerGroups: customLocations.data.filter(
                (loc) => loc.type === 'Farmergroups',
              ),
            },
            regularLocations.data,
          ),
        ),
      );
      this.logger.log('Done!! Created ' + farms.length);
      return { customLocations, regularLocations, farms };
    } catch (err) {
      this.logger.error(err.stack);
    }
  }

  addLocations = async (
    excelContents: LocationExcelRow[],
    type,
    mainType,
    parents,
  ) => {
    return await Promise.all(
      excelContents.map((loc) => {
        const parent = parents?.find(
          (parent) => parent.shortCode === loc.parentLocation,
        );
        return this.locationsService.create({
          organisation: ORG_MH,
          shortCode: loc.idLabelShort,
          name: loc.name,
          type: type,
          mainType: mainType,
          parent,
        });
      }),
    );
  };

  async addCustomLocations(excelContents) {
    const regions: Location[] = await this.addLocations(
      excelContents['regions.skip'],
      MhCustomLocationLevels.REGION,
      EnumMainType.CUSTOM,
      [],
    );
    const zones: Location[] = await this.addLocations(
      excelContents['zones.skip'],
      MhCustomLocationLevels.ZONE,
      EnumMainType.CUSTOM,
      regions,
    );
    const farmerGroups = await this.addLocations(
      excelContents['farmergroups.skip'],
      MhCustomLocationLevels.FARMER_GROUP,
      EnumMainType.CUSTOM,
      zones,
    );
    return { farmerGroups, zones, regions };
  }

  // TODO: How to merge into LTC's locations? Should check if same loc exists? (just doing org-specific for now)
  async addRegularLocations(excelContents) {
    const districts: Location[] = await this.addLocations(
      excelContents['districts.skip'],
      LocationLevels.DISTRICT,
      EnumMainType.GLOBAL,
      [],
    );
    const subCounties: Location[] = await this.addLocations(
      excelContents['subcounties.skip'],
      LocationLevels.SUB_COUNTY,
      EnumMainType.GLOBAL,
      districts,
    );
    const parishes = await this.addLocations(
      excelContents['parishes.skip'],
      LocationLevels.PARISH,
      EnumMainType.GLOBAL,
      subCounties,
    );
    const villages = await this.addLocations(
      excelContents['villages.skip'],
      LocationLevels.VILLAGE,
      EnumMainType.GLOBAL,
      parishes,
    );
    return [...villages, ...parishes, ...subCounties, ...districts];
  }

  async confirmLocationsExist(
    allFarms: MhFarm[],
    customLocations,
    regularLocations,
  ) {
    const missingLocations = {};
    allFarms.forEach((farmData: MhFarm) => {
      const { district, subCounty, subCountyName } = farmData;
      const regularLocation = regularLocations.find(
        (loc) => loc.shortCode === subCounty,
      );

      if (!regularLocation) {
        const parentForLocation = regularLocations.find(
          (locs) => locs.shortCode === district,
        );
        if (!parentForLocation) {
          throw new Error(
            'Missing parent ' + district + ' for new location ' + subCountyName,
          );
        }
        missingLocations[subCountyName] = {
          organisation: ORG_MH,
          shortCode: subCounty.trim(),
          name: subCountyName.trim(),
          type: LocationLevels.SUB_COUNTY,
          mainType: LocationMainType.GLOBAL,
          parent: parentForLocation,
        };
      }
    });

    await Promise.all(
      Object.keys(missingLocations).map(async (key) => {
        const newRegularLocation: Location = await this.locationsService.create(
          missingLocations[key],
        );
        this.logger.log(
          'Missing location ' +
            missingLocations[key].name +
            ' created with id ' +
            newRegularLocation.id,
        );
      }),
    );
    return { regularLocations, customLocations };
  }

  async processFarm(farmData, customLocations, regularLocations) {
    const meta = {
      organisation: 'mh',
    };

    const shortCode = farmData.idLabelShort;
    const existingFarm = await this.farmsService.getMany({
      organisation: meta.organisation,
      shortCode,
    });
    if (existingFarm.data.length > 0) {
      this.logger.log('Farm ' + shortCode + ' already exists, skipping');
      return;
    } else {
      this.logger.warn('Going to add ' + shortCode);
    }

    /////
    // Location - handled in earlier loop
    /////
    const {
      district,
      districtName,
      subCounty,
      subCountyName,
      region,
      zone,
      zoneName,
    } = farmData;

    /////
    // Contact person
    /////
    const {
      idLabelShort,
      nameold,
      name,
      contactLastName,
      contactFirstName,
      contactGender,
      contactDob,
      contactDobCleaned,
      contactDobApproximate,
      dobOriginal,
      age_1,
      phone,
    } = farmData;
    // const contactPerson = await this.personsService.create({
    const contactPerson = {
      organisation: ORG_MH,
      dateOfBirth: parseDate(contactDob), // or contactDobCleaned
      firstName: contactFirstName,
      gender: contactGender,
      lastName: contactLastName,
      phone: '' + phone,
      shortCode: idLabelShort,
      type: UserType.Farmer,
    };

    // Coords
    const {
      latitude,
      longitude,
      accuracy,
      altitude,
      location,
      parentFacility,
      parentFacilityName,
    } = farmData;
    const regularLocation = regularLocations.find(
      (loc) => loc.shortCode === subCounty,
    );
    const customLocation = customLocations.farmerGroups.find(
      (loc) => loc.shortCode === parentFacility,
    );
    if (!customLocation) {
      throw new Error('No custom location for farmerGroup ' + parentFacility);
    }

    const facilityValues: FacilitiesDto = {
      organisation: ORG_MH,
      shortCode: idLabelShort,
      name: name,
      areaTotalManual: 0,
      type: FacilityType.Farm,
      coordinate:
        latitude && longitude
          ? {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }
          : undefined,
      location: regularLocation,
      customLocation: customLocation,
      mainContactPerson: contactPerson,
    };

    /////
    // Plot values - NOTE! We know plot count and totals, but not split per plot!!
    /////
    const {
      areaTotal,
      areaOrganic,
      plotCount,
      areaCrop,
      numberOfPlantsProductive,
      numberOfPlantsNonProductive,
      numberOfPlantsTotal,
      numberOfPlantsShade,
      yieldEstimateRaw,
      yieldEstimateProcessed,
    } = farmData;
    const plotValues: PlotDto = {
      organisation: meta.organisation,
      // cultivationStartDate: undefined,
      // distanceToForest: 0,
      // distanceToForestKnown: false,
      // establishedBefore2020: false,
      // farmCode: '',
      // farmId: '',
      // hasLandTitle: false,
      // hasRightToLand: false,
      // hasShadeTrees: false,
      // lastChemicalUseDate: undefined,
      // ownerName: '',
      // polygonCoordinates: [],
      // polygonSource: undefined,
      // principalLeasesLand: false,
      // principalOwnsLand: false,
      // registrationDate: undefined,
      // status: '',
      // traditionalOwnersPresent: false,
      areaSizeManual: parseFloat(areaTotal),
      areaSizeOrganicManual: parseFloat(areaOrganic),
      type: PlotType.Permanent,
      shortCode: idLabelShort + '-PLOTS',
      name: idLabelShort + '-PLOTS',
      yieldEstimateProcessed: yieldEstimateProcessed,
      yieldEstimateRaw: yieldEstimateRaw,
    };

    /////
    // Farm values
    /////
    const {
      certificationStatus,
      // ['Certification Status'], //
      contractDate,
      contractDateCleaned,
      contractDateOriginal,
      pulperType,
      lastChemicalUseDate,
      inConversionStatus,
      internalInspector,
      lastInspectionDate,
      reInspectionDateOriginal,
      firstVisitDate,
      firstVisitDateOriginal,
    } = farmData;
    const farmValues: FarmInputValues = {
      // seasonCode?: string;
      // seasonId?: string;
      //
      // cultivationStartDate?: Date;
      // registrationDate?: Date;
      // certificationStartDate?: Date;
      // approvalStatus?: ReviewStatus;
      // creationStatus?: CreationStatus;
      contractDate: parseDate(contractDate),
      lastChemicalUseDate: parseDate(lastChemicalUseDate),
      lastInspectionDate: parseDate(lastInspectionDate),
      firstVisitDate: parseDate(firstVisitDate),
      // certificationStatus: certificationStatus, // TODO: How to store?
      parentFacilityName: parentFacilityName,
      plots: [plotValues],
    };
    return await this.farmsService.create({
      organisation: ORG_MH,
      facilityValues,
      farmValues,
    });
  }
}
