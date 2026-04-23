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
    VesselSubType: function() {
        return VesselSubType;
    },
    VesselType: function() {
        return VesselType;
    },
    default: function() {
        return VesselV1;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _utils = require("../../v1utils/utils");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _ProdLot = /*#__PURE__*/ _interop_require_default(require("../production/ProdLot"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var VesselSubType;
(function(VesselSubType) {
    VesselSubType["StorageContainer"] = "StorageContainer";
    VesselSubType["ExportBag"] = "ExportBag";
    VesselSubType["CollectionContainer"] = "CollectionContainer";
})(VesselSubType || (VesselSubType = {}));
var VesselType;
(function(VesselType) {
    VesselType["CollectionBin"] = "CollectionBin";
    VesselType["FermentationBin"] = "FermentationBin";
    VesselType["AerationRack"] = "AerationRack";
    VesselType["CacaoTree"] = "CacaoTree";
    VesselType["FreeAirHeap"] = "FreeAirHeap";
    VesselType["CacaoFermentationModule"] = "CacaoFermentationModule";
    VesselType["Refiner"] = "Refiner";
    VesselType["Marquee"] = "Marquee";
    VesselType["ProductSack"] = "ProductSack";
})(VesselType || (VesselType = {}));
let VesselV1 = class VesselV1 extends _AbstractEntity.AbstractEntity {
    cleanCurrentBatch() {
        this.currentBatch = null;
    }
    hasCurrentBatch() {
        return this.currentBatch != null;
    }
    getCollection() {
        return _dbMappingUtils.collectionKeys.vessels;
    }
    constructor(...args){
        super(...args);
        this.vesselType = null;
        this.vesselSubType = null;
        this.name = null;
        this.permanent = false;
        this.picture = null;
        this.size = null;
        this.weight = null;
        this.currentBatch = null;
        // @Exclude()
        // @expandFromId('currentBatch')
        // currentBatchFull?: Batch = null;
        this.currentProdLot = null;
        this.currentProdLotFull = null;
        this.facility = null;
        this.plot = null;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VesselV1.prototype, "currentBatch", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VesselV1.prototype, "currentProdLot", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], VesselV1.prototype, "currentProdLotStartDate", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('currentProdLot'),
    _ts_metadata("design:type", typeof _ProdLot.default === "undefined" ? Object : _ProdLot.default)
], VesselV1.prototype, "currentProdLotFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VesselV1.prototype, "facility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], VesselV1.prototype, "plot", void 0);
