"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cleanedObjectForPrint: function() {
        return cleanedObjectForPrint;
    },
    cleanedObjectForPrintNoMapping: function() {
        return cleanedObjectForPrintNoMapping;
    },
    clone: function() {
        return clone;
    },
    getClassType: function() {
        return getClassType;
    },
    getCollectionKeyByClass: function() {
        return getCollectionKeyByClass;
    },
    initClassType: function() {
        return initClassType;
    },
    loadTypeById: function() {
        return loadTypeById;
    },
    mapFromPlain: function() {
        return mapFromPlain;
    },
    mapOneObjectFromPlain: function() {
        return mapOneObjectFromPlain;
    },
    mapPlainToClass: function() {
        return mapPlainToClass;
    },
    mapToPlain: function() {
        return mapToPlain;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("./dbMappingUtils");
const _VarietyV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/VarietyV1"));
const _TrainingSessionV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/services/TrainingSessionV1"));
const _TrainingV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/services/TrainingV1"));
const _TrainingTypeV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/services/TrainingTypeV1"));
const _SeasonV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/SeasonV1"));
const _ProductV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/ProductV1"));
const _VarietyPriceV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/VarietyPriceV1"));
const _FacilityV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/FacilityV1"));
const _UserV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/UserV1"));
const _FormSubmissionV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/FormSubmissionV1"));
const _EventV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/EventV1"));
const _OrganisationV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/OrganisationV1"));
const _WalletV1 = require("../v1entities/payments/WalletV1");
const _PaymentTransactionV1 = require("../v1entities/payments/PaymentTransactionV1");
const _Analysis = /*#__PURE__*/ _interop_require_default(require("../v1entities/quality/Analysis"));
const _OriginProperties = /*#__PURE__*/ _interop_require_default(require("../v1entities/production/OriginProperties"));
const _WorkspaceV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/WorkspaceV1"));
const _AccountV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/org/AccountV1"));
const _LocationV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/LocationV1"));
const _ContactV1 = require("../v1entities/farms/ContactV1");
const _ActivityCompletion = /*#__PURE__*/ _interop_require_default(require("../v1entities/production/ActivityCompletion"));
const _LotSection = /*#__PURE__*/ _interop_require_default(require("../v1entities/production/LotSection"));
const _Address = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/Address"));
const _QualityControlResultSubmission = /*#__PURE__*/ _interop_require_default(require("../v1entities/quality/QualityControlResultSubmission"));
const _QualityControlResults = /*#__PURE__*/ _interop_require_default(require("../v1entities/quality/QualityControlResults"));
const _QualityControlSession = /*#__PURE__*/ _interop_require_default(require("../v1entities/quality/QualityControlSession"));
const _Coordinates = /*#__PURE__*/ _interop_require_default(require("../v1entities/utis/Coordinates"));
const _PendingTaskV1 = require("../v1entities/general/PendingTaskV1");
const _WorkflowScope = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/WorkflowScope"));
const _ProdLot = /*#__PURE__*/ _interop_require_default(require("../v1entities/production/ProdLot"));
const _PriceContainer = /*#__PURE__*/ _interop_require_default(require("../v1entities/utis/PriceContainer"));
const _GeoDataV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/GeoDataV1"));
const _LatLong = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/LatLong"));
const _ActivityLog = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/ActivityLog"));
const _AuditActivityV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/AuditActivityV1"));
const _PlotV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/farms/PlotV1"));
const _EntitySurvey = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/EntitySurvey"));
const _VesselV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/VesselV1"));
const _Contract = /*#__PURE__*/ _interop_require_default(require("../v1entities/farms/Contract"));
const _CertificationV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/certification/CertificationV1"));
const _AnimalCount = /*#__PURE__*/ _interop_require_default(require("../v1entities/farms/AnimalCount"));
const _AnimalType = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/AnimalType"));
const _CertificationTypeV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/certification/CertificationTypeV1"));
const _PlantType = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/PlantType"));
const _NonComplianceV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/certification/NonComplianceV1"));
const _AuditEntryV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/AuditEntryV1"));
const _UploadDocument = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/UploadDocument"));
const _UploadDocumentChunk = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/UploadDocumentChunk"));
const _Tag = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/Tag"));
const _Configuration = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/Configuration"));
const _InspectionRecord = /*#__PURE__*/ _interop_require_default(require("../v1entities/general/InspectionRecord"));
const _CropV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/CropV1"));
const _FarmV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/farms/FarmV1"));
const _Farm_minV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/farms/Farm_minV1"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function cleanedObjectForPrint(newVar) {
    const newObject = mapToPlain(newVar);
    const replace = '<VALUE_REMOVED_FOR_PRINTING>';
    replacePropertyValue(newObject, 'picture', replace);
    replacePropertyValue(newObject, 'image', replace);
    return newObject;
}
function cleanedObjectForPrintNoMapping(newVar) {
    const newObject = JSON.parse(JSON.stringify(newVar));
    const replace = '<VALUE_REMOVED_FOR_PRINTING>';
    replacePropertyValue(newObject, 'picture', replace);
    replacePropertyValue(newObject, 'image', replace);
    return newObject;
}
function replacePropertyValue(obj, label, replace) {
    if (obj[label]) {
        obj[label] = replace;
        return;
    }
    for(const i in obj){
        if (obj.hasOwnProperty(i)) {
            if (obj[i] instanceof Object) {
                replacePropertyValue(obj[i], label, replace);
            }
        }
    }
    return;
}
function clone(object) {
    return JSON.parse(JSON.stringify(object));
}
function mapToPlain(entity) {
    const result = (0, _classtransformer.classToPlain)(entity);
    return result;
}
function mapOneObjectFromPlain(plainObject, collection) {
    const classType = getClassType(collection);
    cleanPlainObjectDates(plainObject);
    if (plainObject instanceof classType) {
        console.log('mapOneObjectFromPlain: already converted ', plainObject);
        return plainObject;
    } else {
        // console.log("plainToClass", plainObject);
        return (0, _classtransformer.plainToClass)(classType, plainObject);
    }
}
function cleanPlainObjectDates(obj) {
    for(const i in obj){
        if (obj.hasOwnProperty(i)) {
            if (obj[i] === undefined) {
                delete obj[i];
            } else if (obj[i] instanceof Array) {
                const array = obj[i];
                for (const a of array){
                    if (a instanceof Object) {
                        cleanPlainObjectDates(a);
                    }
                }
            } else if (obj[i] instanceof Object) {
                if (obj[i].toDate) {
                    obj[i] = {
                        seconds: obj[i].seconds,
                        nanoseconds: obj[i].nanoseconds
                    };
                } else {
                    cleanPlainObjectDates(obj[i]);
                }
            }
        }
    }
}
function mapFromPlain(instance, plainObject) {
    // let plain = addUnderscore(plainObject, null);
    const result = (0, _classtransformer.plainToClassFromExist)(instance, plainObject);
    return result;
}
function mapPlainToClass(cls, plainObject) {
    // let plain = addUnderscore(plainObject, null);
    const result = (0, _classtransformer.plainToClass)(cls, plainObject);
    return result;
}
function loadTypeById(id, cls, array) {
    if (id == undefined || id == null) {
        throw Error('ID has to be defined' + id);
    }
    const json = array[id];
    if (json === undefined) {
        throw Error('item not defined in json ' + id);
    }
    const result = (0, _classtransformer.plainToClass)(cls, json);
    //_id
    //hack because I didn't manage to export the HasId interface
    const r = result;
    r['id'] = id;
    //result.setId(id);
    return r;
}
function getClassType(refcollection) {
    if (refcollection.indexOf('_wip') >= 0) {
        refcollection = refcollection.substring(0, refcollection.indexOf('_wip'));
    }
    switch(refcollection){
        case _dbMappingUtils.collectionKeys.organisations:
            return _OrganisationV1.default;
        case _dbMappingUtils.collectionKeys.formsubmissions:
            return _FormSubmissionV1.default;
        case _dbMappingUtils.collectionKeys.events:
            return _EventV1.default;
        case _dbMappingUtils.collectionKeys.events_error:
            return _EventV1.default;
        case _dbMappingUtils.collectionKeys.formsubmissions_completed:
            return _FormSubmissionV1.default;
        case _dbMappingUtils.collectionKeys.formsubmissions_error:
            return _FormSubmissionV1.default;
        // case collectionKeys.auditentries:
        //   return AuditEntry;
        case _dbMappingUtils.collectionKeys.paymenttransactions:
            return _PaymentTransactionV1.PaymentTransactionV1;
        case _dbMappingUtils.collectionKeys.wallets:
            return _WalletV1.WalletV1;
        case _dbMappingUtils.collectionKeys.analyses:
            return _Analysis.default;
        case _dbMappingUtils.collectionKeys.originproperties:
            return _OriginProperties.default;
        case _dbMappingUtils.collectionKeys.auditactivities:
            return _AuditActivityV1.default;
        case _dbMappingUtils.collectionKeys.activitylogs:
            return _ActivityLog.default;
        case _dbMappingUtils.collectionKeys.workspaces:
            return _WorkspaceV1.default;
        case _dbMappingUtils.collectionKeys.platformusers:
            return _AccountV1.default;
        case _dbMappingUtils.collectionKeys.vessels:
            return _VesselV1.default;
        case _dbMappingUtils.collectionKeys.plots:
            return _PlotV1.default;
        case _dbMappingUtils.collectionKeys.documents:
            return _UploadDocument.default;
        case _dbMappingUtils.collectionKeys.documentchunks:
            return _UploadDocumentChunk.default;
        case _dbMappingUtils.collectionKeys.tags:
            return _Tag.default;
        case _dbMappingUtils.collectionKeys.products:
            return _ProductV1.default;
        case _dbMappingUtils.collectionKeys.facilities:
            return _FacilityV1.default;
        case _dbMappingUtils.collectionKeys.farms:
            return _FarmV1.default;
        case _dbMappingUtils.collectionKeys.farms_min:
            return _Farm_minV1.default;
        // case collectionKeys.vesselTypes:
        //   return VesselType;
        case _dbMappingUtils.collectionKeys.varietyprices:
            return _VarietyPriceV1.default;
        case _dbMappingUtils.collectionKeys.varieties:
            return _VarietyV1.default;
        case _dbMappingUtils.collectionKeys.crops:
            return _CropV1.default;
        case _dbMappingUtils.collectionKeys.users:
            return _UserV1.default;
        case _dbMappingUtils.collectionKeys.contracts:
            return _Contract.default;
        case _dbMappingUtils.collectionKeys.certifications:
            return _CertificationV1.default;
        case _dbMappingUtils.collectionKeys.animalcounts:
            return _AnimalCount.default;
        case _dbMappingUtils.collectionKeys.surveys:
            return _EntitySurvey.default;
        case _dbMappingUtils.collectionKeys.seasons:
            return _SeasonV1.default;
        case _dbMappingUtils.collectionKeys.contacts:
            return _ContactV1.ContactV1;
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
        case _dbMappingUtils.collectionKeys.certificationtypes:
            return _CertificationTypeV1.default;
        // case collectionKeys.inspectionrecords:
        //   return InspectionRecord;
        case _dbMappingUtils.collectionKeys.animaltypes:
            return _AnimalType.default;
        case _dbMappingUtils.collectionKeys.locations:
            return _LocationV1.default;
        // case collectionKeys.batches:
        //   return Batch;
        // case collectionKeys.labelqueue:
        //   return LabelQueueEntry;
        case _dbMappingUtils.collectionKeys.prodlots:
            return _ProdLot.default;
        // case collectionKeys.testobjects:
        //   return TestObject;
        // case collectionKeys.testchildren:
        //   return TestChild;
        case _dbMappingUtils.collectionKeys.activitycompletions:
            return _ActivityCompletion.default;
        case _dbMappingUtils.collectionKeys.lotsections:
            return _LotSection.default;
        case _dbMappingUtils.collectionKeys.planttypes:
            return _PlantType.default;
        case _dbMappingUtils.collectionKeys.geodatas:
            return _GeoDataV1.default;
        case _dbMappingUtils.collectionKeys.price:
            return _PriceContainer.default;
        case _dbMappingUtils.collectionKeys.address:
            return _Address.default;
        case _dbMappingUtils.collectionKeys.coordinates:
            return _Coordinates.default;
        // case collectionKeys.globalQrCodeLinks:
        //   return QrCodeLink;
        // case collectionKeys.stories:
        //   return Story;
        // case collectionKeys.storyQrCodeLinks:
        //   return StoryQrCodeLink;
        case _dbMappingUtils.collectionKeys.pendingtasks:
            return _PendingTaskV1.PendingTaskV1;
        case _dbMappingUtils.collectionKeys.workflowscopes:
            return _WorkflowScope.default;
        case _dbMappingUtils.collectionKeys.configurations:
            return _Configuration.default;
        case _dbMappingUtils.collectionKeys.qualitycontrolsessions:
            return _QualityControlSession.default;
        case _dbMappingUtils.collectionKeys.qualitycontrolresults:
            return _QualityControlResults.default;
        case _dbMappingUtils.collectionKeys.qualitycontrolresultsubmissions:
            return _QualityControlResultSubmission.default;
        // case collectionKeys.exports:
        //   return ExportProperties;
        case _dbMappingUtils.collectionKeys.trainings:
            return _TrainingV1.default;
        case _dbMappingUtils.collectionKeys.trainingsessions:
            return _TrainingSessionV1.default;
        case _dbMappingUtils.collectionKeys.trainingtypes:
            return _TrainingTypeV1.default;
        default:
            throw Error('not supported getClassType:' + refcollection + '.');
    }
}
function initClassType(refcollection) {
    if (refcollection.indexOf('_wip') >= 0) {
        refcollection = refcollection.substring(0, refcollection.indexOf('_wip'));
    }
    switch(refcollection){
        case _dbMappingUtils.collectionKeys.pendingtasks:
            return new _PendingTaskV1.PendingTaskV1();
        case _dbMappingUtils.collectionKeys.workflowscopes:
            return new _WorkflowScope.default();
        // case collectionKeys.stories:
        //   return new Story();
        // case collectionKeys.storyQrCodeLinks:
        //   return new StoryQrCodeLink();
        case _dbMappingUtils.collectionKeys.configurations:
            return new _Configuration.default();
        // case collectionKeys.globalQrCodeLinks:
        //   return new QrCodeLink();
        case _dbMappingUtils.collectionKeys.vessels:
            return new _VesselV1.default();
        case _dbMappingUtils.collectionKeys.plots:
            return new _PlotV1.default();
        case _dbMappingUtils.collectionKeys.documents:
            return new _UploadDocument.default();
        case _dbMappingUtils.collectionKeys.documentchunks:
            return new _UploadDocumentChunk.default();
        case _dbMappingUtils.collectionKeys.tags:
            return new _Tag.default();
        case _dbMappingUtils.collectionKeys.products:
            return new _ProductV1.default();
        case _dbMappingUtils.collectionKeys.facilities:
            return new _FacilityV1.default();
        case _dbMappingUtils.collectionKeys.farms:
            return new _FarmV1.default();
        case _dbMappingUtils.collectionKeys.formsubmissions:
            return new _FormSubmissionV1.default();
        case _dbMappingUtils.collectionKeys.formsubmissions_completed:
            return new _FormSubmissionV1.default();
        case _dbMappingUtils.collectionKeys.events:
            return new _EventV1.default();
        case _dbMappingUtils.collectionKeys.varietyprices:
            return new _VarietyPriceV1.default();
        case _dbMappingUtils.collectionKeys.varieties:
            return new _VarietyV1.default();
        case _dbMappingUtils.collectionKeys.crops:
            return new _CropV1.default();
        case _dbMappingUtils.collectionKeys.contracts:
            return new _Contract.default();
        case _dbMappingUtils.collectionKeys.certifications:
            return new _CertificationV1.default();
        case _dbMappingUtils.collectionKeys.animalcounts:
            return new _AnimalCount.default();
        case _dbMappingUtils.collectionKeys.surveys:
            return new _EntitySurvey.default();
        case _dbMappingUtils.collectionKeys.trainings:
            return new _TrainingV1.default();
        case _dbMappingUtils.collectionKeys.trainingsessions:
            return new _TrainingSessionV1.default();
        case _dbMappingUtils.collectionKeys.trainingtypes:
            return new _TrainingTypeV1.default();
        case _dbMappingUtils.collectionKeys.seasons:
            return new _SeasonV1.default();
        case _dbMappingUtils.collectionKeys.contacts:
            return new _ContactV1.ContactV1();
        case _dbMappingUtils.collectionKeys.noncompliances:
            return new _NonComplianceV1.default();
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
        case _dbMappingUtils.collectionKeys.certificationtypes:
            return new _CertificationTypeV1.default();
        case _dbMappingUtils.collectionKeys.inspectionrecords:
            return new _InspectionRecord.default();
        case _dbMappingUtils.collectionKeys.animaltypes:
            return new _AnimalType.default();
        case _dbMappingUtils.collectionKeys.users:
            return new _UserV1.default();
        case _dbMappingUtils.collectionKeys.locations:
            return new _LocationV1.default();
        // case collectionKeys.batches:
        //   return new Batch();
        case _dbMappingUtils.collectionKeys.prodlots:
            return new _ProdLot.default();
        // case collectionKeys.testobjects:
        //   return new TestObject();
        case _dbMappingUtils.collectionKeys.activitycompletions:
            return new _ActivityCompletion.default();
        case _dbMappingUtils.collectionKeys.lotsections:
            return new _LotSection.default();
        case _dbMappingUtils.collectionKeys.planttypes:
            return new _PlantType.default();
        case _dbMappingUtils.collectionKeys.geodatas:
            return new _GeoDataV1.default();
        case _dbMappingUtils.collectionKeys.activitylogs:
            return new _ActivityLog.default();
        case _dbMappingUtils.collectionKeys.price:
            return new _PriceContainer.default();
        case _dbMappingUtils.collectionKeys.address:
            return new _Address.default();
        case _dbMappingUtils.collectionKeys.auditentries:
            return new _AuditEntryV1.default();
        case _dbMappingUtils.collectionKeys.paymenttransactions:
            return new _PaymentTransactionV1.PaymentTransactionV1();
        case _dbMappingUtils.collectionKeys.wallets:
            return new _WalletV1.WalletV1();
        case _dbMappingUtils.collectionKeys.analyses:
            return new _Analysis.default();
        case _dbMappingUtils.collectionKeys.originproperties:
            return new _OriginProperties.default();
        case _dbMappingUtils.collectionKeys.auditactivities:
            return new _AuditActivityV1.default();
        case _dbMappingUtils.collectionKeys.qualitycontrolsessions:
            return new _QualityControlSession.default();
        case _dbMappingUtils.collectionKeys.qualitycontrolresults:
            return new _QualityControlResults.default();
        case _dbMappingUtils.collectionKeys.qualitycontrolresultsubmissions:
            return new _QualityControlResultSubmission.default();
        case _dbMappingUtils.collectionKeys.coordinates:
            return new _Coordinates.default(new _LatLong.default(null, null), null);
        default:
            throw Error('not supported ' + refcollection);
    }
}
function getCollectionKeyByClass(cls) {
    switch(cls){
        case _AuditEntryV1.default:
            return _dbMappingUtils.collectionKeys.auditentries;
        case _PaymentTransactionV1.PaymentTransactionV1:
            return _dbMappingUtils.collectionKeys.paymenttransactions;
        case _WalletV1.WalletV1:
            return _dbMappingUtils.collectionKeys.wallets;
        case _Analysis.default:
            return _dbMappingUtils.collectionKeys.analyses;
        case _OriginProperties.default:
            return _dbMappingUtils.collectionKeys.originproperties;
        case _AuditActivityV1.default:
            return _dbMappingUtils.collectionKeys.auditactivities;
        case _ActivityCompletion.default:
            return _dbMappingUtils.collectionKeys.activitycompletions;
        case _LotSection.default:
            return _dbMappingUtils.collectionKeys.lotsections;
        case _PlantType.default:
            return _dbMappingUtils.collectionKeys.planttypes;
        case _GeoDataV1.default:
            return _dbMappingUtils.collectionKeys.geodatas;
        case _ActivityLog.default:
            return _dbMappingUtils.collectionKeys.activitylogs;
        case _VesselV1.default:
            return _dbMappingUtils.collectionKeys.vessels;
        case _OrganisationV1.default:
            return _dbMappingUtils.collectionKeys.organisations;
        case _FormSubmissionV1.default:
            return _dbMappingUtils.collectionKeys.formsubmissions;
        case _EventV1.default:
            return _dbMappingUtils.collectionKeys.events;
        case _AccountV1.default:
            return _dbMappingUtils.collectionKeys.platformusers;
        case _WorkspaceV1.default:
            return _dbMappingUtils.collectionKeys.workspaces;
        case _PlotV1.default:
            return _dbMappingUtils.collectionKeys.plots;
        case _UploadDocument.default:
            return _dbMappingUtils.collectionKeys.documents;
        case _UploadDocumentChunk.default:
            return _dbMappingUtils.collectionKeys.documentchunks;
        case _Tag.default:
            return _dbMappingUtils.collectionKeys.tags;
        case _ProductV1.default:
            return _dbMappingUtils.collectionKeys.products;
        case _FacilityV1.default:
            return _dbMappingUtils.collectionKeys.facilities;
        case _FarmV1.default:
            return _dbMappingUtils.collectionKeys.farms;
        case _Farm_minV1.default:
            return _dbMappingUtils.collectionKeys.farms_min;
        case _VarietyPriceV1.default:
            return _dbMappingUtils.collectionKeys.varietyprices;
        case _UserV1.default:
            return _dbMappingUtils.collectionKeys.users;
        case _LocationV1.default:
            return _dbMappingUtils.collectionKeys.locations;
        // case Batch:
        //   return collectionKeys.batches;
        case _ProdLot.default:
            return _dbMappingUtils.collectionKeys.prodlots;
        // case QrCodeLink:
        //   return collectionKeys.globalQrCodeLinks;
        // case StoryQrCodeLink:
        //   return collectionKeys.storyQrCodeLinks;
        // case Configuration:
        //   return collectionKeys.configurations;
        // case Story:
        //   return collectionKeys.stories;
        case _CropV1.default:
            return _dbMappingUtils.collectionKeys.crops;
        case _VarietyV1.default:
            return _dbMappingUtils.collectionKeys.varieties;
        case _Contract.default:
            return _dbMappingUtils.collectionKeys.contracts;
        case _CertificationV1.default:
            return _dbMappingUtils.collectionKeys.certifications;
        case _AnimalCount.default:
            return _dbMappingUtils.collectionKeys.animalcounts;
        case _EntitySurvey.default:
            return _dbMappingUtils.collectionKeys.surveys;
        case _TrainingV1.default:
            return _dbMappingUtils.collectionKeys.trainings;
        case _TrainingSessionV1.default:
            return _dbMappingUtils.collectionKeys.trainingsessions;
        case _TrainingTypeV1.default:
            return _dbMappingUtils.collectionKeys.trainingtypes;
        case _SeasonV1.default:
            return _dbMappingUtils.collectionKeys.seasons;
        case _ContactV1.ContactV1:
            return _dbMappingUtils.collectionKeys.contacts;
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
        case _CertificationTypeV1.default:
            return _dbMappingUtils.collectionKeys.certificationtypes;
        // case InspectionRecord:
        //   return collectionKeys.inspectionrecords;
        // case AnimalType:
        //   return collectionKeys.animaltypes;
        case _WorkflowScope.default:
            return _dbMappingUtils.collectionKeys.workflowscopes;
        case _PendingTaskV1.PendingTaskV1:
            return _dbMappingUtils.collectionKeys.pendingtasks;
        // case ExportProperties:
        //   return collectionKeys.exports;
        case _QualityControlSession.default:
            return _dbMappingUtils.collectionKeys.qualitycontrolsessions;
        case _QualityControlResults.default:
            return _dbMappingUtils.collectionKeys.qualitycontrolresults;
        case _QualityControlResultSubmission.default:
            return _dbMappingUtils.collectionKeys.qualitycontrolresultsubmissions;
        default:
            throw Error('not supported getCollectionKeyByClass ' + cls);
    }
}
