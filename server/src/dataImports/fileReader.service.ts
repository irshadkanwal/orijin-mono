import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { XMLParser } from 'fast-xml-parser';
import * as Papa from 'papaparse';
export interface GeoDataCoordinate {
  lat: number;
  lng: number;
}
@Injectable()
export class FileReaderService {
  private logger = new Logger(FileReaderService.name);

  private getFullPath = (file) => {
    const fullPath = process.cwd() + file;
    return fullPath;
  };

  readDirectory(directory) {
    const directoryPath = this.getFullPath(directory);
    return fs.readdirSync(directoryPath);
  }

  convertExcelDateToJSDate(excelDate) {
    // Get the number of milliseconds from Unix epoch.
    if (!excelDate || excelDate === '') return null;
    const unixTime = (excelDate - 25569) * 86400 * 1000;
    return new Date(unixTime);
  }

  async readExcelFile(file, headerRow = 1) {
    const buf = fs.readFileSync(this.getFullPath(file));
    const workbook = XLSX.read(buf, { type: 'buffer' });
    const results: { sheetName?: string; lines?: any[] } = {};
    for (const sheetName of workbook.SheetNames) {
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        range: headerRow - 1,
      });
      const rows = Object.keys(jsonData);
      results[sheetName] = [];
      for (const rowNumber of rows) {
        results[sheetName].push(jsonData[rowNumber]);
      }
    }
    return results;
  }

  async readFileAndParseCsv(file: string): Promise<any[]> {
    try {
      const data = await fs.promises.readFile(this.getFullPath(file), 'utf8');
      const lines = data.split('\n');
      const nonEmptyLines = lines.filter((line) => line.trim() !== '');
      const dataWithoutEmpties = nonEmptyLines.join('\n');
      const fileContents = Papa.parse(dataWithoutEmpties, {
        header: true,
      });
      return fileContents.data;
    } catch (err) {
      this.logger.error('Error reading file:', err);
    }
  }
  async readCsvFile(file: string) {
    try {
      const data = await fs.promises.readFile(this.getFullPath(file), 'utf8');
      const lines = data.split('\n').filter((line) => line.trim()); // Remove empty lines
      const headers = lines[0].split(',');
      const results = lines.slice(1).map((line) => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

      return results;
    } catch (err) {
      this.logger.error('Error reading file:', err);
    }
  }

  /**
   * Yes yes I'm not Excel, but combining all the various data types here.. should rename Service later.
   *
   * @param file
   */
  async readXmlFile(file: string) {
    //xml file from https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ms762271(v=vs.85)
    const xmlFile = readFileSync(this.getFullPath(file), 'utf8');
    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(xmlFile);
  }

  readExcelBuffer(buffer: Buffer, isSingleSheet): any {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const results = {};
    if (isSingleSheet) {
      const jsonData = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
      );
      return jsonData;
    }
    for (const sheetName of workbook.SheetNames) {
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      results[sheetName] = jsonData;
    }
    return results;
  }

  async readCsvBuffer(buffer: Buffer): Promise<any[]> {
    try {
      const data = buffer.toString('utf8');
      const fileContents = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
      });
      return fileContents.data;
    } catch (err) {
      this.logger.error('Error reading CSV buffer:', err);
      throw err;
    }
  }

  readXmlBuffer(buffer: Buffer): any {
    try {
      const xmlData = buffer.toString('utf8');
      const parser = new XMLParser({ ignoreAttributes: false });
      return parser.parse(xmlData);
    } catch (err) {
      this.logger.error('Error reading XML buffer:', err);
      throw err;
    }
  }

  parseCoordinatesFromString(value: string) {
    let split: string[] = value.split(';');
    let split2: string[] = value.split(',');

    let result: GeoDataCoordinate[] = [];

    if (split2.length > 2) {
      split = split2;
    }

    if (split.length % 2 === 0) {
      let current: GeoDataCoordinate = {
        lat: null,
        lng: null,
      };

      let index = 0;
      for (let item of split) {
        if (item.indexOf('0 ') >= 0) {
          item = item.replace('0 ', '');
        }

        if (index % 2 === 0) {
          current = {
            lat: null,
            lng: null,
          };
          current.lng = parseFloat(item);
        } else {
          current.lat = parseFloat(item);
          result.push(current);
        }
        index++;
      }
      return result;
    } else {
      throw Error(
        "coordinates need to be paired, remember to use ';' to separate " +
          split.length,
      );
    }
  }
}
