"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreFarmExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreFarmExporterService;
    }
});
const _common = require("@nestjs/common");
const _farmsservice = require("../../farms/farms.service");
const _AbstractExporter = require("./AbstractExporter");
const _FarmV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/farms/FarmV1"));
const _utils = require("../v1utils/utils");
const _ObjectId = require("../v1entities/utis/ObjectId");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _nestjsprisma = require("nestjs-prisma");
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
let FirestoreFarmExporterService = class FirestoreFarmExporterService extends _AbstractExporter.AbstractExporter {
    async getMany(organisation) {
        const inputs = await this.v2Service.getManyImpl({
            organisation
        });
        return inputs.data;
    }
    async transform(input, meta) {
        const currentFarm = await this.firestoreService.getById(input.id, _FarmV1.default, {
            ...meta,
            currentUser: meta.userId
        });
        const result = new _FarmV1.default();
        (0, _utils.setupIdFields)(result, input, meta);
        const facility = input.facility;
        if (currentFarm?.mobilePayRegistrationStatus) {
            result.mobilePayRegistrationStatus = currentFarm.mobilePayRegistrationStatus;
            result.mobilePayWallets = currentFarm.mobilePayWallets;
            result.mobilePayWalletsFull = currentFarm.mobilePayWalletsFull;
            result.mobilePayWalletsFullIds = currentFarm.mobilePayWalletsFullIds;
            //based on yeild estimates from plots + production data...!
            result.maxQuantityProcessedLimitProcessed = null;
            result.maxQuantityProcessedLimitRaw = null;
            result.quantityProcessedCurrentSeasonRaw = null;
            result.quantityProcessedCurrentSeasonProcessed = null;
        }
        const mainContactPerson = facility.mainContactPerson;
        const contacts = await this.prisma.contact.findMany({
            where: {
                personId: mainContactPerson.id
            },
            include: {
                wallets: true
            }
        });
        result.name = facility.name;
        result.id.labelShort = facility.shortCode;
        result.id.label = facility.name;
        result.certificationStatus = input.certificationStatus;
        if (mainContactPerson) {
            const contact = (0, _utils.transformUserV2)(mainContactPerson, input, meta);
            contact.contactPersonForFacility = result.id;
            result.mainContactPerson = contact.id;
        }
        const location = input.facility.location;
        if (location) {
            const myLocation = location;
            const parentLocationId = new _ObjectId.ObjectId(myLocation.id, 'locations');
            parentLocationId.labelShort = myLocation.shortCode;
            parentLocationId.label = myLocation.name;
            //VILLAGE
            result.parentLocation = parentLocationId;
            if (myLocation.parent) {
                const parentLocationParentId = new _ObjectId.ObjectId(myLocation.parent.id, 'locations');
                parentLocationParentId.labelShort = myLocation.parent.shortCode;
                parentLocationParentId.label = myLocation.parent.name;
                //PARISH
                result.parentLocationParent = parentLocationParentId;
                if (myLocation.parent.parent) {
                    const parentLOcationParentParentId = new _ObjectId.ObjectId(myLocation.parent.parent.id, 'locations');
                    parentLOcationParentParentId.labelShort = myLocation.parent.parent.shortCode;
                    parentLOcationParentParentId.label = myLocation.parent.parent.name;
                    //SUB COUNTY
                    result.parentLocationParentParent = parentLOcationParentParentId;
                    if (myLocation.parent.parent.parent) {
                        const parentLocationParentParentParentId = new _ObjectId.ObjectId(myLocation.parent.parent.parent.id, 'locations');
                        parentLocationParentParentParentId.labelShort = myLocation.parent.parent.parent.shortCode;
                        parentLocationParentParentParentId.label = myLocation.parent.parent.parent.name;
                        //DISTRCIT
                        result.parentLocationParentParentParent = parentLocationParentParentParentId;
                    }
                }
            }
        }
        (0, _utils.parseLocationHierarchyStart)(result, location);
        return result;
    }
    async exportAll(meta, key) {
        meta.onlyCreate = true;
        return super.exportAll(meta, key);
    }
    constructor(firestoreService, myService, prisma){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.prisma = prisma;
        this.logger = new _common.Logger(FirestoreFarmExporterService.name);
    }
};
FirestoreFarmExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], FirestoreFarmExporterService);
