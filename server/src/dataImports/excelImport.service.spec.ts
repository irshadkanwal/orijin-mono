import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../common/configs/config';
import { FileReaderService } from './fileReader.service';

/**
 * TODO: Decide what to do with this test, not really usefull.. keeping as skip
 */
describe.skip('ExcelImport', () => {
  let excelImportService: FileReaderService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
      providers: [FileReaderService],
    }).compile();

    app.useLogger(new Logger());
    excelImportService = app.get<FileReaderService>(FileReaderService);
  });

  describe('Excel reading', () => {
    it('Should read in a file', async () => {
      const file = process.cwd() + '/importData/LTC-Step5-FARMS-HMA.xlsx';
      const result = await excelImportService.readExcelFile(file);
      expect(result).toEqual({});
    });
  });
});
