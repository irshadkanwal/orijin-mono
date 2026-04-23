"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FiltersService", {
    enumerable: true,
    get: function() {
        return FiltersService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
require("reflect-metadata");
const _filtersmodel = require("./models/filters.model");
const _paginationAndSortingdto = require("../common/dto/paginationAndSorting.dto");
const _prismahelper = require("../common/prisma.helper");
const _utils = require("../common/utils");
const _seasonsservice = require("../seasons/seasons.service");
const _locationsservice = require("../locations/locations.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FiltersService = class FiltersService {
    getPaginationAndSortingProperties() {
        const paginationDtoPrototype = Object.getPrototypeOf(new _paginationAndSortingdto.PaginationAndSortingDto());
        return Object.getOwnPropertyNames(paginationDtoPrototype).filter((prop)=>prop !== 'constructor');
    }
    extractFiltersFromClass(filterClass) {
        const filters = [];
        const className = filterClass.name;
        // console.log(`Inspecting prototype for class: ${className}`);
        const metadata = (0, _prismahelper.getFilterMetadata)(className);
        if (metadata) {
            for (const [key, meta] of metadata.entries()){
                filters.push({
                    key,
                    ...meta
                });
            }
        }
        return filters;
    }
    /** Globally for every filter out there, add appropriate options based on the key (id) of a filter */ async appendOptionsToFilters(orgId, filters) {
        const data = await (0, _utils.promiseObject)({
            locations: filters.find((filter)=>filter.key === 'location') ? this.locationService.getAllForFilterOptions({
                organisation: orgId,
                mainType: 'GLOBAL'
            }) : Promise.resolve([]),
            customLocations: filters.find((filter)=>filter.key === 'customLocation') ? this.locationService.getAllForFilterOptions({
                organisation: orgId,
                mainType: 'CUSTOM'
            }) : Promise.resolve([]),
            seasons: filters.find((filter)=>filter.key === 'seasonCode') ? this.seasonService.getMany({
                organisation: orgId,
                sort: 'shortCode',
                sortOrder: 'desc'
            }) : Promise.resolve({
                data: [],
                count: 0
            })
        });
        return filters.map((filter)=>{
            if (filter.key === 'location') {
                filter.options = data.locations.map((loc)=>({
                        value: loc.name,
                        label: loc.type
                    }));
            } else if (filter.key === 'customLocation') {
                filter.options = data.customLocations.map((loc)=>({
                        value: loc.name,
                        label: loc.type
                    }));
            } else if (filter.key === 'seasonCode') {
                filter.options = data.seasons.data.map((season)=>({
                        value: season.shortCode,
                        label: season.shortCode
                    }));
            } else if (filter.key === 'polygonStatus') {
                filter.options = [
                    {
                        value: 'OK',
                        label: 'OK'
                    },
                    {
                        value: 'WARNINGS',
                        label: 'Warnings'
                    },
                    {
                        value: 'FAILED',
                        label: 'Failed'
                    },
                    {
                        value: 'NONE',
                        label: 'Missing'
                    }
                ];
            } else if (filter.key === 'deforestation') {
                filter.options = [
                    {
                        value: 'NOT_DONE',
                        label: 'Not analyzed'
                    },
                    {
                        value: 'OK',
                        label: 'OK'
                    },
                    {
                        value: 'RISK',
                        label: 'Has risk'
                    }
                ];
            }
            return filter;
        });
    }
    async getFilters(filterKey, orgId) {
        const filterClass = _filtersmodel.filterClassMap[filterKey];
        if (!filterClass) {
            this.logger.error(`No filter class found for key: ${filterKey}`);
            return [];
        }
        const filters = this.extractFiltersFromClass(filterClass);
        return orgId ? this.appendOptionsToFilters(orgId, filters) : Promise.resolve(filters);
    }
    constructor(prisma, seasonService, locationService){
        this.prisma = prisma;
        this.seasonService = seasonService;
        this.locationService = locationService;
        this.logger = new _common.Logger(FiltersService.name);
    }
};
FiltersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _seasonsservice.SeasonsService === "undefined" ? Object : _seasonsservice.SeasonsService,
        typeof _locationsservice.LocationsService === "undefined" ? Object : _locationsservice.LocationsService
    ])
], FiltersService);
