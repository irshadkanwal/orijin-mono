import { Injectable, Logger } from '@nestjs/common';
import { LocationsService } from '../../locations/locations.service';
import { AbstractExporter } from './AbstractExporter';
import { FirestoreService } from '../firestore.service';
import LocationV1, { LocationType } from '../v1entities/refdata/LocationV1';
import { Location } from '../../locations/models/locations.model';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import OrmProvider from '../v1services/OrmProvider';
import FacilityV1, { FacilityType } from '../v1entities/refdata/FacilityV1';
import { FirestoreFacilityExporterService } from './firestoreFacilityExporter.service';

@Injectable()
export class FirestoreLocationExporterService extends AbstractExporter<
  Location,
  LocationV1,
  LocationsService
> {
  private logger = new Logger(FirestoreLocationExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: LocationsService,
    protected facilityExporter: FirestoreFacilityExporterService,
  ) {
    super(firestoreService, myService);
  }

  async transform(input: Location, meta: Meta): Promise<LocationV1> {
    let res = new LocationV1();

    if (input.type === 'Farmergroups' || input.type === 'CollectionPoint') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res = new FacilityV1();
    }

    setupIdFields(res, input, meta);

    res.name = input.name;
    res.type = input.type as LocationType;
    res.id.label = res.name;

    if (input.type === 'Farmergroups') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.type = 'FarmerGroup' as FacilityType;
    }

    if (input.type === 'CollectionPoint') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      res.type = 'CollectionPoint' as FacilityType;
    }

    const item = await this.myService.getOne({
      id: input.id,
      org: meta.organisation,
    });

    if (item.type === 'SubCounty') {
      // result.parentLocationParentParentCode = input2.shortCode;
      // result.parentLocationParentParentName = input2.name;

      if (!item.parent) {
        console.warn(
          `parent not defined for ${item.shortCode}: ${item.name}, this is not good, but we can get by for now`,
        );
        // throw Error(`parent not defined for ${item.shortCode}: ${item.name}`);
      }
      res.id.authTag = item.parent?.shortCode;
    } else if (item.type === 'District') {
      // result.parentLocationParentParentParentCode = input2.shortCode;
      // result.parentLocationParentParentParentName = input2.name;

      res.id.authTag = item.shortCode;
    } else if (item.type === 'Village') {
      // result.parentLocationCode = input2.shortCode;
      // result.parentLocationName = input2.name;
      if (item.parent?.parent?.parent) {
        res.id.authTag = item.parent.parent.parent.shortCode;
      }
    } else if (item.type === 'Parish') {
      // result.parentLocationParentCode = input2?.shortCode;
      // result.parentLocationParentName = input2?.name;

      if (item.parent?.parent) {
        res.id.authTag = item.parent.parent.shortCode;
      }
    } else if (input.type === 'Farmergroups') {
    } else if (input.type === 'Region') {
    } else if (input.type === 'Zone') {
    } else if (input.type === 'CollectionPoint') {
      // res.parentLocationParentParent =
      //do nothing for now
    } else {
      throw Error('unknonwn input2 type ' + item.type);
    }

    if (item.parent) {
      const parentLocationId = new ObjectId(item.parent.id, 'locations');
      parentLocationId.labelShort = item.parent.shortCode;
      parentLocationId.label = item.parent.name;
      res.parentLocation = parentLocationId;

      if (item.parent.parent) {
        const parentLocationParentId = new ObjectId(
          item.parent.parent.id,
          'locations',
        );
        parentLocationParentId.labelShort = item.parent.parent.shortCode;
        parentLocationParentId.label = item.parent.parent.name;
        res.parentLocationParent = parentLocationParentId;

        if (item.parent.parent.parent) {
          const parentLocationParentParentId = new ObjectId(
            item.parent.parent.parent.id,
            'locations',
          );
          parentLocationParentParentId.labelShort =
            item.parent.parent.parent.shortCode;
          parentLocationParentParentId.label = item.parent.parent.parent.name;
          res.parentLocationParentParent = parentLocationParentParentId;
        }
      }
    }

    return res;
  }
}
