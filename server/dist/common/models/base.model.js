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
    BaseModel: function() {
        return BaseModel;
    },
    BaseSeasonalModel: function() {
        return BaseSeasonalModel;
    }
});
let BaseModel = class BaseModel {
};
let BaseSeasonalModel = class BaseSeasonalModel extends BaseModel {
};
