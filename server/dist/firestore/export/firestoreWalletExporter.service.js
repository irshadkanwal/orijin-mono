"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreWalletExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreWalletExporterService;
    }
});
const _common = require("@nestjs/common");
const _AbstractExporter = require("./AbstractExporter");
const _utils = require("../v1utils/utils");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _WalletV1 = require("../v1entities/payments/WalletV1");
const _walletsservice = require("../../persons/wallets.service");
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
let FirestoreWalletExporterService = class FirestoreWalletExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const res = new _WalletV1.WalletV1();
        (0, _utils.setupIdFields)(res, input, meta);
        res.id.labelShort = input.phone;
        res.id.label = input.phone;
        res.type = 'MobilePay';
        res.firstName = input.externalFirstName;
        res.name_matches_network_score = input.name_matches_network_score ? input.name_matches_network_score.toNumber() : null;
        res.name_matches_network_status = input.name_matches_network_status;
        res.name_on_network = input.name_on_network;
        res.errorStatus = input.errorStatus;
        res.errorMsg = input.errorMsg;
        res.firstName = input.externalLastName;
        res.externalId = input.externalId;
        res.phone = input.phone;
        // usingFarms: Array<ObjectId>;
        // usingFarmsFull: Array<WalletV1>;
        // usingFarmsFullIds: Array<string> = [];
        return res;
    }
    async exportAll(meta, key) {
        meta.onlyCreate = true;
        return super.exportAll(meta, key);
    }
    constructor(firestoreService, myService){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.logger = new _common.Logger(FirestoreWalletExporterService.name);
    }
};
FirestoreWalletExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _walletsservice.WalletsService === "undefined" ? Object : _walletsservice.WalletsService
    ])
], FirestoreWalletExporterService);
