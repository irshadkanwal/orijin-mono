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
    PlotCoordinateSources: function() {
        return PlotCoordinateSources;
    },
    PlotType: function() {
        return PlotType;
    }
});
const _client = require("@prisma/client");
var PlotType;
(function(PlotType) {
    PlotType["Annual"] = "Annual";
    PlotType["Permanent"] = "Permanent";
})(PlotType || (PlotType = {}));
var PlotCoordinateSources;
(function(PlotCoordinateSources) {
    PlotCoordinateSources["IMPORT"] = "IMPORT";
    PlotCoordinateSources["ORIJIN_APP"] = "ORIJIN_APP";
    PlotCoordinateSources["GEOCLEDIAN"] = "GEOCLEDIAN";
    PlotCoordinateSources["AUTOFIX"] = "AUTOFIX";
})(PlotCoordinateSources || (PlotCoordinateSources = {}));
const plotWithRelations = _client.Prisma.validator()({
    include: {
        polygons: true,
        satelliteAnalysis: true,
        farm: true
    }
});
