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
    CustomTypeOrder: function() {
        return CustomTypeOrder;
    },
    GlobalLocationTypeOrder: function() {
        return GlobalLocationTypeOrder;
    },
    LTCCustomLocationLevels: function() {
        return LTCCustomLocationLevels;
    },
    LocationLevels: function() {
        return LocationLevels;
    },
    LocationMainType: function() {
        return LocationMainType;
    },
    LocationTypeOrder: function() {
        return LocationTypeOrder;
    },
    MhCustomLocationLevels: function() {
        return MhCustomLocationLevels;
    }
});
var LocationMainType;
(function(LocationMainType) {
    LocationMainType["GLOBAL"] = "GLOBAL";
    LocationMainType["CUSTOM"] = "CUSTOM";
})(LocationMainType || (LocationMainType = {}));
var LocationLevels;
(function(LocationLevels) {
    LocationLevels["DISTRICT"] = "District";
    LocationLevels["PARISH"] = "Parish";
    LocationLevels["VILLAGE"] = "Village";
    LocationLevels["SUB_COUNTY"] = "SubCounty";
})(LocationLevels || (LocationLevels = {}));
var MhCustomLocationLevels;
(function(MhCustomLocationLevels) {
    MhCustomLocationLevels["REGION"] = "Region";
    MhCustomLocationLevels["ZONE"] = "Zone";
    MhCustomLocationLevels["FARMER_GROUP"] = "Farmergroups";
})(MhCustomLocationLevels || (MhCustomLocationLevels = {}));
var LTCCustomLocationLevels;
(function(LTCCustomLocationLevels) {
    LTCCustomLocationLevels["COLLECTIONPOINT"] = "CollectionPoint";
})(LTCCustomLocationLevels || (LTCCustomLocationLevels = {}));
const GlobalLocationTypeOrder = {
    ["District"]: 1,
    ["SubCounty"]: 2,
    ["Parish"]: 3,
    ["Village"]: 4
};
const CustomTypeOrder = {
    ["Farmergroups"]: 1,
    ["Zone"]: 2,
    ["Region"]: 3
};
const LocationTypeOrder = {
    ["GLOBAL"]: 1,
    ["CUSTOM"]: 2
};
