"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MhDataImportService", {
    enumerable: true,
    get: function() {
        return MhDataImportService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _fileReaderservice = require("./fileReader.service");
const _personsservice = require("../persons/persons.service");
const _farmsservice = require("../farms/farms.service");
const _plotsservice = require("../farms/plots.service");
const _locationsservice = require("../locations/locations.service");
const _seasonsservice = require("../seasons/seasons.service");
const _locationsmodel = require("../locations/models/locations.model");
const _usermodel = require("../users/models/user.model");
const _facilitymodel = require("../facilities/models/facility.model");
const _plotsmodel = require("../farms/models/plots.model");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const parseDate = (dateString)=>{
    const date = new Date(dateString + 'Z');
    if (isNaN(date.getTime()) || dateString === '1970-01-01T00:00:00' || dateString === 'NaN/NaN/NaN' || dateString === '') {
        return null; // Invalid date
    }
    return date;
};
const ORG_MH = 'mh';
let MhDataImportService = class MhDataImportService {
    async importMh() {
        try {
            const file = '/importData/mh/MH Step 5  - Farms  - orijin-dataimport.xlsx';
            const excelContents = await this.excelImportServicel.readExcelFile(file);
            const farmData = excelContents['farms'];
            // Get all locations from their owns sheets + run through Farms to confirm all exist
            // const { customLocations, regularLocations } =
            //   await this.confirmLocationsExist(
            //     farmData,
            //     await this.addCustomLocations(excelContents),
            //     await this.addRegularLocations(excelContents),
            //   );
            // Version after initial run was complete and just 200 farms were remaining for re-run
            const regularLocations = await this.locationsService.getMany({
                organisation: ORG_MH,
                mainType: _client.EnumMainType.GLOBAL
            });
            const customLocations = await this.locationsService.getMany({
                organisation: ORG_MH,
                mainType: _client.EnumMainType.CUSTOM
            });
            // Process actual farms asynchronously
            const farms = await Promise.all(excelContents['farms'].map(async (farm)=>this.processFarm(farm, {
                    farmerGroups: customLocations.data.filter((loc)=>loc.type === 'Farmergroups')
                }, regularLocations.data)));
            this.logger.log('Done!! Created ' + farms.length);
            return {
                customLocations,
                regularLocations,
                farms
            };
        } catch (err) {
            this.logger.error(err.stack);
        }
    }
    async addCustomLocations(excelContents) {
        const regions = await this.addLocations(excelContents['regions.skip'], _locationsmodel.MhCustomLocationLevels.REGION, _client.EnumMainType.CUSTOM, []);
        const zones = await this.addLocations(excelContents['zones.skip'], _locationsmodel.MhCustomLocationLevels.ZONE, _client.EnumMainType.CUSTOM, regions);
        const farmerGroups = await this.addLocations(excelContents['farmergroups.skip'], _locationsmodel.MhCustomLocationLevels.FARMER_GROUP, _client.EnumMainType.CUSTOM, zones);
        return {
            farmerGroups,
            zones,
            regions
        };
    }
    // TODO: How to merge into LTC's locations? Should check if same loc exists? (just doing org-specific for now)
    async addRegularLocations(excelContents) {
        const districts = await this.addLocations(excelContents['districts.skip'], _locationsmodel.LocationLevels.DISTRICT, _client.EnumMainType.GLOBAL, []);
        const subCounties = await this.addLocations(excelContents['subcounties.skip'], _locationsmodel.LocationLevels.SUB_COUNTY, _client.EnumMainType.GLOBAL, districts);
        const parishes = await this.addLocations(excelContents['parishes.skip'], _locationsmodel.LocationLevels.PARISH, _client.EnumMainType.GLOBAL, subCounties);
        const villages = await this.addLocations(excelContents['villages.skip'], _locationsmodel.LocationLevels.VILLAGE, _client.EnumMainType.GLOBAL, parishes);
        return [
            ...villages,
            ...parishes,
            ...subCounties,
            ...districts
        ];
    }
    async confirmLocationsExist(allFarms, customLocations, regularLocations) {
        const missingLocations = {};
        allFarms.forEach((farmData)=>{
            const { district, subCounty, subCountyName } = farmData;
            const regularLocation = regularLocations.find((loc)=>loc.shortCode === subCounty);
            if (!regularLocation) {
                const parentForLocation = regularLocations.find((locs)=>locs.shortCode === district);
                if (!parentForLocation) {
                    throw new Error('Missing parent ' + district + ' for new location ' + subCountyName);
                }
                missingLocations[subCountyName] = {
                    organisation: ORG_MH,
                    shortCode: subCounty.trim(),
                    name: subCountyName.trim(),
                    type: _locationsmodel.LocationLevels.SUB_COUNTY,
                    mainType: _locationsmodel.LocationMainType.GLOBAL,
                    parent: parentForLocation
                };
            }
        });
        await Promise.all(Object.keys(missingLocations).map(async (key)=>{
            const newRegularLocation = await this.locationsService.create(missingLocations[key]);
            this.logger.log('Missing location ' + missingLocations[key].name + ' created with id ' + newRegularLocation.id);
        }));
        return {
            regularLocations,
            customLocations
        };
    }
    async processFarm(farmData, customLocations, regularLocations) {
        const meta = {
            organisation: 'mh'
        };
        const shortCode = farmData.idLabelShort;
        const existingFarm = await this.farmsService.getMany({
            organisation: meta.organisation,
            shortCode
        });
        if (existingFarm.data.length > 0) {
            this.logger.log('Farm ' + shortCode + ' already exists, skipping');
            return;
        } else {
            this.logger.warn('Going to add ' + shortCode);
        }
        /////
        // Location - handled in earlier loop
        /////
        const { district, districtName, subCounty, subCountyName, region, zone, zoneName } = farmData;
        /////
        // Contact person
        /////
        const { idLabelShort, nameold, name, contactLastName, contactFirstName, contactGender, contactDob, contactDobCleaned, contactDobApproximate, dobOriginal, age_1, phone } = farmData;
        // const contactPerson = await this.personsService.create({
        const contactPerson = {
            organisation: ORG_MH,
            dateOfBirth: parseDate(contactDob),
            firstName: contactFirstName,
            gender: contactGender,
            lastName: contactLastName,
            phone: '' + phone,
            shortCode: idLabelShort,
            type: _usermodel.UserType.Farmer
        };
        // Coords
        const { latitude, longitude, accuracy, altitude, location, parentFacility, parentFacilityName } = farmData;
        const regularLocation = regularLocations.find((loc)=>loc.shortCode === subCounty);
        const customLocation = customLocations.farmerGroups.find((loc)=>loc.shortCode === parentFacility);
        if (!customLocation) {
            throw new Error('No custom location for farmerGroup ' + parentFacility);
        }
        const facilityValues = {
            organisation: ORG_MH,
            shortCode: idLabelShort,
            name: name,
            areaTotalManual: 0,
            type: _facilitymodel.FacilityType.Farm,
            coordinate: latitude && longitude ? {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            } : undefined,
            location: regularLocation,
            customLocation: customLocation,
            mainContactPerson: contactPerson
        };
        /////
        // Plot values - NOTE! We know plot count and totals, but not split per plot!!
        /////
        const { areaTotal, areaOrganic, plotCount, areaCrop, numberOfPlantsProductive, numberOfPlantsNonProductive, numberOfPlantsTotal, numberOfPlantsShade, yieldEstimateRaw, yieldEstimateProcessed } = farmData;
        const plotValues = {
            organisation: meta.organisation,
            // cultivationStartDate: undefined,
            // distanceToForest: 0,
            // distanceToForestKnown: false,
            // establishedBefore2020: false,
            // farmCode: '',
            // farmId: '',
            // hasLandTitle: false,
            // hasRightToLand: false,
            // hasShadeTrees: false,
            // lastChemicalUseDate: undefined,
            // ownerName: '',
            // polygonCoordinates: [],
            // polygonSource: undefined,
            // principalLeasesLand: false,
            // principalOwnsLand: false,
            // registrationDate: undefined,
            // status: '',
            // traditionalOwnersPresent: false,
            areaSizeManual: parseFloat(areaTotal),
            areaSizeOrganicManual: parseFloat(areaOrganic),
            type: _plotsmodel.PlotType.Permanent,
            shortCode: idLabelShort + '-PLOTS',
            name: idLabelShort + '-PLOTS',
            yieldEstimateProcessed: yieldEstimateProcessed,
            yieldEstimateRaw: yieldEstimateRaw
        };
        /////
        // Farm values
        /////
        const { certificationStatus, // ['Certification Status'], //
        contractDate, contractDateCleaned, contractDateOriginal, pulperType, lastChemicalUseDate, inConversionStatus, internalInspector, lastInspectionDate, reInspectionDateOriginal, firstVisitDate, firstVisitDateOriginal } = farmData;
        const farmValues = {
            // seasonCode?: string;
            // seasonId?: string;
            //
            // cultivationStartDate?: Date;
            // registrationDate?: Date;
            // certificationStartDate?: Date;
            // approvalStatus?: ReviewStatus;
            // creationStatus?: CreationStatus;
            contractDate: parseDate(contractDate),
            lastChemicalUseDate: parseDate(lastChemicalUseDate),
            lastInspectionDate: parseDate(lastInspectionDate),
            firstVisitDate: parseDate(firstVisitDate),
            // certificationStatus: certificationStatus, // TODO: How to store?
            parentFacilityName: parentFacilityName,
            plots: [
                plotValues
            ]
        };
        return await this.farmsService.create({
            organisation: ORG_MH,
            facilityValues,
            farmValues
        });
    }
    constructor(prisma, excelImportServicel, personsService, farmsService, plotsService, locationsService, seasonsService){
        this.prisma = prisma;
        this.excelImportServicel = excelImportServicel;
        this.personsService = personsService;
        this.farmsService = farmsService;
        this.plotsService = plotsService;
        this.locationsService = locationsService;
        this.seasonsService = seasonsService;
        this.logger = new _common.Logger(MhDataImportService.name);
        this.addLocations = async (excelContents, type, mainType, parents)=>{
            return await Promise.all(excelContents.map((loc)=>{
                const parent = parents?.find((parent)=>parent.shortCode === loc.parentLocation);
                return this.locationsService.create({
                    organisation: ORG_MH,
                    shortCode: loc.idLabelShort,
                    name: loc.name,
                    type: type,
                    mainType: mainType,
                    parent
                });
            }));
        };
    }
};
MhDataImportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _fileReaderservice.FileReaderService === "undefined" ? Object : _fileReaderservice.FileReaderService,
        typeof _personsservice.PersonsService === "undefined" ? Object : _personsservice.PersonsService,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _plotsservice.PlotsService === "undefined" ? Object : _plotsservice.PlotsService,
        typeof _locationsservice.LocationsService === "undefined" ? Object : _locationsservice.LocationsService,
        typeof _seasonsservice.SeasonsService === "undefined" ? Object : _seasonsservice.SeasonsService
    ])
], MhDataImportService);
