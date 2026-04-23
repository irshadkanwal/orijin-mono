"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _client = require("@prisma/client");
const paymentTransactionWithRelations = _client.Prisma.validator()({
    include: {
        farm: {
            include: {
                facility: true
            }
        },
        lot: true
    }
});
 // import {
 //   BaseModel,
 //   BaseSeasonalModel,
 //   ID,
 // } from '../../common/models/base.model';
 // export class ProdPaymentTransaction extends BaseModel {
 // workFlowName: string = null;
 // hasMovedToNext: boolean;
 // workflowFinished: boolean;
 // paymentTransactionIdentifier: string = null;
 // currentState: string = null;
 // lastActivityName: string = null;
 // lastActivityType: string = null;
 // createdByActivityName: string = null;
 // systemState: PaymentTransactionState = null;
 // accumulationRefreshType: AccumulationRefreshType = null;
 //
 // samplePreparationStatus: SamplePreparationStatus = SamplePreparationStatus.NotDone;
 // transportStatus: TransportStatus = TransportStatus.NotSet;
 // modificationStatus: ModificationStatus = ModificationStatus.NotSet;
 //
 // approvalStatusBuyer: PaymentTransactionApprovalStatus = PaymentTransactionApprovalStatus.NotSet;
 // shippingStatus: ShippingStatus = ShippingStatus.NotSet;
 // purchaseStatus: PurchaseStatus = PurchaseStatus.NotSet;
 // samplingStatus: SamplingStatus = SamplingStatus.NotSet;
 // evaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
 // physicalEvaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
 // sensorialEvaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
 // phytosanitaryEvaluationStatus: EvaluationStatus = EvaluationStatus.NotSet;
 // reportStatus: LockStatus = LockStatus.NotSet;
 // paymentStatus: PaymentStatus = PaymentStatus.NotSet;
 //
 //
 // paymentTransactions: Array<ObjectId>;
 //
 //
 // facility: ObjectId = null;
 //
 //
 // season: ObjectId = null;
 //
 // processingProperties: ProcessingProperties = new ProcessingProperties();
 //
 // startDate: Date = null;
 //
 // endDate: Date = null;
 //
 // activityCompletions: Array<ObjectId>;
 // activityCompletionsFull: Array<ActivityCompletion>;
 //
 // paymentTransactionSections: Array<ObjectId>;
 //
 // paymentTransactionSectionsFull: Array<PaymentTransactionSection>;
 //
 // paymentTransactionUsageSections: Array<PaymentTransactionUsageSection>;
 //
 // statusHistoryItems: Array<StatusHistoryItem>;
 //
 // noteItems: Array<NoteItem>;
 //
 // origin: boolean;
 // endProduct: boolean;
 // hasBeenSampled: boolean;
 //
 // originType: OriginType[] = null;
 // prodpaymentTransactionType: ProdPaymentTransactionType = null;
 // accumulationType: AccumulationType = null;
 //
 // accumulationWeightKey: AccumulationWeightKey = null;
 // currentVesselId: ObjectId = null;
 // previousVesselId: ObjectId = null;
 // batches: Array<ObjectId>;
 // batchesFull: Array<Batch>;
 // sources: Array<SourceRelationshipWeightArrayObject>;
 // singleSourceRef: ObjectId
 // samples: Array<ObjectId>;
 //
 // samplesFull: Array<ProdPaymentTransaction>;
 //
 // followingProdpaymentTransactionIds: Array<ObjectId>;
 // originPropertiesId: ObjectId;
 //
 // originProperties: OriginProperties;
 //
 //
 // tag: ObjectId = null;
 //
 //
 // tags: ObjectId[] = [];
 //
 // tagsIdLabels: string[] = [];
 //
 // tagStrings: [] = [];
 //
 // analyses: ObjectId[];
 // analysesFull: Array<Analysis>;
 // qualityControlResults: ObjectId[];
 //
 // qualityControlResultsFull: Array<QualityControlResults>;
 // qualityControlSessions: ObjectId[];
 // qualityControlSessionsFull: Array<QualityControlSession>;
 //
 // qualityScore: number = null;
 //
 // @Type(() => ApprovalItem)
 // approvalItems: Array<ApprovalItem>;
 //
 // @Type(() => SeasonHistoryItem)
 // seasonHistory: Array<SeasonHistoryItem>;
 // }
