import { Injectable, Logger } from '@nestjs/common';
import { AbstractExporter } from './AbstractExporter';
import { Vessel } from '../../vessels/models/vessels.model';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import { VesselsService } from '../../vessels/vessels.service';
import VesselV1 from '../v1entities/refdata/VesselV1';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FirestoreVesselsExporterService extends AbstractExporter<
  Vessel,
  VesselV1,
  VesselsService
> {
  private logger = new Logger(FirestoreVesselsExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: VesselsService,
    protected prisma:PrismaService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Vessel, meta: Meta): Promise<VesselV1> {
    const vesselObj = new VesselV1();

    // Set up ID fields based on utility function
    setupIdFields(vesselObj, input, meta);

    // Map fields from input (Prisma model) to result (VesselV1)
    vesselObj.id.label = input.id; // Assuming setupIdFields handles id fields appropriately

    // Map Date fields (convert Prisma DateTime to JavaScript Date)
    vesselObj.createdDate = input.createdAt ? new Date(input.createdAt) : null;
    vesselObj.updatedDate = input.updatedAt ? new Date(input.updatedAt) : null;

    vesselObj.name = input.name;
    vesselObj.permanent = input.permanent ?? false;

    // Map size field from Decimal to a nested object
    if (input.size) {
      vesselObj.size = {
        amount: Number(input.size), // Ensure correct conversion
        unit: 'grams', // Assuming a default unit, adjust if needed
      };
    } else {
      vesselObj.size = {
        amount: null,
        unit: null,
      };
    }

    // Map weight field from Decimal to a nested object
    if (input.weight) {
      vesselObj.weight = {
        amount: Number(input.weight), // Ensure correct conversion
        unit: 'grams', // Assuming a default unit, adjust if needed
      };
    } else {
      vesselObj.weight = {
        amount: null,
        unit: null,
      };
    }

    // Map facility and plot references
    if (input.facilityId) {
      vesselObj.facility = { id: input.facilityId } as any; // Adjust based on your actual facility object structure
    } else {
      vesselObj.facility = null;
    }

    if (input.plotId) {
      vesselObj.plot = { id: input.plotId } as any; // Adjust based on your actual plot object structure
    } else {
      vesselObj.plot = null;
    }
    
    return vesselObj;
  }
}
