import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FileReaderService } from './fileReader.service';
import { LtcChatpowExportFarm } from './ltc.farmImportFromExcel.model';
import { UserType } from '../users/models/user.model';
import { PersonsService } from '../persons/persons.service';
import { FarmsService } from '../farms/farms.service';
import { LocationsService } from '../locations/locations.service';
import { FacilityType } from '../facilities/models/facility.model';
import { FarmInputValues } from '../farms/dto/farms.dto';
import { SeasonsService } from '../seasons/seasons.service';
import { PlotsService } from '../farms/plots.service';
import { PlotCoordinateSources, PlotType } from '../farms/models/plots.model';
import { ReviewStatus } from '../farms/models/farms.model';
import { PersonsDto } from '../persons/dto/persons.dto';
import { FacilitiesDto } from '../facilities/dto/facilities.dto';
import { LocationLevels } from '../locations/models/locations.model';

const LTC = 'ltc';

const meta = {
  organisation: LTC,
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

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

@Injectable()
export class LtcDataImportService {
  logger = new Logger(LtcDataImportService.name);

  constructor(
    private prisma: PrismaService,
    private excelImportServicel: FileReaderService,
    private personsService: PersonsService,
    private farmsService: FarmsService,
    private plotsService: PlotsService,
    private locationsService: LocationsService,
    private seasonsService: SeasonsService,
  ) {}

  async importLtcCsv(): Promise<any[]> {
    // await this.getDistinctValues();

    const polygons = await this.importLtcPolygonData();
    await this.importLtcLocationsExcel();
    return await this.importLtcFarmsCsv(polygons);
  }

  async importLtcPolygonData() {
    const xml = await this.excelImportServicel.readXmlFile(
      '/importData/Growers list Field-polygon-2024-03-28-11-52-19.kml',
    );
    // console.log(xml);
    return xml['kml'].Folder.Placemark.map((place) => {
      const polygonString =
        place.Polygon.outerBoundaryIs.LinearRing.coordinates;
      const polygon = polygonString
        .split(',0 ')
        .map((latLong: string) => latLong.split(',')); // Remove the altitude 0 and split into lat/long pairs
      const data = {};
      for (const line of place.description.split('<tr>')) {
        const final = line
          .split('\n')
          .join('')
          .split('<table  padding="0">')
          .join('')
          .split('</table>')
          .join('')
          .split('</tr>')
          .join('')
          .split('<td>')
          .join('')
          .split('<b>')
          .join('')
          .split('</b>')
          .join('')
          .split('</td>')
          .join('')
          .split(':');
        const key = final[0]?.trim();
        const value = final[1]?.trim();
        if (key) {
          data[key] = value;
        }
      }
      // console.log({ place, polygon, data });
      return { data, polygon };
    });
  }

  async importLtcLocationsExcel(): Promise<any> {
    const file =
      '/importData/LTC - Step 1 -distrcit _ subcounty - orijin-dataimport .xlsx';
    const excelContents = await this.excelImportServicel.readExcelFile(file);

    const existingLocations = await this.locationsService.getMany();
    const data = existingLocations.data;
    type District = {
      idLabelShort: string;
      name: string;
      type: string;
      idAuthTag: string;
    };

    const districtData: District[] = excelContents['locations'];
    const districts = {};
    for (const line of districtData) {
      districts[line.idLabelShort] = data.find(
        (loc) => loc.shortCode === line.idLabelShort && loc.type === line.type,
      );
      if (!districts[line.idLabelShort]) {
        districts[line.idLabelShort] = await this.locationsService.create({
          organisation: meta.organisation,
          shortCode: line.idLabelShort,
          name: line.name,
          type: line.type,
        });
        this.logger.log('Added new ' + line.type + ': ' + line.name);
      }
    }

    type SubCounty = {
      parentLocation: string; // 'HMA',
      idLabelShort: string; // 'BNK',
      name: string; //  'BUHANIKA',
      type: string; //'SubCounty',
      idAuthTag: string; // 'ALL',
      lookup: string; // 'HMA'
    };

    const subCountyData: SubCounty[] = excelContents['locations3'];
    for (const line of subCountyData) {
      const existingLocation = data.find(
        (loc) => loc.shortCode === line.idLabelShort && loc.type === line.type,
      );
      if (!existingLocation) {
        await this.locationsService.create({
          organisation: meta.organisation,
          shortCode: line.idLabelShort,
          name: line.name,
          type: line.type,
          parent: { connect: { id: districts[line.parentLocation].id } },
        });
        this.logger.log('Added new ' + line.type + ': ' + line.name);
      }
    }
  }

  addMissingLocation = async (line, locations, level) => {
    const {
      parentLocationParentParentParent, // 'BUNDIBUGYO', = District
      parentLocationParentParent, // 'BUBANDI', = Subcounty
      parentLocationParent, // 'NJULE', = Parish
      VILLAGE, // 'NAMUGHAJO II', = Village
      parentLocation, // 'NAMUGHAJO II',
      parentFacility, // 'BUBANDI',
    } = line;

    const keys = {
      SubCounty: parentLocationParentParent,
      Parish: parentLocationParent,
      Village: parentLocation,
    };
    const parents = {
      SubCounty: parentLocationParentParentParent,
      Parish: parentLocationParentParent,
      Village: parentLocationParent,
    };
    const key = keys[level];
    const parent = parents[level];

    const existingLocation = locations.find(
      (loc) => loc.name.trim().toLowerCase() === key.trim().toLowerCase(),
    );
    if (!existingLocation) {
      const newLocation = await this.locationsService.create({
        organisation: meta.organisation,
        shortCode: key, // TODO: How to make shortcodes for new names?
        name: key,
        type: level,
        parent: {
          connect: {
            id: locations.find((loc) => loc.name === parent).id,
          },
        },
      });
      locations.push(newLocation);
    }
    // console.log(
    //   'Locations after adding: ',
    //   locations.map((loc) => loc.type + ' ' + loc.name),
    // );
    return locations;
  };

  async getDistinctValues() {
    const lines: LtcChatpowExportFarm[] =
      (await this.excelImportServicel.readCsvFile(
        '/importData/ltc-farms-2024-05-16.csv',
      )) as LtcChatpowExportFarm[];

    const result = {};
    const key = 'Date of approval';
    for (const line of lines) {
      if (!result[line[key]]) {
        result[line[key]] = 0;
      }
      result[line[key]]++;
      // const facility = line.parentFacility;
      // const village = line.parentLocationParentParent;
      // if (facility !== village) {
      //   console.log(
      //     'WANR ' + line.idLabelShort + ' ' + facility + ' ' + village,
      //   );
      // }
    }

    return result;
    // {
    //   mainContactPerson: 'TOK-0148',
    //     name: 'BUSABUTAMA JOSTINA',
    //   contactLastName: 'BUSABUTAMA',
    //   contactFirstName: 'JOSTINA',
    //   season: '2023/24',
    //   idLabelShort: 'TOK-0148',
    //   contactGender: 'Female',
    //   contactDob: '1980-12-10T00:00:00',
    //   'Date of birth': '12/10/1980',
    //   contactEducation: '',
    //   contactIdentificationNumberType: 'NationalId',
    //   contactIdentificationNumber: 'CF8000310241DL',
    //   email: '',
    //   contactMaritalStatus: 'married',
    //   phone: '778418715',
    //   'Number of phone numbers': '1',
    //   'hh members': '',
    //   contractDate: '2023-06-24T00:00:00',
    //   'Contract date': '6/24/2023',
    //   'Household longitude': '0.7309017',
    //   'Household latitude': '30.03784',
    //   'Household altitude': '',
    //   location: '0.7309017;30.03784;;',
    //   'N of farms': '',
    //   'Ttl plots': '',
    //   acreage: '0.51',
    //   areaTotal: '0.51',
    //   areaTotalHA: '0.20638986',
    //   yieldEstimateRaw: '1147.5',
    //   maxQuantityProcessedLimitRaw: '1147.5',
    //   'Total infrastructure acrage': '',
    //   'Total conservation acreage': '',
    //   'Number of main crops': '',
    //   'Number of minor crops': '',
    //   'Number of attached structures': '',
    //   'Number of attached certifications': '',
    //   'Number of trainings': '',
    //   'Training types': '',
    //   'Number of livestock': '',
    //   Livestock: '',
    //   'Main source of cooking': '',
    //   'Main source of lighting': '',
    //   'Main roof construction': '',
    //   'Main wall construction': '',
    //   Assets: '',
    //   parentLocationParentParentParent: 'BUNDIBUGYO',
    //   parentLocationParentParent: 'TOKWE',
    //   parentLocationParent: 'BUNDINYAMA',
    //   VILLAGE: 'BUNDIMUGAYO',
    //   parentLocation: 'BUNDIMUGAYO',
    //   parentFacility: 'TOKWE',
    //   registrationDate: '2023-06-24T00:00:00',
    //   'Date of registration': '6/24/2023',
    //   'Farmer entry mode': '',
    //   Surveyor: '',
    //   lastInspectionDate: '',
    //   'Last inspection date': '',
    //   'Date of approval': '',
    //   'certificationStatus\r': '\r'
    // }
  }

  async importLtcFarmsCsv(polygons, limit = 9999999): Promise<any> {
    const lines: LtcChatpowExportFarm[] =
      (await this.excelImportServicel.readCsvFile(
        '/importData/ltc-farms-2024-05-16.csv',
      )) as LtcChatpowExportFarm[];
    let locations = await this.locationsService.getMany(); // Stored in previous step
    const existingPersons = await this.personsService.getMany();
    const existingFarms = (await this.farmsService.getMany()).data;
    // console.log(
    //   'ExistingFarms example, total ' + existingFarms.length,
    //   JSON.stringify(existingFarms[7], null, 4),
    // );
    // throw new Error();
    const seasons = (
      await this.seasonsService.getMany({
        organisation: 'ltc',
      })
    ).data;
    let season;
    for (const line of lines.slice(0, limit)) {
      // ======
      // 1) Season
      // ======

      season = seasons.find((season) => season.name === line.season);
      if (!season) {
        season = await this.seasonsService.create({
          active: true,
          name: line.season,
          shortCode: line.season,
          startsAt: new Date('2023-08-01'),
          organisation: LTC,
        });
        seasons.push(season);
        this.logger.log('Created season ' + season.name);
      }

      // ======
      // 2) Location - just connect to correct Location, and perhaps confirm the hierarchy is the same?
      // ======
      locations = await this.addMissingLocation(
        line,
        locations,
        LocationLevels.SUB_COUNTY,
      );
      locations = await this.addMissingLocation(
        line,
        locations,
        LocationLevels.PARISH,
      );
      locations = await this.addMissingLocation(
        line,
        locations,
        LocationLevels.DISTRICT,
      );
    }

    // Do in batches
    const chunks = chunkArray(lines, 100);
    const results: any[] = [];
    for (const chunk of chunks) {
      const promises = chunk.map(async (line) => {
        // ======
        // 3) Contact person - ALSO in the other file!
        // ======
        const contactPersonPayload: PersonsDto = {
          organisation: LTC,
          // Missing? //   mainContactPerson: 'BBD-1013',
          type: UserType.Farmer,
          shortCode: line.mainContactPerson,
          firstName: line.contactFirstName, //   contactFirstName: 'EZIRON',
          lastName: line.contactLastName, //   contactLastName: 'MUHINDO',
          email: line.email, //   email: '',
          phone: line.phone, //   phone: '770630173',
          gender: line.contactGender, //   contactGender: 'Male',
          dateOfBirth: parseDate(line.contactDob), //   contactDob: '1970-01-01T00:00:00',  //   'Date of birth': 'NaN/NaN/NaN',
          dateOfBirthApproximate: false, // TODO: Not known!
          identificationNumber: line.contactIdentificationNumberType, //   contactIdentificationNumberType: 'NationalId',
          identificationNumberType: line.contactIdentificationNumber, //   contactIdentificationNumber: 'CM48003101FE8H',
          education: line.contactEducation, //   contactEducation: '',
          maritalStatus: line.contactMaritalStatus, //   contactMaritalStatus: '',
        };

        let contactPerson = existingPersons.data.find(
          (p) => p.shortCode === line.idLabelShort,
        );
        if (contactPerson) {
          this.logger.log(' Person already exists for ' + line.idLabelShort);
        } else {
          contactPerson = await this.personsService.create(
            contactPersonPayload,
          );
          this.logger.log(
            ' Created person for ' +
              line.idLabelShort +
              ': ' +
              contactPerson.firstName +
              ' ' +
              contactPerson.lastName,
          );
        }

        // ======
        // 4) FARM
        // ======
        const lat = parseFloat(line['Household latitude']);
        const long = parseFloat(line['Household longitude']);

        const location = locations.data.find(
          (loc) =>
            loc.name.trim().toLowerCase() ===
            line.parentLocation.trim().toLowerCase(),
        );

        if (
          existingFarms.find(
            (farm) => farm.facility.shortCode === line.idLabelShort,
          )
        ) {
          this.logger.log(' Farm already exists for ' + line.idLabelShort);
        } else {
          const facilityValues: FacilitiesDto = {
            organisation: meta.organisation,
            type: FacilityType.Farm,
            shortCode: line.idLabelShort, //   idLabelShort: 'BBD-1013',
            name: line.name, // name: 'MUHINDO EZIRON', - just duplicates main contact name
            address: {
              country: 'UGA',
            },
            mainContactPerson: contactPerson as PersonsDto,

            //   acreage: '1.09',
            //   areaTotal: '1.09',
            //   areaTotalHA: '0.44110774',
            areaTotalManual: parseFloat(line.areaTotalHA),
            // timezone: line.timezone,
            location: location,

            // FARM LOCATION  -> to Facility or Farm? (more pure if Facility)
            //   'Household longitude': '0.6372735',
            //   'Household latitude': '29.9826673',
            //   'Household altitude': '',
            //   location: '0.6372735;29.9826673;;',
            coordinate:
              lat && long
                ? {
                    latitude: lat,
                    longitude: long,
                  }
                : undefined,
          };

          //   Surveyor: '',
          //   'Farmer entry mode': '',
          //   'certificationStatus\r': '\r'
          // this.logger.log(line.registrationDate);
          const farmValues: FarmInputValues = {
            approvalStatus: parseDate(line['Date of approval']) //   'Date of approval': '',
              ? ReviewStatus.Approved // TODO: Onko oikein?
              : ReviewStatus.InReview,
            // creationStatus: line.creationStatus,
            contractDate: parseDate(line.contractDate), //   contractDate: '2021-04-22T00:00:00', //   'Contract date': '4/22/2021',
            registrationDate: parseDate(line.registrationDate), //   registrationDate: '2021-04-22T00:00:00',//   'Date of registration': '4/22/2021', = "Entrance to organic certification:	"
            // certificationStartDate: line.certificationStartDate?.toDate(),
            // lastChemicalUseDate: line.lastChemicalUseDate?.toDate(),
            lastInspectionDate: parseDate(line.lastInspectionDate), //   lastInspectionDate: '2023-09-22T00:00:00', //   'Last inspection date': '9/22/2023',
            firstVisitDate: null, // TODO?

            parentFacilityName: line.parentFacility, //   parentFacility: 'BUBANDI',

            seasonId: season.id, //   season: '2023/24',

            // TODO: Are these needed? -> were empty for majority of farms
            // DATA FROM THE CSV
            //   'Number of phone numbers': '1',
            //   'hh members': '',
            //   'Total infrastructure acrage': '',
            //   'Total conservation acreage': '',
            //   'Number of main crops': '',
            //   'Number of minor crops': '',
            //   'Number of attached structures': '',
            //   'Number of attached certifications': '',
            //   'Number of trainings': '',
            //   'Training types': '',
            //   'Number of livestock': '',
            //   Livestock: '',
            //   'Main source of cooking': '',
            //   'Main source of lighting': '',
            //   'Main roof construction': '',
            //   'Main wall construction': '',
            //   Assets: '',
          };

          // // 2) Create the farm
          const prismaFarm = await this.farmsService.create({
            organisation: LTC,
            facilityValues,
            farmValues,
          });

          //   yieldEstimateRaw: '2452.5',
          //   maxQuantityProcessedLimitRaw: '2452.5',
          //   'N of farms': '',
          //   'Ttl plots': '',

          // ======
          // 5) Plot
          // ======

          // polygon: [
          //   [ '33.4894038', '0.414597' ],
          //   [ '33.4892892', '0.4145164' ],
          //   [ '33.4892376', '0.4145028' ],
          //   [ '33.4891427', '0.4144166' ],
          //   [ '33.4890448', '0.4143328' ],
          //   [ '33.4891564', '0.4142196' ],
          //   [ '33.489503', '0.4143825' ],
          //   [ '33.4895676', '0.41451' ],
          //   [ '33.4894826', '0.4146236' ],
          //   [ '33.489503', '0.4143825' ],
          //   [ '33.4895539', '0.4144419' ]
          // ],
          //   data: {
          //   'Farmer name': 'AARON  WAKOLO',
          //     'Farmer code': 'IMR-0147',
          //     District: 'MAYUGE',
          //     Zone: 'IMANYIRO',
          //     Village: 'BUKAWANGO',
          //     'Field name': 'AARON',
          //     'Field size': '1.5',
          //     'Main crop': 'COCOA'
          // }
          const polygonsForFarm = polygons.find(
            (poly) => poly.data['Farmer code'] === line.idLabelShort,
          );
          if (!polygonsForFarm) {
            this.logger.warn('No polygon found for ' + line.idLabelShort);
          }

          let yieldEstimateRaw = parseFloat(line.yieldEstimateRaw);
          let areaSizeManual = parseFloat(line.areaTotalHA);
          let status = 'IMPORTED';
          if (yieldEstimateRaw > 100000) {
            status = 'ERROR';
            yieldEstimateRaw = null;
            areaSizeManual = null;
          }

          const plot = await this.plotsService.upsert(
            {
              organisation: meta.organisation,
              shortCode: line.idLabelShort + '-PLOT-1',
              name: line.idLabelShort + '-PLOT-1',
              farmId: prismaFarm.id,
              type: PlotType.Permanent, // TODO: Onko näin?
              // cultivationStartDate: line.cultivationStartDate?.toDate(),
              yieldEstimateRaw: yieldEstimateRaw,
              areaSizeManual: areaSizeManual,
              polygonCoordinates: polygonsForFarm
                ? polygonsForFarm.polygon
                : undefined,
              polygonSource: PlotCoordinateSources.IMPORT,
              status,
            },
            { operationType: 'farmImport' },
          );

          // this.logger.log(' Created farm ' + line.idLabelShort);

          return {
            prismaFarm,
            plot,
            contactPerson,
          };
        }
      });
      const chunkResults = await Promise.all(promises);
      results.push(...chunkResults);
      this.logger.log('Created one chunk');
    }

    return results;

    // return await Promise.all(promises);
  }
}
