"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestorePersonExporterService", {
    enumerable: true,
    get: function() {
        return FirestorePersonExporterService;
    }
});
const _common = require("@nestjs/common");
const _personsservice = require("../../persons/persons.service");
const _AbstractExporter = require("./AbstractExporter");
const _utils = require("../v1utils/utils");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _farmsservice = require("../../farms/farms.service");
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
let FirestorePersonExporterService = class FirestorePersonExporterService extends _AbstractExporter.AbstractExporter {
    async transform(person, meta) {
        let farm = null;
        if (person.mainContactPersonFor[0]) {
            const facility = await this.prisma.facility.findUnique({
                where: {
                    id: person.mainContactPersonFor[0].id
                }
            });
            farm = await this.prisma.farm.findUnique({
                where: {
                    facilityId: facility.id
                },
                include: {
                    facility: true
                }
            });
        }
        const res = (0, _utils.transformUserV2)(person, farm, meta);
        return res;
    }
    async exportAll(meta, key) {
        meta.onlyCreate = true;
        return super.exportAll(meta, key);
    }
    constructor(firestoreService, myService, farmService, prisma){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.farmService = farmService;
        this.prisma = prisma;
        this.logger = new _common.Logger(FirestorePersonExporterService.name);
    }
};
FirestorePersonExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _personsservice.PersonsService === "undefined" ? Object : _personsservice.PersonsService,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], FirestorePersonExporterService);
