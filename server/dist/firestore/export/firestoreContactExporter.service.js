"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreContactExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreContactExporterService;
    }
});
const _common = require("@nestjs/common");
const _AbstractExporter = require("./AbstractExporter");
const _utils = require("../v1utils/utils");
const _OrmProvider = /*#__PURE__*/ _interop_require_default(require("../v1services/OrmProvider"));
const _ContactV1 = require("../v1entities/farms/ContactV1");
const _contactsservice = require("../../persons/contacts.service");
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
let FirestoreContactExporterService = class FirestoreContactExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const res = new _ContactV1.ContactV1();
        (0, _utils.setupIdFields)(res, input, meta);
        res.id.label = `${input.phone}`;
        res.firstName = input.firstName;
        res.lastName = input.lastName;
        res.phone = input.phone;
        res.registeredUnderPrincipalsName = input.registeredUnderPrincipalsName;
        res.registeredForMobileMoney = input.registeredForMobileMoney;
        const person = await this.prisma.person.findUnique({
            where: {
                id: input.personId
            }
        });
        const personId = new _ObjectId.ObjectId(input.personId, 'users');
        personId.labelShort = person.shortCode;
        personId.label = `${person.firstName} ${person.lastName}`;
        res.entity = personId;
        const wallets = await this.prisma.wallet.findMany({
            where: {
                contactId: input.id
            }
        });
        if (wallets.length > 0) {
            const wallet = wallets[0];
            const walletId = new _ObjectId.ObjectId(wallet.id, 'wallets');
            walletId.labelShort = wallet.phone;
            walletId.label = wallet.phone;
            res.wallet = walletId;
        }
        return res;
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
        this.logger = new _common.Logger(FirestoreContactExporterService.name);
    }
};
FirestoreContactExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _contactsservice.ContactsService === "undefined" ? Object : _contactsservice.ContactsService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], FirestoreContactExporterService);
