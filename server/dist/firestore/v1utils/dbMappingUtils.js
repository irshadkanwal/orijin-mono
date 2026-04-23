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
    AllCollections: function() {
        return AllCollections;
    },
    WORKSPACES_PARENT_COLLECTION: function() {
        return WORKSPACES_PARENT_COLLECTION;
    },
    collectionKeys: function() {
        return collectionKeys;
    },
    dynamicWorkspaceCollections: function() {
        return dynamicWorkspaceCollections;
    },
    farmDataWorkspaceCollections: function() {
        return farmDataWorkspaceCollections;
    },
    farmDataWorkspaceCollectionsWip: function() {
        return farmDataWorkspaceCollectionsWip;
    },
    getDomainCollections: function() {
        return getDomainCollections;
    },
    globalCollections: function() {
        return globalCollections;
    },
    isGlobalCollection: function() {
        return isGlobalCollection;
    },
    offlineAppCacheableCollections: function() {
        return offlineAppCacheableCollections;
    },
    paymentCollections: function() {
        return paymentCollections;
    },
    staticWorkspaceCollections: function() {
        return staticWorkspaceCollections;
    },
    workspaceCollections: function() {
        return workspaceCollections;
    },
    workspaceCollectionsForTraceOffline: function() {
        return workspaceCollectionsForTraceOffline;
    }
});
var collectionKeys;
(function(collectionKeys) {
    collectionKeys["wallets"] = "wallets";
    collectionKeys["trainings"] = "trainings";
    collectionKeys["trainingsessions"] = "trainingsessions";
    collectionKeys["trainingtypes"] = "trainingtypes";
    collectionKeys["contacts"] = "contacts";
    collectionKeys["paymenttransactions"] = "paymenttransactions";
    collectionKeys["workflowscopes"] = "workflowscopes";
    collectionKeys["geodatas"] = "geodatas";
    collectionKeys["pendingtasks"] = "pendingtasks";
    collectionKeys["globalQrCodeLinks"] = "globalQrCodeLinks";
    collectionKeys["batches"] = "batches";
    collectionKeys["users"] = "users";
    collectionKeys["platformusers"] = "platformusers";
    collectionKeys["vessels"] = "vessels";
    collectionKeys["trees"] = "trees";
    collectionKeys["events"] = "events";
    collectionKeys["events_error"] = "events_error";
    collectionKeys["formsubmissions"] = "formsubmissions";
    collectionKeys["formsubmissions_completed"] = "formsubmissions_completed";
    collectionKeys["formsubmissions_error"] = "formsubmissions_error";
    collectionKeys["plots"] = "plots";
    collectionKeys["persons"] = "persons";
    collectionKeys["planttypes"] = "planttypes";
    collectionKeys["animaltypes"] = "animaltypes";
    collectionKeys["organisations"] = "organisations";
    collectionKeys["facilities"] = "facilities";
    collectionKeys["farms"] = "farms";
    collectionKeys["farms_min"] = "farms_min";
    collectionKeys["producers"] = "producers";
    collectionKeys["vesselTypes"] = "vesselTypes";
    collectionKeys["varietyprices"] = "varietyprices";
    collectionKeys["prodlots"] = "prodlots";
    collectionKeys["originproperties"] = "originproperties";
    collectionKeys["qualitycontrolsessions"] = "qualitycontrolsessions";
    collectionKeys["qualitycontrolresults"] = "qualitycontrolresults";
    collectionKeys["qualitycontrolresultsubmissions"] = "qualitycontrolresultsubmissions";
    collectionKeys["varieties"] = "varieties";
    collectionKeys["crops"] = "crops";
    collectionKeys["contracts"] = "contracts";
    collectionKeys["certifications"] = "certifications";
    collectionKeys["animalcounts"] = "animalcounts";
    collectionKeys["surveys"] = "surveys";
    collectionKeys["seasons"] = "seasons";
    collectionKeys["noncompliances"] = "noncompliances";
    collectionKeys["seeds"] = "seeds";
    collectionKeys["contactdetails"] = "contactdetails";
    collectionKeys["serviceactivityoutputs"] = "serviceactivityoutputs";
    collectionKeys["serviceactivities"] = "serviceactivities";
    collectionKeys["servicecategories"] = "servicecategories";
    collectionKeys["serviceactivitybeneficiaries"] = "serviceactivitybeneficiaries";
    collectionKeys["services"] = "services";
    collectionKeys["notes"] = "notes";
    collectionKeys["approvals"] = "approvals";
    collectionKeys["documents"] = "documents";
    collectionKeys["documents_wip"] = "documents_wip";
    collectionKeys["documentchunks"] = "documentchunks";
    collectionKeys["certificationtypes"] = "certificationtypes";
    collectionKeys["inspectionrecords"] = "inspectionrecords";
    collectionKeys["contracttemplates"] = "contracttemplates";
    collectionKeys["tags"] = "tags";
    collectionKeys["products"] = "products";
    collectionKeys["locations"] = "locations";
    collectionKeys["activities"] = "activities";
    collectionKeys["labelqueue"] = "labelqueue";
    collectionKeys["storyQrCodeLinks"] = "storyQrCodeLinks";
    collectionKeys["stories"] = "stories";
    collectionKeys["farmDetails"] = "farmDetails";
    collectionKeys["price"] = "price";
    collectionKeys["address"] = "address";
    collectionKeys["coordinates"] = "coordinates";
    collectionKeys["activitycompletions"] = "activitycompletions";
    collectionKeys["lotsections"] = "lotsections";
    collectionKeys["auditentries"] = "auditentries";
    collectionKeys["analyses"] = "analyses";
    collectionKeys["auditactivities"] = "auditactivities";
    collectionKeys["activitylogs"] = "activitylogs";
    collectionKeys["testchildren"] = "testchildren";
    collectionKeys["testobjects"] = "testobjects";
    collectionKeys["workspaces"] = "workspaces";
    collectionKeys["configurations"] = "configurations";
    collectionKeys["exports"] = "exports";
})(collectionKeys || (collectionKeys = {}));
const AllCollections = Object.keys(collectionKeys);
const globalCollections = [
    "workspaces",
    "stories",
    "organisations",
    "platformusers",
    "storyQrCodeLinks",
    "globalQrCodeLinks",
    "configurations"
];
const staticWorkspaceCollections = [
    "planttypes",
    "facilities",
    "tags",
    "products",
    "varieties",
    "certificationtypes",
    "services",
    "servicecategories",
    "animaltypes",
    "trainingtypes",
    "seasons",
    "varietyprices",
    "vessels",
    "locations"
];
const farmDataWorkspaceCollections = [
    "persons",
    "farms",
    "users",
    "plots",
    "contacts",
    "contracts",
    "trainings",
    "trainingsessions",
    "geodatas",
    "certifications",
    "animalcounts",
    "surveys",
    "noncompliances",
    "serviceactivityoutputs",
    "serviceactivitybeneficiaries",
    "serviceactivities"
];
const paymentCollections = [];
function farmDataWorkspaceCollectionsWip() {
    const farmDataWorkspaceCollectionsWip = farmDataWorkspaceCollections.map((r)=>r + '_wip');
    farmDataWorkspaceCollectionsWip.push('auditentries_wip');
    farmDataWorkspaceCollectionsWip.push('activitylogs_wip');
    farmDataWorkspaceCollectionsWip.push('auditactivities_wip');
    farmDataWorkspaceCollectionsWip.push('pendingtasks_wip');
    farmDataWorkspaceCollectionsWip.push('workflowscopes_wip');
    farmDataWorkspaceCollectionsWip.push('events_wip');
    return farmDataWorkspaceCollectionsWip;
}
const offlineAppCacheableCollections = [
    "formsubmissions",
    'documents_wip',
    'documentchunks',
    'documentchunks_wip',
    ...farmDataWorkspaceCollectionsWip(),
    ...staticWorkspaceCollections
];
const dynamicWorkspaceCollections = [
    "formsubmissions_completed",
    'formsubmissions_error',
    'events_completed',
    'activitylogs_wip',
    'workflowscopes_wip',
    'pendingtasks_wip',
    'documents_error',
    'documents_wip',
    'surveys_wip',
    'events_wip',
    'documents_completed',
    "events",
    "workflowscopes",
    "prodlots",
    "documents",
    "documentchunks",
    "batches",
    "lotsections",
    "paymenttransactions",
    "pendingtasks",
    "auditentries",
    "auditactivities",
    "activitylogs",
    "analyses",
    "originproperties",
    "formsubmissions",
    "activitycompletions",
    "qualitycontrolsessions",
    "qualitycontrolresults",
    "qualitycontrolresultsubmissions",
    "exports"
];
const workspaceCollectionsForTraceOffline = [
    ...staticWorkspaceCollections,
    ...dynamicWorkspaceCollections
];
const workspaceCollections = [
    ...staticWorkspaceCollections,
    ...dynamicWorkspaceCollections
];
function getDomainCollections() {
    const strings = AllCollections.map((m)=>m + '').filter((m)=>!isGlobalCollection(m));
    return strings;
}
function isGlobalCollection(collection) {
    const strings = Object.values(globalCollections).map((m)=>m + '');
    const b = strings.indexOf(collection) >= 0;
    return b;
}
const WORKSPACES_PARENT_COLLECTION = 'workspaces';
