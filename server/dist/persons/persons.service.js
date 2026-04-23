"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PersonsService", {
    enumerable: true,
    get: function() {
        return PersonsService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _prismahelper = require("../common/prisma.helper");
const _locationsservice = require("../locations/locations.service");
const _AbstractService = /*#__PURE__*/ _interop_require_wildcard(require("../common/service/AbstractService"));
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
let PersonsService = class PersonsService extends _AbstractService.default {
    standardInclude() {
        return {
            contacts: {
                include: {
                    wallets: true
                }
            },
            mainContactPersonFor: {
                include: {
                    location: {
                        include: {
                            ..._locationsservice.locationParentInclude
                        }
                    },
                    customLocation: {
                        include: {
                            ..._locationsservice.locationParentInclude
                        }
                    },
                    coordinate: true,
                    farm: true
                }
            }
        };
    }
    servicesActivitiesInclude() {
        return {
            ...this.standardInclude(),
            ServiceActivityBeneficiaries: {
                include: {
                    supportingServiceActivity: {
                        include: {
                            supportingServiceActivityType: true,
                            supportingServiceCategory: true,
                            supportingServiceCategoryType: true,
                            location: {
                                include: {
                                    facilities: {
                                        include: {
                                            mainContactPerson: true
                                        }
                                    },
                                    facilitiesCustom: {
                                        include: {
                                            mainContactPerson: true
                                        }
                                    }
                                }
                            },
                            serviceActivityLocations: {
                                include: {
                                    location: {
                                        include: {
                                            facilitiesCustom: {
                                                include: {
                                                    mainContactPerson: true
                                                }
                                            },
                                            ..._locationsservice.locationParentInclude
                                        }
                                    }
                                }
                            },
                            supportingServiceInputType: true
                        }
                    },
                    person: true
                }
            }
        };
    }
    async getMany(filters) {
        const args = {
            where: this.convertFiltersToWhere(filters),
            include: this.standardInclude(),
            orderBy: {
                createdAt: 'desc'
            },
            ...(0, _prismahelper.addPagination)(filters)
        };
        const [data, count] = await this.prisma.$transaction([
            this.prisma.person.findMany(args),
            this.prisma.person.count({
                where: args.where
            })
        ]);
        return {
            data: data,
            count
        };
    }
    async convertForImport(body) {
        //TODO: use .skip instead in the import files...
        delete body['contactPersonForFacility'];
        delete body['parentLocationParentParentParent'];
        delete body['parentLocationParentParent'];
        delete body['parentLocationParent'];
        delete body['VILLAGE'];
        delete body['parentLocation'];
        delete body['parentFacility'];
        delete body['name'];
        delete body['season'];
        const res = {
            ...body,
            dateOfBirth: (0, _AbstractService.parseDateForImport)(body.dateOfBirth),
            dateOfBirthApproximate: (0, _AbstractService.parseBooleanForImport)(body.dateOfBirthApproximate)
        };
        return res;
    }
    async getCustomizedMany(where) {
        return this.prisma.person.findMany({
            where
        });
    }
    connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const personBody = body;
        //should do the actual linking here also...
        if (personBody.mainContactPersonFor && personBody.mainContactPersonFor.length == 0) {
            personBody.mainContactPersonFor = undefined;
        } else if (personBody.mainContactPersonFor) {
            //TODO: not sure if this will delink everything...
            personBody.mainContactPersonFor = undefined;
        }
        if (personBody.ServiceActivityBeneficiaries && personBody.ServiceActivityBeneficiaries.length == 0) {
            personBody.ServiceActivityBeneficiaries = undefined;
        } else if (personBody.ServiceActivityBeneficiaries) {
            personBody.ServiceActivityBeneficiaries = undefined;
        }
        //TODO: fix the types
        return body;
    }
    constructor(prisma, changes){
        super(prisma, prisma.person, changes);
        this.prisma = prisma;
        this.changes = changes;
        this.logger = new _common.Logger(PersonsService.name);
        this.objectType = 'Person';
        this.convertFiltersToWhere = (filters)=>{
            if (!filters?.organisation) {
                throw new Error('Search without organisation not allowed');
            }
            const where = {
                organisation: filters.organisation
            };
            if (filters.location) {
                const locations = decodeURIComponent(filters.location).split(',');
                const nameOrShortcode = (location)=>({
                        OR: [
                            {
                                name: {
                                    equals: location,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                shortCode: {
                                    equals: location,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    });
                where.mainContactPersonFor = {
                    some: {
                        AND: []
                    }
                };
                where.mainContactPersonFor.some.AND.push({
                    OR: locations.map((location)=>({
                            OR: [
                                {
                                    location: nameOrShortcode(location)
                                },
                                {
                                    location: {
                                        parent: nameOrShortcode(location)
                                    }
                                },
                                {
                                    location: {
                                        parent: {
                                            parent: nameOrShortcode(location)
                                        }
                                    }
                                },
                                {
                                    location: {
                                        parent: {
                                            parent: {
                                                parent: nameOrShortcode(location)
                                            }
                                        }
                                    }
                                }
                            ]
                        }))
                });
            }
            if (filters.shortCode) {
                const [firstNamePart, lastNamePart] = filters.shortCode.split(' ');
                return {
                    AND: [
                        where,
                        {
                            OR: [
                                {
                                    shortCode: {
                                        contains: filters.shortCode,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    firstName: {
                                        contains: filters.shortCode,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    lastName: {
                                        contains: filters.shortCode || '',
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    email: {
                                        contains: filters.shortCode,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    AND: [
                                        {
                                            firstName: {
                                                contains: firstNamePart,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            lastName: {
                                                contains: lastNamePart || '',
                                                mode: 'insensitive'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
            }
            return where;
        };
    }
};
PersonsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _changesservice.ChangesService === "undefined" ? Object : _changesservice.ChangesService
    ])
], PersonsService);
