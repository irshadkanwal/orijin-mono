import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileReaderService } from './fileReader.service';
import { DataImportService } from './dataImport.service';
import { PlotCoordinateSources } from '../farms/models/plots.model';
import { Chance } from 'chance';
const chance = new Chance();

@Controller()
export class DataImportController {
  constructor(
    private fileReaderService: FileReaderService,
    private dataImportService: DataImportService,
  ) {}

  @Post(':org/upload-file/:type')
  @UseInterceptors(FileInterceptor('file'))
  async importData(
    @Param('org') org: string,
    @Param('type') type: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const { buffer, mimetype } = file;
    let parsedData;
    try {
      if (mimetype.includes('csv')) {
        parsedData = await this.fileReaderService.readCsvBuffer(buffer);
      } else if (
        mimetype.includes('excel') ||
        mimetype.includes('spreadsheetml')
      ) {
        parsedData = this.fileReaderService.readExcelBuffer(buffer, true);
      } else {
        throw new BadRequestException('Unsupported file type.');
      }
      if (type === 'polygons' && parsedData) {
        parsedData.forEach((item) => {
          // Parse polygon field and update the coordinates field
          item.coordinates = this.fileReaderService.parseCoordinatesFromString(
            item.polygon,
          );
          item.shortCode =
            item.shortCode ?? 'Poly-' + chance.word({ length: 3 });

          item.source = item.source ?? PlotCoordinateSources.IMPORT;
          delete item.polygon; // Remove polygon field
          delete item.orgId;
          delete item.areaManual;
        });
      }

      const imported = await this.dataImportService.importFromJson(
        parsedData,
        type,
        org,
        true,
      );
      const failed = (imported || []).filter((a) => !a);

      return {
        message: `Import complete. Successful: ${
          imported.length - failed.length
        }: Failed: ${failed.length}`,
      };
    } catch (error) {
      console.error('Error in controller: ------', error);
      throw new BadRequestException(error?.message || 'Failed to parse file.');
    }
  }
}
