import { Injectable, Logger } from '@nestjs/common';
import { AbstractExporter } from './AbstractExporter';
import FacilityV1, { FacilityType } from '../v1entities/refdata/FacilityV1';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { Meta } from '../v1entities/utis/types';
import { setupIdFields } from './../v1utils/utils';
import { Facility } from '../../facilities/models/facility.model';
import { FacilitiesService } from '../../facilities/facilities.service';
import OrmProvider from '../v1services/OrmProvider';

@Injectable()
export class FirestoreFacilityExporterService extends AbstractExporter<
  Facility,
  FacilityV1,
  FacilitiesService
> {
  private logger = new Logger(FirestoreFacilityExporterService.name);

  constructor(
    protected firestoreService: OrmProvider,
    protected myService: FacilitiesService,
  ) {
    super(firestoreService, myService);
  }
  async transform(item: Facility, meta: Meta): Promise<FacilityV1> {
    const res = new FacilityV1();
    setupIdFields(res, item, meta);

    res.name = item.name;
    res.type = item.type as FacilityType;
    res.id.label = res.name;

    // console.log('processing', item);
    if (item.location) {
      const parentLocationId = new ObjectId(item.location.id, 'locations');
      parentLocationId.labelShort = item.location.shortCode;
      parentLocationId.label = item.location.name;
      //VILLAGE
      res.parentLocation = parentLocationId;

      if (item.location.parent) {
        const parentLocationParentId = new ObjectId(
          item.location.parent.id,
          'locations',
        );
        parentLocationParentId.labelShort = item.location.parent.shortCode;
        parentLocationParentId.label = item.location.parent.name;
        //PARISH
        res.parentLocationParent = parentLocationParentId;

        if (item.location.parent.parent) {
          const parentLOcationParentParentId = new ObjectId(
            item.location.parent.parent.id,
            'locations',
          );
          parentLOcationParentParentId.labelShort =
            item.location.parent.parent.shortCode;
          parentLOcationParentParentId.label = item.location.parent.parent.name;
          //SUB COUNTY
          res.parentLocationParentParent = parentLOcationParentParentId;

          if (item.location.parent.parent.parent) {
            const parentLocationParentParentParentId = new ObjectId(
              item.location.parent.parent.parent.id,
              'locations',
            );
            parentLocationParentParentParentId.labelShort =
              item.location.parent.parent.parent.shortCode;
            parentLocationParentParentParentId.label =
              item.location.parent.parent.parent.name;
            //DISTRCIT
            res.parentLocationParentParentParent =
              parentLocationParentParentParentId;
          }
        }
      }
    }

    return res;
  }

  async exportAll(meta: Meta): Promise<FacilityV1[]> {
    const inputs = await this.myService.getMany({
      organisation: meta.organisation,
      type: 'CollectionPoint',
    });

    // console.log('inputs', inputs);
    console.log('Exporting facilities');

    const transformed = await Promise.all(
      inputs.data.map((s) => this.transform(s, meta)),
    );
    // console.log('transformed', transformed);
    if (meta.onlyCreate) {
      const upserted = await Promise.all(
        transformed.map((a) => this.onlyCreate(a)),
      );
      // console.log('upserted', upserted);
      console.log('Exporting facilities done');
      return upserted;
    } else {
      const upserted = await Promise.all(
        transformed.map((a) => this.upsert(a)),
      );
      // console.log('upserted', upserted);
      console.log('Exporting facilities done');
      return upserted;
    }
  }
}
