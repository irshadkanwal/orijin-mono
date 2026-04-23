import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FileReaderService } from './fileReader.service';
import { PersonsDto } from '../persons/dto/persons.dto';
import { UserType } from '../users/models/user.model';
import { FacilitiesDto } from '../facilities/dto/facilities.dto';
import { FacilityType } from '../facilities/models/facility.model';
import { PlotDto } from '../farms/dto/farms.dto';
import { PlotCoordinateSources, PlotType } from '../farms/models/plots.model';
import { FarmsService } from '../farms/farms.service';
import { seedSeasons } from '../common/seed/seedSeasons';
import { CommonDataImportService } from './common.dataImport.service';

const ORGANISATION = 'cm_nahua';
const countryIso = 'CRI';
const folder = '/importData/COSTA RICA - NAHUA/';

type ParsedFarmRow = {
  ID3: number;
  Nombre: string;
  Crop: string;
  area_ha: number;
  Latitud: number;
  Longitud: number;
  'harvest date': number; // Excel date
  Poligon: string;
  ' kg dry ': number;
};

// type ParsedData = { farmName: string; parsedCoordinates: ParsedCoordinate[] };

@Injectable()
export class NahuaDataImportService {
  logger = new Logger(NahuaDataImportService.name);

  constructor(
    private prisma: PrismaService,
    private farmsService: FarmsService,
    private fileReaderService: FileReaderService,
    private commonDataImportService: CommonDataImportService,
  ) {}

  async readKml(fileName: string) {
    const xml = await this.fileReaderService.readXmlFile(folder + fileName);
    const polygonString =
      xml['kml'].Document.Placemark.Polygon.outerBoundaryIs.LinearRing
        .coordinates;
    return polygonString.split(' ').map((latLongAlt: string) => {
      const coords = latLongAlt.split(',');
      return [parseFloat(coords[0]), parseFloat(coords[1])];
    });
  }

  async parseAndCreateFarms(farms: ParsedFarmRow[]) {
    const storedFarms = [];
    for (const farmRow of farms) {
      const farmNumber: string = String(farmRow.ID3).padStart(4, '0');
      const shortCode = 'FARM-' + farmNumber;
      const storedFarm = storedFarms.find(
        (storedFarm) => storedFarm.facility.shortCode === shortCode,
      );
      if (storedFarm) {
        this.logger.warn(`Farm ${farmNumber} already exists: ` + storedFarm.id);
        continue;
      }
      const name = farmRow.Nombre || '';
      this.logger.log('Going to create farm ' + shortCode + ' for ' + name);

      const personDto: PersonsDto = {
        dateOfBirth: undefined,
        firstName: name.split(' ')[0],
        lastName: name.slice(name.split(' ')[0].length),
        type: UserType.Farmer,
        shortCode: 'FARMER-' + farmNumber,
        organisation: ORGANISATION,
      };

      const facilityValues: FacilitiesDto = {
        areaTotalManual: farmRow.area_ha,
        name: name,
        shortCode,
        type: FacilityType.Farm,
        organisation: ORGANISATION,
        mainContactPerson: personDto,
        coordinate:
          farmRow.Latitud && farmRow.Longitud
            ? {
                // I've got these mixed up in the DB!!
                latitude: farmRow.Longitud, // farmRow.Latitud
                longitude: farmRow.Latitud,
              }
            : undefined,
        countryIso,
      };

      const plotDto: PlotDto = {
        name: shortCode + '-P1',
        shortCode: shortCode + '-P1',
        type: PlotType.Permanent,
        organisation: ORGANISATION,
        areaSizeManual: farmRow.area_ha,
        // yieldEstimateRaw: farmRow[' kg dry '],
      };

      const polygonFile = farmRow.Poligon;
      const coordinates = polygonFile ? await this.readKml(polygonFile) : null;
      if (coordinates) {
        plotDto.polygonCoordinates = coordinates;
        plotDto.polygonSource = PlotCoordinateSources.IMPORT;
      }

      const payload = {
        facilityValues: facilityValues,
        farmValues: {
          plots: [plotDto],
          seasonCode: '2023/24',
        },
        organisation: ORGANISATION,
      };

      // console.log(JSON.stringify(payload, null, 4));

      try {
        const stored = await this.farmsService.create(payload);
        storedFarms.push(stored);
      } catch (err) {
        this.logger.error('err', err);
      }
    }
    return storedFarms;
  }

  async importNahua(): Promise<any> {
    const existingSeasons = await this.prisma.season.findMany({
      where: { organisation: ORGANISATION },
    });
    if (existingSeasons.length === 0) {
      await seedSeasons(this.prisma, ORGANISATION, false);
    }
    await this.commonDataImportService.seedCommodity('cocoa', ORGANISATION);

    const file = folder + '25- E119 Farmers data.xlsx';
    const excelContents = await this.fileReaderService.readExcelFile(file);
    const sheet = excelContents['E119 Farmers data'];
    const storedFarms = await this.parseAndCreateFarms(sheet);

    return storedFarms;
  }
}
