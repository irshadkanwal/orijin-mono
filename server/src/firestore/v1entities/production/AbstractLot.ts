import { Transform, Type } from 'class-transformer';
import { cascadingDelete } from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import {
  EvaluationStatus,
  LockStatus,
  LotApprovalStatus,
  LotState,
  ModificationStatus,
  NoteItem,
  PaymentStatus,
  PurchaseStatus,
  SamplePreparationStatus,
  SamplingStatus,
  ShippingStatus,
  StatusHistoryItem,
  TransportStatus,
} from '../utis/types';
import { formatDatesForFS } from '../../v1utils/utils';
// import LotSection from './LotSection';
import ProcessingProperties from './ProcessingProperties';
// import ActivityCompletion from './ActivityCompletion';
// import LotUsageSection from './LotUsageSection';

class AccumulationRefreshType {}

export default abstract class AbstractLot extends AbstractEntity {
  // implements
  // HasProcessingProperties,
  // CanHaveWorkflow,
  // HasActivityCompletions,
  // HasNotes
  workFlowName: string = null;
  hasMovedToNext = false;
  workflowFinished = false;
  lotIdentifier: string = null;
  currentState: string = null;
  lastActivityName: string = null;
  lastActivityType: string = null;
  createdByActivityName: string = null;
  systemState: LotState = null;
  accumulationRefreshType: AccumulationRefreshType = null;

  samplePreparationStatus: SamplePreparationStatus =
    SamplePreparationStatus.NotDone;
  transportStatus: TransportStatus = TransportStatus.NotSet;
  modificationStatus: ModificationStatus = ModificationStatus.NotSet;

  approvalStatusBuyer: LotApprovalStatus = LotApprovalStatus.NotSet;
  shippingStatus: ShippingStatus = ShippingStatus.NotSet;
  purchaseStatus: PurchaseStatus = PurchaseStatus.NotSet;
  samplingStatus: SamplingStatus = SamplingStatus.NotSet;
  evaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
  physicalEvaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
  sensorialEvaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
  phytosanitaryEvaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
  reportStatus: LockStatus = LockStatus.NotSet;
  paymentStatus: PaymentStatus = PaymentStatus.NotSet;

  @Type(() => ObjectId)
  @cascadingDelete()
  paymentTransactions: Array<ObjectId>;

  @Type(() => ObjectId)
  facility: ObjectId = null;

  @Type(() => ObjectId)
  season: ObjectId = null;

  @Type(() => ProcessingProperties)
  processingProperties: ProcessingProperties = new ProcessingProperties();

  @Transform(({ value }) => formatDatesForFS(value))
  startDate: Date = null;

  @Transform(({ value }) => formatDatesForFS(value))
  endDate: Date = null;

  @Type(() => ObjectId)
  @cascadingDelete()
  activityCompletions: Array<ObjectId>;

  // @Exclude()
  // @expandFromId('activityCompletions')
  // activityCompletionsFull: Array<ActivityCompletion>;

  @Type(() => ObjectId)
  // @cascadingDelete()
  lotSections: Array<ObjectId>;

  // @Exclude()
  // @expandFromId('lotSections')
  // lotSectionsFull: Array<LotSection>;

  // @Type(() => LotUsageSection)
  // lotUsageSections: Array<LotUsageSection>;

  @Type(() => StatusHistoryItem)
  statusHistoryItems: Array<StatusHistoryItem>;

  @Type(() => NoteItem)
  noteItems: Array<NoteItem>;

  // get activityCompletionsContributingToTotal(): Array<ActivityCompletion> {
  //   return (this.activityCompletionsFull || []).filter(
  //     (s) => s.aCType != ACType.NotContributingToTotal,
  //   );
  // }

  // get lastActivityCompletion(): ActivityCompletion {
  //   return this.activityCompletionsInOrder[0];
  // }

  // get activityCompletionsInOrder(): Array<ActivityCompletion> {
  //   const r = (this.activityCompletionsFull || []).sort((a, b) => {
  //     if (a.createdDate > b.createdDate) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });
  //   return r;
  // }

  // get activityCompletionsInReverseOrder(): Array<ActivityCompletion> {
  //   const r = (this.activityCompletionsFull || []).sort((a, b) => {
  //     if (a.createdDate > b.createdDate) {
  //       return 1;
  //     } else {
  //       return -1;
  //     }
  //   });
  //   return r;
  // }
  //
  // public deleteActivityCompletion(activityCompletion: ObjectId) {
  //   const index = this.activityCompletions.findIndex(
  //     (a) => a.id === activityCompletion.id,
  //   );
  //   this.activityCompletions.splice(index, 1);
  //   this.activityCompletionsFull.splice(index, 1);
  // }
  // public deleteLotSection(activityCompletion: ObjectId) {
  //   const index = this.lotSections.findIndex(
  //     (a) => a.id === activityCompletion.id,
  //   );
  //   this.lotSections.splice(index, 1);
  //   this.lotSectionsFull.splice(index, 1);
  // }
  //
  // public addActivityCompletion(activityCompletion: ActivityCompletion) {
  //   if (!this.activityCompletions) {
  //     this.activityCompletions = [];
  //   }
  //   if (!this.activityCompletionsFull) {
  //     this.activityCompletionsFull = [];
  //   }
  //   for (const ac of this.activityCompletionsFull) {
  //     ac.hasMovedToNext = true;
  //   }
  //
  //   this.activityCompletions.push(activityCompletion.id);
  //   this.activityCompletionsFull.push(activityCompletion);
  // }

  setWorkFlowId(id: ObjectId) {
    this.id.workflowId = id;
  }

  setChainId(id: string) {
    this.id.chainId = id;
  }
}
