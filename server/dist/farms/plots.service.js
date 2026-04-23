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
    PlotsService: function() {
        return PlotsService;
    },
    deepPlotIncludes: function() {
        return deepPlotIncludes;
    },
    plotIncludes: function() {
        return plotIncludes;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _changesservice = require("../changes/changes.service");
const _comparisonUtil = require("../common/comparisonUtil");
const _geopolygonservice = require("../geodatas/geopolygon.service");
const _polygonUtilservice = require("../polygonUtil/polygonUtil.service");
const _geopolygonwarningsservice = require("../geodatas/geopolygonwarnings.service");
const _constants = require("../common/constants");
const _AbstractService = /*#__PURE__*/ _interop_require_wildcard(require("../common/service/AbstractService"));
const _prismahelper = require("../common/prisma.helper");
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
function convert(prismaPlotClient) {
    return {
        ...prismaPlotClient,
        type: prismaPlotClient.type
    };
}
const plotIncludes = {
    polygons: {
        include: {
            polygonWarnings: true,
            polygonInteractionWarnings: true
        }
    },
    satelliteAnalysis: true
};
const deepPlotIncludes = {
    ...plotIncludes,
    plotCountItems: {
        where: {
            deletedAt: null
        }
    },
    polygons: {
        include: {
            polygonWarnings: true,
            polygonInteractionWarnings: {
                include: {
                    polygons: {
                        include: {
                            plot: true
                        },
                        where: {
                            deletedAt: null,
                            active: true
                        }
                    }
                }
            }
        }
    }
};
let PlotsService = class PlotsService extends _AbstractService.default {
    // CRUD
    async getSeasonByFarmId(farmId) {
        const farm = await this.prisma.farm.findFirst({
            where: {
                id: farmId
            }
        });
        return farm.seasonId;
    }
    async getOne(id) {
        const plot = await this.prisma.plot.findUnique({
            where: {
                id: id
            },
            include: plotIncludes
        });
        if (!plot) {
            throw new Error('Plot not found ' + id);
        }
        return convert(plot);
    }
    async getMany(filters) {
        // Check for the first scenario
        if (!filters.farmId && !filters.farmShortcode && !filters.organisation) {
            throw new Error('Cannot search plots without a farm identifier, organisation, or farm shortcode');
        }
        // Build the where clause
        const where = {
            shortCode: filters.shortCode ?? undefined,
            deletedAt: null,
            farm: {
                ...filters.organisation ? {
                    organisation: {
                        equals: filters.organisation
                    }
                } : {},
                ...filters.farmId ? {
                    id: filters.farmId
                } : {},
                facility: filters.farmShortcode ? {
                    shortCode: {
                        equals: filters.farmShortcode
                    }
                } : undefined
            }
        };
        // Construct pagination and sorting args (adjust as needed)
        const sorting = {
            sort: 'createdAt',
            sortOrder: 'asc'
        }; // Example sorting
        const orderBy = sorting.sort ? [
            {
                [sorting.sort]: sorting.sortOrder || 'asc'
            }
        ] : undefined;
        const args = {
            where,
            orderBy,
            include: plotIncludes,
            ...(0, _prismahelper.addPagination)(filters)
        };
        // Execute the query and count in a transaction
        const [data, count] = await this.prisma.$transaction([
            this.prisma.plot.findMany(args),
            this.prisma.plot.count({
                where: args.where
            })
        ]);
        return data.map((a)=>convert(a)); // Ensure `convert` is properly defined
    }
    async autofixAndStorePolygons(polygonCoordinates, polygonSource, plotShortCode) {
        // this.logger.log(
        //   'Starting autofix for polys from ' + polygonSource,
        //   polygonCoordinates,
        // );
        if (!polygonCoordinates) return null;
        const { completedPolygon, polygonWarnings, areaAsSquareMeters } = this.polygonUtilService.completePolygonAndGetWarnings(polygonCoordinates, polygonSource, plotShortCode);
        const originalAndFixed = [];
        originalAndFixed.push({
            source: polygonSource,
            coordinates: completedPolygon,
            polygonWarnings: {
                create: polygonWarnings
            },
            areaCalculated: areaAsSquareMeters * _constants.SQUARE_METER_TO_HECTARES_MULTIPLIER,
            active: false
        });
        if (polygonWarnings.length === 0) {
            // All good, early exit
            originalAndFixed[0].active = true;
            this.logger.debug(`Polygon autofix was not needed for ${plotShortCode}`);
        } else {
            // Not good, trying to fix
            try {
                const fixedData = this.polygonUtilService.fixPolygon(completedPolygon, polygonWarnings, polygonSource, plotShortCode);
                if (fixedData) {
                    originalAndFixed.push({
                        source: 'AUTOFIX',
                        coordinates: fixedData.fixedCoordinates,
                        areaCalculated: fixedData.areaAsSquareMetersAfterFix * _constants.SQUARE_METER_TO_HECTARES_MULTIPLIER,
                        polygonWarnings: {
                            create: fixedData.warningsAfterFixAttempt
                        },
                        active: true
                    });
                    this.logger.log(`Polygon autofix done for farm ${plotShortCode}, coordinates:: ${fixedData.fixedCoordinates.length}, area: ${originalAndFixed[1].areaCalculated}, remaining warnings: ${fixedData.warningsAfterFixAttempt.filter((warn)=>!warn.fixed).map((warn)=>warn.key)}`);
                } else {
                    this.logger.warn(`Not able to polygon autofix for plot ${plotShortCode}, remaining warnings: 
          ${JSON.stringify(polygonWarnings)}`);
                }
            } catch (err2) {
                this.logger.warn(`Autofix failed for farm ${plotShortCode}`, {
                    error: err2.message,
                    polygonCoordinates
                });
            }
        }
        return originalAndFixed;
    }
    async checkPolygonOverlapAndAddWarning(coordinates, org, seasonId, polygonId) {
        const dBPolygons = await this.polygonService.getAllActivePolygonsForOrgAndSeason(org, seasonId);
        const overlappingResults = this.polygonUtilService.checkPolygonOverlappingForOrg(dBPolygons, coordinates, polygonId);
        const { polygons, outdatedWarnings } = overlappingResults || {};
        return {
            addWarning: polygons?.length > 0,
            polygon: polygons,
            outdatedWarnings
        };
    }
    async upsert(payload, metadata) {
        // console.log(payload);
        const { farmId, farmCode, polygonCoordinates, polygonSource, organisation, countItems, ...restOfValues } = payload;
        const shortCode = payload.shortCode;
        this.logger.debug('Upsert plot ' + shortCode);
        if (!farmId && !farmCode) {
            throw Error('Either farmId or farmCode has to be provided');
        }
        const sId = farmId;
        if (farmCode) {
            // TODO: Hakee Cropista mutta farmCodella?
            throw Error('this cant be working!');
        // sId = (
        //   await this.prisma.facility.findUnique({
        //     where: { shortCode: farmCode, organisation: payload.organisation },
        //   })
        // ).id;
        }
        // Try to find based on short code even when ID not provided
        if (!payload.id) {
            const existingPlots = await this.getMany({
                shortCode,
                farmId
            });
            if (existingPlots.length > 0) {
                this.logger.debug('Identified plot by shortCode "' + shortCode + '" even if plot ID was missing');
                payload.id = existingPlots[0].id;
            }
        }
        let originalAndFixedPolygon;
        if (polygonCoordinates) {
            // TODO: Combine with polygonService and/or plot updating
            originalAndFixedPolygon = await this.autofixAndStorePolygons(polygonCoordinates, polygonSource, payload.shortCode);
        }
        try {
            let res;
            if (payload.id) {
                // UPDATE
                this.logger.debug('Updating plot ' + shortCode + ' for farm ' + (farmCode ?? farmId));
                const existing = await this.getOne(payload.id);
                res = convert(await this.prisma.plot.update({
                    data: {
                        ...restOfValues,
                        polygons: {
                            updateMany: {
                                where: {
                                    active: true
                                },
                                data: {
                                    active: false
                                }
                            },
                            create: originalAndFixedPolygon ?? undefined
                        },
                        farmId: sId,
                        plotCountItems: countItems ? {
                            updateMany: {
                                where: {
                                    deletedAt: null
                                },
                                data: {
                                    deletedAt: new Date()
                                }
                            },
                            create: countItems
                        } : undefined
                    },
                    where: {
                        id: payload.id
                    },
                    include: plotIncludes
                }));
                if (this.changes) {
                    const diffs = (0, _comparisonUtil.getObjectDifferences)({
                        ...existing,
                        polygons: undefined,
                        satelliteAnalysis: undefined,
                        polygonCoordinates: undefined
                    }, {
                        ...res,
                        // Exclude everything included by plotIncludes
                        polygons: undefined,
                        satelliteAnalysis: undefined,
                        polygonCoordinates: undefined
                    }, true);
                    await this.changes.populate(payload.id, 'Plot', 'update', metadata?.updatedBy ?? 'system', metadata?.operationType, diffs);
                }
            } else {
                // CREATE
                this.logger.debug('Creating plot ' + shortCode + ' for farm ' + (farmCode ?? farmId));
                res = convert(await this.prisma.plot.create({
                    data: {
                        ...restOfValues,
                        polygons: originalAndFixedPolygon ? {
                            create: originalAndFixedPolygon
                        } : undefined,
                        plotCountItems: countItems //
                         ? {
                            create: countItems
                        } : undefined,
                        farmId: sId
                    },
                    include: plotIncludes
                }));
                if (this.changes) {
                    await this.changes.populate(res.id, 'Plot', 'create', metadata?.updatedBy ?? 'system', metadata?.operationType, (0, _comparisonUtil.getObjectDifferences)({}, {
                        ...res,
                        polygons: undefined,
                        satelliteAnalysis: undefined
                    }, true));
                }
            }
            await this.createInteractionWarningsForSinglePlot(res, organisation);
            return res;
        } catch (err) {
            this.logger.error(payload);
            this.logger.error(err);
            throw err;
        }
    }
    async createInteractionWarningsForSinglePlot(plotResponse, organisation) {
        const plot = await plotResponse;
        const polygons = plot.polygons;
        const activePolygon = polygons.find((polygon)=>polygon.active);
        const inactivePolygons = polygons.filter((polygon)=>!polygon.active);
        const farmId = plot.farmId;
        const seasonId = await this.getSeasonByFarmId(farmId);
        //fix existing warnings for in-active polygons
        await this.createInteractionWarningsForPolygons(activePolygon, seasonId, organisation, inactivePolygons, plot.shortCode);
    }
    async createInteractionWarningsForPolygons(activePolygon, seasonId, organisation, inactivePolygons, plotShortCode) {
        const updates = inactivePolygons.map((polygon)=>this.polygonWarningService.fixInactivePolygonWarnings(polygon.id));
        await Promise.all(updates);
        if (!activePolygon) {
            // this.logger.debug(
            //   'No active polygon found for ' + plotShortCode + ' , skipping interaction warnings',
            // );
            return;
        }
        const polygonInteractionWarnings = await this.checkPolygonOverlapAndAddWarning(activePolygon.coordinates, organisation, seasonId, activePolygon.id);
        if (polygonInteractionWarnings?.outdatedWarnings?.length) {
            const updates = polygonInteractionWarnings.outdatedWarnings.map((warning)=>this.polygonWarningService.fixPolygonInteractionWarnings(warning));
            await Promise.all(updates);
        }
        if (polygonInteractionWarnings?.addWarning) {
            this.logger.log('Found ' + polygonInteractionWarnings.polygon.length + ' overlap warnings for ' + plotShortCode);
            const interactionWarnings = polygonInteractionWarnings.polygon.map((polygon)=>this.polygonUtilService.getPolygonInteractionWarnings({
                    createOverlapWarning: true
                }, polygon.id, activePolygon.id));
            const createWarningsPromise = interactionWarnings.map((warning)=>this.polygonWarningService.createPolygonInteractionWarnings(warning));
            await Promise.all(createWarningsPromise);
        } else {
            this.logger.debug('No New Warnings for polygon ' + plotShortCode + ', skipping');
        }
    }
    async delete(plot, metadata) {
        const now = new Date();
        const changes = {
            deletedAt: now
        };
        await this.changes.populate(plot.id, 'Plot', 'delete', metadata?.updatedBy ?? 'system', metadata?.operationType, (0, _comparisonUtil.getObjectDifferences)({}, changes, true));
        await this.prisma.plot.update({
            where: {
                id: plot.id
            },
            data: changes
        });
        return;
    }
    async findUnique(shortCode, organisation) {
        return await this.prisma.plot.findFirst({
            where: {
                shortCode: {
                    equals: shortCode,
                    mode: 'insensitive'
                },
                farm: {
                    is: {
                        organisation: organisation
                    }
                }
            },
            include: plotIncludes
        });
    }
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { farmId, farmCode, ...rest } = body;
        const storedFarm = await this.prisma.farm.findMany({
            where: {
                AND: [
                    {
                        organisation: body.organisation
                    },
                    {
                        OR: [
                            {
                                id: farmId
                            }
                        ]
                    },
                    {
                        facility: {
                            is: {
                                shortCode: farmCode
                            }
                        }
                    }
                ]
            }
        });
        if (storedFarm.length === 0) {
            throw new Error('contact not found for code ' + (farmCode || farmId));
        }
        return {
            ...rest,
            farm: {
                connect: {
                    id: storedFarm[0].id
                }
            }
        };
    }
    async convertForImport(body) {
        delete body.organisation;
        const res = {
            ...body,
            active: (0, _AbstractService.parseBooleanForImport)(body.active),
            interCropped: (0, _AbstractService.parseBooleanForImport)(body.interCropped),
            yieldEstimateRaw: (0, _AbstractService.parseIntForInport)(body.yieldEstimateRaw),
            cultivationStartDate: (0, _AbstractService.parseDateForImport)(body.cultivationStartDate),
            registrationDate: (0, _AbstractService.parseDateForImport)(body.registrationDate),
            lastChemicalUseDate: (0, _AbstractService.parseDateForImport)(body.lastChemicalUseDate),
            areaSizeManual: (0, _AbstractService.parseIntForInport)(body.areaSizeManual)
        };
        return res;
    }
    constructor(prisma, polygonUtilService, polygonService, polygonWarningService, changes){
        super(prisma, prisma.plot);
        this.prisma = prisma;
        this.polygonUtilService = polygonUtilService;
        this.polygonService = polygonService;
        this.polygonWarningService = polygonWarningService;
        this.changes = changes;
        this.logger = new _common.Logger(PlotsService.name);
    }
};
PlotsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _polygonUtilservice.PolygonUtilService === "undefined" ? Object : _polygonUtilservice.PolygonUtilService,
        typeof _geopolygonservice.PolygonService === "undefined" ? Object : _geopolygonservice.PolygonService,
        typeof _geopolygonwarningsservice.PolygonWarningService === "undefined" ? Object : _geopolygonwarningsservice.PolygonWarningService,
        typeof _changesservice.ChangesService === "undefined" ? Object : _changesservice.ChangesService
    ])
], PlotsService);
