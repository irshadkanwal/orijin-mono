import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FileReaderService } from './fileReader.service';
import { FarmsService } from '../farms/farms.service';
import { PersonsDto } from '../persons/dto/persons.dto';
import { UserType } from '../users/models/user.model';
import { FarmInputValues, PlotDto } from '../farms/dto/farms.dto';
import { FacilitiesDto } from '../facilities/dto/facilities.dto';
import { FacilityType } from '../facilities/models/facility.model';
import { PlotCoordinateSources, PlotType } from '../farms/models/plots.model';
import { seedSeasons } from '../common/seed/seedSeasons';
import { CommonDataImportService } from './common.dataImport.service';

type ParsedFarmRow = {
  farmerNumber: number;
  farmerName: string;
  plotId: string;
  plotName: string;
  updatedAt: Date;
  updatedBy: string;
};

type ParsedPolygonRow = {
  ID: string;
  Farmer: string;
  Organic_Survey_ID: string;
  Farmer_Plot_ID: string;
  GPS_Location: string;
  Plotted_By: string;
  Timestamp_Captured: Date;
  Polygon_ID: string;
  Inspection_Submission_Status: string;
};

const ORGANISATION = 'kamili';

type ParsedCoordinate = {
  lat: number;
  long: number;
  evelation: number;
  time: Date;
};

const groupByFarmer = (
  results: ParsedFarmRow[],
): { [farmerName: string]: ParsedFarmRow[] } => {
  const groupedResults: { [farmerName: string]: ParsedFarmRow[] } = {};
  results.forEach((result) => {
    const { farmerNumber } = result;
    if (!groupedResults[farmerNumber]) {
      groupedResults[farmerNumber] = [];
    }
    groupedResults[farmerNumber].push(result);
  });

  return groupedResults;
};

const groupById = (
  results: ParsedPolygonRow[],
): { [Farmer_Plot_ID: string]: ParsedPolygonRow[] } => {
  const groupedResults: { [Farmer_Plot_ID: string]: ParsedPolygonRow[] } = {};
  results.forEach((result) => {
    const { Farmer_Plot_ID } = result;
    if (!groupedResults[Farmer_Plot_ID]) {
      groupedResults[Farmer_Plot_ID] = [];
    }
    groupedResults[Farmer_Plot_ID].push(result);
  });

  return groupedResults;
};

type ParsedData = { farmName: string; parsedCoordinates: ParsedCoordinate[] };

@Injectable()
export class KokoaKamiliDataImportService {
  logger = new Logger(KokoaKamiliDataImportService.name);

  constructor(
    private prisma: PrismaService,
    private fileReaderService: FileReaderService,
    private farmsService: FarmsService,
    private commonDataImportService: CommonDataImportService,
  ) {}

  parsePolygons(polygonLines) {
    const parsedLines = polygonLines.map((polygonLine) => {
      return {
        ...polygonLine,
        Timestamp_Captured: this.fileReaderService.convertExcelDateToJSDate(
          polygonLine.Timestamp_Captured,
        ),
      };
    });

    const polygonsPerPlot = {};
    const grouped: { [ID: string]: ParsedPolygonRow[] } =
      groupById(parsedLines);
    for (const [id, coordinates] of Object.entries(grouped)) {
      polygonsPerPlot[id] = coordinates
        .sort(
          (a, b) =>
            a.Timestamp_Captured.getTime() - b.Timestamp_Captured.getTime(),
        )
        .filter(
          (poly) =>
            poly.GPS_Location &&
            poly.GPS_Location !== '' &&
            poly.Inspection_Submission_Status === 'Approved',
        )
        .map((poly) => {
          const [long, lat] = poly.GPS_Location.split(',');
          return {
            lat: parseFloat(lat),
            long: parseFloat(long),
            time: poly.Timestamp_Captured,
          };
        });
    }
    return polygonsPerPlot;
  }

  async parseAndCreateFarms(farmersAndPlots, polygonsPerPlot, activeSeason) {
    const farmsToCreate = [];
    for (const farmLine of farmersAndPlots) {
      // .filter((ff) => ff.Farmer === 2343)
      if (farmLine.Active === true) {
        const values = {
          farmerNumber: farmLine.Farmer,
          farmerName: farmLine.Farmer_Name,
          plotId: farmLine.ID,
          plotName: farmLine.Plot,
          updatedAt: this.fileReaderService.convertExcelDateToJSDate(
            farmLine.Updated_Timestamp,
          ),
          updatedBy: farmLine.Updated_By,
        };
        farmsToCreate.push(values);
      }
    }

    // Add all Farmers and Farms
    const storedFarms = [];
    const grouped: { [farmerName: string]: ParsedFarmRow[] } =
      groupByFarmer(farmsToCreate);
    for (const entry of Object.entries(grouped)) {
      if (!entry[0]) {
        return;
      }
      const farmerNubmer: string = String(entry[0]).padStart(4, '0');
      const data: ParsedFarmRow[] = entry[1];
      const shortCode = data[0].farmerName.replace(' ', '');
      const name = data[0].farmerName;

      const personDto: PersonsDto = {
        dateOfBirth: undefined,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        type: UserType.Farmer,
        shortCode: 'FARMER-' + farmerNubmer,
        organisation: ORGANISATION,
      };

      const facilityValues: FacilitiesDto = {
        areaTotalManual: 0,
        name: name,
        shortCode: 'FARM-' + farmerNubmer,
        type: FacilityType.Farm,
        organisation: ORGANISATION,
        mainContactPerson: personDto,
        countryIso: 'TZA',
      };

      const plotDtos: PlotDto[] = data.map((plot) => {
        let finishedDto: PlotDto = {
          name: plot.plotName || 'n/a',
          shortCode: plot.plotId,
          type: PlotType.Permanent,
          organisation: ORGANISATION,
        };
        if (
          polygonsPerPlot[plot.plotId] &&
          polygonsPerPlot[plot.plotId].length > 0
        ) {
          const polygonCoordinates = polygonsPerPlot[plot.plotId].map(
            (poly) => [poly.lat, poly.long],
          );
          finishedDto = {
            ...finishedDto,
            polygonCoordinates,
            polygonSource: PlotCoordinateSources.IMPORT,
          };
        } else {
          this.logger.warn('No polygon for plot ' + plot.plotId);
        }
        return finishedDto;
      });

      const farmValues: FarmInputValues = {
        plots: plotDtos,
        seasonId: activeSeason.id,
      };
      const farm = await this.farmsService.create({
        facilityValues: facilityValues,
        farmValues: farmValues,
        organisation: '',
      });
      storedFarms.push(farm);
    }
    return storedFarms;
  }

  async importKamili(): Promise<any> {
    await this.commonDataImportService.emptyDbForOrganisation(
      this.prisma,
      ORGANISATION,
    );

    const existingSeasons = await this.prisma.season.findMany({
      where: { organisation: ORGANISATION },
    });
    if (existingSeasons.length === 0) {
      await seedSeasons(this.prisma, ORGANISATION, false);
    }
    await this.commonDataImportService.seedCommodity('cocoa', ORGANISATION);

    const file = '/importData/kamili/Kokoa Kamili_2022.xlsx';
    const excelContents = await this.fileReaderService.readExcelFile(file);

    const activeSeason = await this.prisma.season.findFirst({
      where: {
        organisation: ORGANISATION,
        active: true,
      },
    });
    const polygonsPerPlot = this.parsePolygons(excelContents['Plot_Corners']);
    const storedFarms = await this.parseAndCreateFarms(
      excelContents['Farmer_Plots'],
      polygonsPerPlot,
      activeSeason,
    );

    return storedFarms;
  }
}
