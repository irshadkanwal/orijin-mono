import { Injectable, Logger } from '@nestjs/common';
import { FileReaderService } from './fileReader.service';
import { FarmsService } from '../farms/farms.service';
import { FacilitiesDto } from '../facilities/dto/facilities.dto';
import { CountItemDto, FarmInputValues, PlotDto } from '../farms/dto/farms.dto';
import { UserType } from '../users/models/user.model';
import { FacilityType } from '../facilities/models/facility.model';
import { PlotCoordinateSources, PlotType } from '../farms/models/plots.model';
import { MhRawFarm } from './models/mhRaw.farm.model';
import { EntityServiceOperationType } from '../common/dto/types';
import { HECATRES_TO_ACRES_MULTIPLIER } from '../common/constants';
import { MhDataImportService } from './mh.dataImport.service';
import { LocationsService } from '../locations/locations.service';
import { LocationMainType } from '../locations/models/locations.model';
import {
  CountCategory,
  CountSubType,
  CountType,
  Farm,
} from '../farms/models/farms.model';
import { PrismaService } from 'nestjs-prisma';

const ORG_MH = 'mh';

@Injectable()
export class MhRawDataImportService {
  logger = new Logger(MhRawDataImportService.name);

  constructor(
    private prisma: PrismaService,
    private mhImportService: MhDataImportService,
    private fileReaderService: FileReaderService,
    private locationsService: LocationsService,
    private farmsService: FarmsService,
  ) {}

  printOut = (text, left, right) => {
    this.logger.log(text, left + ' / ' + right);
  };

  async importMHRawFormat(limit = 9999): Promise<any> {
    try {
      const file =
        '/importData/mh/Internal_Farm_Inspection_Form_raw_date_22-23.xlsx';
      const excelContents = await this.fileReaderService.readExcelFile(file, 5);
      const farmData = excelContents['Form1'];

      // Get all locations from their owns sheets + run through Farms to confirm all exist
      // const { customLocations, regularLocations } =
      //   await this.mhImportService.confirmLocationsExist(
      //     farmData,
      //     await this.mhImportService.addCustomLocations(excelContents),
      //     [],
      //     // await this.mhImportService.addRegularLocations(excelContents),
      //   );
      //

      const customLocations = await this.locationsService.getMany({
        organisation: ORG_MH,
        mainType: LocationMainType.CUSTOM,
      });

      // Confirm seasons
      await this.addSeasons();

      const existingFarms = await this.farmsService.getMany({
        organisation: 'mh',
      });

      const chunkSize = 20;
      const allFarms = farmData.slice(0, limit);
      const results = [];

      async function processChunk(chunk, that) {
        return Promise.all(
          chunk.map(async (farm) => {
            results.push(
              await that.processFarm(
                farm,
                customLocations.data,
                results,
                existingFarms.data,
              ),
            );
          }),
        );
      }

      for (let i = 0; i < allFarms.length; i += chunkSize) {
        const chunk = allFarms.slice(i, i + chunkSize);
        const chunkResults = await processChunk(chunk, this);
        results.push(...chunkResults);
        console.log(
          `Processed ${i + chunk.length} out of ${allFarms.length} farms`,
        );
      }

      // Process actual farms asynchronously
      // let index = 2;
      // for (const farm of allFarms) {
      //   index++;
      //   this.logger.log('--------------------');
      //   this.logger.log(index + ' / ' + allFarms.length);
      //   this.logger.log('--------------------');
      //   results.push(
      //     await this.processFarm(
      //       farm,
      //       customLocations.data,
      //       results,
      //       existingFarms.data,
      //     ),
      //   ); // , customLocations, regularLocations),
      // }
      // results = results.filter((x) => x);
      // this.logger.log('Done! Results:', JSON.stringify(results, null, 4));

      // Out of all
      // this.printOut(
      //   'Farms found from DB and processed till the end:',
      //   results.filter((x) => x.farmFoundFromDb).length,
      //   allFarms.length,
      // );
      // this.printOut(
      //   'Partial farm code: ',
      //   results.filter((x) => x.partialFarmCodeFound).length,
      //   allFarms.length,
      // );
      // this.printOut(
      //   'Duplicate farm code: ',
      //   results.filter((x) => x.duplicateFarmCodeFound).length,
      //   allFarms.length,
      // );
      //
      // // Out of processed
      // this.printOut(
      //   'PolygonsOk:',
      //   results.filter((x) => x.polygonsOk).length,
      //   results.length,
      // );
      // this.printOut(
      //   'PlotCountMatches: ',
      //   results.filter((x) => x.plotCountMatches).length,
      //   results.length,
      // );
      // this.printOut(
      //   'Text In Area Field: ',
      //   results.filter((x) => x.textInAreaField).length,
      //   results.length,
      // );

      return {
        // customLocations, regularLocations,
        farms: results.filter((x) => x),
      };
    } catch (err) {
      this.logger.error(err.stack);
    }
  }

  async createSeason(lastDigitsOfYear, active = false) {
    const startYear = lastDigitsOfYear;
    const endYear = parseInt(lastDigitsOfYear) + 1;
    const code = '20' + startYear + '/' + endYear;
    const existing = await this.prisma.season.findUnique({
      where: {
        shortCode_organisation: { shortCode: code, organisation: 'mh' },
      },
    });
    if (!existing) {
      await this.prisma.season.create({
        data: {
          shortCode: code,
          name: code,
          startsAt: new Date('20' + startYear + '-07-01'),
          endsAt: new Date('20' + endYear + '-06-30'),
          organisation: 'mh',
          active: active,
        },
      });
    }
  }

  async addSeasons() {
    // await this.createSeason('19');
    // await this.createSeason('20');
    await this.createSeason('21');
    await this.createSeason('22');
    await this.createSeason('23', true);
  }

  async upsertContactPerson(farmData, farmShortCode) {
    const name = farmData['Farmer Name:'];
    if (!name || typeof name !== 'string') {
      this.logger.warn('No name for ' + farmShortCode);
      return;
    }
    const contactPerson = {
      organisation: ORG_MH,
      firstName: name.split(' ')[0],
      gender: farmData.Gender,
      lastName: name.split(' ')[1],
      shortCode: farmShortCode,
      type: UserType.Farmer,
      // dateOfBirth: parseDate(contactDob), // or contactDobCleaned
      // phone: '' + phone,
    };
    const existingContactPersons = await this.prisma.person.findMany({
      where: {
        organisation: ORG_MH,
        shortCode: farmShortCode,
      },
    });
    if (existingContactPersons.length > 0) {
      return {
        ...existingContactPersons[0],
        ...contactPerson,
      };
    }
    return contactPerson;
  }

  normalizeObjectKeys(obj) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/\u00A0/g, ' '),
        value,
      ]),
    );
  }

  async processFarm(
    rawFarmData,
    customLocations = null,
    results = [],
    existingFarms: Farm[] = [],
    regularLocations = null,
  ) {
    const farmData: MhRawFarm = this.normalizeObjectKeys(
      rawFarmData,
    ) as MhRawFarm;

    const shortCode = farmData['Farmer Code:'];
    if (!shortCode || shortCode === '') {
      this.logger.log('Blank row, skipping');
      return;
    }

    if (shortCode.endsWith('-') || shortCode.length < 9) {
      this.logger.log(
        'Only partial farm code found, skipping to avoid duplicates: ' +
          shortCode,
      );
      return { shortCode, partialFarmCodeFound: true };
    }

    const inspectionDate = this.fileReaderService.convertExcelDateToJSDate(
      farmData['Date of Inspection'],
    );
    const seasonCode =
      inspectionDate.getUTCFullYear() +
      '/' +
      (inspectionDate.getUTCFullYear() + 1).toString().substring(2, 4);

    if (
      seasonCode === '2019/20' ||
      seasonCode === '2020/21' ||
      seasonCode === '2025/26'
    ) {
      this.logger.log('Skipping season ' + seasonCode);
      return;
    }

    if (
      results
        .filter((x) => x)
        .find(
          (x) =>
            x.shortCode.toUpperCase() === shortCode.toUpperCase() &&
            x.seasonCode === seasonCode,
        )
    ) {
      this.logger.log('Duplicate farm code found, skipping: ' + shortCode);
      return { shortCode, duplicateFarmCodeFound: true };
    }

    const meta = {
      organisation: 'mh',
    };

    const existsFor23 = existingFarms.find(
      (x: Farm) =>
        x.facility.shortCode === shortCode && x.season.shortCode === '2023/24',
    );
    // const existsFor23 = await this.farmsService.getMany({
    //   shortCode: shortCode,
    //   organisation: meta.organisation,
    //   seasonCode: '2023/24',
    // });
    if (!existsFor23) {
      this.logger.log(
        'Farm ' +
          shortCode +
          'not originally imported for 23, skipping totally',
      );
      return;
    }

    const existingFarm = existingFarms.find(
      (x: Farm) =>
        x.facility.shortCode === shortCode && x.season.shortCode === seasonCode,
    );
    if (!existingFarm) {
      this.logger.warn(
        'No existing farm for ' +
          shortCode +
          ' season ' +
          seasonCode +
          ', creating',
      );
      // return;
    } else {
      this.logger.log(
        'Farm found for ' +
          shortCode +
          ' season ' +
          seasonCode +
          ', id: ' +
          existingFarm.id,
      );
    }

    // TODO: We are not processing the updates to the main contact person at facilityService.connectDependenciesForCreateAndUpdate()
    const contactPerson = await this.upsertContactPerson(farmData, shortCode);

    const farmerGroupName = farmData['Farmer Group Name']; // also: 'Zone'
    const customLocation = customLocations
      .filter((location) => location.type === 'Farmergroups')
      .find((loc) => loc.name.toLowerCase() === farmerGroupName.toLowerCase());
    if (!customLocation) {
      this.logger.warn('No custom location for farmerGroup ' + farmerGroupName);
    }

    // Facility coordinates
    let latitude = parseFloat(farmData['GPS Latitude']);
    let longitude = parseFloat(farmData['GPS Longitude']);
    if (latitude > 10) {
      // MH-specific fix, some values are wrong way in Excel..
      const temp = latitude;
      latitude = longitude;
      longitude = temp;
    }

    const facilityValues: FacilitiesDto = {
      id: existingFarm?.facility?.id,
      organisation: ORG_MH,
      shortCode,
      name: shortCode,
      areaTotalManual: 0,
      type: FacilityType.Farm,
      coordinate:
        latitude && longitude
          ? {
              // TODO: These are wrong way in the DB!!
              latitude: longitude,
              longitude: latitude,
            }
          : undefined,
      // location: regularLocation,
      customLocation: customLocation,
      mainContactPerson: contactPerson,
      countryIso: 'UGA',
    };

    /////
    // Plot values
    /////
    let polygonsOk = true;
    let textInAreaField = false;
    const addPlot = (farmData, number): PlotDto => {
      const areaKey =
        number === 1
          ? 'Field 1: Area(acres)' //
          : 'Field ' + number + ': Area';
      let areaManual =
        farmData[areaKey] !== '0'
          ? parseFloat(farmData[areaKey]) / HECATRES_TO_ACRES_MULTIPLIER
          : null;
      if (isNaN(areaManual)) {
        this.logger.warn(
          'Invalid area for ' + areaKey + ' -> ' + farmData[areaKey],
        );
        areaManual = 0;
        textInAreaField = true;
      }

      // Plot coordinates
      const latKey = 'Field ' + number + ': GPS Latitude';
      const lonKey = 'Field ' + number + ': GPS Longitude';
      let lat = parseFloat(farmData[latKey]) || 0;
      let long = parseFloat(farmData[lonKey]) || 0;

      let coordinates = null;
      if (lat && long && lat > 0 && long > 0 && lat < 90 && long < 90) {
        if (lat > 10) {
          // MH-specific fix, some values are wrong way in Excel..
          const temp = lat;
          lat = long;
          long = temp;
        }
        coordinates = [[long, lat]]; // TODO! These are wrong way in the DB.. [[lat, long]] would be correct but..
      } else {
        polygonsOk = false;
        this.logger.debug(
          'No correct lat/long for ' +
            shortCode +
            ', field : ' +
            number +
            ' ' +
            JSON.stringify({ [latKey]: lat || null, [lonKey]: long || null }),
        );
      }

      const counts = {
        productive: farmData['Field ' + number + ': Productive Trees'] || 0,
        young: farmData['Field ' + number + ': Number of Young trees'] || 0,
        stumped: farmData['Field ' + number + ': Stumped Trees'] || 0,
        shade: farmData['Field ' + number + ': Shade Trees'] || 0,
      };
      const countItems: CountItemDto[] = [];
      countItems.push({
        category: CountCategory.Plant,
        type: CountType.MainCrop,
        subType: CountSubType.Productive,
        count: parseInt(counts.productive),
      });
      countItems.push({
        category: CountCategory.Plant,
        type: CountType.MainCrop,
        subType: CountSubType.Young,
        count: parseInt(counts.young),
      });
      countItems.push({
        category: CountCategory.Plant,
        type: CountType.MainCrop,
        subType: CountSubType.Stumped,
        count: parseInt(counts.stumped),
      });
      countItems.push({
        category: CountCategory.Plant,
        type: CountType.Shade,
        count: parseInt(counts.shade),
      });

      // console.log(farmData);
      return {
        organisation: meta.organisation,
        shortCode: shortCode + '-PLOT-' + number,
        name: farmData['Field ' + number + ': Field Name'],
        type: PlotType.Permanent,
        areaSizeManual: areaManual,
        yieldEstimateRaw: parseInt(
          farmData['Field ' + number + ': Yield Estimate'],
        ),
        polygonCoordinates: coordinates,
        polygonSource: PlotCoordinateSources.IMPORT,
        countItems,
      };
    };

    const exists = (string) => {
      return string && string !== '' && string != 'No' && string !== '0';
    };

    //////////////
    // Add plots
    //////////////
    const plots = [addPlot(farmData, 1)];
    if (exists(farmData['Field 2: Field Name'])) {
      plots.push(addPlot(farmData, 2));
    }
    if (exists(farmData['Field 3: Field Name'])) {
      plots.push(addPlot(farmData, 3));
    }
    if (exists(farmData['Field 4: Field Name'])) {
      plots.push(addPlot(farmData, 4));
    }

    //////////////
    // Check plot count
    //////////////
    let plotCountMatches = false;
    const coffeePlots = parseInt(farmData['Number of Coffee Plots']);
    const conventionalPlots = parseInt(
      farmData['Number of Conventional Plots'],
    );
    if (
      !isNaN(coffeePlots) &&
      !isNaN(conventionalPlots) &&
      coffeePlots + conventionalPlots === plots.length
    ) {
      this.logger.log(
        'Plot count matches: ' +
          coffeePlots +
          ' + ' +
          conventionalPlots +
          ' vs ' +
          plots.length,
      );
      plotCountMatches = true;
    } else {
      this.logger.debug(
        'Plot count does NOT match: ' +
          coffeePlots +
          ' + ' +
          conventionalPlots +
          ' vs ' +
          plots.length,
      );
    }

    ////
    // TODO: Confirm areas vs plot areas
    //////
    // 'Area Under Coffee'
    // 'Area Under other Crops'
    // 'Area Under conservation'
    // 'Total Farm Area'

    /////
    // Farm values
    /////
    const farmValues: FarmInputValues = {
      id: existingFarm?.id || undefined,
      seasonCode: seasonCode,
      // cultivationStartDate?: Date;
      // registrationDate?: Date;
      // certificationStartDate?: Date;
      // approvalStatus?: ReviewStatus;
      // creationStatus?: CreationStatus;
      contractDate: this.fileReaderService.convertExcelDateToJSDate(
        farmData['Date of Farmer Contract'],
      ),
      // lastChemicalUseDate: parseDate(lastChemicalUseDate),
      lastInspectionDate: this.fileReaderService.convertExcelDateToJSDate(
        farmData['Date of Inspection'],
      ),
      // firstVisitDate: parseDate(firstVisitDate),
      // certificationStatus: certificationStatus, // TODO: How to store?
      plots,
    };

    // Sanity checks

    const areaUnderoffee = farmData['Area Under Coffee'];
    const areaOtherCrops = farmData['Area Under other Crops'];
    const areaCoservation = farmData['Area Under conservation'];
    const areaTotal = farmData['Total Farm Area'];
    const numberOfPlots = farmData['Number of Coffee Plots'];
    const numberOfConventionalPlots = farmData['Number of Conventional Plots'];

    const areaTotalPlots = plots.reduce((acc, plot) => {
      return acc + plot.areaSizeManual;
    }, 0);

    const summary = {
      existingId: existingFarm?.id,
      areaTotalPlots,
      areaTotal,
      areaUnderoffee,
      areaOtherCrops,
      areaCoservation,
      numberOfPlots,
      numberOfConventionalPlots,
    };
    // console.log('summary for ' + shortCode, summary);

    const entityOperationMetadata = {
      operationType: 'farmImport' as EntityServiceOperationType,
      updatedBy: farmData['Email'],
    };

    if (existingFarm) {
      await this.farmsService.update(
        existingFarm.id,
        {
          organisation: ORG_MH,
          facilityValues,
          farmValues,
        },
        entityOperationMetadata,
      );
    } else {
      await this.farmsService.create(
        {
          organisation: ORG_MH,
          facilityValues,
          farmValues,
        },
        entityOperationMetadata,
      );
    }

    return {
      shortCode,
      farmFoundFromDb: true,
      polygonsOk,
      plotCountMatches,
      textInAreaField,
    };
  }
}
