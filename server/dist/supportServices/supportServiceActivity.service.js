"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SupportServiceActivityService", {
    enumerable: true,
    get: function() {
        return SupportServiceActivityService;
    }
});
const _prismahelper = require("../common/prisma.helper");
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _client = require(".prisma/client");
const _AbstractService = /*#__PURE__*/ _interop_require_wildcard(require("../common/service/AbstractService"));
const _prismaUtils = require("../common/prismaUtils");
const _locationsservice = require("../locations/locations.service");
const _datefns = require("date-fns");
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
let SupportServiceActivityService = class SupportServiceActivityService extends _AbstractService.default {
    async connectDependenciesForCreateAndUpdate(body, isUpdate) {
        const { supportingServiceCategoryTypeCode, supportingServiceCategoryCode, supportingServiceInputTypeCode, supportingServiceActivityTypeCode, ...rest } = body;
        const csvInput = body;
        const dtoInput = body;
        const supportingServiceCategoryId = dtoInput.supportingServiceCategoryId;
        const supportingServiceActivityTypeId = dtoInput.supportingServiceActivityTypeId;
        const supportingServiceInputTypeId = dtoInput.supportingServiceInputTypeId;
        const supportingServiceCategoryTypeId = dtoInput.supportingServiceCategoryTypeId;
        const locationId = dtoInput.locationId;
        const locationCode = csvInput.locationCode;
        let personIds = dtoInput.personIds;
        const farmerGroupCodes = csvInput.farmerGroupCodes;
        let farmerGroupIds = dtoInput.farmerGroupIds;
        const itemsProcessed = dtoInput.itemsProcessed;
        const itemValue = dtoInput.itemValue;
        const total = dtoInput.total;
        const score = dtoInput.score;
        delete rest['farmerGroupCodes'];
        delete rest['farmerGroupIds'];
        delete rest['personIds'];
        delete rest['farmerId'];
        delete rest['itemsProcessed'];
        delete rest['itemValue'];
        delete rest['total'];
        delete rest['score'];
        if (farmerGroupCodes && farmerGroupCodes.length > 0) {
            const codes = farmerGroupCodes.split(';');
            // Fetch farmer groups based on the organisation and short codes
            const farmerGroups = await this.prisma.location.findMany({
                where: {
                    organisation: dtoInput.organisation,
                    shortCode: {
                        in: codes
                    }
                }
            });
            // Fetch person IDs based on the organisation and short codes
            const persons = await this.prisma.person.findMany({
                where: {
                    organisation: dtoInput.organisation,
                    shortCode: {
                        in: codes
                    }
                }
            });
            // Check if all specified codes were found in the farmer groups
            if (farmerGroups.length + persons.length !== codes.length) {
                throw new Error(`Some specified codes not found: ${farmerGroupCodes}`);
            }
            // Determine the IDs to use based on the beneficiary type
            const beneficiaryType = body.beneficiaryType.toLocaleLowerCase();
            if (beneficiaryType === 'individual') {
                // console.log('individual', persons);
                // Use person IDs for 'individual' type
                personIds = persons.map((p)=>p.id);
            } else if (beneficiaryType === 'group') {
                // console.log('group', farmerGroups);
                // Use farmer group IDs for 'group' type
                farmerGroupIds = farmerGroups.map((f)=>f.id);
            } else {
                // Fallback logic if the type is not explicitly 'individual' or 'group'
                if (codes.length > 1) {
                    rest['beneficiaryType'] = 'group';
                    farmerGroupIds = farmerGroups.map((f)=>f.id);
                } else {
                    rest['beneficiaryType'] = 'individual';
                    personIds = persons.map((p)=>p.id);
                }
            }
        }
        const updateData = {
            ...rest,
            supportingServiceInputType: undefined,
            supportingServiceCategory: undefined,
            supportingServiceActivityType: undefined,
            supportingServiceCategoryType: undefined
        };
        if (farmerGroupIds && farmerGroupIds.length > 0) {
            updateData.serviceActivityLocations = {
                ...isUpdate && {
                    deleteMany: {}
                },
                create: farmerGroupIds.map((locationId)=>({
                        locationId: locationId
                    }))
            };
        } else {
            if (isUpdate && updateData.serviceActivityLocations && updateData.serviceActivityLocations.length === 0) {
                updateData.serviceActivityLocations = undefined;
            }
        }
        if (personIds && personIds.length > 0) {
            updateData.ServiceActivityBeneficiaries = {
                ...isUpdate && {
                    deleteMany: {}
                },
                create: personIds.map((personId)=>({
                        person: {
                            connect: {
                                id: personId
                            }
                        },
                        primary: (body.beneficiaryType?.toLocaleLowerCase() === 'individual') ?? false,
                        itemsProcessed: itemsProcessed,
                        itemValue: itemValue,
                        score: score,
                        total: total
                    }))
            };
        } else {
            if (isUpdate && updateData.ServiceActivityBeneficiaries && updateData.ServiceActivityBeneficiaries.length === 0) {
                updateData.ServiceActivityBeneficiaries = undefined;
            } else if (isUpdate) {
                updateData.ServiceActivityBeneficiaries = {
                    deleteMany: {}
                };
            }
        }
        if (supportingServiceCategoryTypeCode || supportingServiceCategoryTypeId) {
            await (0, _prismaUtils.setupDependencyBasedOnShortCodeOrId)('supportingServiceCategoryType', // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.prisma.supportingServiceCategoryType, supportingServiceCategoryTypeCode, supportingServiceCategoryTypeId, body.organisation, true, isUpdate, updateData);
        }
        if (supportingServiceCategoryCode || supportingServiceCategoryId) {
            await (0, _prismaUtils.setupDependencyBasedOnShortCodeOrId)('supportingServiceCategory', // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.prisma.supportingServiceCategory, supportingServiceCategoryCode, supportingServiceCategoryId, body.organisation, true, isUpdate, updateData);
        }
        if (supportingServiceActivityTypeCode || supportingServiceActivityTypeId) {
            await (0, _prismaUtils.setupDependencyBasedOnShortCodeOrId)('supportingServiceActivityType', // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.prisma.supportingServiceActivityType, supportingServiceActivityTypeCode, supportingServiceActivityTypeId, body.organisation, true, isUpdate, updateData);
        }
        if (supportingServiceInputTypeCode || supportingServiceInputTypeId) {
            await (0, _prismaUtils.setupDependencyBasedOnShortCodeOrId)('supportingServiceInputType', // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.prisma.supportingServiceInputType, supportingServiceInputTypeCode, supportingServiceInputTypeId, body.organisation, false, isUpdate, updateData);
        }
        if (locationCode || locationId) {
            await (0, _prismaUtils.setupDependencyBasedOnShortCodeOrId)('location', // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.prisma.location, locationCode, locationId, body.organisation, false, isUpdate, updateData);
        }
        return updateData;
    }
    standardInclude(includeServiceActivityLocations) {
        const include = includeServiceActivityLocations ?? false;
        const serviceActivityLocationInclude = include ? {
            include: {
                location: {
                    include: _locationsservice.locationParentInclude
                }
            }
        } : undefined;
        return {
            supportingServiceActivityType: {
                include: {
                    supportingServiceCategory: true
                }
            },
            supportingServiceInputType: true,
            ServiceActivityBeneficiaries: {
                include: {
                    person: {
                        include: {
                            mainContactPersonFor: {
                                include: {
                                    location: {
                                        include: {
                                            facilities: {
                                                include: {
                                                    mainContactPerson: true
                                                }
                                            },
                                            ..._locationsservice.locationParentInclude
                                        }
                                    },
                                    customLocation: {
                                        include: _locationsservice.locationParentInclude
                                    },
                                    farm: {
                                        include: {
                                            plots: {
                                                where: {
                                                    deletedAt: null
                                                },
                                                include: {
                                                    polygons: {
                                                        where: {
                                                            active: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    supportingServiceActivity: {
                        include: {
                            location: {
                                include: _locationsservice.locationParentInclude
                            },
                            serviceActivityLocations: serviceActivityLocationInclude,
                            supportingServiceCategoryType: true,
                            supportingServiceCategory: true,
                            supportingServiceActivityType: true,
                            supportingServiceInputType: true
                        }
                    }
                }
            },
            supportingServiceCategory: true,
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
                    },
                    ..._locationsservice.locationParentInclude
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
            supportingServiceCategoryType: true
        };
    }
    async convertForImport(body) {
        return {
            ...body,
            supportingServiceCategoryId: undefined,
            supportingServiceActivityTypeId: undefined,
            supportingServiceInputTypeId: undefined,
            personIds: undefined,
            locationId: undefined,
            dateOfService: (0, _AbstractService.parseDateForImport)(body.dateOfService),
            farmerGroupIds: undefined,
            supportingServiceCategoryTypeId: undefined
        };
    }
    async getMany(filters) {
        const args = {
            where: this.convertFiltersToWhere(filters),
            include: filters.tab === 'beneficiaries' ? this.standardInclude(true) : this.standardInclude(false),
            orderBy: {
                createdAt: 'desc'
            },
            ...(0, _prismahelper.addPagination)(filters)
        };
        const [data, count] = await this.prisma.$transaction([
            this.prisma.supportingServiceActivity.findMany(args),
            this.prisma.supportingServiceActivity.count({
                where: args.where
            })
        ]);
        return {
            data,
            count
        };
    }
    getDateRangeFromAgeRange(ageRange) {
        const today = new Date();
        if (ageRange === '50+') {
            return {
                thresholdDate: (0, _datefns.subYears)(today, 50)
            }; // For ages 50 and above
        }
        if (ageRange === '0-17') {
            return {
                startDate: (0, _datefns.subYears)(today, 17),
                endDate: today
            }; // For ages under 18
        }
        if (ageRange === '18-30') {
            const endDate = (0, _datefns.subYears)(today, 18); // Birthday for 18 years old
            const startDate = (0, _datefns.subYears)(today, 30); // Birthday for 30 years old + 1
            return {
                startDate,
                endDate
            };
        }
        if (ageRange === '31-50') {
            const endDate = (0, _datefns.subYears)(today, 31); // Birthday for 31 years old
            const startDate = (0, _datefns.subYears)(today, 51); // Birthday for 50 years old + 1
            return {
                startDate,
                endDate
            };
        }
        // Handle unspecified range, e.g., "20-25"
        const [minAge, maxAge] = ageRange.split('-').map(Number);
        if (isNaN(minAge) || isNaN(maxAge)) {
            throw new Error(`Invalid age range format: ${ageRange}`);
        }
        const endDate = (0, _datefns.subYears)(today, minAge);
        const startDate = (0, _datefns.subYears)(today, maxAge + 1); // Adjusted to include maxAge
        return {
            startDate,
            endDate
        };
    }
    constructor(prisma){
        super(prisma, prisma.supportingServiceActivity);
        this.prisma = prisma;
        this.logger = new _common.Logger(SupportServiceActivityService.name);
        this.convertFiltersToWhere = (filters)=>{
            if (!filters?.organisation) {
                throw new Error('Search without organisation not allowed');
            }
            const where = {
                organisation: filters.organisation
            };
            if (filters.activityType) {
                const activities_categories = decodeURIComponent(filters.activityType).split(',');
                const activityTypes = [];
                const categories = [];
                for (const activity_category of activities_categories){
                    const [activityType, category] = decodeURIComponent(activity_category).split('-');
                    if (activityType) {
                        activityTypes.push(activityType);
                    }
                    if (category) {
                        categories.push(category);
                    }
                }
                if (activityTypes.length > 0) {
                    where.supportingServiceActivityType = {
                        OR: activityTypes.map((activityType)=>({
                                OR: [
                                    {
                                        name: {
                                            equals: activityType,
                                            mode: 'insensitive'
                                        }
                                    },
                                    {
                                        shortCode: {
                                            equals: activityType,
                                            mode: 'insensitive'
                                        }
                                    }
                                ]
                            }))
                    };
                }
                if (categories.length > 0) {
                    where.supportingServiceCategory = {
                        OR: categories.map((category)=>({
                                OR: [
                                    {
                                        name: {
                                            equals: category,
                                            mode: 'insensitive'
                                        }
                                    },
                                    {
                                        shortCode: {
                                            equals: category,
                                            mode: 'insensitive'
                                        }
                                    }
                                ]
                            }))
                    };
                }
            }
            if (filters.personName) {
                const personNames = decodeURIComponent(filters.personName).split(',');
                where.ServiceActivityBeneficiaries = {
                    some: {}
                };
                where.ServiceActivityBeneficiaries.some.OR = personNames.map((personName)=>{
                    const [firstName, lastName] = personName.split(' ');
                    return {
                        person: {
                            AND: [
                                {
                                    firstName: {
                                        equals: firstName,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    lastName: {
                                        equals: lastName,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        }
                    };
                });
            }
            if (filters.gender) {
                const genders = decodeURIComponent(filters.gender).split(',');
                where.ServiceActivityBeneficiaries = {
                    some: {}
                };
                where.ServiceActivityBeneficiaries.some.OR = genders.map((gender)=>{
                    return {
                        person: {
                            gender: {
                                equals: gender,
                                mode: 'insensitive'
                            }
                        }
                    };
                });
            }
            if (filters.ageRanges) {
                const ageRanges = decodeURIComponent(filters.ageRanges).split(',');
                const rangeEqualsFilter = (ageRange)=>{
                    const dateRange = this.getDateRangeFromAgeRange(ageRange);
                    const filterCriteria = ageRange === '50+' ? {
                        dateOfBirth: {
                            lte: dateRange?.thresholdDate
                        }
                    } : {
                        dateOfBirth: {
                            gte: dateRange.startDate,
                            lte: dateRange.endDate
                        }
                    };
                    return filterCriteria;
                };
                where.ServiceActivityBeneficiaries = {
                    some: {
                        OR: ageRanges.map((ageRange)=>{
                            return {
                                person: rangeEqualsFilter(ageRange)
                            };
                        })
                    }
                };
            }
            if (filters.program) {
                const programs = decodeURIComponent(filters.program).split(',');
                where.supportingServiceCategory = {
                    OR: programs.map((program)=>({
                            OR: [
                                {
                                    name: {
                                        equals: program,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    shortCode: {
                                        equals: program,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        }))
                };
            }
            if (filters.serviceType) {
                const serviceTypes = decodeURIComponent(filters.serviceType).split(',');
                where.supportingServiceCategoryType = {
                    OR: serviceTypes.map((serviceType)=>({
                            OR: [
                                {
                                    name: {
                                        equals: serviceType,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    shortCode: {
                                        equals: serviceType,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        }))
                };
            }
            if (filters.inputType) {
                const inputTypes = decodeURIComponent(filters.inputType).split(',');
                where.supportingServiceInputType = {
                    OR: inputTypes.map((inputType)=>({
                            OR: [
                                {
                                    name: {
                                        equals: inputType,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    shortCode: {
                                        equals: inputType,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        }))
                };
            }
            if (filters.location) {
                const districts = decodeURIComponent(filters.location).split(',');
                const nameEqualsFilter = (location)=>({
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
                where.location = {
                    OR: districts.map((location)=>({
                            OR: [
                                nameEqualsFilter(location),
                                {
                                    parent: nameEqualsFilter(location)
                                },
                                {
                                    parent: {
                                        parent: nameEqualsFilter(location)
                                    }
                                },
                                {
                                    parent: {
                                        parent: {
                                            parent: nameEqualsFilter(location)
                                        }
                                    }
                                }
                            ]
                        }))
                };
            }
            if (filters.customLocation) {
                const districts = decodeURIComponent(filters.customLocation).split(',');
                const nameEqualsFilter = (location)=>({
                        OR: [
                            {
                                name: {
                                    equals: location,
                                    mode: _client.Prisma.QueryMode.insensitive
                                }
                            },
                            {
                                shortCode: {
                                    equals: location,
                                    mode: _client.Prisma.QueryMode.insensitive
                                }
                            }
                        ]
                    });
                where.serviceActivityLocations = {
                    some: {
                        location: {
                            OR: districts.flatMap((location)=>[
                                    nameEqualsFilter(location),
                                    {
                                        parent: nameEqualsFilter(location)
                                    },
                                    {
                                        parent: {
                                            parent: nameEqualsFilter(location)
                                        }
                                    },
                                    {
                                        parent: {
                                            parent: {
                                                parent: nameEqualsFilter(location)
                                            }
                                        }
                                    }
                                ])
                        }
                    }
                };
            }
            if (filters.operator) {
                where.operator = filters.operator ? {
                    contains: filters.operator,
                    mode: _client.Prisma.QueryMode.insensitive
                } : undefined;
            }
            return where;
        };
    }
};
SupportServiceActivityService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService
    ])
], SupportServiceActivityService);
