"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return PlotV1;
    }
});
const _dbMappingUtils = require("../../v1utils/dbMappingUtils");
const _classtransformer = require("class-transformer");
const _ObjectId = require("../utis/ObjectId");
const _AbstractEntity = require("../utis/AbstractEntity");
const _ormAnnotations = require("../../v1utils/ormAnnotations");
const _utils = require("../../v1utils/utils");
const _GeoDataV1 = /*#__PURE__*/ _interop_require_default(require("../refdata/GeoDataV1"));
const _Coordinates = /*#__PURE__*/ _interop_require_default(require("../utis/Coordinates"));
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
let PlotV1 = class PlotV1 extends _AbstractEntity.AbstractEntity {
    getCollection() {
        return _dbMappingUtils.collectionKeys.plots;
    }
    constructor(name){
        super();
        // certificationStatus: CertificationStatus = null;
        this.isOrganic = null;
        this.interCropped = null;
        this.isActive = null;
        this.principalOwnsLand = null;
        this.principalLeasesLand = null;
        this.hasRightToLand = null;
        this.hasLandTitle = null;
        this.ownerName = null;
        this.establishedBefore2020 = null;
        this.hasShadeTrees = null;
        this.distanceToForestKnown = null;
        this.distanceToForest = null;
        this.traditionalOwners = null;
        this.isDecifientOfNutrition = null;
        this.shadeAmount = null;
        this.landInclination = null;
        this.shannonIndex = null;
        this.evennessIndex = null;
        this.name = null;
        this.type = null;
        this.numberOfPlants = null;
        this.numberOfPlantsProductive = null;
        this.numberOfPlantsNonProductive = null;
        this.numberOfPlantsYoung = null;
        this.numberOfPlantsStumped = null;
        this.numberOfPlantsTotal = null;
        this.numberOfPlantsShade = null;
        this.averageAgeOfPlants = null;
        this.minAgeOfPlants = null;
        this.maxAgeOfPlants = null;
        this.areaCrop = null;
        this.areaOrganic = null;
        this.areaSanctioned = null;
        this.areaInConversion = null;
        this.areaTotal = null;
        this.areaTotalManual = null;
        this.notes = null;
        this.cultivationStartDate = null;
        this.registrationDate = null;
        this.lastChemicalUseDate = null;
        this.lastInspectionDate = null;
        this.varieties = [];
        this.varietiesFull = [];
        this.polygon = null;
        this.polygonFull = null;
        this.geodatas = [];
        this.geodatasFull = [];
        this.primaryCrops = null;
        this.secondaryCrops = null;
        // @Type(() => CropHistoryItem)
        // cropHistory: Array<CropHistoryItem> = <Array<CropHistoryItem>>[];
        this.yieldEstimateRaw = null;
        this.yieldEstimateProcessed = null;
        this.location = null;
        this.bioDiversityData = {};
        this.season = null;
        this.seasons = [];
        this.facility = null;
        this.farm = null;
        this.name = name;
    }
};
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PlotV1.prototype, "cultivationStartDate", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PlotV1.prototype, "registrationDate", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PlotV1.prototype, "lastChemicalUseDate", void 0);
_ts_decorate([
    (0, _classtransformer.Transform)(({ value })=>(0, _utils.formatDatesForFS)(value)),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], PlotV1.prototype, "lastInspectionDate", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], PlotV1.prototype, "varieties", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('varieties'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], PlotV1.prototype, "varietiesFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PlotV1.prototype, "polygon", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('polygon'),
    _ts_metadata("design:type", typeof _GeoDataV1.default === "undefined" ? Object : _GeoDataV1.default)
], PlotV1.prototype, "polygonFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], PlotV1.prototype, "geodatas", void 0);
_ts_decorate([
    (0, _classtransformer.Exclude)(),
    (0, _ormAnnotations.expandFromId)('geodatas'),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], PlotV1.prototype, "geodatasFull", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_Coordinates.default),
    _ts_metadata("design:type", typeof _Coordinates.default === "undefined" ? Object : _Coordinates.default)
], PlotV1.prototype, "location", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PlotV1.prototype, "season", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], PlotV1.prototype, "seasons", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PlotV1.prototype, "facility", void 0);
_ts_decorate([
    (0, _classtransformer.Type)(()=>_ObjectId.ObjectId),
    _ts_metadata("design:type", typeof _ObjectId.ObjectId === "undefined" ? Object : _ObjectId.ObjectId)
], PlotV1.prototype, "farm", void 0);
