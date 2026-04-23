"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreProductTypeExporterService", {
    enumerable: true,
    get: function() {
        return FirestoreProductTypeExporterService;
    }
});
const _common = require("@nestjs/common");
const _productsservice = require("../../products/products.service");
const _productTypesservice = require("../../products/productTypes.service");
const _AbstractExporter = require("./AbstractExporter");
const _ProductV1 = /*#__PURE__*/ _interop_require_default(require("../v1entities/refdata/ProductV1"));
const _utils = require("../v1utils/utils");
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
let FirestoreProductTypeExporterService = class FirestoreProductTypeExporterService extends _AbstractExporter.AbstractExporter {
    async transform(input, meta) {
        const res = new _ProductV1.default();
        (0, _utils.setupIdFields)(res, input, meta);
        res.id.label = input.name;
        res.name = input.name;
        return res;
    }
    constructor(firestoreService, myService, productTypesService){
        super(firestoreService, myService);
        this.firestoreService = firestoreService;
        this.myService = myService;
        this.logger = new _common.Logger(FirestoreProductTypeExporterService.name);
    }
};
FirestoreProductTypeExporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _OrmProvider.default === "undefined" ? Object : _OrmProvider.default,
        typeof _productsservice.ProductsService === "undefined" ? Object : _productsservice.ProductsService,
        typeof _productTypesservice.ProductTypesService === "undefined" ? Object : _productTypesservice.ProductTypesService
    ])
], FirestoreProductTypeExporterService);
