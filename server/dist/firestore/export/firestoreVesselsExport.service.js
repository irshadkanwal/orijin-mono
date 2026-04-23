"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreVesselsExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreVesselsExporterService;
    }
});
const _common = require("@nestjs/common");
const _AbstractExporter = require("./AbstractExporter");
const _utils = require("../v1utils/utils");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _vesselsservice = require("../../vessels/vessels.service");
const _VesselV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/VesselV1"));
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
let FirestoreVesselsExporterService = class FirestoreVesselsExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const vesselObj = new _VesselV1.default();
        // Set up ID fields based on utility function
        (0, _utils.setupIdFields)(vesselObj, input, meta);
        // Map fields from input (Prisma model) to result (VesselV1)
        vesselObj.id.label = input.id; // Assuming setupIdFields handles id fields appropriately
        // Map Date fields (convert Prisma DateTime to JavaScript Date)
        vesselObj.createdDate = input.createdAt ? new Date(input.createdAt) : null;
        vesselObj.updatedDate = input.updatedAt ? new Date(input.updatedAt) : null;
        vesselObj.name = input.name;
        vesselObj.permanent = input.permanent ?? false;
        // Map size field from Decimal to a nested object
        if (input.size) {
            vesselObj.size = {
                amount: Number(input.size),
                unit: 'grams'
            };
        } else {
            vesselObj.size = {
                amount: null,
                unit: null
            };
        }
        // Map weight field from Decimal to a nested object
        if (input.weight) {
            vesselObj.weight = {
                amount: Number(input.weight),
                unit: 'grams'
            };
        } else {
            vesselObj.weight = {
                amount: null,
                unit: null
            };
        }
        // Map facility and plot references
        if (input.facilityId) {
            vesselObj.facility = {
                id: input.facilityId
            }; // Adjust based on your actual facility object structure
        } else {
            vesselObj.facility = null;
        }
        if (input.plotId) {
            vesselObj.plot = {
                id: input.plotId
            }; // Adjust based on your actual plot object structure
        } else {
            vesselObj.plot = null;
        }
        return vesselObj;
    }
    constructor(firestoreService, myService, prisma){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.prisma = prisma;
        this.logger = new _common.Logger(FirestoreVesselsExporterService.name);
    }
};
FirestoreVesselsExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _vesselsservice.VesselsService === "undefined" ? Object : _vesselsservice.VesselsService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], FirestoreVesselsExporterService);
