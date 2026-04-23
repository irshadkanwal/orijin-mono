"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreLocationExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreLocationExporterService;
    }
});
const _common = require("@nestjs/common");
const _locationsservice = require("../../locations/locations.service");
const _AbstractExporter = require("./AbstractExporter");
const _LocationV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/LocationV1"));
const _ObjectId = require("../v1entities/utis/ObjectId");
const _utils = require("../v1utils/utils");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _FacilityV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/FacilityV1"));
const _firestoreFacilityExporterservice = require("./firestoreFacilityExporter.service");
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
let FirestoreLocationExporterService = class FirestoreLocationExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        let res = new _LocationV1.default();
        if (input.type === 'Farmergroups' || input.type === 'CollectionPoint') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res = new _FacilityV1.default();
        }
        (0, _utils.setupIdFields)(res, input, meta);
        res.name = input.name;
        res.type = input.type;
        res.id.label = res.name;
        if (input.type === 'Farmergroups') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res.type = 'FarmerGroup';
        }
        if (input.type === 'CollectionPoint') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res.type = 'CollectionPoint';
        }
        const item = await this.myService.getOne({
            id: input.id,
            org: meta.organisation
        });
        if (item.type === 'SubCounty') {
            // result.parentLocationParentParentCode = input2.shortCode;
            // result.parentLocationParentParentName = input2.name;
            if (!item.parent) {
                console.warn(`parent not defined for ${item.shortCode}: ${item.name}, this is not good, but we can get by for now`);
            // throw Error(`parent not defined for ${item.shortCode}: ${item.name}`);
            }
            res.id.authTag = item.parent?.shortCode;
        } else if (item.type === 'District') {
            // result.parentLocationParentParentParentCode = input2.shortCode;
            // result.parentLocationParentParentParentName = input2.name;
            res.id.authTag = item.shortCode;
        } else if (item.type === 'Village') {
            // result.parentLocationCode = input2.shortCode;
            // result.parentLocationName = input2.name;
            if (item.parent?.parent?.parent) {
                res.id.authTag = item.parent.parent.parent.shortCode;
            }
        } else if (item.type === 'Parish') {
            // result.parentLocationParentCode = input2?.shortCode;
            // result.parentLocationParentName = input2?.name;
            if (item.parent?.parent) {
                res.id.authTag = item.parent.parent.shortCode;
            }
        } else if (input.type === 'Farmergroups') {} else if (input.type === 'Region') {} else if (input.type === 'Zone') {} else if (input.type === 'CollectionPoint') {
        // res.parentLocationParentParent =
        //do nothing for now
        } else {
            throw Error('unknonwn input2 type ' + item.type);
        }
        if (item.parent) {
            const parentLocationId = new _ObjectId.ObjectId(item.parent.id, 'locations');
            parentLocationId.labelShort = item.parent.shortCode;
            parentLocationId.label = item.parent.name;
            res.parentLocation = parentLocationId;
            if (item.parent.parent) {
                const parentLocationParentId = new _ObjectId.ObjectId(item.parent.parent.id, 'locations');
                parentLocationParentId.labelShort = item.parent.parent.shortCode;
                parentLocationParentId.label = item.parent.parent.name;
                res.parentLocationParent = parentLocationParentId;
                if (item.parent.parent.parent) {
                    const parentLocationParentParentId = new _ObjectId.ObjectId(item.parent.parent.parent.id, 'locations');
                    parentLocationParentParentId.labelShort = item.parent.parent.parent.shortCode;
                    parentLocationParentParentId.label = item.parent.parent.parent.name;
                    res.parentLocationParentParent = parentLocationParentParentId;
                }
            }
        }
        return res;
    }
    constructor(firestoreService, myService, facilityExporter){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.facilityExporter = facilityExporter;
        this.logger = new _common.Logger(FirestoreLocationExporterService.name);
    }
};
FirestoreLocationExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _locationsservice.LocationsService === "undefined" ? Object : _locationsservice.LocationsService,
        typeof _firestoreFacilityExporterservice.FirestoreFacilityExporterService === "undefined" ? Object : _firestoreFacilityExporterservice.FirestoreFacilityExporterService
    ])
], FirestoreLocationExporterService);
