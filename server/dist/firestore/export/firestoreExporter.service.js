"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreExporterService;
    }
});
const _common = require("@nestjs/common");
const _firestoreFarmExporterservice = require("./firestoreFarmExporter.service");
const _firestorePersonExporterservice = require("./firestorePersonExporter.service");
const _firestoreLocationExporterservice = require("./firestoreLocationExporter.service");
const _firestoreSeasonExporterservice = require("./firestoreSeasonExporter.service");
const _firestoreProductsExporterservice = require("./firestoreProductsExporter.service");
const _firestoreVarietiesExporterservice = require("./firestoreVarietiesExporter.service");
const _firestoreCropsExporterservice = require("./firestoreCropsExporter.service");
const _firestoreServicesCategoryTypeExporterservice = require("./firestoreServicesCategoryTypeExporter.service");
const _firestoreServicesActivityExporterservice = require("./firestoreServicesActivityExporter.service");
const _firestoreServicesCategoryExporterservice = require("./firestoreServicesCategoryExporter.service");
const _firestoreProductPriceExporterservice = require("./firestoreProductPriceExporter.service");
const _firestoreFarmMinExporterservice = require("./firestoreFarmMinExporter.service");
const _firestoreFacilityExporterservice = require("./firestoreFacilityExporter.service");
const _firestoreServicesActivityTypeExporterservice = require("./firestoreServicesActivityTypeExporter.service");
const _firestoreWalletExporterservice = require("./firestoreWalletExporter.service");
const _firestoreContactExporterservice = require("./firestoreContactExporter.service");
const _firestoreCertificationTypeExporterservice = require("./firestoreCertificationTypeExporter.service");
const _firestoreVesselsExportservice = require("./firestoreVesselsExport.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirestoreExporterService = class FirestoreExporterService {
    async exportOne(id, meta) {
        return 'hhahaha';
    }
    async exportAll(meta, items) {
        if (!items || items.includes('certificationtypes')) {
            await this.firestoreCertificationTypeExporterService.exportAll(meta, 'certificationtypes');
        }
        if (!items || items.includes('seasons')) {
            await this.firestoreSeasonExporterService.exportAll(meta, 'seasons');
        }
        if (!items || items.includes('locations')) {
            await this.firestoreLocationExporterService.exportAll(meta, 'locations');
        }
        if (!items || items.includes('facilities')) {
            await this.firestoreFacilityExporterService.exportAll(meta);
        }
        if (!items || items.includes('varieties')) {
            await this.firestoreVarietiesExporterService.exportAll(meta, 'varieties');
        }
        if (!items || items.includes('crops')) {
            await this.firestoreCropsExporterService.exportAll(meta, 'crops');
        }
        // if (!items || items.includes('servicecategorytypes')) {
        //   await this.firestoreServicesCategoryTypeExporterService.exportAll(
        //     meta,
        //     'servicecategorytypes',
        //   );
        // }
        //
        //
        // if (!items || items.includes('servicecategories')) {
        //   await this.firestoreServicesCategoryExporterService.exportAll(
        //     meta,
        //     'servicecategories',
        //   );
        // }
        if (!items || items.includes('serviceactivitytypes')) {
            await this.firestoreServicesActivityTypeExporterService.exportAll(meta, 'serviceactivitytypes');
        }
        if (!items || items.includes('farms')) {
            await this.firestoreFarmExporterService.exportAll(meta, 'farms');
        }
        if (!items || items.includes('farms_min')) {
            await this.firestoreFarmMinExporterService.exportAll(meta, 'farms_min');
        }
        if (!items || items.includes('persons')) {
            await this.firestorePersonExporterService.exportAll(meta, 'persons');
        }
        if (!items || items.includes('wallets')) {
            await this.firestoreWalletExporterService.exportAll(meta, 'wallets');
        }
        if (!items || items.includes('contacts')) {
            await this.firestoreContactExporterService.exportAll(meta, 'contacts');
        }
        if (!items || items.includes('products')) {
            await this.firestoreProductsExporterService.exportAll(meta, 'products');
        }
        if (!items || items.includes('prices')) {
            await this.firestoreProductPriceExporterService.exportAll(meta, 'prices');
        }
        if (!items || items.includes('vessels')) {
            await this.firestoreVesselsExportService.exportAll(meta, 'vessels');
        }
        return 'hhahaha';
    }
    constructor(firestoreFarmExporterService, firestoreFacilityExporterService, firestoreSeasonExporterService, firestoreProductsExporterService, firestoreProductPriceExporterService, firestoreFarmMinExporterService, firestoreVarietiesExporterService, firestoreServicesCategoryTypeExporterService, firestoreServicesCategoryExporterService, firestoreServicesActivityExporterService, firestoreServicesActivityTypeExporterService, firestorePersonExporterService, firestoreContactExporterService, firestoreWalletExporterService, firestoreLocationExporterService, firestoreCropsExporterService, firestoreCertificationTypeExporterService, firestoreVesselsExportService){
        this.firestoreFarmExporterService = firestoreFarmExporterService;
        this.firestoreFacilityExporterService = firestoreFacilityExporterService;
        this.firestoreSeasonExporterService = firestoreSeasonExporterService;
        this.firestoreProductsExporterService = firestoreProductsExporterService;
        this.firestoreProductPriceExporterService = firestoreProductPriceExporterService;
        this.firestoreFarmMinExporterService = firestoreFarmMinExporterService;
        this.firestoreVarietiesExporterService = firestoreVarietiesExporterService;
        this.firestoreServicesCategoryTypeExporterService = firestoreServicesCategoryTypeExporterService;
        this.firestoreServicesCategoryExporterService = firestoreServicesCategoryExporterService;
        this.firestoreServicesActivityExporterService = firestoreServicesActivityExporterService;
        this.firestoreServicesActivityTypeExporterService = firestoreServicesActivityTypeExporterService;
        this.firestorePersonExporterService = firestorePersonExporterService;
        this.firestoreContactExporterService = firestoreContactExporterService;
        this.firestoreWalletExporterService = firestoreWalletExporterService;
        this.firestoreLocationExporterService = firestoreLocationExporterService;
        this.firestoreCropsExporterService = firestoreCropsExporterService;
        this.firestoreCertificationTypeExporterService = firestoreCertificationTypeExporterService;
        this.firestoreVesselsExportService = firestoreVesselsExportService;
        this.logger = new _common.Logger(FirestoreExporterService.name);
    }
};
FirestoreExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestoreFarmExporterservice.FirestoreFarmExporterService === "undefined" ? Object : _firestoreFarmExporterservice.FirestoreFarmExporterService,
        typeof _firestoreFacilityExporterservice.FirestoreFacilityExporterService === "undefined" ? Object : _firestoreFacilityExporterservice.FirestoreFacilityExporterService,
        typeof _firestoreSeasonExporterservice.FirestoreSeasonExporterService === "undefined" ? Object : _firestoreSeasonExporterservice.FirestoreSeasonExporterService,
        typeof _firestoreProductsExporterservice.FirestoreProductsExporterService === "undefined" ? Object : _firestoreProductsExporterservice.FirestoreProductsExporterService,
        typeof _firestoreProductPriceExporterservice.FirestoreProductPriceExporterService === "undefined" ? Object : _firestoreProductPriceExporterservice.FirestoreProductPriceExporterService,
        typeof _firestoreFarmMinExporterservice.FirestoreFarmMinExporterService === "undefined" ? Object : _firestoreFarmMinExporterservice.FirestoreFarmMinExporterService,
        typeof _firestoreVarietiesExporterservice.FirestoreVarietiesExporterService === "undefined" ? Object : _firestoreVarietiesExporterservice.FirestoreVarietiesExporterService,
        typeof _firestoreServicesCategoryTypeExporterservice.FirestoreServicesCategoryTypeExporterService === "undefined" ? Object : _firestoreServicesCategoryTypeExporterservice.FirestoreServicesCategoryTypeExporterService,
        typeof _firestoreServicesCategoryExporterservice.FirestoreServicesCategoryExporterService === "undefined" ? Object : _firestoreServicesCategoryExporterservice.FirestoreServicesCategoryExporterService,
        typeof _firestoreServicesActivityExporterservice.FirestoreServicesActivityExporterService === "undefined" ? Object : _firestoreServicesActivityExporterservice.FirestoreServicesActivityExporterService,
        typeof _firestoreServicesActivityTypeExporterservice.FirestoreServicesActivityTypeExporterService === "undefined" ? Object : _firestoreServicesActivityTypeExporterservice.FirestoreServicesActivityTypeExporterService,
        typeof _firestorePersonExporterservice.FirestorePersonExporterService === "undefined" ? Object : _firestorePersonExporterservice.FirestorePersonExporterService,
        typeof _firestoreContactExporterservice.FirestoreContactExporterService === "undefined" ? Object : _firestoreContactExporterservice.FirestoreContactExporterService,
        typeof _firestoreWalletExporterservice.FirestoreWalletExporterService === "undefined" ? Object : _firestoreWalletExporterservice.FirestoreWalletExporterService,
        typeof _firestoreLocationExporterservice.FirestoreLocationExporterService === "undefined" ? Object : _firestoreLocationExporterservice.FirestoreLocationExporterService,
        typeof _firestoreCropsExporterservice.FirestoreCropsExporterService === "undefined" ? Object : _firestoreCropsExporterservice.FirestoreCropsExporterService,
        typeof _firestoreCertificationTypeExporterservice.FirestoreCertificationTypeExporterService === "undefined" ? Object : _firestoreCertificationTypeExporterservice.FirestoreCertificationTypeExporterService,
        typeof _firestoreVesselsExportservice.FirestoreVesselsExporterService === "undefined" ? Object : _firestoreVesselsExportservice.FirestoreVesselsExporterService
    ])
], FirestoreExporterService);
