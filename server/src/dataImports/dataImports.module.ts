import { Module } from '@nestjs/common';
import { LtcDataImportService } from './ltc.dataImport.service';
import { FileReaderService } from './fileReader.service';
import { FarmsModule } from '../farms/farms.module';
import { PersonsModule } from '../persons/persons.module';
import { LocationsModule } from '../locations/locations.module';
import { SeasonsModule } from '../seasons/seasons.module';
import { MhDataImportService } from './mh.dataImport.service';
import { LyonDataImportService } from './lyon.dataImport.service';
import { DataImportService } from './dataImport.service';
import { CropsModule } from '../crops/crops.module';
import { SupportServiceModule } from '../supportServices/supportService.module';
import { ProductsModule } from '../products/products.module';
import { FacilitiesModule } from '../facilities/facilities.module';
import { KokoaKamiliDataImportService } from './kokoaKamili.dataImport.service';
import { DataImportController } from './data-import.controller';
import { MhRawDataImportService } from './mhRaw.dataImport.service';
import { CertificationsModule } from '../certifications/certifications.module';
import { NahuaDataImportService } from './nahua.dataImport.service';
import { CommonDataImportService } from './common.dataImport.service';
import { VesselsModule } from '../vessels/vessels.module';
import { GeodatasModule } from '../geodatas/geodatas.module';

@Module({
  imports: [
    FarmsModule,
    PersonsModule,
    FacilitiesModule,
    LocationsModule,
    CertificationsModule,
    SeasonsModule,
    CropsModule,
    SupportServiceModule,
    ProductsModule,
    VesselsModule,
    GeodatasModule,
  ],
  controllers: [DataImportController],
  providers: [
    FileReaderService,
    LtcDataImportService,
    DataImportService,
    MhDataImportService,
    MhRawDataImportService,
    LyonDataImportService,
    KokoaKamiliDataImportService,
    NahuaDataImportService,
    CommonDataImportService,
  ],
})
export class DataImportsModule {}
