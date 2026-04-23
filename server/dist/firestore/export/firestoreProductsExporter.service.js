"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreProductsExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreProductsExporterService;
    }
});
const _common = require("@nestjs/common");
const _productsservice = require("../../products/products.service");
const _AbstractExporter = require("./AbstractExporter");
const _ProductV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/ProductV1"));
const _ObjectId = require("../v1entities/utis/ObjectId");
const _utils = require("../v1utils/utils");
const _nestjsprisma = require("nestjs-prisma");
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
let FirestoreProductsExporterService = class FirestoreProductsExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const res = new _ProductV1.default();
        (0, _utils.setupIdFields)(res, input, meta);
        res.id.label = input.name;
        res.name = input.name;
        res.name = input.name;
        res.sku = input.sku;
        res.organic = input.organic;
        res.dry = input.dry;
        if (input.originVariety) {
            const varietyId = new _ObjectId.ObjectId(input.originVariety.id, 'varieties');
            varietyId.labelShort = input.originVariety.shortCode;
            varietyId.label = input.originVariety.name;
            res.variety = varietyId;
        }
        const prices = await this.prisma.price.findMany({
            where: {
                organisation: meta.organisation,
                productId: input.id
            }
        });
        if (prices && prices.length == 1) {
            const priceId = new _ObjectId.ObjectId(prices[0].id, 'varietyprices');
            priceId.labelShort = input.shortCode;
            priceId.label = input.name;
            res.varietyPrice = priceId;
        }
        if (input.originLocation) {
            const originLocationId = new _ObjectId.ObjectId(input.originLocation.id, 'locations');
            originLocationId.labelShort = input.originLocation.shortCode;
            originLocationId.label = input.originLocation.name;
            //DISTRICT
            res.originLocation = originLocationId;
        }
        // res.crop = new ObjectId('', '', '');
        // res.originFacility = '';
        // res.originProducer = '';
        // res.price = '';
        // res.type = '';
        // res.singleOrigin = '';
        return res;
    }
    constructor(firestoreService, myService, prisma){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.prisma = prisma;
        this.logger = new _common.Logger(FirestoreProductsExporterService.name);
    }
};
FirestoreProductsExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], FirestoreProductsExporterService);
