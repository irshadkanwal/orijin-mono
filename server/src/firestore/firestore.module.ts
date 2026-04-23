import { Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { FarmsModule } from '../farms/farms.module';
import { SeasonsModule } from '../seasons/seasons.module';
import { LocationsModule } from '../locations/locations.module';
import { FirestoreFarmImporterService } from './firestoreFarmImporter.service';
import { FirestoreLocationImporterService } from './firestoreLocationImport.service';
import { FirestoreSeasonImporterService } from './firestoreSeasonImporter.service';
import { FirestoreUtilsService } from './firestore.helper.service';
import { PersonsModule } from '../persons/persons.module';
import { FirestoreFarmInspectionService } from './firestore.farm.inspection.service';
import { FirestoreController } from './firestore.controller';
import { PolygonUtilModule } from '../polygonUtil/polygonUtil.module';
import { FirebaseAuthService } from './firebaseAuth.service';
import { FirestoreFarmExporterService } from './export/firestoreFarmExporter.service';
import { FirestorePersonExporterService } from './export/firestorePersonExporter.service';
import { FirestoreSeasonExporterService } from './export/firestoreSeasonExporter.service';
import { FirestoreLocationExporterService } from './export/firestoreLocationExporter.service';
import { SupportServiceModule } from '../supportServices/supportService.module';
import { FirestoreExporterService } from './export/firestoreExporter.service';
import { ProductsModule } from '../products/products.module';
import { CropsModule } from '../crops/crops.module';
import { FirestoreProductsExporterService } from './export/firestoreProductsExporter.service';
import { FirestoreVarietiesExporterService } from './export/firestoreVarietiesExporter.service';
import { FirestoreCropsExporterService } from './export/firestoreCropsExporter.service';
import { FirestoreServicesActivityExporterService } from './export/firestoreServicesActivityExporter.service';
import { FirestoreServicesCategoryTypeExporterService } from './export/firestoreServicesCategoryTypeExporter.service';
import { FirestoreServicesCategoryExporterService } from './export/firestoreServicesCategoryExporter.service';
import { FirestoreProductPriceExporterService } from './export/firestoreProductPriceExporter.service';
import { FirestoreFarmMinExporterService } from './export/firestoreFarmMinExporter.service';
import { SupportServiceActivityService } from '../supportServices/supportServiceActivity.service';
import { SendGridModule } from '../common/service/send-grid/send-grid.module';
import { FirestoreFacilityExporterService } from './export/firestoreFacilityExporter.service';
import { FacilitiesModule } from '../facilities/facilities.module';
import { FirestoreServicesActivityTypeExporterService } from './export/firestoreServicesActivityTypeExporter.service';
import { FirestoreDBProvider } from './v1services/FirestoreDBProvider';
import OrmProvider from './v1services/OrmProvider';
import UserProvider from './v1services/UserProvider';
import WorkspaceProvider from './v1services/WorkspaceProvider';
import OrganisationProvider from './v1services/OrganisationProvider';
import { FirestoreFarmInspectionGetterService } from './firestoreFarmInspectionGetter.service';
import { HttpModule } from '@nestjs/axios';
import { FirestoreWalletExporterService } from './export/firestoreWalletExporter.service';
import { FirestoreContactExporterService } from './export/firestoreContactExporter.service';
import { FirestoreOrgnisationService } from './services/firestoreOrgnisation.service';
import { FirestoreDBService } from './services/firestoreDb.service';
import { FirestoreOrmService } from './services/firestoreOrm.service';
import { FirestoreWorkspaceService } from './services/firestoreWorkspace.service';
import { CertificationTypeService } from '../certifications/certificationType.service';
import { CertificationsModule } from '../certifications/certifications.module';
import { FirestoreCertificationTypeExporterService } from './export/firestoreCertificationTypeExporter.service';
import { FirestoreUserService } from './services/firestoreUser.service';
import { FirestoreOrganisationConfig } from './services/firestoreOrganisationConfig.service';
import { FirestoreVesselsExporterService } from './export/firestoreVesselsExport.service';
import { VesselsModule } from '../vessels/vessels.module';

@Module({
  imports: [
    SeasonsModule,
    SupportServiceModule,
    CertificationsModule,
    ProductsModule,
    FacilitiesModule,
    CropsModule,
    FarmsModule,
    VesselsModule,
    LocationsModule,
    PersonsModule,
    PolygonUtilModule,
    SendGridModule,
    HttpModule,
  ],
  providers: [
    OrganisationProvider,
    WorkspaceProvider,
    UserProvider,
    OrmProvider,
    FirestoreDBProvider,
    FirestoreService,
    FirestoreUtilsService,
    FirestoreFarmExporterService,
    FirestoreVesselsExporterService,
    FirestoreSeasonExporterService,
    FirestoreProductsExporterService,
    CertificationTypeService,
    FirestoreProductPriceExporterService,
    FirestoreVarietiesExporterService,
    FirestoreCropsExporterService,
    FirestoreServicesActivityExporterService,
    FirestoreServicesActivityTypeExporterService,
    FirestoreServicesCategoryTypeExporterService,
    FirestoreCertificationTypeExporterService,
    SupportServiceActivityService,
    FirestoreServicesCategoryExporterService,
    FirestoreFacilityExporterService,
    FirestoreLocationExporterService,
    FirestorePersonExporterService,
    FirestoreExporterService,
    FirestoreWalletExporterService,
    FirestoreContactExporterService,
    FirestoreFarmImporterService,
    FirestoreFarmMinExporterService,
    FirestoreLocationImporterService,
    FirestoreSeasonImporterService,
    FirestoreFarmInspectionService,
    FirebaseAuthService,
    FirestoreFarmInspectionGetterService,
    FirestoreOrgnisationService,
    FirestoreDBService,
    FirestoreOrmService,
    FirestoreWorkspaceService,
    FirestoreUserService,
    FirestoreOrganisationConfig
  ],
  exports: [
    FirestoreService,
    OrmProvider,
    WorkspaceProvider,
    OrganisationProvider,
    UserProvider,
  ],
  controllers: [FirestoreController],
})
export class FirestoreModule {}
