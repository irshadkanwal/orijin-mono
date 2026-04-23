"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FacilitiesService", {
    enumerable: true,
    get: function() {
        return FacilitiesService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _client = require("@prisma/client");
const _AbstractService = /*#__PURE__*/ _interop_require_wildcard(require("../common/service/AbstractService"));
const _prismahelper = require("../common/prisma.helper");
const _changesservice = require("../changes/changes.service");
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
let FacilitiesService = class FacilitiesService extends _AbstractService.default {
    convert(prismaFacilityClient) {
        return {
            ...prismaFacilityClient,
            address: prismaFacilityClient.address,
            type: prismaFacilityClient.type
        };
    }
    async findUnique(shortCode, organisation) {
        const existing = await this.prisma.facility.findUnique({
            where: {
                shortCode: shortCode,
                organisation: organisation,
                id: undefined,
                deletedAt: null
            }
        });
        return existing;
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { type, areaTotalManual, ...restOfValues } = body;
        const csvInput = body;
        const dtoInput = body;
        let mainContactPerson = dtoInput.mainContactPerson;
        const mainContactPersonCode = csvInput.mainContactPersonCode;
        const mainContactPersonId = dtoInput.mainContactPersonId;
        const locationCode = csvInput.locationCode;
        const customLocationCode = csvInput.customLocationCode;
        let location = dtoInput.location;
        const locationId = dtoInput.locationId;
        const customLocationId = dtoInput.customLocationId;
        const address = dtoInput.address;
        const coordinate = dtoInput.coordinate;
        let customLocation = dtoInput.customLocation;
        delete restOfValues['mainContactPerson'];
        delete restOfValues['locationCode'];
        delete restOfValues['location'];
        delete restOfValues['customLocation'];
        delete restOfValues['customLocationCode'];
        delete restOfValues['address'];
        delete restOfValues['coordinate'];
        delete restOfValues['locationId'];
        delete restOfValues['customLocationId'];
        delete restOfValues['coordinateId'];
        delete restOfValues['mainContactPersonId'];
        if (customLocationCode) {
            const locs = await this.prisma.location.findMany({
                where: {
                    AND: [
                        {
                            organisation: body.organisation
                        },
                        {
                            shortCode: customLocationCode
                        }
                    ]
                }
            });
            if (locs.length === 0) {
                throw new Error('location not found for code ' + customLocationCode);
            }
            customLocation = locs[0];
        }
        if (locationCode) {
            const locs = await this.prisma.location.findMany({
                where: {
                    AND: [
                        {
                            organisation: body.organisation
                        },
                        {
                            shortCode: locationCode
                        }
                    ]
                }
            });
            if (locs.length === 0) {
                throw new Error('location not found for code ' + locationCode);
            }
            location = locs[0];
        }
        let mainContactPersonInput = undefined;
        if (mainContactPersonCode || mainContactPersonId) {
            const persons = await this.prisma.person.findMany({
                where: {
                    AND: [
                        {
                            organisation: body.organisation
                        },
                        {
                            OR: [
                                {
                                    shortCode: mainContactPersonCode
                                },
                                {
                                    id: mainContactPersonId
                                }
                            ]
                        }
                    ]
                }
            });
            mainContactPerson = persons[0];
        }
        if (mainContactPerson) {
            if (mainContactPerson.id) {
                mainContactPersonInput = {
                    connect: {
                        id: mainContactPerson.id
                    }
                };
            } else {
                mainContactPersonInput = {
                    create: mainContactPerson
                };
            }
        }
        return {
            ...restOfValues,
            type: type,
            address: address,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mainContactPerson: mainContactPersonInput,
            location: location ? {
                connect: {
                    id: location.id
                }
            } : locationId ? {
                connect: {
                    id: locationId
                }
            } : undefined,
            customLocation: customLocation //
             ? {
                connect: {
                    id: customLocation.id
                }
            } : customLocationId ? {
                connect: {
                    id: customLocationId
                }
            } : undefined,
            areaTotalManual: areaTotalManual ? new _client.Prisma.Decimal(areaTotalManual) : null,
            coordinate: coordinate ? {
                create: coordinate
            } : undefined
        };
    }
    async getMany(filters = {}) {
        const { sort, sortOrder, name, type } = filters;
        const where = {
            organisation: filters.organisation,
            deletedAt: null,
            name: name ? {
                contains: name,
                mode: _client.Prisma.QueryMode.insensitive
            } : undefined,
            type: type ? {
                contains: type,
                mode: _client.Prisma.QueryMode.insensitive
            } : undefined,
            ...filters.notFarm ? {
                type: {
                    not: 'Farm'
                }
            } : {}
        };
        const orderBy = sort ? [
            {
                [sort]: sortOrder || 'asc'
            }
        ] : this.getDefaultOrderBy();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [data, count] = await this.prisma.$transaction([
            this.prisma.facility.findMany({
                where: where,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                orderBy: orderBy,
                include: {
                    location: {
                        include: {
                            parent: {
                                include: {
                                    parent: {
                                        include: {
                                            parent: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    customLocation: {
                        include: {
                            parent: {
                                include: {
                                    parent: {
                                        include: {
                                            parent: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    mainContactPerson: true
                },
                ...(0, _prismahelper.addPagination)(filters)
            }),
            this.prismaDelegate.count({
                where: where
            })
        ]);
        // return { data, count };
        return {
            data: data.map(this.convertModel),
            count: count
        };
    }
    async convertForImport(body) {
        delete body['parentFacilityCode'];
        delete body['locationParentParentCode'];
        delete body['parentLocationParentParentParent'];
        return {
            ...body,
            areaTotalManual: (0, _AbstractService.parseIntForInport)(body.areaTotalManual)
        };
    }
    constructor(prisma, changes){
        super(prisma, prisma.facility, changes);
        this.prisma = prisma;
        this.changes = changes;
        this.logger = new _common.Logger(FacilitiesService.name);
        this.objectType = 'Facility';
    }
};
FacilitiesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _changesservice.ChangesService === "undefined" ? Object : _changesservice.ChangesService
    ])
], FacilitiesService);
