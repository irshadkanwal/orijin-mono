import {
  ClassConstructor,
  classToPlain,
  plainToClass,
  plainToClassFromExist,
} from 'class-transformer';
import { collectionKeys } from './dbMappingUtils';
import VarietyV1 from '../v1entities/refdata/VarietyV1';
import TrainingSessionV1 from '../v1entities/services/TrainingSessionV1';
import TrainingV1 from '../v1entities/services/TrainingV1';
import TrainingTypeV1 from '../v1entities/services/TrainingTypeV1';
import SeasonV1 from '../v1entities/refdata/SeasonV1';
import ProductV1 from '../v1entities/refdata/ProductV1';
import Farm from '../v1entities/farms/Farm_minV1';
import VarietyPriceV1 from '../v1entities/refdata/VarietyPriceV1';
import FacilityV1 from '../v1entities/refdata/FacilityV1';
import UserV1 from '../v1entities/org/UserV1';

import { AbstractEntity } from '../v1entities/utis/AbstractEntity';
import FormSubmissionV1 from '../v1entities/general/FormSubmissionV1';
import EventV1 from '../v1entities/general/EventV1';
import OrganisationV1 from '../v1entities/org/OrganisationV1';
import { WalletV1 } from '../v1entities/payments/WalletV1';
import { PaymentTransactionV1 } from '../v1entities/payments/PaymentTransactionV1';
import Analysis from '../v1entities/quality/Analysis';
import OriginProperties from '../v1entities/production/OriginProperties';
import WorkspaceV1 from '../v1entities/org/WorkspaceV1';
import AccountV1 from '../v1entities/org/AccountV1';
import LocationV1 from '../v1entities/refdata/LocationV1';
import { ContactV1 } from '../v1entities/farms/ContactV1';
import ActivityCompletion from '../v1entities/production/ActivityCompletion';
import LotSection from '../v1entities/production/LotSection';
import Address from '../v1entities/refdata/Address';
import QualityControlResultSubmission from '../v1entities/quality/QualityControlResultSubmission';
import QualityControlResults from '../v1entities/quality/QualityControlResults';
import QualityControlSession from '../v1entities/quality/QualityControlSession';
import Coordinates from '../v1entities/utis/Coordinates';
import { PendingTaskV1 } from '../v1entities/general/PendingTaskV1';
import WorkflowScope from '../v1entities/general/WorkflowScope';
import ProdLot from '../v1entities/production/ProdLot';
import PriceContainer from '../v1entities/utis/PriceContainer';
import GeoDataV1 from '../v1entities/refdata/GeoDataV1';
import LatLong from '../v1entities/refdata/LatLong';
import ActivityLog from '../v1entities/general/ActivityLog';
import AuditActivityV1 from '../v1entities/general/AuditActivityV1';
import PlotV1 from '../v1entities/farms/PlotV1';
import EntitySurvey from '../v1entities/general/EntitySurvey';
import VesselV1 from '../v1entities/refdata/VesselV1';
import Contract from '../v1entities/farms/Contract';
import CertificationV1 from '../v1entities/certification/CertificationV1';
import AnimalCount from '../v1entities/farms/AnimalCount';
import AnimalType from '../v1entities/refdata/AnimalType';
import CertificationTypeV1 from '../v1entities/certification/CertificationTypeV1';
import PlantType from '../v1entities/refdata/PlantType';
import NonComplianceV1 from '../v1entities/certification/NonComplianceV1';
import AuditEntryV1 from '../v1entities/general/AuditEntryV1';
import UploadDocument from '../v1entities/general/UploadDocument';
import UploadDocumentChunk from '../v1entities/general/UploadDocumentChunk';
import Tag from '../v1entities/general/Tag';
import Configuration from '../v1entities/general/Configuration';
import InspectionRecord from '../v1entities/general/InspectionRecord';
import CropV1 from '../v1entities/refdata/CropV1';
import FarmV1 from '../v1entities/farms/FarmV1';
import Farm_minV1 from '../v1entities/farms/Farm_minV1';

export function cleanedObjectForPrint(newVar: any): any {
  const newObject: any = mapToPlain(newVar);

  const replace = '<VALUE_REMOVED_FOR_PRINTING>';
  replacePropertyValue(newObject, 'picture', replace);
  replacePropertyValue(newObject, 'image', replace);

  return newObject;
}

export function cleanedObjectForPrintNoMapping(newVar: any): any {
  const newObject: any = JSON.parse(JSON.stringify(newVar));

  const replace = '<VALUE_REMOVED_FOR_PRINTING>';
  replacePropertyValue(newObject, 'picture', replace);
  replacePropertyValue(newObject, 'image', replace);

  return newObject;
}

function replacePropertyValue(obj: any, label: string, replace: string): void {
  if (obj[label]) {
    obj[label] = replace;
    return;
  }

  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] instanceof Object) {
        replacePropertyValue(obj[i], label, replace);
      }
    }
  }
  return;
}

export function clone(object: any): any {
  return JSON.parse(JSON.stringify(object));
}

export function mapToPlain<T>(entity: T): any {
  const result = classToPlain(entity);
  return result;
}

export function mapOneObjectFromPlain(
  plainObject: any,
  collection: string,
): any {
  const classType: ClassConstructor<AbstractEntity> = getClassType(collection);

  cleanPlainObjectDates(plainObject);
  if (plainObject instanceof classType) {
    console.log('mapOneObjectFromPlain: already converted ', plainObject);
    return plainObject;
  } else {
    // console.log("plainToClass", plainObject);
    return plainToClass(classType, plainObject);
  }
}

function cleanPlainObjectDates(obj: any): void {
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] === undefined) {
        delete obj[i];
      } else if (obj[i] instanceof Array) {
        const array = obj[i];
        for (const a of array) {
          if (a instanceof Object) {
            cleanPlainObjectDates(a);
          }
        }
      } else if (obj[i] instanceof Object) {
        if (obj[i].toDate) {
          obj[i] = { seconds: obj[i].seconds, nanoseconds: obj[i].nanoseconds };
        } else {
          cleanPlainObjectDates(obj[i]);
        }
      }
    }
  }
}

export function mapFromPlain<T>(instance: T, plainObject: any): T {
  // let plain = addUnderscore(plainObject, null);
  const result = plainToClassFromExist(instance, plainObject);
  return result;
}

export function mapPlainToClass<T>(
  cls: ClassConstructor<T>,
  plainObject: any,
): T {
  // let plain = addUnderscore(plainObject, null);
  const result = plainToClass(cls, plainObject);
  return result;
}

export function loadTypeById<T>(
  id: string,
  cls: ClassConstructor<T>,
  array: any,
): T {
  if (id == undefined || id == null) {
    throw Error('ID has to be defined' + id);
  }

  const json: any = array[id];

  if (json === undefined) {
    throw Error('item not defined in json ' + id);
  }

  const result: T = <T>plainToClass(cls, json);

  //_id
  //hack because I didn't manage to export the HasId interface
  const r = result as any;
  r['id'] = id;
  //result.setId(id);
  return r;
}

export function getClassType(refcollection: string): any {
  if (refcollection.indexOf('_wip') >= 0) {
    refcollection = refcollection.substring(0, refcollection.indexOf('_wip'));
  }
  switch (refcollection) {
    case collectionKeys.organisations:
      return OrganisationV1;
    case collectionKeys.formsubmissions:
      return FormSubmissionV1;
    case collectionKeys.events:
      return EventV1;
    case collectionKeys.events_error:
      return EventV1;
    case collectionKeys.formsubmissions_completed:
      return FormSubmissionV1;
    case collectionKeys.formsubmissions_error:
      return FormSubmissionV1;
    // case collectionKeys.auditentries:
    //   return AuditEntry;
    case collectionKeys.paymenttransactions:
      return PaymentTransactionV1;
    case collectionKeys.wallets:
      return WalletV1;
    case collectionKeys.analyses:
      return Analysis;
    case collectionKeys.originproperties:
      return OriginProperties;
    case collectionKeys.auditactivities:
      return AuditActivityV1;
    case collectionKeys.activitylogs:
      return ActivityLog;
    case collectionKeys.workspaces:
      return WorkspaceV1;
    case collectionKeys.platformusers:
      return AccountV1;
    case collectionKeys.vessels:
      return VesselV1;
    case collectionKeys.plots:
      return PlotV1;
    case collectionKeys.documents:
      return UploadDocument;
    case collectionKeys.documentchunks:
      return UploadDocumentChunk;
    case collectionKeys.tags:
      return Tag;
    case collectionKeys.products:
      return ProductV1;
    case collectionKeys.facilities:
      return FacilityV1;
    case collectionKeys.farms:
      return FarmV1;
    case collectionKeys.farms_min:
      return Farm_minV1;
    // case collectionKeys.vesselTypes:
    //   return VesselType;
    case collectionKeys.varietyprices:
      return VarietyPriceV1;
    case collectionKeys.varieties:
      return VarietyV1;
    case collectionKeys.crops:
      return CropV1;
    case collectionKeys.users:
      return UserV1;
    case collectionKeys.contracts:
      return Contract;
    case collectionKeys.certifications:
      return CertificationV1;
    case collectionKeys.animalcounts:
      return AnimalCount;
    case collectionKeys.surveys:
      return EntitySurvey;
    case collectionKeys.seasons:
      return SeasonV1;
    case collectionKeys.contacts:
      return ContactV1;
    // case collectionKeys.noncompliances:
    //   return ComplianceItem;
    // case collectionKeys.servicecategories:
    //   return ServiceCategory;
    // case collectionKeys.serviceactivities:
    //   return ServiceActivity;
    // case collectionKeys.services:
    //   return Service;
    // case collectionKeys.serviceactivitybeneficiaries:
    //   return ServiceActivityBeneficiary;
    // case collectionKeys.serviceactivityoutputs:
    //   return ServiceActivityOutput;
    case collectionKeys.certificationtypes:
      return CertificationTypeV1;
    // case collectionKeys.inspectionrecords:
    //   return InspectionRecord;
    case collectionKeys.animaltypes:
      return AnimalType;
    case collectionKeys.locations:
      return LocationV1;
    // case collectionKeys.batches:
    //   return Batch;
    // case collectionKeys.labelqueue:
    //   return LabelQueueEntry;
    case collectionKeys.prodlots:
      return ProdLot;
    // case collectionKeys.testobjects:
    //   return TestObject;
    // case collectionKeys.testchildren:
    //   return TestChild;
    case collectionKeys.activitycompletions:
      return ActivityCompletion;
    case collectionKeys.lotsections:
      return LotSection;
    case collectionKeys.planttypes:
      return PlantType;
    case collectionKeys.geodatas:
      return GeoDataV1;
    case collectionKeys.price:
      return PriceContainer;
    case collectionKeys.address:
      return Address;
    case collectionKeys.coordinates:
      return Coordinates;
    // case collectionKeys.globalQrCodeLinks:
    //   return QrCodeLink;
    // case collectionKeys.stories:
    //   return Story;
    // case collectionKeys.storyQrCodeLinks:
    //   return StoryQrCodeLink;
    case collectionKeys.pendingtasks:
      return PendingTaskV1;
    case collectionKeys.workflowscopes:
      return WorkflowScope;
    case collectionKeys.configurations:
      return Configuration;
    case collectionKeys.qualitycontrolsessions:
      return QualityControlSession;
    case collectionKeys.qualitycontrolresults:
      return QualityControlResults;
    case collectionKeys.qualitycontrolresultsubmissions:
      return QualityControlResultSubmission;
    // case collectionKeys.exports:
    //   return ExportProperties;
    case collectionKeys.trainings:
      return TrainingV1;
    case collectionKeys.trainingsessions:
      return TrainingSessionV1;
    case collectionKeys.trainingtypes:
      return TrainingTypeV1;
    default:
      throw Error('not supported getClassType:' + refcollection + '.');
  }
}

export function initClassType(refcollection: string): any {
  if (refcollection.indexOf('_wip') >= 0) {
    refcollection = refcollection.substring(0, refcollection.indexOf('_wip'));
  }

  switch (refcollection) {
    case collectionKeys.pendingtasks:
      return new PendingTaskV1();
    case collectionKeys.workflowscopes:
      return new WorkflowScope();
    // case collectionKeys.stories:
    //   return new Story();
    // case collectionKeys.storyQrCodeLinks:
    //   return new StoryQrCodeLink();
    case collectionKeys.configurations:
      return new Configuration();
    // case collectionKeys.globalQrCodeLinks:
    //   return new QrCodeLink();
    case collectionKeys.vessels:
      return new VesselV1();
    case collectionKeys.plots:
      return new PlotV1();
    case collectionKeys.documents:
      return new UploadDocument();
    case collectionKeys.documentchunks:
      return new UploadDocumentChunk();
    case collectionKeys.tags:
      return new Tag();
    case collectionKeys.products:
      return new ProductV1();
    case collectionKeys.facilities:
      return new FacilityV1();
    case collectionKeys.farms:
      return new FarmV1();
    case collectionKeys.formsubmissions:
      return new FormSubmissionV1();
    case collectionKeys.formsubmissions_completed:
      return new FormSubmissionV1();
    case collectionKeys.events:
      return new EventV1();
    case collectionKeys.varietyprices:
      return new VarietyPriceV1();
    case collectionKeys.varieties:
      return new VarietyV1();
    case collectionKeys.crops:
      return new CropV1();
    case collectionKeys.contracts:
      return new Contract();
    case collectionKeys.certifications:
      return new CertificationV1();
    case collectionKeys.animalcounts:
      return new AnimalCount();
    case collectionKeys.surveys:
      return new EntitySurvey();
    case collectionKeys.trainings:
      return new TrainingV1();
    case collectionKeys.trainingsessions:
      return new TrainingSessionV1();
    case collectionKeys.trainingtypes:
      return new TrainingTypeV1();
    case collectionKeys.seasons:
      return new SeasonV1();
    case collectionKeys.contacts:
      return new ContactV1();
    case collectionKeys.noncompliances:
      return new NonComplianceV1();
    // case collectionKeys.serviceactivities:
    //   return new ServiceActivity();
    // case collectionKeys.servicecategories:
    //   return new ServiceCategory();
    // case collectionKeys.services:
    //   return new Service();
    // case collectionKeys.serviceactivitybeneficiaries:
    //   return new ServiceActivityBeneficiary();
    // case collectionKeys.serviceactivityoutputs:
    //   return new ServiceActivityOutput();
    case collectionKeys.certificationtypes:
      return new CertificationTypeV1();
    case collectionKeys.inspectionrecords:
      return new InspectionRecord();
    case collectionKeys.animaltypes:
      return new AnimalType();
    case collectionKeys.users:
      return new UserV1();
    case collectionKeys.locations:
      return new LocationV1();
    // case collectionKeys.batches:
    //   return new Batch();
    case collectionKeys.prodlots:
      return new ProdLot();
    // case collectionKeys.testobjects:
    //   return new TestObject();
    case collectionKeys.activitycompletions:
      return new ActivityCompletion();
    case collectionKeys.lotsections:
      return new LotSection();
    case collectionKeys.planttypes:
      return new PlantType();
    case collectionKeys.geodatas:
      return new GeoDataV1();
    case collectionKeys.activitylogs:
      return new ActivityLog();
    case collectionKeys.price:
      return new PriceContainer();
    case collectionKeys.address:
      return new Address();
    case collectionKeys.auditentries:
      return new AuditEntryV1();
    case collectionKeys.paymenttransactions:
      return new PaymentTransactionV1();
    case collectionKeys.wallets:
      return new WalletV1();
    case collectionKeys.analyses:
      return new Analysis();
    case collectionKeys.originproperties:
      return new OriginProperties();
    case collectionKeys.auditactivities:
      return new AuditActivityV1();
    case collectionKeys.qualitycontrolsessions:
      return new QualityControlSession();
    case collectionKeys.qualitycontrolresults:
      return new QualityControlResults();
    case collectionKeys.qualitycontrolresultsubmissions:
      return new QualityControlResultSubmission();
    case collectionKeys.coordinates:
      return new Coordinates(new LatLong(null, null), null);
    default:
      throw Error('not supported ' + refcollection);
  }
}

export function getCollectionKeyByClass(cls: any): string {
  switch (cls) {
    case AuditEntryV1:
      return collectionKeys.auditentries;
    case PaymentTransactionV1:
      return collectionKeys.paymenttransactions;
    case WalletV1:
      return collectionKeys.wallets;
    case Analysis:
      return collectionKeys.analyses;
    case OriginProperties:
      return collectionKeys.originproperties;
    case AuditActivityV1:
      return collectionKeys.auditactivities;
    case ActivityCompletion:
      return collectionKeys.activitycompletions;
    case LotSection:
      return collectionKeys.lotsections;
    case PlantType:
      return collectionKeys.planttypes;
    case GeoDataV1:
      return collectionKeys.geodatas;
    case ActivityLog:
      return collectionKeys.activitylogs;
    case VesselV1:
      return collectionKeys.vessels;
    case OrganisationV1:
      return collectionKeys.organisations;
    case FormSubmissionV1:
      return collectionKeys.formsubmissions;
    case EventV1:
      return collectionKeys.events;
    case AccountV1:
      return collectionKeys.platformusers;
    case WorkspaceV1:
      return collectionKeys.workspaces;
    case PlotV1:
      return collectionKeys.plots;
    case UploadDocument:
      return collectionKeys.documents;
    case UploadDocumentChunk:
      return collectionKeys.documentchunks;
    case Tag:
      return collectionKeys.tags;
    case ProductV1:
      return collectionKeys.products;
    case FacilityV1:
      return collectionKeys.facilities;
    case FarmV1:
      return collectionKeys.farms;
    case Farm_minV1:
      return collectionKeys.farms_min;
    case VarietyPriceV1:
      return collectionKeys.varietyprices;
    case UserV1:
      return collectionKeys.users;
    case LocationV1:
      return collectionKeys.locations;
    // case Batch:
    //   return collectionKeys.batches;
    case ProdLot:
      return collectionKeys.prodlots;
    // case QrCodeLink:
    //   return collectionKeys.globalQrCodeLinks;
    // case StoryQrCodeLink:
    //   return collectionKeys.storyQrCodeLinks;
    // case Configuration:
    //   return collectionKeys.configurations;
    // case Story:
    //   return collectionKeys.stories;
    case CropV1:
      return collectionKeys.crops;
    case VarietyV1:
      return collectionKeys.varieties;
    case Contract:
      return collectionKeys.contracts;
    case CertificationV1:
      return collectionKeys.certifications;
    case AnimalCount:
      return collectionKeys.animalcounts;
    case EntitySurvey:
      return collectionKeys.surveys;
    case TrainingV1:
      return collectionKeys.trainings;
    case TrainingSessionV1:
      return collectionKeys.trainingsessions;
    case TrainingTypeV1:
      return collectionKeys.trainingtypes;
    case SeasonV1:
      return collectionKeys.seasons;
    case ContactV1:
      return collectionKeys.contacts;
    // case ComplianceItem:
    //   return collectionKeys.noncompliances;
    // case ServiceActivity:
    //   return collectionKeys.serviceactivities;
    // case ServiceCategory:
    //   return collectionKeys.servicecategories;
    // case Service:
    //   return collectionKeys.services;
    // case ServiceActivityOutput:
    //   return collectionKeys.serviceactivityoutputs;
    // case ServiceActivityBeneficiary:
    //   return collectionKeys.serviceactivitybeneficiaries;
    case CertificationTypeV1:
      return collectionKeys.certificationtypes;
    // case InspectionRecord:
    //   return collectionKeys.inspectionrecords;
    // case AnimalType:
    //   return collectionKeys.animaltypes;
    case WorkflowScope:
      return collectionKeys.workflowscopes;
    case PendingTaskV1:
      return collectionKeys.pendingtasks;
    // case ExportProperties:
    //   return collectionKeys.exports;
    case QualityControlSession:
      return collectionKeys.qualitycontrolsessions;
    case QualityControlResults:
      return collectionKeys.qualitycontrolresults;
    case QualityControlResultSubmission:
      return collectionKeys.qualitycontrolresultsubmissions;
    default:
      throw Error('not supported getCollectionKeyByClass ' + cls);
  }
}
