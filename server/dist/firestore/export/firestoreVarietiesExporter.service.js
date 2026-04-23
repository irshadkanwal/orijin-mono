"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreVarietiesExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreVarietiesExporterService;
    }
});
const _common = require("@nestjs/common");
const _cropvarietyservice = require("../../crops/cropvariety.service");
const _AbstractExporter = require("./AbstractExporter");
const _VarietyV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/VarietyV1"));
const _utils = require("../v1utils/utils");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _ObjectId = require("../v1entities/utis/ObjectId");
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
let FirestoreVarietiesExporterService = class FirestoreVarietiesExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const crop = await this.prisma.crop.findUnique({
            where: {
                id: input.cropId
            }
        });
        const res = new _VarietyV1.default();
        (0, _utils.setupIdFields)(res, input, meta);
        res.name = input.name;
        res.id.label = input.name;
        res.crop = new _ObjectId.ObjectId(input.cropId, 'crops');
        res.crop.label = crop.name;
        res.crop.labelShort = crop.shortCode;
        return res;
    }
    constructor(firestoreService, myService, prisma){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.prisma = prisma;
        this.logger = new _common.Logger(FirestoreVarietiesExporterService.name);
    }
};
FirestoreVarietiesExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _cropvarietyservice.CropvarietyService === "undefined" ? Object : _cropvarietyservice.CropvarietyService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], FirestoreVarietiesExporterService);
