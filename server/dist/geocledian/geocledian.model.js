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
    GeocledianCommodity: function() {
        return GeocledianCommodity;
    },
    GeocledianStatus: function() {
        return GeocledianStatus;
    }
});
var GeocledianCommodity;
(function(GeocledianCommodity) {
    GeocledianCommodity["cattle"] = "cattle";
    GeocledianCommodity["cocoa"] = "cocoa";
    GeocledianCommodity["coffee"] = "coffee";
    GeocledianCommodity["oilpalm"] = "oilpalm";
    GeocledianCommodity["rubber"] = "rubber";
    GeocledianCommodity["soya"] = "soya";
    GeocledianCommodity["wood"] = "wood";
})(GeocledianCommodity || (GeocledianCommodity = {}));
var GeocledianStatus;
(function(GeocledianStatus) {
    GeocledianStatus["PENDING"] = "PENDING";
    GeocledianStatus["ANALYZED"] = "ANALYZED";
})(GeocledianStatus || (GeocledianStatus = {}));
