import { Injectable, Logger } from '@nestjs/common';
import { FarmsService } from '../../farms/farms.service';
import { AbstractExporter } from './AbstractExporter';
import { Farm } from '../../farms/models/farms.model';
import FarmV1, { CertificationStatus } from '../v1entities/farms/FarmV1';
import {
  parseLocationHierarchyStart,
  setupIdFields,
  transformUserV2,
} from './../v1utils/utils';
import { Meta } from '../v1entities/utis/types';
import { ObjectId } from '../v1entities/utis/ObjectId';
import OrmProvider from '../v1services/OrmProvider';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FirestoreFarmExporterService extends AbstractExporter<
  Farm,
  FarmV1,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  FarmsService
> {
  private logger = new Logger(FirestoreFarmExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: FarmsService,
    protected prisma: PrismaService,
  ) {
    super(firestoreService, myService);
  }

  async getMany(organisation: string): Promise<Farm[]> {
    const inputs = await this.v2Service.getManyImpl({
      organisation,
    });
    return inputs.data as Farm[];
  }
  async transform(input: Farm, meta: Meta): Promise<FarmV1> {
    const currentFarm = await this.firestoreService.getById(input.id, FarmV1, {
      ...meta,
      currentUser: meta.userId as ObjectId,
    });

    const result = new FarmV1();
    setupIdFields(result, input, meta);

    const facility = input.facility;

    if (currentFarm?.mobilePayRegistrationStatus) {
      result.mobilePayRegistrationStatus =
        currentFarm.mobilePayRegistrationStatus;
      result.mobilePayWallets = currentFarm.mobilePayWallets;
      result.mobilePayWalletsFull = currentFarm.mobilePayWalletsFull;
      result.mobilePayWalletsFullIds = currentFarm.mobilePayWalletsFullIds;

      //based on yeild estimates from plots + production data...!
      result.maxQuantityProcessedLimitProcessed = null;
      result.maxQuantityProcessedLimitRaw = null;
      result.quantityProcessedCurrentSeasonRaw = null;
      result.quantityProcessedCurrentSeasonProcessed = null;
    }

    const mainContactPerson = facility.mainContactPerson;

    const contacts = await this.prisma.contact.findMany({
      where: {
        personId: mainContactPerson.id,
      },
      include: {
        wallets: true,
      },
    });

    result.name = facility.name;
    result.id.labelShort = facility.shortCode;
    result.id.label = facility.name;

    result.certificationStatus =
      input.certificationStatus as any as CertificationStatus;

    if (mainContactPerson) {
      const contact = transformUserV2(mainContactPerson, input, meta);
      contact.contactPersonForFacility = result.id;

      result.mainContactPerson = contact.id;
    }

    const location = input.facility.location;

    if (location) {
      const myLocation = location;
      const parentLocationId = new ObjectId(myLocation.id, 'locations');
      parentLocationId.labelShort = myLocation.shortCode;
      parentLocationId.label = myLocation.name;
      //VILLAGE
      result.parentLocation = parentLocationId;

      if (myLocation.parent) {
        const parentLocationParentId = new ObjectId(
          myLocation.parent.id,
          'locations',
        );
        parentLocationParentId.labelShort = myLocation.parent.shortCode;
        parentLocationParentId.label = myLocation.parent.name;
        //PARISH
        result.parentLocationParent = parentLocationParentId;

        if (myLocation.parent.parent) {
          const parentLOcationParentParentId = new ObjectId(
            myLocation.parent.parent.id,
            'locations',
          );
          parentLOcationParentParentId.labelShort =
            myLocation.parent.parent.shortCode;
          parentLOcationParentParentId.label = myLocation.parent.parent.name;
          //SUB COUNTY
          result.parentLocationParentParent = parentLOcationParentParentId;

          if (myLocation.parent.parent.parent) {
            const parentLocationParentParentParentId = new ObjectId(
              myLocation.parent.parent.parent.id,
              'locations',
            );
            parentLocationParentParentParentId.labelShort =
              myLocation.parent.parent.parent.shortCode;
            parentLocationParentParentParentId.label =
              myLocation.parent.parent.parent.name;
            //DISTRCIT
            result.parentLocationParentParentParent =
              parentLocationParentParentParentId;
          }
        }
      }
    }

    parseLocationHierarchyStart(result, location);

    return result;
  }
  async exportAll(meta: Meta, key?: string): Promise<FarmV1[]> {
    meta.onlyCreate = true;
    return super.exportAll(meta, key);
  }
}
