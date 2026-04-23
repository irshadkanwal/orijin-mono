import { Exclude, Expose, Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import {
  cascadingDelete,
  expandFromId,
  mapToObjectId,
} from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import AbstractLot from './AbstractLot';
import SourceRelationshipWeightArrayObject from '../utis/SourceRelationshipWeightArrayObject';
import OriginProperties from './OriginProperties';
import Analysis from '../quality/Analysis';
import QualityControlResults from '../quality/QualityControlResults';
import QualityControlSession from '../quality/QualityControlSession';
import {
  AccumulationType,
  AccumulationWeightKey,
  ApprovalItem,
  OriginType,
  ProdLotType,
  SeasonHistoryItem,
} from '../utis/types';
import Coordinates from '../utis/Coordinates';

export default class ProdLot extends AbstractLot {
  origin = false;
  endProduct = false;
  hasBeenSampled = false;

  originType: OriginType[] = null;
  prodlotType: ProdLotType = null;
  accumulationType: AccumulationType = null;

  accumulationWeightKey: AccumulationWeightKey = null;

  @Type(() => ObjectId)
  currentVesselId: ObjectId = null;

  @Type(() => ObjectId)
  previousVesselId: ObjectId = null;

  @Type(() => ObjectId)
  @mapToObjectId(collectionKeys.batches)
  // @expandOnLoad()
  // @cascadingDelete()
  // batches: Array<ObjectId>;

  // @Exclude()
  // batchesFull: Array<Batch>;
  @Type(() => SourceRelationshipWeightArrayObject)
  sources: Array<SourceRelationshipWeightArrayObject>;

  @Type(() => ObjectId)
  singleSourceRef: ObjectId;

  @Type(() => ObjectId)
  samples: Array<ObjectId>;

  @Exclude()
  @expandFromId('samples')
  samplesFull: Array<ProdLot>;

  @Type(() => ObjectId)
  followingProdlotIds: Array<ObjectId>;

  @Type(() => ObjectId)
  // @cascadingDelete()
  originPropertiesId: ObjectId;

  @expandFromId('originPropertiesId')
  @Exclude()
  originProperties: OriginProperties;

  @Type(() => ObjectId)
  tag: ObjectId = null;

  @Type(() => ObjectId)
  tags: ObjectId[] = [];

  tagsIdLabels: string[] = [];

  tagStrings: [] = [];

  @Type(() => ObjectId)
  @cascadingDelete()
  analyses: ObjectId[];

  @Exclude()
  @expandFromId('analyses')
  analysesFull: Array<Analysis>;

  @Type(() => ObjectId)
  @cascadingDelete()
  qualityControlResults: ObjectId[];

  @Exclude()
  @expandFromId('qualityControlResults')
  qualityControlResultsFull: Array<QualityControlResults>;

  @Type(() => ObjectId)
  @cascadingDelete()
  qualityControlSessions: ObjectId[];

  @Exclude()
  @expandFromId('qualityControlSessions')
  qualityControlSessionsFull: Array<QualityControlSession>;

  public deleteQualityControlResults(activityCompletion: ObjectId) {
    const index = this.qualityControlResults.findIndex(
      (a) => a.id === activityCompletion.id,
    );
    this.qualityControlResults.splice(index, 1);
    this.qualityControlResultsFull.splice(index, 1);
  }

  qualityScore: number = null;

  @Type(() => ApprovalItem)
  approvalItems: Array<ApprovalItem>;

  @Type(() => SeasonHistoryItem)
  seasonHistory: Array<SeasonHistoryItem>;

  // @Type(() => PaymentSummary)
  // payments: Array<PaymentSummary> = <Array<PaymentSummary>>[];

  // constructor(prodlotType: OriginType[]) {
  //   super();
  //   this.originType = prodlotType;
  // }

  // public addSourceWithContainer(id: ObjectId, containerId: Array<number>) {
  //   if (!containerId) {
  //     throw Error('container ids have to be defined');
  //   } else {
  //     const weight = new SourceRelationshipWeight();
  //     weight.containerId = containerId;
  //     this.sources.push(new SourceRelationshipWeightArrayObject(id, weight));
  //   }
  // }

  // public addSource(id: ObjectId, weightToAdd?: SourceRelationshipWeight) {
  //   if (!weightToAdd) {
  //     weightToAdd = new SourceRelationshipWeight();
  //     weightToAdd.percentage = 100;
  //   }
  //
  //   // console.log("HHEHRRE");
  //
  //   let exists = false;
  //   for (const s of this.sources || []) {
  //     if (s.weight.percentage == 100 && s.ref.id == id.id) {
  //       exists = true;
  //     }
  //   }
  //
  //   if (!exists) {
  //     if (!this.sources) {
  //       this.sources = [];
  //     }
  //     this.sources.push(
  //       new SourceRelationshipWeightArrayObject(id, weightToAdd),
  //     );
  //   }
  // }

  // removeBatch(toRemove: ObjectId) {
  //   const batchToRemove = this.batches.find((b) => {
  //     return b.id == toRemove.id;
  //   });
  //
  //   const batchToRemoveFull = this.batchesFull.find((b) => {
  //     return b.id.id == toRemove.id;
  //   });
  //
  //   if (!batchToRemove) {
  //     throw Error(
  //       `Batch not found in the parent prodlot ${JSON.stringify(toRemove)}`,
  //     );
  //   }
  //   if (!batchToRemoveFull) {
  //     throw Error(
  //       `Batch not found in the parent prodlot - full ${JSON.stringify(
  //         toRemove,
  //       )}`,
  //     );
  //   }
  //
  //   this.batches.splice(this.batches.indexOf(batchToRemove), 1);
  //   this.batchesFull.splice(this.batchesFull.indexOf(batchToRemoveFull), 1);
  // }

  public deleteAnalysis(itemId: ObjectId) {
    const index = this.analyses.findIndex((a) => a.id === itemId.id);
    this.analyses.splice(index, 1);
    const indexFull = this.analysesFull.findIndex((a) => a.id.id === itemId.id);
    this.analysesFull.splice(indexFull, 1);
  }
  //
  // addBatch(batch: Batch) {
  //   if (!this.batches) {
  //     this.batches = [];
  //   }
  //   this.batches.push(batch.id);
  //
  //   if (!this.batchesFull) {
  //     this.batchesFull = [];
  //   }
  //   this.batchesFull.push(batch);
  // }

  getCollection(): string {
    return collectionKeys.prodlots;
  }

  @Expose()
  get location(): Coordinates {
    return this.updatedLocation;
  }

  validateObjectIntegrity() {
    // if (location) {
    //   if (!(location instanceof Location)) {
    //     throw Error("location has to be locationType");
    //   }
    // }
    // if (facility) {
    //   if (!(isObjectIdOfType(facility, "facilities"))) {
    //     throw Error("facilities has to be facilities");
    //   }
    // }
  }
  // get timeFromStart(): number {
  //   const created = moment(this.createdDate);
  //   const now = moment();
  //   const duration = moment.duration(created.diff(now));
  //   const d = duration.asSeconds();
  //   return d;
  // }
}
