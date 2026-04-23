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
    EXTERNAL_SCHEDULER_URL: function() {
        return EXTERNAL_SCHEDULER_URL;
    },
    FARM_INSPECTION_URL: function() {
        return FARM_INSPECTION_URL;
    },
    HECATRES_TO_ACRES_MULTIPLIER: function() {
        return HECATRES_TO_ACRES_MULTIPLIER;
    },
    HECTARE_TO_SQUARE_METER_MULTIPLIRE: function() {
        return HECTARE_TO_SQUARE_METER_MULTIPLIRE;
    },
    SQUARE_METER_TO_ACRES_MULTIPLIER: function() {
        return SQUARE_METER_TO_ACRES_MULTIPLIER;
    },
    SQUARE_METER_TO_HECTARES_MULTIPLIER: function() {
        return SQUARE_METER_TO_HECTARES_MULTIPLIER;
    }
});
const EXTERNAL_SCHEDULER_URL = 'scheduler';
const FARM_INSPECTION_URL = ':org/farmsinspection';
const SQUARE_METER_TO_ACRES_MULTIPLIER = 0.000247105;
const SQUARE_METER_TO_HECTARES_MULTIPLIER = 0.0001;
const HECTARE_TO_SQUARE_METER_MULTIPLIRE = 10000;
const HECATRES_TO_ACRES_MULTIPLIER = 10000 * SQUARE_METER_TO_ACRES_MULTIPLIER;
