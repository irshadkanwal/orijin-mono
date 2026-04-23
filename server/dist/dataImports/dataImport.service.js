"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DataImportService", {
    enumerable: true,
    get: function() {
        return DataImportService;
    }
});
const _common = require("@nestjs/common");
const _farmsservice = require("../farms/farms.service");
const _facilitiesservice = require("../facilities/facilities.service");
const _personsservice = require("../persons/persons.service");
const _locationsservice = require("../locations/locations.service");
const _productsservice = require("../products/products.service");
const _productTypesservice = require("../products/productTypes.service");
const _seasonsservice = require("../seasons/seasons.service");
const _supportServiceCategoryTypeservice = require("../supportServices/supportServiceCategoryType.service");
const _supportServiceCategoryservice = require("../supportServices/supportServiceCategory.service");
const _cropsservice = require("../crops/crops.service");
const _cropvarietyservice = require("../crops/cropvariety.service");
const _productPriceservice = require("../products/productPrice.service");
const _supportServiceActivityservice = require("../supportServices/supportServiceActivity.service");
const _fileReaderservice = require("./fileReader.service");
const _supportServiceInputTypeservice = require("../supportServices/supportServiceInputType.service");
const _supportServiceActivityTypeservice = require("../supportServices/supportServiceActivityType.service");
const _supportServiceActivityBeneficiaryservice = require("../supportServices/supportServiceActivityBeneficiary.service");
const _certificationTypeservice = require("../certifications/certificationType.service");
const _contactsservice = require("../persons/contacts.service");
const _walletsservice = require("../persons/wallets.service");
const _plotsservice = require("../farms/plots.service");
const _certificationsservice = require("../certifications/certifications.service");
const _vesselsservice = require("../vessels/vessels.service");
const _geopolygonservice = require("../geodatas/geopolygon.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DataImportService = class DataImportService {
    async importCollection(json, service, orgOverride, allowFail = false, loadInSync = false, logger = this.logger) {
        async function loadFunc(item) {
            try {
                const s = JSON.stringify(item);
                // this.logger.log(s + '.');
                if (s == '{}' || s == '{"organisation":""}') {
                    return null;
                }
                for (const k of Object.keys(item)){
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
            for (const item of json){
                const i = await loadFunc(item);
                results.push(i);
            }
            return results;
        } else {
            return await Promise.all(json.map(async (item)=>loadFunc(item)));
        }
    }
    async importOne(folderPrefix, fileName, type, orgOverride) {
        const file = await this.fileReaderService.readFileAndParseCsv(folderPrefix + fileName);
        const imported = await this.importFromJson(file, type, orgOverride) || [];
        const failed = (imported || []).filter((a)=>!a);
        this.logger.log(`imported ${type}: ${imported.length}: failed: ${failed.length}: success: ${imported.length - failed.length}`);
    }
    async importAll(items, folderPrefix, orgOverride) {
        for (const item of items){
            const types = item[1];
            this.logger.log('Start import ' + types);
            const items = await this.importOne(folderPrefix, item[0], types, orgOverride);
            this.logger.log('End import ' + types);
        }
    }
    async importFromJson(json, type, orgOverride, allowFail = false) {
        if (type === 'crops') {
            return this.importCollection(json, this.cropsService, orgOverride, allowFail);
        } else if (type === 'certificationtypes') {
            return this.importCollection(json, this.certificationTypeService, orgOverride, allowFail);
        } else if (type === 'seasons') {
            return this.importCollection(json, this.seasonsService, orgOverride, allowFail);
        } else if (type === 'varieties') {
            return this.importCollection(json, this.cropvarietyService, orgOverride, allowFail);
        } else if (type === 'producttypes') {
            return this.importCollection(json, this.productTypesService, orgOverride, allowFail);
        } else if (type === 'products') {
            return this.importCollection(json, this.productsService, orgOverride, allowFail);
        } else if (type === 'prices') {
            return this.importCollection(json, this.productPriceService, orgOverride, allowFail);
        } else if (type === 'servicecategorytypes') {
            return this.importCollection(json, this.supportServiceCategoryTypeService, orgOverride, allowFail);
        } else if (type === 'servicecategories') {
            return this.importCollection(json, this.supportServiceCategoryService, orgOverride, allowFail);
        } else if (type === 'serviceinputtypes') {
            return this.importCollection(json, this.SupportServiceInputTypeService, orgOverride, allowFail);
        } else if (type === 'serviceactivitytypes') {
            return this.importCollection(json, this.supportServiceActivityTypeService, orgOverride, allowFail);
        } else if (type === 'serviceceactivities') {
            return this.importCollection(json, this.supportServiceActivityService, orgOverride, allowFail);
        } else if (type === 'serviceactivitybeneficiary') {
            return this.importCollection(json, this.supportServiceActivityBeneficiaryService, orgOverride, allowFail, true);
        } else if (type === 'locations') {
            return this.importCollection(json, this.locationsService, orgOverride, allowFail);
        } else if (type === 'facilities') {
            return this.importCollection(json, this.facilitiesService, orgOverride, allowFail);
        } else if (type === 'farms') {
            return this.importCollection(json, this.farmsService, orgOverride, true);
        } else if (type === 'persons') {
            return this.importCollection(json, this.personsService, orgOverride, allowFail);
        } else if (type === 'certifications') {
            return this.importCollection(json, this.certificationsService, orgOverride, allowFail);
        } else if (type === 'contacts') {
            return this.importCollection(json, this.contactsService, orgOverride, allowFail);
        } else if (type === 'wallets') {
            return this.importCollection(json, this.walletsService, orgOverride, allowFail);
        } else if (type === 'plots') {
            return this.importCollection(json, this.plotsService, orgOverride, allowFail);
        } else if (type === 'vessels') {
            return this.importCollection(json, this.vesselsService, orgOverride, allowFail);
        } else if (type === 'polygons') {
            return this.importCollection(json, this.polygonService, orgOverride, allowFail);
        } else {
            throw Error('not supported');
        }
    }
    constructor(farmsService, facilitiesService, personsService, productsService, productPriceService, productTypesService, seasonsService, certificationTypeService, supportServiceCategoryTypeService, supportServiceCategoryService, supportServiceActivityService, supportServiceActivityBeneficiaryService, SupportServiceInputTypeService, supportServiceActivityTypeService, cropsService, cropvarietyService, locationsService, fileReaderService, contactsService, walletsService, plotsService, certificationsService, vesselsService, polygonService){
        this.farmsService = farmsService;
        this.facilitiesService = facilitiesService;
        this.personsService = personsService;
        this.productsService = productsService;
        this.productPriceService = productPriceService;
        this.productTypesService = productTypesService;
        this.seasonsService = seasonsService;
        this.certificationTypeService = certificationTypeService;
        this.supportServiceCategoryTypeService = supportServiceCategoryTypeService;
        this.supportServiceCategoryService = supportServiceCategoryService;
        this.supportServiceActivityService = supportServiceActivityService;
        this.supportServiceActivityBeneficiaryService = supportServiceActivityBeneficiaryService;
        this.SupportServiceInputTypeService = SupportServiceInputTypeService;
        this.supportServiceActivityTypeService = supportServiceActivityTypeService;
        this.cropsService = cropsService;
        this.cropvarietyService = cropvarietyService;
        this.locationsService = locationsService;
        this.fileReaderService = fileReaderService;
        this.contactsService = contactsService;
        this.walletsService = walletsService;
        this.plotsService = plotsService;
        this.certificationsService = certificationsService;
        this.vesselsService = vesselsService;
        this.polygonService = polygonService;
        this.logger = new _common.Logger(DataImportService.name);
    }
};
DataImportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _facilitiesservice.FacilitiesService === "undefined" ? Object : _facilitiesservice.FacilitiesService,
        typeof _personsservice.PersonsService === "undefined" ? Object : _personsservice.PersonsService,
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService,
        typeof _productPriceservice.ProductPriceService === "undefined" ? Object : _productPriceservice.ProductPriceService,
        typeof _productTypesservice.ProductTypesService === "undefined" ? Object : _productTypesservice.ProductTypesService,
        typeof _seasonsservice.SeasonsService === "undefined" ? Object : _seasonsservice.SeasonsService,
        typeof _certificationTypeservice.CertificationTypeService === "undefined" ? Object : _certificationTypeservice.CertificationTypeService,
        typeof _supportServiceCategoryTypeservice.SupportServiceCategoryTypeService === "undefined" ? Object : _supportServiceCategoryTypeservice.SupportServiceCategoryTypeService,
        typeof _supportServiceCategoryservice.SupportServiceCategoryService === "undefined" ? Object : _supportServiceCategoryservice.SupportServiceCategoryService,
        typeof _supportServiceActivityservice.SupportServiceActivityService === "undefined" ? Object : _supportServiceActivityservice.SupportServiceActivityService,
        typeof _supportServiceActivityBeneficiaryservice.SupportServiceActivityBeneficiaryService === "undefined" ? Object : _supportServiceActivityBeneficiaryservice.SupportServiceActivityBeneficiaryService,
        typeof _supportServiceInputTypeservice.SupportServiceInputTypeService === "undefined" ? Object : _supportServiceInputTypeservice.SupportServiceInputTypeService,
        typeof _supportServiceActivityTypeservice.SupportServiceActivityTypeService === "undefined" ? Object : _supportServiceActivityTypeservice.SupportServiceActivityTypeService,
        typeof _cropsservice.CropsService === "undefined" ? Object : _cropsservice.CropsService,
        typeof _cropvarietyservice.CropvarietyService === "undefined" ? Object : _cropvarietyservice.CropvarietyService,
        typeof _locationsservice.LocationsService === "undefined" ? Object : _locationsservice.LocationsService,
        typeof _fileReaderservice.FileReaderService === "undefined" ? Object : _fileReaderservice.FileReaderService,
        typeof _contactsservice.ContactsService === "undefined" ? Object : _contactsservice.ContactsService,
        typeof _walletsservice.WalletsService === "undefined" ? Object : _walletsservice.WalletsService,
        typeof _plotsservice.PlotsService === "undefined" ? Object : _plotsservice.PlotsService,
        typeof _certificationsservice.CertificationsService === "undefined" ? Object : _certificationsservice.CertificationsService,
        typeof _vesselsservice.VesselsService === "undefined" ? Object : _vesselsservice.VesselsService,
        typeof _geopolygonservice.PolygonService === "undefined" ? Object : _geopolygonservice.PolygonService
    ])
], DataImportService);
