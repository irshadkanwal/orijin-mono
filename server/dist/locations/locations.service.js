"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    LocationsService: function() {
        return LocationsService;
    },
    locationParentInclude: function() {
        return locationParentInclude;
    }
});
const _common = require("@nestjs/common");
const _locationsmodel = require("./models/locations.model");
const _nestjsprisma = require("nestjs-prisma");
const _AbstractService = require("../common/service/AbstractService");
const _prismahelper = require("../common/prisma.helper");
const _orderdirection = require("../common/order/order-direction");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function convert(prismaLocationClient) {
    return {
        ...prismaLocationClient
    };
}
const locationParentInclude = {
    // First
    parent: {
        include: {
            // Second
            parent: {
                include: {
                    // Third
                    parent: {
                        include: {
                            // Fourth
                            parent: true
                        }
                    }
                }
            }
        }
    }
};
let LocationsService = class LocationsService {
    async getOne(params) {
        if (params.id) {
            const locationById = await this.prisma.location.findUnique({
                where: {
                    id: params.id,
                    organisation: params.org
                },
                include: locationParentInclude
            });
            return convert(locationById);
        }
        const locationByShortcode = await this.prisma.location.findMany({
            where: {
                shortCode: params.shortCode,
                organisation: params.org
            },
            include: locationParentInclude
        });
        return convert(locationByShortcode[0]);
    }
    async getAllForFilterOptions(filters) {
        const defaultOrderBy = [
            {
                mainType: _orderdirection.OrderDirection.asc
            },
            {
                type: _orderdirection.OrderDirection.asc
            }
        ];
        const whereClause = this.convertFiltersToWhere(filters);
        return this.prisma.location.findMany({
            orderBy: defaultOrderBy,
            include: {
                parent: true
            },
            where: whereClause
        });
    }
    async getMany(filters = {}) {
        const { pagination, sorting, filters: filterFields } = (0, _prismahelper.parseFilters)(filters);
        const locationWhereClause = this.convertFiltersToWhere(filterFields);
        const inputPagination = (0, _prismahelper.addPagination)(pagination);
        const { sort, sortOrder } = sorting;
        const defaultOrderBy = [
            {
                mainType: _orderdirection.OrderDirection.asc
            },
            {
                type: _orderdirection.OrderDirection.asc
            }
        ];
        const orderBy = sort ? [
            {
                [sort]: sortOrder || _orderdirection.OrderDirection.desc
            },
            {
                mainType: _orderdirection.OrderDirection.asc
            }
        ] : defaultOrderBy;
        const [data, count] = await this.prisma.$transaction([
            this.prisma.location.findMany({
                where: locationWhereClause,
                orderBy: orderBy,
                include: {
                    parent: true
                },
                ...inputPagination
            }),
            this.prisma.location.count({
                where: locationWhereClause
            })
        ]);
        return {
            data: data,
            count: count
        };
    }
    async create(body) {
        // this.logger.log(`Creating ${body.type} / ${body.shortCode} / ${body.name}`);
        const { parent, parentCode, ...values } = body;
        let parentId = values.parentId;
        delete values.parentId;
        try {
            if (parentCode && parentCode.length > 0) {
                const parent = await this.prisma.location.findMany({
                    where: {
                        AND: [
                            {
                                organisation: body.organisation
                            },
                            {
                                shortCode: parentCode
                            }
                        ]
                    }
                });
                if (parent.length === 0) {
                    throw Error(`parent not found with: ${parentCode}.`);
                }
                parentId = parent[0].id;
            }
            return convert(await this.prisma.location.create({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data: {
                    ...values,
                    parent: parent || parentId ? {
                        connect: {
                            id: parent?.id || parentId
                        }
                    } : undefined
                },
                include: locationParentInclude
            }));
        } catch (err) {
            this.logger.warn(JSON.stringify(err));
            this.logger.warn(err);
            this.logger.warn(body);
            if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2002' && err.meta.target[0] === 'shortCode') {
                return await this.getOne({
                    shortCode: body.shortCode,
                    org: body.organisation
                });
            } else {
                throw err;
            }
        }
    }
    async update(id, body) {
        this.logger.log(`Updating ${body.type} / ${body.shortCode}`);
        const { parentId, name, shortCode, type } = body;
        const isDistrict = type === _locationsmodel.LocationLevels.DISTRICT;
        const parentUpdate = isDistrict ? {
            disconnect: true
        } : parentId ? {
            connect: {
                id: parentId
            }
        } : undefined;
        return convert(await this.prisma.location.update({
            where: {
                id: id
            },
            data: {
                name,
                shortCode,
                type,
                parent: parentUpdate
            },
            include: locationParentInclude
        }));
    }
    async delete(id) {
        this.logger.log(`Deleting ${id}`);
        await this.prisma.location.delete({
            where: {
                id
            }
        });
        return {
            sucess: true
        };
    }
    async getCustomizedMany(where) {
        return this.prisma.location.findMany({
            where
        });
    }
    async upsertImport(body) {
        const { shortCode, organisation, ...restOfValues } = body;
        (0, _AbstractService.cleanCsvImportFields)(body);
        if (!body.shortCode) {
            this.logger.error(body);
            throw Error('all imports need to have a shortcode');
        }
        const existing = await this.prisma.location.findUnique({
            where: {
                shortCode: shortCode,
                organisation: organisation,
                id: undefined
            }
        });
        if (existing) {
            return this.update(existing.id, {
                ...existing,
                ...body
            });
        }
        // console.log('before conversion', body);
        return this.create(body);
    }
    async getDescendantLocations(locationId) {
        const descendants = await this.prisma.location.findMany({
            where: {
                OR: [
                    {
                        id: locationId
                    },
                    {
                        parentId: locationId
                    },
                    {
                        parent: {
                            parentId: locationId
                        }
                    },
                    {
                        parent: {
                            parent: {
                                parentId: locationId
                            }
                        }
                    }
                ]
            },
            select: {
                id: true
            }
        });
        return descendants.map((location)=>location.id);
    }
    async getFarmsPerLocation(organisation, filters) {
        let custom = true;
        let locations = await this.prisma.location.findMany({
            where: {
                organisation,
                type: {
                    in: [
                        'Zone',
                        'Region'
                    ]
                }
            }
        });
        // If no custom locations exist for org
        if (locations.length === 0) {
            custom = false;
            locations = await this.prisma.location.findMany({
                where: {
                    organisation,
                    type: {
                        in: [
                            'District',
                            'SubCounty'
                        ]
                    }
                }
            });
        }
        const locationCounts = await Promise.all(locations.map(async (location)=>{
            // Fetch descendant locations for each location
            const descendantLocationIds = await this.getDescendantLocations(location.id);
            // Fetch facilities that are in the descendant locations
            const facilities = await this.prisma.facility.findMany({
                where: {
                    organisation,
                    locationId: !custom ? {
                        in: descendantLocationIds
                    } : undefined,
                    customLocationId: custom ? {
                        in: descendantLocationIds
                    } : undefined,
                    farm: {
                        season: filters.seasonCode ? {
                            shortCode: filters.seasonCode
                        } : undefined
                    }
                },
                select: {
                    id: true
                }
            });
            // Get unique facility IDs
            const uniqueFacilityIds = new Set(facilities.map((facility)=>facility.id));
            return {
                locationId: location.id,
                locationName: location.name,
                farmCount: uniqueFacilityIds.size,
                level: location.type
            };
        }));
        // Group the results by District and SubCounty
        const result = locationCounts.reduce((acc, locationCount)=>{
            if (locationCount.level === 'District' || locationCount.level === 'SubCounty' || locationCount.level === 'Zone' || locationCount.level === 'Region') {
                if (!acc[locationCount.level]) {
                    acc[locationCount.level] = [];
                }
                acc[locationCount.level].push({
                    locationId: locationCount.locationId,
                    locationName: locationCount.locationName,
                    farmCount: locationCount.farmCount
                });
            }
            return acc;
        }, {});
        return result;
    }
    async getStats() {
        const locations = await this.prisma.location.findMany();
        const countsByLevel = {
            [_locationsmodel.LocationLevels.DISTRICT]: 0,
            [_locationsmodel.LocationLevels.PARISH]: 0,
            [_locationsmodel.LocationLevels.VILLAGE]: 0,
            [_locationsmodel.LocationLevels.SUB_COUNTY]: 0
        };
        locations.forEach((location)=>{
            if (location.type in countsByLevel) {
                countsByLevel[location.type]++;
            }
        });
        const totalCount = locations.length;
        return {
            data: {
                totalCount,
                countsByLevel
            }
        };
    }
    constructor(prisma){
        this.prisma = prisma;
        this.logger = new _common.Logger(LocationsService.name);
        this.convertFiltersToWhere = (filters)=>{
            const { filters: filterFields } = (0, _prismahelper.parseFilters)(filters);
            if (!filterFields.organisation) {
                throw new Error('Search without organization not allowed');
            }
            const where = {
                organisation: filterFields.organisation,
                AND: []
            };
            if (filterFields.name || filterFields.shortCode) {
                where.AND.push({
                    OR: [
                        {
                            name: {
                                contains: filterFields.name,
                                mode: 'insensitive'
                            }
                        },
                        {
                            shortCode: {
                                contains: filterFields.shortCode,
                                mode: 'insensitive'
                            }
                        }
                    ]
                });
            }
            if (filterFields.type) {
                const types = filterFields.type.split(',');
                where.AND.push({
                    type: {
                        in: types,
                        mode: 'insensitive'
                    }
                });
            }
            if (filterFields.mainType) {
                where.AND.push({
                    mainType: filterFields.mainType
                });
            }
            return where;
        };
    }
};
LocationsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], LocationsService);
