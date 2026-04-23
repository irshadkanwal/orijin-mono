"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreProductPriceExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreProductPriceExporterService;
    }
});
const _common = require("@nestjs/common");
const _productsservice = require("../../products/products.service");
const _AbstractExporter = require("./AbstractExporter");
const _productPriceservice = require("../../products/productPrice.service");
const _VarietyPriceV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/VarietyPriceV1"));
const _PriceContainer = /*#__PURE__*/ _interop_require_default(require("../v1entities/utis/PriceContainer"));
const _AmountUnit = /*#__PURE__*/ _interop_require_default(require("../v1entities/utis/AmountUnit"));
const _utils = require("../v1utils/utils");
const _ObjectId = require("../v1entities/utis/ObjectId");
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
let FirestoreProductPriceExporterService = class FirestoreProductPriceExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const res = new _VarietyPriceV1.default();
        (0, _utils.setupIdFields)(res, input, meta);
        const product = await this.pProductsService.getOne({
            id: input.productId,
            org: meta.organisation
        });
        res.id.label = product.name;
        res.name = product.name;
        const variety = await this.prisma.cropVariety.findUnique({
            where: {
                id: product.originVarietyId,
                deletedAt: null
            }
        });
        res.variety = new _ObjectId.ObjectId(product.originVarietyId, 'varieties', variety.shortCode);
        res.variety.label = variety.name;
        res.price = new _PriceContainer.default();
        res.price.price = new _AmountUnit.default(input.amount.toNumber(), input.unit);
        res.price.perWeight = new _AmountUnit.default(input.perAmountAmount.toNumber(), input.perAmountUnit);
        return res;
    }
    constructor(firestoreService, myService, pProductsService, prisma){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.pProductsService = pProductsService;
        this.prisma = prisma;
        this.logger = new _common.Logger(FirestoreProductPriceExporterService.name);
    }
};
FirestoreProductPriceExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _productPriceservice.ProductPriceService === "undefined" ? Object : _productPriceservice.ProductPriceService,
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService,
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], FirestoreProductPriceExporterService);
