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
    FilterClasses: function() {
        return FilterClasses;
    },
    filterClassMap: function() {
        return filterClassMap;
    }
});
const _farmsfilterdto = require("../../farms/dto/farms.filter.dto");
const _plotsfilterdto = require("../../farms/dto/plots.filter.dto");
const _firestoreusersfilterdto = require("../../firestore/dto/firestore.users.filter.dto");
const _locationsfilterdto = require("../../locations/dto/locations.filter.dto");
var FilterClasses;
(function(FilterClasses) {
    FilterClasses["farms"] = "farms";
    FilterClasses["locations"] = "locations";
    FilterClasses["users"] = "users";
    FilterClasses["dashboard"] = "dashboard";
    FilterClasses["plots"] = "plots";
})(FilterClasses || (FilterClasses = {}));
const filterClassMap = {
    ["farms"]: _farmsfilterdto.FarmsFilter,
    ["locations"]: _locationsfilterdto.LocationsFilter,
    ["users"]: _firestoreusersfilterdto.FirestoreUsersFilter,
    ["plots"]: _plotsfilterdto.PlotsFilter
};
