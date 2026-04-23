import { Injectable, Logger } from '@nestjs/common';
import { FirestoreFarmExporterService } from './firestoreFarmExporter.service';
import { FirestorePersonExporterService } from './firestorePersonExporter.service';
import { FirestoreLocationExporterService } from './firestoreLocationExporter.service';
import { FirestoreSeasonExporterService } from './firestoreSeasonExporter.service';
import { FirestoreProductsExporterService } from './firestoreProductsExporter.service';
import { FirestoreVarietiesExporterService } from './firestoreVarietiesExporter.service';
import { FirestoreCropsExporterService } from './firestoreCropsExporter.service';
import { FirestoreServicesCategoryTypeExporterService } from './firestoreServicesCategoryTypeExporter.service';
import { FirestoreServicesActivityExporterService } from './firestoreServicesActivityExporter.service';
import { FirestoreServicesCategoryExporterService } from './firestoreServicesCategoryExporter.service';
import { FirestoreProductPriceExporterService } from './firestoreProductPriceExporter.service';
import { FirestoreFarmMinExporterService } from './firestoreFarmMinExporter.service';
import { Meta } from '../v1entities/utis/types';
import { FirestoreFacilityExporterService } from './firestoreFacilityExporter.service';
import { FirestoreServicesActivityTypeExporterService } from './firestoreServicesActivityTypeExporter.service';
import { FirestoreWalletExporterService } from './firestoreWalletExporter.service';
import { FirestoreContactExporterService } from './firestoreContactExporter.service';
import { FirestoreCertificationTypeExporterService } from './firestoreCertificationTypeExporter.service';
import { FirestoreVesselsExporterService } from './firestoreVesselsExport.service';

@Injectable()
export class FirestoreExporterService {
  private logger = new Logger(FirestoreExporterService.name);

  constructor(
    private firestoreFarmExporterService: FirestoreFarmExporterService,
    private firestoreFacilityExporterService: FirestoreFacilityExporterService,
    private firestoreSeasonExporterService: FirestoreSeasonExporterService,
    private firestoreProductsExporterService: FirestoreProductsExporterService,
    private firestoreProductPriceExporterService: FirestoreProductPriceExporterService,
    private firestoreFarmMinExporterService: FirestoreFarmMinExporterService,
    private firestoreVarietiesExporterService: FirestoreVarietiesExporterService,
    private firestoreServicesCategoryTypeExporterService: FirestoreServicesCategoryTypeExporterService,
    private firestoreServicesCategoryExporterService: FirestoreServicesCategoryExporterService,
    private firestoreServicesActivityExporterService: FirestoreServicesActivityExporterService,
    private firestoreServicesActivityTypeExporterService: FirestoreServicesActivityTypeExporterService,
    private firestorePersonExporterService: FirestorePersonExporterService,
    private firestoreContactExporterService: FirestoreContactExporterService,
    private firestoreWalletExporterService: FirestoreWalletExporterService,
    private firestoreLocationExporterService: FirestoreLocationExporterService,
    private firestoreCropsExporterService: FirestoreCropsExporterService,
    private firestoreCertificationTypeExporterService: FirestoreCertificationTypeExporterService,
    private firestoreVesselsExportService: FirestoreVesselsExporterService
  ) {}

  async exportOne(id: string, meta: Meta) {
    return 'hhahaha';
  }

  async exportAll(meta: Meta, items?: string[]) {
    if (!items || items.includes('certificationtypes')) {
      await this.firestoreCertificationTypeExporterService.exportAll(
        meta,
        'certificationtypes',
      );
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
      await this.firestoreServicesActivityTypeExporterService.exportAll(
        meta,
        'serviceactivitytypes',
      );
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
}
