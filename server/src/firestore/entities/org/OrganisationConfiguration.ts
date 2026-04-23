import { Type } from 'class-transformer';
import { AbstractEntity } from '../utils/AbstractEntity';
import { ObjectId } from '../utils/ObjectId';
import { collectionKeys } from '../utils/DbMappingUtils';

export interface GeneralConfig {
  masterWorkspace?: string;
  testWorkspace?: string;
  standardDateTimeFormat?: string;
  phoneCountryCode?: string;
  standardWeightUnit?: string;
  phoneValidationRegex?: string;
  standardAreaUnitForImport?: string;
  standardDateFormat?: string;
  phoneValidationPhoneOnlyRegex?: string;
  standardRounding?: string;
  standardAreaUnit?: string;
}

export interface LocalityConfig {
  defaultLocale: string;
  defaultCountryCode: string;
  defaultCurrencyUnit: string;
  defaultTemperatureUnit: string;
  availableWeightUnits: string[];
  defaultWeightUnit: string;
  availableCurrencyUnits: string[];
  defaultCountry: string[];
  availableLocales: string[];
  availableTemperatureUnits: string[];
}

export interface PaymentConfig {
  mobilePaymentProvider?: string;
  mobilePayEnabled: boolean;
}

class OrganisationConfig extends AbstractEntity {
  isDeleted: boolean;
  isArchived: boolean;
  enabled: boolean;
  approvalStatus?: any; // Marked optional
  creationStatus?: any; // Marked optional
  sourceSystem?: string | null = null;
  statusReason?: string | null = null;
  meta_configkey?: string;
  systemStatus?: string | null = null;
  v1ToV2Status?: any; // Marked optional
  reviewStatus?: any; // Marked optional
  v1ToV2StatusOriginal?: any; // Marked optional
  meta_workspace?: any; // Marked optional
  admins?: Array<ObjectId> = [];
  @Type(() => ObjectId)
  users?: Array<ObjectId> = [];
  @Type(() => ObjectId)
  workspaces?: Array<ObjectId> = [];

  @Type(() => Object)
  config?: {
    general?: GeneralConfig;
    locality?: LocalityConfig;
    payment?: PaymentConfig;
    customLocationHierarchy?: any; // Marked optional
    locationHierarchy?: any; // Marked optional
  };

  constructor() {
    super();
  }

  getCollection(): string {
    return collectionKeys.organisation_config;
  }
  addUser(userId: ObjectId) {
    this.users.push(userId);
  }

  addWorkspace(workspace: ObjectId) {
    this.workspaces.push(workspace);
  }
  addAdmin(user: ObjectId) {
    this.admins.push(user);
  }
}

export default OrganisationConfig;
