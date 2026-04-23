"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return OriginProperties;
    }
});
const _classtransformer = require("class-transformer");
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _ObjectId = require("../utis/ObjectId");
const _AmountUnit = /*#__PURE__*/ _interop_require_default(require("../utis/AmountUnit"));
const _PriceContainer = /*#__PURE__*/ _interop_require_default(require("../utis/PriceContainer"));
const _utils = require("../../v1utils/utils");
const _AbstractEntity = require("../utis/AbstractEntity");
const _VarietyPriceContainer = /*#__PURE__*/ _interop_require_default(require("../utis/VarietyPriceContainer"));
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
let OriginProperties = class OriginProperties extends _AbstractEntity.AbstractEntity {
    get hasItsOwnOrigin() {
        return this.facility != null || this.plots.length > 0 || this.variety != null || this.tree != null;
    }
    addLocationParent(variety) {
        if (!this.locationParents) {
            this.locationParents = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.locationParents, variety);
    }
    addLocation(variety) {
        if (!this.locations) {
            this.locations = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.locations, variety);
    }
    addSeason(variety) {
        if (!this.seasons) {
            this.seasons = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.seasons, variety);
    }
    addOperator(variety) {
        if (!this.operators) {
            this.operators = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.operators, variety);
    }
    addVariety(variety) {
        if (!this.varieties) {
            this.varieties = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.varieties, variety);
    }
    addCollectionDate(item) {
        if (!this.collectionDates) {
            this.collectionDates = new Array();
        }
        const existing = this.collectionDates.find((m)=>m.date.getTime() == item.getTime());
        if (!existing) {
            const dateWrapper = new _utils.DateWrapper();
            dateWrapper.date = item;
            this.collectionDates.push(dateWrapper);
        }
    }
    addVarietyPrice(item) {
        if (!this.prices) {
            this.prices = new Array();
        }
        const existing = this.prices.find((m)=>m.variety.id === item.variety.id && m.price.price.amount === item.price.price.amount);
        if (!existing) {
            this.prices.push(item);
            return true;
        }
        return false;
    }
    addProduct(item) {
        if (!this.products) {
            this.products = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.products, item);
    }
    addFacility(item) {
        if (!this.facilities) {
            this.facilities = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.facilities, item);
    }
    addProducer(item) {
        if (!this.producers) {
            this.producers = new Array();
        }
        (0, _utils.addIdToArrayIfNotExists)(this.producers, item);
    }
    addSessionId(sessionId) {
        if (!this.sessionIds) {
            this.sessionIds = new Array();
        }
        if (!this.sessionIds.includes(sessionId)) {
            this.sessionIds.push(sessionId);
        }
    }
    getCollection() {
        return _dbMappingUtils.collectionKeys.originproperties;
    }
    constructor(...args){
        super(...args);
        this.properties = {};
        this.sessionId = null;
        this.price = null;
        this.products = [];
        this.producers = [];
        this.plots = [];
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_AmountUnit.default),
    _ts_metadata("design:type", typeof _AmountUnit.default === "undefined" ? Object : _AmountUnit.default)
], OriginProperties.prototype, "money", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_PriceContainer.default),
    _ts_metadata("design:type", typeof _VarietyPriceContainer.default === "undefined" ? Object : _VarietyPriceContainer.default)
], OriginProperties.prototype, "price", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_VarietyPriceContainer.default),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "prices", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "product", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "products", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "location", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "locationParent", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "locations", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "locationParents", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "facility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "facilities", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "facilitiesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "communities", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "communitiesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "countries", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "regions", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "producer", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "producers", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "plots", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "tree", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "variety", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "operator", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], OriginProperties.prototype, "season", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "varieties", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "operators", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "seasons", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "varietiesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "collectors", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], OriginProperties.prototype, "collectionDate", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_utils.DateWrapper),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], OriginProperties.prototype, "collectionDates", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], OriginProperties.prototype, "receptionDate", void 0);
