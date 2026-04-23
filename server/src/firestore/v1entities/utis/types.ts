import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from './ObjectId';
import {
  GetOneInput,
  PaginationAndSortingDto,
  PaginationAndSortingOutputDto,
} from '../../../common/dto/paginationAndSorting.dto';
import { Transform, Type } from 'class-transformer';
import ProcessingProperties from '../production/ProcessingProperties';
import ActivityCompletion from '../production/ActivityCompletion';
import PricePerWeight from '../production/PricePerWeight';
import { formatDatesForFS } from '../../v1utils/utils';

export interface CanHaveWorkflow {
  workFlowName: string;
  workflowFinished: boolean;
  systemState: LotState;
  currentState: string;
  hasMovedToNext: boolean;
  setWorkFlowId(id: ObjectId);
  setChainId(id: string);
}

export enum ACType {
  Multi = 'Multi',
  NotContributingToTotal = 'NotContributingToTotal',
  DontCreate = 'DontCreate',
  Standard = 'Standard',
  Single = 'Single',
}

export class MFSRegistration {
  externalId?: string = null;
  phone?: string = null;
  firstName?: string = null;
  lastName?: string = null;

  errorMsg?: string;
  mobileMoneyRecipientIsDifferentPerson?: boolean;
  updateProducerPhone?: boolean;

  phone_is_supported?: string;
  phone_is_mm_registered?: string;
  name_on_network?: string;
  name_matches_network_status?: string;
  name_matches_network_score?: number;
}

export class ExternalSystemAccount {
  systemName: string = null;
  type: string = null;
  externalId?: string = null;
  phone: string = null;
  firstName: string = null;
  lastName: string = null;
  info?: MFSRegistration = null;
  infoPhoneNumberOwner?: MFSRegistration = null;
}

export class PaymentSummary {
  externalId?: string;

  targetAccountId: string = null;
  targetFirstName: string = null;
  targetLastName: string = null;
  amount: number = null;
  currency: string = null;

  paymentStatus?: string = null;
  externalStatus: string = null;
  errorMsg: string = null;

  updatedDate: Date;

  paymentTransaction: ObjectId;

  productionEntity: ObjectId = null;

  productionEntityParent: ObjectId = null;

  producerEntity: ObjectId = null;
}

export class SeasonHistoryItem {
  quantityProcessedRaw?: number;
  quantityProcessedProcessed?: number;

  @Type(() => ObjectId)
  season: ObjectId;
}

export interface HasProcessingProperties {
  processingProperties: ProcessingProperties;
}

export class ApprovalItem {
  note: string;
  approvalStatus: LotApprovalStatus;

  @Transform(({ value }) => formatDatesForFS(value))
  date: Date;

  @Type(() => ObjectId)
  user: ObjectId;

  isBuyer: boolean;
}

export enum AccumulationType {
  None = 'None',
  ProdLot = 'ProdLot',
  AE = 'AE',
  LotSection = 'LotSection',
  LotSectionSource = 'LotSectionSource',
  Batch = 'Batch',
}
export enum AccumulationWeightKey {
  beforeWeight = 'beforeWeight',
  afterWeight = 'afterWeight',
}

export enum ProdLotType {
  Group = 'Group',
  Sample = 'Sample',
  Single = 'Single',
}

export enum OriginType {
  Tree = 'Tree',
  Plot = 'Plot',
  Variety = 'Variety',
  Location = 'Location',
  LocationParent = 'LocationParent',
  Product = 'Product',
  DayColour = 'DayColour',
  Facility = 'Facility',
  Season = 'Season',
  Operator = 'Operator',
  Farm = 'Farm',
}

export type LotStatusType =
  | 'samplePreparationStatus'
  | 'transportStatus'
  | 'modificationStatus'
  | 'approvalStatus'
  | 'approvalStatusBuyer'
  | 'shippingStatus'
  | 'purchaseStatus'
  | 'samplingStatus'
  | 'evaluationStatus'
  | 'physicalEvaluationStatus'
  | 'sensorialEvaluationStatus'
  | 'phytosanitaryEvaluationStatus'
  | 'reportStatus'
  | 'systemState'
  | string;

export type LotStatusTypeValue =
  | 'Open'
  | 'Public'
  | 'Origin'
  | 'Private'
  | 'EndProduct'
  | 'Archived'
  | 'Closed'
  | 'NotSet'
  | 'InTransport'
  | 'NotReady'
  | 'Ready'
  | 'Received'
  | 'CanModify'
  | 'CanModifyNonEssentials'
  | 'Done'
  | 'NotDone'
  | 'Approved'
  | 'Rejected'
  | 'Discarded'
  | 'TentativelyApproved'
  | 'Locked'
  | 'Unlocked'
  | 'Shipped'
  | 'NotShipped'
  | 'Sampled'
  | 'InSampling'
  | 'NotSampled'
  | 'Purchased'
  | 'NotPurchased'
  | 'Started'
  | 'InProgress'
  | 'Evaluated'
  | 'NotEvaluated'
  | string;
export interface HasNotes {
  noteItems: Array<NoteItem>;
}

export class StatusHistoryItem {
  note: string;
  statusType: LotStatusType;
  value: LotStatusTypeValue;
  activityName: string;

  @Transform(({ value }) => formatDatesForFS(value))
  date: Date;

  @Type(() => ObjectId)
  user: ObjectId;
}

export class NoteItem {
  note: string;
  sourceActivity: string;
  id: string;

  @Transform(({ value }) => formatDatesForFS(value))
  date: Date;

  @Type(() => ObjectId)
  user: ObjectId;
}

export interface HasDocuments {
  documents: FileDocument[];
}

export interface HasActivityCompletions {
  activityCompletions: Array<ObjectId>;
  addActivityCompletion(item: ActivityCompletion);
}

export interface PriceSuggestionContainer {
  money?: IAmountUnit;
  pricePerWeight: PricePerWeight;
  increasePayDetails?: PricePerWeight;
  increasePayDetailsStr?: string;
  priceIncrease?: IAmountUnit;
  priceIncreaseString?: string;
  pricePerUnitString: string;
  weightOfContainerString?: string;
  netWeightString?: string;
  netWeight?: IAmountUnit;
  pricePerWeightString: string;
}
interface PaymentItem {
  accountId: string;
  name: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentInstruction {
  accountId: string;
  name: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PayoutResponse {
  id: number;
  organization: number;
  amount: number;
  currency: string;
  account: number;
  payment_type: string;
  description: string;
  state: string;
  last_error: string;
  rejected_reason: string;
  rejected_by: string;
  rejected_time: string;
  cancelled_reason: string;
  cancelled_by: string;
  cancelled_time: string;
  created: string;
  author: number;
  modified: string;
  updated_by: number;
  start_date: string;
  send_sms_message: boolean;
  charged_fee: number;
  payment_fx_details: string;
  amount_in_send_currency: boolean;
}

export interface TransactionData {
  id?: number;
  paymentId: number;
  organizationId: number;
  amount: string;
  status?: string;
  currency: string;
  paymentType: string;
  accout: number;
  transactionType?: string;
}

export interface PayoutRequestSingle {
  phonenumber: string;
  first_name: string;
  last_name: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  payment_type: string;
}
export interface PaymentWebHookRequest {
  id: string;
  state: string;
}

export interface PayoutRequestMulti {
  instructions: PaymentInstruction[];
  entity: {
    id: string;
    refcollection: string;
  };
  meta_workspace: string;
  meta_organisation: string;
}
export enum PaymentType {
  NotSet = 'NotSet',
  MobilePay = 'MobilePay',
  Cash = 'Cash',
  Credit = 'Credit',
  Cheque = 'Cheque',
}

export enum LotState {
  Open = 'Open',
  Public = 'Public',
  Origin = 'Origin',
  Private = 'Private',
  EndProduct = 'EndProduct',
  Archived = 'Archived',
  Closed = 'Closed',
}
export enum TransportStatus {
  NotSet = 'NotSet',
  InTransport = 'InTransport',
  NotReady = 'NotReady',
  Ready = 'Ready',
  Received = 'Received',
}
export enum ModificationStatus {
  NotSet = 'NotSet',
  CanModify = 'CanModify',
  CanModifyNonEssentials = 'CanModifyNonEssentials',
  Closed = 'Closed',
}
export enum SamplePreparationStatus {
  Done = 'Done',
  NotDone = 'NotDone',
}

export enum InspectionApprovalStatus {
  NotSet = 'NotSet',
  Approved = 'Approved',
  ApprovedWithConditions = 'ApprovedWithConditions',
  Rejected = 'Rejected',
}
export enum CreationStatus {
  NotSet = 'NotSet',
  DataImport = 'DataImport',
  ByUser = 'ByUser',
  InBuying = 'InBuying',
}

export enum FormSubmissionType {
  NotSet = 'NotSet',
  StandardSubmission = 'StandardSubmission',
  DeferredSubmission = 'DeferredSubmission',
  DeferredTotalsCalculations = 'DeferredTotalsCalculations',
}

export enum ReviewStatus {
  NotSet = 'NotSet',
  NeedsReview = 'NeedsReview',
  InReview = 'InReview',
  Rejected = 'Rejected',
  Approved = 'Approved',
  TentativelyApproved = 'TentativelyApproved',
  ApprovedWithConditions = 'ApprovedWithConditions',
}

export enum FarmSystemStatus {
  NotSet = 'NotSet',
  Active = 'Active',
  InActive = 'InActive',
  Suspended = 'Suspended',
}

export enum LotApprovalStatus {
  NotSet = 'NotSet',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Discarded = 'Discarded',
  TentativelyApproved = 'TentativelyApproved',
}

export enum PaymentStatus {
  NotSet = 'NotSet',
  Created = 'Created',
  InProgress = 'InProgress',
  Draft = 'Draft',
  ActionRequired = 'ActionRequired',
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  CompletedWithError = 'CompletedWithError',
  Error = 'Error',
}

export interface IAmountUnit {
  amount: number;
  unit: string;
}
export enum RegistrationStatus {
  NotSet = 'NotSet',
  InProgress = 'InProgress',
  Draft = 'Draft',
  Completed = 'Completed',
  ActionRequired = 'ActionRequired',
  NameMismatch = 'NameMismatch',
  CompletedWithError = 'CompletedWithError',
  Error = 'Error',
}

export enum LockStatus {
  NotSet = 'NotSet',
  Locked = 'Locked',
  Unlocked = 'Unlocked',
}

export enum ShippingStatus {
  NotSet = 'NotSet',
  Shipped = 'Shipped',
  NotShipped = 'NotShipped',
}

export enum SamplingStatus {
  NotSet = 'NotSet',
  Sampled = 'Sampled',
  InSampling = 'InSampling',
  NotSampled = 'NotSampled',
}
export enum PurchaseStatus {
  NotSet = 'NotSet',
  Purchased = 'Purchased',
  NotPurchased = 'NotPurchased',
}

export enum EvaluationStatus {
  NotSet = 'NotSet',
  Started = 'Started',
  InProgress = 'InProgress',
  Evaluated = 'Evaluated',
  NotEvaluated = 'NotEvaluated',
}

export class ObjectIdUser extends ObjectId {
  constructor(id: string, email: string) {
    super(id, collectionKeys.platformusers);
    this.email = email;
  }
}
export interface IUserInfo {
  displayName?: string | null;
  email: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  providerId?: string;
  uid: string;
}

export type AdditionalUserInfo = {
  isNewUser: boolean;
  profile: any | null;
  providerId: string;
  username?: string | null;
};

export interface ISignupParams {
  email: string;
  password: string;
  displayName?: string;
  accessControlRole?: string;
}

export class AuthCredential {
  providerId: string;
  signInMethod: string;
}

export type UserCredential = {
  additionalUserInfo?: AdditionalUserInfo | null;
  credential: AuthCredential | null;
  operationType?: string | null;
  user: IUserInfo | null;
};
export class GoogleApiCredential {
  public accessToken: string = null;
  public refreshToken: string = null;
  public scope: string = null;
  public expiryDate: Date = null;
  public idToken: string = null;

  constructor(
    accessToken: string,
    refreshToken: string,
    expiryDate: Date,
    idToken: string,
    scope: string,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.scope = scope;
    this.expiryDate = expiryDate;
    this.idToken = idToken;
  }
}

export class LocationsFilter extends PaginationAndSortingDto {
  organisation: string;
}

export interface V2Service<T extends V1Id> {
  getOne(params: GetOneInput): Promise<T>;
  getMany(filters: LocationsFilter): Promise<PaginationAndSortingOutputDto<T>>;
}

export interface V1Id {
  id: string;
  shortCode?: string;
}

export interface Meta {
  userId?: {
    id: string;
    refcollection: string;
  };
  season?: {
    id: string;
    refcollection: string;
  };
  workspace: string;
  organisation: string;
  configKey: string;
  token?: string;
  values?: any;
  onlyCreate?: boolean;
}

export type StorageDocument = {
  name: string;
  type: string;
  url?: string;
  uid?: string;
  storagePath?: string;
  publicUrl?: string;
  language?: string;
  lastModified?: Date;
  index?: number;
  isLocked?: boolean;

  source?: 'file' | 'image' | 'camera' | 'signature';
  targetProperty?: string;
  sourceProperty?: string;

  size?: number;

  id?: ObjectId;
};

export type FileDocument = StorageDocument & {
  note?: string;
};
