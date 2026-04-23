"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreFacilityExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreFacilityExporterService;
    }
});
const _common = require("@nestjs/common");
const _AbstractExporter = require("./AbstractExporter");
const _FacilityV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/FacilityV1"));
const _ObjectId = require("../v1entities/utis/ObjectId");
const _utils = require("../v1utils/utils");
const _facilitiesservice = require("../../facilities/facilities.service");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
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
let FirestoreFacilityExporterService = class FirestoreFacilityExporterService extends _AbstractExporter.AbstractExporter {
    async transform(item, meta) {
        const res = new _FacilityV1.default();
        (0, _utils.setupIdFields)(res, item, meta);
        res.name = item.name;
        res.type = item.type;
        res.id.label = res.name;
        // console.log('processing', item);
        if (item.location) {
            const parentLocationId = new _ObjectId.ObjectId(item.location.id, 'locations');
            parentLocationId.labelShort = item.location.shortCode;
            parentLocationId.label = item.location.name;
            //VILLAGE
            res.parentLocation = parentLocationId;
            if (item.location.parent) {
                const parentLocationParentId = new _ObjectId.ObjectId(item.location.parent.id, 'locations');
                parentLocationParentId.labelShort = item.location.parent.shortCode;
                parentLocationParentId.label = item.location.parent.name;
                //PARISH
                res.parentLocationParent = parentLocationParentId;
                if (item.location.parent.parent) {
                    const parentLOcationParentParentId = new _ObjectId.ObjectId(item.location.parent.parent.id, 'locations');
                    parentLOcationParentParentId.labelShort = item.location.parent.parent.shortCode;
                    parentLOcationParentParentId.label = item.location.parent.parent.name;
                    //SUB COUNTY
                    res.parentLocationParentParent = parentLOcationParentParentId;
                    if (item.location.parent.parent.parent) {
                        const parentLocationParentParentParentId = new _ObjectId.ObjectId(item.location.parent.parent.parent.id, 'locations');
                        parentLocationParentParentParentId.labelShort = item.location.parent.parent.parent.shortCode;
                        parentLocationParentParentParentId.label = item.location.parent.parent.parent.name;
                        //DISTRCIT
                        res.parentLocationParentParentParent = parentLocationParentParentParentId;
                    }
                }
            }
        }
        return res;
    }
    async exportAll(meta) {
        const inputs = await this.myService.getMany({
            organisation: meta.organisation,
            type: 'CollectionPoint'
        });
        // console.log('inputs', inputs);
        console.log('Exporting facilities');
        const transformed = await Promise.all(inputs.data.map((s)=>this.transform(s, meta)));
        // console.log('transformed', transformed);
        if (meta.onlyCreate) {
            const upserted = await Promise.all(transformed.map((a)=>this.onlyCreate(a)));
            // console.log('upserted', upserted);
            console.log('Exporting facilities done');
            return upserted;
        } else {
            const upserted = await Promise.all(transformed.map((a)=>this.upsert(a)));
            // console.log('upserted', upserted);
            console.log('Exporting facilities done');
            return upserted;
        }
    }
    constructor(firestoreService, myService){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.logger = new _common.Logger(FirestoreFacilityExporterService.name);
    }
};
FirestoreFacilityExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _facilitiesservice.FacilitiesService === "undefined" ? Object : _facilitiesservice.FacilitiesService
    ])
], FirestoreFacilityExporterService);
