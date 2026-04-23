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
import { FacilityType } from '../facilities/models/facility.model';
import { PlotCoordinateSources, PlotType } from '../farms/models/plots.model';

const ORGANISATION = 'lyonagro';
type ParsedCoordinate = {
  lat: number;
  long: number;
  evelation: number;
  time: Date;
};
type ParsedData = { farmName: string; parsedCoordinates: ParsedCoordinate[] };

@Injectable()
export class LyonDataImportService {
  logger = new Logger(LyonDataImportService.name);

  constructor(
    private prisma: PrismaService,
    private fileReaderService: FileReaderService,
    private personsService: PersonsService,
    private farmsService: FarmsService,
    private plotsService: PlotsService,
    private locationsService: LocationsService,
    private seasonsService: SeasonsService,
  ) {}

  async seedSoy() {
    const soy = await this.prisma.crop.findUnique({
      where: {
        shortCode_organisation: {
          shortCode: 'soy',
          organisation: ORGANISATION,
        },
      },
    });
    if (!soy) {
      const soy = await this.prisma.crop.create({
        data: {
          shortCode: 'soy',
          name: 'Soy',
          organisation: ORGANISATION,
        },
      });

      await this.prisma.cropVariety.create({
        data: {
          shortCode: 'soy-1',
          name: 'Soy',
          cropId: soy.id,
          organisation: ORGANISATION,
        },
      });
    }
  }

  async importLyon(): Promise<any> {
    await this.seedSoy();
    const directory = '/importData/lyon/';
    const allData: ParsedData[] = await this.collectData(directory);
    // console.log(JSON.stringify(allData, null, 4));

    const promises = allData.map(async (data) => {
      const facilityValues: FacilitiesDto = {
        areaTotalManual: 0,
        name: data.farmName,
        organisation: ORGANISATION,
        shortCode: data.farmName,
        type: FacilityType.Farm,
      };
      const plot: PlotDto = {
        name: '',
        organisation: ORGANISATION,
        shortCode: data.farmName + 'PLOT-1',
        type: PlotType.Permanent,
        polygonSource: PlotCoordinateSources.IMPORT,
        polygonCoordinates: data.parsedCoordinates.map((coord) => [
          coord.long,
          coord.lat,
        ]),
      };
      const farmValues: FarmInputValues = {
        plots: [plot],
      };
      return await this.farmsService.create({
        organisation: ORGANISATION,
        facilityValues,
        farmValues,
      });
    });
    await Promise.all(promises);
    this.logger.log('Farms created: ' + promises.length);
  }

  async collectData(directory): Promise<ParsedData[]> {
    const collectedData = [];
    for (const folder of ['GPS 5', 'GPS 4', 'GPS 3', 'GPS 2', 'GPS 1']) {
      const files = this.fileReaderService.readDirectory(directory + folder);
      const promises = files.map(async (file) => {
        console.log(file);
        const contents = await this.fileReaderService.readXmlFile(
          directory + folder + '/' + file,
        );
        const data = contents['gpx']['trk'];
        const farmName = data.name;
        // The folders contain old & new data (GPS 1 = oldest, GPS 5 = newest), so we take only the most recent instance we find
        if (
          !collectedData.find((collected) => collected.farmName === farmName)
        ) {
          const coordinatesArray = data.trkseg.trkpt;
          const parsedCoordinates = [];
          for (const coord of coordinatesArray) {
            //   <trkpt lat="9.3721298128" lon="-0.4243460018">
            //   <ele>157.31</ele>
            //   <time>2023-07-05T14:45:16Z</time>
            parsedCoordinates.push({
              lat: parseFloat(coord['@_lat']),
              long: parseFloat(coord['@_lon']),
              elevation: coord.ele,
              time: coord.time,
            });
          }
          collectedData.push({
            farmName,
            parsedCoordinates,
          });
        }
        this.logger.log(
          'file ' +
            file +
            ' fully processed, total count ' +
            collectedData.length,
        );
      });
      await Promise.all(promises);
      this.logger.log(
        'Folder ' +
          folder +
          ' fully processed, total count ' +
          collectedData.length,
      );
    }
    return collectedData;
  }
}
