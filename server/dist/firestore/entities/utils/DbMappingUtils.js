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
    collectionKeys: function() {
        return collectionKeys;
    },
    getClassType: function() {
        return getClassType;
    },
    getCollectionKeyByClass: function() {
        return getCollectionKeyByClass;
    },
    globalCollections: function() {
        return globalCollections;
    }
});
const _Accounts = /*#__PURE__*/ _interop_require_default(require("../org/Accounts"));
const _Organisation = /*#__PURE__*/ _interop_require_default(require("../org/Organisation"));
const _OrganisationConfiguration = /*#__PURE__*/ _interop_require_default(require("../org/OrganisationConfiguration"));
const _Workspace = /*#__PURE__*/ _interop_require_default(require("../org/Workspace"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var collectionKeys;
(function(collectionKeys) {
    collectionKeys["organisations"] = "organisations";
    collectionKeys["platformusers"] = "platformusers";
    collectionKeys["workspaces"] = "workspaces";
    collectionKeys["superusers"] = "superusers";
    collectionKeys["organisation_config"] = "orgconfigurations";
})(collectionKeys || (collectionKeys = {}));
const globalCollections = [
    "organisations",
    "platformusers"
];
function getClassType(refcollection) {
    if (refcollection.indexOf('_wip') >= 0) {
        refcollection = refcollection.substring(0, refcollection.indexOf('_wip'));
    }
    switch(refcollection){
        case "organisations":
            return _Organisation.default;
        case "platformusers":
            return _Accounts.default;
        case "workspaces":
            return _Workspace.default;
        case "orgconfigurations":
            return _OrganisationConfiguration.default;
        default:
            throw Error('not supported getClassType:' + refcollection + '.');
    }
}
function getCollectionKeyByClass(cls) {
    switch(cls){
        case _Organisation.default:
            {
                return "organisations";
            }
        case _Accounts.default:
            {
                return "platformusers";
            }
        case _Workspace.default:
            {
                return "workspaces";
            }
        case _OrganisationConfiguration.default:
            {
                return "orgconfigurations";
            }
        default:
            throw Error('not supported getCollectionKeyByClass ' + cls);
    }
}
