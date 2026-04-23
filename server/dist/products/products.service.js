"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProductsService", {
    enumerable: true,
    get: function() {
        return ProductsService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = /*#__PURE__*/ _interop_require_wildcard(require("../common/service/AbstractService"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
let ProductsService = class ProductsService extends _AbstractService.default {
    standardInclude() {
        return {
            productType: true,
            originLocation: true,
            originVariety: true
        };
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { productTypeCode, ...rest } = body;
        const csvInput = body;
        const dtoInput = body;
        const productTypeId = dtoInput.productTypeId;
        const originLocationId = dtoInput.originLocationId;
        const originVarietyId = dtoInput.originVarietyId;
        const cropVarietyCodes = csvInput.cropVarietyCodes;
        const originLocationCodes = csvInput.originLocationCodes;
        delete rest['certificationTypes'];
        // delete rest['singleOrigin'];
        // delete rest['originLocations'];
        delete rest['originFacilities'];
        delete rest['productTypeId'];
        delete rest['cropVarietyCodes'];
        delete rest['originLocationCodes'];
        delete rest['originVarietyId'];
        delete rest['originLocationId'];
        const productTypesStored = await this.prisma.productType.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: productTypeId
                            },
                            {
                                shortCode: productTypeCode
                            }
                        ]
                    }
                ]
            }
        });
        if (productTypesStored.length === 0) {
            throw new Error('productType not found for code ' + (productTypeCode || productTypeId));
        }
        const varietiesStored = await this.prisma.cropVariety.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: originVarietyId
                            }
                        ]
                    }
                ]
            }
        });
        if (varietiesStored.length === 0) {
            throw new Error('crop varieties not found for code ' + originVarietyId);
        }
        const originLocationsStored = await this.prisma.location.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: originLocationId
                            }
                        ]
                    }
                ]
            }
        });
        if (originLocationsStored.length === 0) {
            throw new Error('location not found for code ' + originLocationsStored);
        }
        const resultValues = {
            ...rest,
            productType: {
                connect: {
                    id: productTypesStored[0].id
                }
            },
            originVariety: {
                connect: {
                    id: varietiesStored[0].id
                }
            },
            originLocation: {
                connect: {
                    id: originLocationsStored[0].id
                }
            }
        };
        if (cropVarietyCodes && cropVarietyCodes.length > 0) {
            const varietiesSplit = cropVarietyCodes ? cropVarietyCodes.split(';') : [];
            const varieties = await Promise.all(varietiesSplit.map((p)=>{
                return this.prisma.cropVariety.findUnique({
                    where: {
                        shortCode_organisation: {
                            shortCode: p,
                            organisation: body.organisation
                        }
                    }
                });
            }));
            if (varieties.some((a)=>!a?.id)) {
                throw Error('varieties not found ' + cropVarietyCodes);
            }
            //not working for some reason!!
            // originVarieties: {
            //   // deleteMany: {},
            //   create: varieties.map((od) => ({
            //     cropVariety: {
            //       connect: { id: od.id },
            //     },
            //   })),
            // },
            resultValues.originVariety = {
                // deleteMany: {},
                connect: {
                    id: varieties[0].id
                }
            };
        }
        if (originLocationCodes && originLocationCodes.length > 0) {
            const split = cropVarietyCodes ? originLocationCodes.split(';') : [];
            const locations = await Promise.all(split.map(async (p)=>{
                const items = await this.prisma.location.findMany({
                    where: {
                        AND: [
                            {
                                organisation: body.organisation
                            },
                            {
                                shortCode: p
                            }
                        ]
                    }
                });
                if (items.length !== 1) {
                    console.log('LOCATIONS HERE', items);
                    throw Error('locations not found ' + p);
                }
                return items[0];
            }));
            //not working for some reason!!
            // resultValues.originLocations = {
            //   // deleteMany: {},
            //   create: locations.map((od) => ({
            //     location: {
            //       connect: { id: od.id, organisation: body.organisation },
            //     },
            //   })),
            // };
            if (!locations[0]) {
            // console.error('locations:' + originLocationCodes, locations);
            // throw Error('locations not found ' + originLocationCodes);
            } else {
                resultValues.originLocation = {
                    // deleteMany: {},
                    connect: {
                        id: locations[0].id
                    }
                };
            }
        }
        return resultValues;
    }
    async convertForImport(body) {
        const item = await super.convertForImport(body);
        delete body['defaultPackagingContainer'];
        delete body['originFacilityCode'];
        delete body['originFarms'];
        // delete body['originLocationCodes'];
        return {
            ...item,
            singleOrigin: (0, _AbstractService.parseBooleanForImport)(body.singleOrigin),
            grade: (0, _AbstractService.parseIntForInport)(body.grade),
            dry: (0, _AbstractService.parseBooleanForImport)(body.dry),
            organic: (0, _AbstractService.parseBooleanForImport)(body.organic)
        };
    }
    constructor(prisma){
        super(prisma, prisma.product);
        this.prisma = prisma;
        this.logger = new _common.Logger(ProductsService.name);
    }
};
ProductsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], ProductsService);
