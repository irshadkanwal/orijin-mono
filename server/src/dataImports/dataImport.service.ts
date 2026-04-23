import { Injectable, Logger } from '@nestjs/common';
import { FarmsService } from '../farms/farms.service';
import { FacilitiesService } from '../facilities/facilities.service';
import { PersonsService } from '../persons/persons.service';
import { LocationsService } from '../locations/locations.service';
import { ProductsService } from '../products/products.service';
import { ProductTypesService } from '../products/productTypes.service';
import { SeasonsService } from '../seasons/seasons.service';
import { SupportServiceCategoryTypeService } from '../supportServices/supportServiceCategoryType.service';
import { SupportServiceCategoryService } from '../supportServices/supportServiceCategory.service';
import { CropsService } from '../crops/crops.service';
import { CropvarietyService } from '../crops/cropvariety.service';
import { ProductPriceService } from '../products/productPrice.service';
import { SupportServiceActivityService } from '../supportServices/supportServiceActivity.service';
import { FileReaderService } from './fileReader.service';
import { CsvImportService } from '../common/dto/types';
import { SupportServiceInputTypeService } from '../supportServices/supportServiceInputType.service';
import { SupportServiceActivityTypeService } from '../supportServices/supportServiceActivityType.service';
import { SupportServiceActivityBeneficiaryService } from '../supportServices/supportServiceActivityBeneficiary.service';
import { CertificationTypeService } from '../certifications/certificationType.service';
import { ContactsService } from '../persons/contacts.service';
import { WalletsService } from '../persons/wallets.service';
import { PlotsService } from '../farms/plots.service';
import { CertificationsService } from '../certifications/certifications.service';
import { VesselsService } from '../vessels/vessels.service';
import { PolygonService } from '../geodatas/geopolygon.service';

@Injectable()
export class DataImportService {
  private logger = new Logger(DataImportService.name);

  constructor(
    private farmsService: FarmsService,
    private facilitiesService: FacilitiesService,
    private personsService: PersonsService,
    private productsService: ProductsService,
    private productPriceService: ProductPriceService,
    private productTypesService: ProductTypesService,
    private seasonsService: SeasonsService,
    private certificationTypeService: CertificationTypeService,
    private supportServiceCategoryTypeService: SupportServiceCategoryTypeService,
    private supportServiceCategoryService: SupportServiceCategoryService,
    private supportServiceActivityService: SupportServiceActivityService,
    private supportServiceActivityBeneficiaryService: SupportServiceActivityBeneficiaryService,
    private SupportServiceInputTypeService: SupportServiceInputTypeService,
    private supportServiceActivityTypeService: SupportServiceActivityTypeService,
    private cropsService: CropsService,
    private cropvarietyService: CropvarietyService,
    private locationsService: LocationsService,
    private fileReaderService: FileReaderService,
    private contactsService: ContactsService,
    private walletsService: WalletsService,
    private plotsService: PlotsService,
    private certificationsService: CertificationsService,
    private vesselsService: VesselsService,
    private polygonService: PolygonService,
  ) {}

  async importCollection<T extends CsvImportService<any, any>>(
    json: any[],
    service: T,
    orgOverride?: string,
    allowFail = false,
    loadInSync = false,
    logger = this.logger,
  ) {
    async function loadFunc(item: any) {
      try {
        const s = JSON.stringify(item);
        // this.logger.log(s + '.');
        if (s == '{}' || s == '{"organisation":""}') {
          return null;
        }
        for (const k of Object.keys(item)) {
          if (k.indexOf('skip') >= 0) {
            delete item[k];
          }
        }

        if (orgOverride) {
          item.organisation = orgOverride;
        }
        return await service.upsertImport(item);
      } catch (e) {
        logger.error('Error in import', e);
        if (allowFail) {
          return null;
        }
        throw e;
      }
    }
    if (loadInSync) {
      const results = [];
      for (const item of json) {
        const i = await loadFunc(item);
        results.push(i);
      }
      return results;
    } else {
      return await Promise.all(json.map(async (item: any) => loadFunc(item)));
    }
  }

  async importOne(
    folderPrefix: string,
    fileName: string,
    type: string,
    orgOverride?: string,
  ) {
    const file = await this.fileReaderService.readFileAndParseCsv(
      folderPrefix + fileName,
    );
    const imported = (await this.importFromJson(file, type, orgOverride)) || [];

    const failed = (imported || []).filter((a) => !a);

    this.logger.log(
      `imported ${type}: ${imported.length}: failed: ${
        failed.length
      }: success: ${imported.length - failed.length}`,
    );
  }

  async importAll(
    items: string[][],
    folderPrefix: string,
    orgOverride?: string,
  ) {
    for (const item of items) {
      const types = item[1];
      this.logger.log('Start import ' + types);
      const items = await this.importOne(
        folderPrefix,
        item[0],
        types,
        orgOverride,
      );
      this.logger.log('End import ' + types);
    }
  }
  async importFromJson(
    json: any[],
    type: string,
    orgOverride?: string,
    allowFail = false,
  ) {
    if (type === 'crops') {
      return this.importCollection(
        json,
        this.cropsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'certificationtypes') {
      return this.importCollection(
        json,
        this.certificationTypeService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'seasons') {
      return this.importCollection(
        json,
        this.seasonsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'varieties') {
      return this.importCollection(
        json,
        this.cropvarietyService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'producttypes') {
      return this.importCollection(
        json,
        this.productTypesService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'products') {
      return this.importCollection(
        json,
        this.productsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'prices') {
      return this.importCollection(
        json,
        this.productPriceService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'servicecategorytypes') {
      return this.importCollection(
        json,
        this.supportServiceCategoryTypeService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'servicecategories') {
      return this.importCollection(
        json,
        this.supportServiceCategoryService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'serviceinputtypes') {
      return this.importCollection(
        json,
        this.SupportServiceInputTypeService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'serviceactivitytypes') {
      return this.importCollection(
        json,
        this.supportServiceActivityTypeService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'serviceceactivities') {
      return this.importCollection(
        json,
        this.supportServiceActivityService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'serviceactivitybeneficiary') {
      return this.importCollection(
        json,
        this.supportServiceActivityBeneficiaryService,
        orgOverride,
        allowFail,
        true,
      );
    } else if (type === 'locations') {
      return this.importCollection(
        json,
        this.locationsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'facilities') {
      return this.importCollection(
        json,
        this.facilitiesService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'farms') {
      return this.importCollection(json, this.farmsService, orgOverride, true);
    } else if (type === 'persons') {
      return this.importCollection(
        json,
        this.personsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'certifications') {
      return this.importCollection(
        json,
        this.certificationsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'contacts') {
      return this.importCollection(
        json,
        this.contactsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'wallets') {
      return this.importCollection(
        json,
        this.walletsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'plots') {
      return this.importCollection(
        json,
        this.plotsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'vessels') {
      return this.importCollection(
        json,
        this.vesselsService,
        orgOverride,
        allowFail,
      );
    } else if (type === 'polygons') {
      return this.importCollection(
        json,
        this.polygonService,
        orgOverride,
        allowFail,
      );
    } else {
      throw Error('not supported');
    }
  }
}
