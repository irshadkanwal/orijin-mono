"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DataImportsModule", {
    enumerable: true,
    get: function() {
        return DataImportsModule;
    }
});
const _common = require("@nestjs/common");
const _ltcdataImportservice = require("./ltc.dataImport.service");
const _fileReaderservice = require("./fileReader.service");
const _farmsmodule = require("../farms/farms.module");
const _personsmodule = require("../persons/persons.module");
const _locationsmodule = require("../locations/locations.module");
const _seasonsmodule = require("../seasons/seasons.module");
const _mhdataImportservice = require("./mh.dataImport.service");
const _lyondataImportservice = require("./lyon.dataImport.service");
const _dataImportservice = require("./dataImport.service");
const _cropsmodule = require("../crops/crops.module");
const _supportServicemodule = require("../supportServices/supportService.module");
const _productsmodule = require("../products/products.module");
const _facilitiesmodule = require("../facilities/facilities.module");
const _kokoaKamilidataImportservice = require("./kokoaKamili.dataImport.service");
const _dataimportcontroller = require("./data-import.controller");
const _mhRawdataImportservice = require("./mhRaw.dataImport.service");
const _certificationsmodule = require("../certifications/certifications.module");
const _nahuadataImportservice = require("./nahua.dataImport.service");
const _commondataImportservice = require("./common.dataImport.service");
const _vesselsmodule = require("../vessels/vessels.module");
const _geodatasmodule = require("../geodatas/geodatas.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DataImportsModule = class DataImportsModule {
};
DataImportsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _farmsmodule.FarmsModule,
            _personsmodule.PersonsModule,
            _facilitiesmodule.FacilitiesModule,
            _locationsmodule.LocationsModule,
            _certificationsmodule.CertificationsModule,
            _seasonsmodule.SeasonsModule,
            _cropsmodule.CropsModule,
            _supportServicemodule.SupportServiceModule,
            _productsmodule.ProductsModule,
            _vesselsmodule.VesselsModule,
            _geodatasmodule.GeodatasModule
        ],
        controllers: [
            _dataimportcontroller.DataImportController
        ],
        providers: [
            _fileReaderservice.FileReaderService,
            _ltcdataImportservice.LtcDataImportService,
            _dataImportservice.DataImportService,
            _mhdataImportservice.MhDataImportService,
            _mhRawdataImportservice.MhRawDataImportService,
            _lyondataImportservice.LyonDataImportService,
            _kokoaKamilidataImportservice.KokoaKamiliDataImportService,
            _nahuadataImportservice.NahuaDataImportService,
            _commondataImportservice.CommonDataImportService
        ]
    })
], DataImportsModule);
