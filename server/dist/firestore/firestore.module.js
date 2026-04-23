"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreModule", {
    enumerable: true,
    get: function() {
        return FirestoreModule;
    }
});
const _common = require("@nestjs/common");
const _firestoreservice = require("./firestore.service");
const _farmsmodule = require("../farms/farms.module");
const _seasonsmodule = require("../seasons/seasons.module");
const _locationsmodule = require("../locations/locations.module");
const _firestoreFarmImporterservice = require("./firestoreFarmImporter.service");
const _firestoreLocationImportservice = require("./firestoreLocationImport.service");
const _firestoreSeasonImporterservice = require("./firestoreSeasonImporter.service");
const _firestorehelperservice = require("./firestore.helper.service");
const _personsmodule = require("../persons/persons.module");
const _firestorefarminspectionservice = require("./firestore.farm.inspection.service");
const _firestorecontroller = require("./firestore.controller");
const _polygonUtilmodule = require("../polygonUtil/polygonUtil.module");
const _firebaseAuthservice = require("./firebaseAuth.service");
const _firestoreFarmExporterservice = require("./export/firestoreFarmExporter.service");
const _firestorePersonExporterservice = require("./export/firestorePersonExporter.service");
const _firestoreSeasonExporterservice = require("./export/firestoreSeasonExporter.service");
const _firestoreLocationExporterservice = require("./export/firestoreLocationExporter.service");
const _supportServicemodule = require("../supportServices/supportService.module");
const _firestoreExporterservice = require("./export/firestoreExporter.service");
const _productsmodule = require("../products/products.module");
const _cropsmodule = require("../crops/crops.module");
const _firestoreProductsExporterservice = require("./export/firestoreProductsExporter.service");
const _firestoreVarietiesExporterservice = require("./export/firestoreVarietiesExporter.service");
const _firestoreCropsExporterservice = require("./export/firestoreCropsExporter.service");
const _firestoreServicesActivityExporterservice = require("./export/firestoreServicesActivityExporter.service");
const _firestoreServicesCategoryTypeExporterservice = require("./export/firestoreServicesCategoryTypeExporter.service");
const _firestoreServicesCategoryExporterservice = require("./export/firestoreServicesCategoryExporter.service");
const _firestoreProductPriceExporterservice = require("./export/firestoreProductPriceExporter.service");
const _firestoreFarmMinExporterservice = require("./export/firestoreFarmMinExporter.service");
const _supportServiceActivityservice = require("../supportServices/supportServiceActivity.service");
const _sendgridmodule = require("../common/service/send-grid/send-grid.module");
const _firestoreFacilityExporterservice = require("./export/firestoreFacilityExporter.service");
const _facilitiesmodule = require("../facilities/facilities.module");
const _firestoreServicesActivityTypeExporterservice = require("./export/firestoreServicesActivityTypeExporter.service");
const _FirestoreDBProvider = require("./v1services/FirestoreDBProvider");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("./v1services/OrmProvider"));
const _UserProvider = /*#__PURE__*/ _interop_require_default(require("./v1services/UserProvider"));
const _WorkspaceProvider = /*#__PURE__*/ _interop_require_default(require("./v1services/WorkspaceProvider"));
const _OrganisationProvider = /*#__PURE__*/ _interop_require_default(require("./v1services/OrganisationProvider"));
const _firestoreFarmInspectionGetterservice = require("./firestoreFarmInspectionGetter.service");
const _axios = require("@nestjs/axios");
const _firestoreWalletExporterservice = require("./export/firestoreWalletExporter.service");
const _firestoreContactExporterservice = require("./export/firestoreContactExporter.service");
const _firestoreOrgnisationservice = require("./services/firestoreOrgnisation.service");
const _firestoreDbservice = require("./services/firestoreDb.service");
const _firestoreOrmservice = require("./services/firestoreOrm.service");
const _firestoreWorkspaceservice = require("./services/firestoreWorkspace.service");
const _certificationTypeservice = require("../certifications/certificationType.service");
const _certificationsmodule = require("../certifications/certifications.module");
const _firestoreCertificationTypeExporterservice = require("./export/firestoreCertificationTypeExporter.service");
const _firestoreUserservice = require("./services/firestoreUser.service");
const _firestoreOrganisationConfigservice = require("./services/firestoreOrganisationConfig.service");
const _firestoreVesselsExportservice = require("./export/firestoreVesselsExport.service");
const _vesselsmodule = require("../vessels/vessels.module");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FirestoreModule = class FirestoreModule {
};
FirestoreModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _seasonsmodule.SeasonsModule,
            _supportServicemodule.SupportServiceModule,
            _certificationsmodule.CertificationsModule,
            _productsmodule.ProductsModule,
            _facilitiesmodule.FacilitiesModule,
            _cropsmodule.CropsModule,
            _farmsmodule.FarmsModule,
            _vesselsmodule.VesselsModule,
            _locationsmodule.LocationsModule,
            _personsmodule.PersonsModule,
            _polygonUtilmodule.PolygonUtilModule,
            _sendgridmodule.SendGridModule,
            _axios.HttpModule
        ],
        providers: [
            _OrganisationProvider.default,
            _WorkspaceProvider.default,
            _UserProvider.default,
            _OrmProvider.default,
            _FirestoreDBProvider.FirestoreDBProvider,
            _firestoreservice.FirestoreService,
            _firestorehelperservice.FirestoreUtilsService,
            _firestoreFarmExporterservice.FirestoreFarmExporterService,
            _firestoreVesselsExportservice.FirestoreVesselsExporterService,
            _firestoreSeasonExporterservice.FirestoreSeasonExporterService,
            _firestoreProductsExporterservice.FirestoreProductsExporterService,
            _certificationTypeservice.CertificationTypeService,
            _firestoreProductPriceExporterservice.FirestoreProductPriceExporterService,
            _firestoreVarietiesExporterservice.FirestoreVarietiesExporterService,
            _firestoreCropsExporterservice.FirestoreCropsExporterService,
            _firestoreServicesActivityExporterservice.FirestoreServicesActivityExporterService,
            _firestoreServicesActivityTypeExporterservice.FirestoreServicesActivityTypeExporterService,
            _firestoreServicesCategoryTypeExporterservice.FirestoreServicesCategoryTypeExporterService,
            _firestoreCertificationTypeExporterservice.FirestoreCertificationTypeExporterService,
            _supportServiceActivityservice.SupportServiceActivityService,
            _firestoreServicesCategoryExporterservice.FirestoreServicesCategoryExporterService,
            _firestoreFacilityExporterservice.FirestoreFacilityExporterService,
            _firestoreLocationExporterservice.FirestoreLocationExporterService,
            _firestorePersonExporterservice.FirestorePersonExporterService,
            _firestoreExporterservice.FirestoreExporterService,
            _firestoreWalletExporterservice.FirestoreWalletExporterService,
            _firestoreContactExporterservice.FirestoreContactExporterService,
            _firestoreFarmImporterservice.FirestoreFarmImporterService,
            _firestoreFarmMinExporterservice.FirestoreFarmMinExporterService,
            _firestoreLocationImportservice.FirestoreLocationImporterService,
            _firestoreSeasonImporterservice.FirestoreSeasonImporterService,
            _firestorefarminspectionservice.FirestoreFarmInspectionService,
            _firebaseAuthservice.FirebaseAuthService,
            _firestoreFarmInspectionGetterservice.FirestoreFarmInspectionGetterService,
            _firestoreOrgnisationservice.FirestoreOrgnisationService,
            _firestoreDbservice.FirestoreDBService,
            _firestoreOrmservice.FirestoreOrmService,
            _firestoreWorkspaceservice.FirestoreWorkspaceService,
            _firestoreUserservice.FirestoreUserService,
            _firestoreOrganisationConfigservice.FirestoreOrganisationConfig
        ],
        exports: [
            _firestoreservice.FirestoreService,
            _OrmProvider.default,
            _WorkspaceProvider.default,
            _OrganisationProvider.default,
            _UserProvider.default
        ],
        controllers: [
            _firestorecontroller.FirestoreController
        ]
    })
], FirestoreModule);
