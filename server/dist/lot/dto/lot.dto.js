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
    LotsDto: function() {
        return LotsDto;
    },
    LotsDtoConnected: function() {
        return LotsDtoConnected;
    },
    LotsDtoCsv: function() {
        return LotsDtoCsv;
    }
});
let LotsDtoCsv = class LotsDtoCsv {
};
let LotsDto = class LotsDto {
};
let LotsDtoConnected = class LotsDtoConnected extends LotsDto {
};
