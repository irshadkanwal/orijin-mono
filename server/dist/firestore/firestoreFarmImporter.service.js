"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreFarmImporterService", {
    enumerable: true,
    get: function() {
        return FirestoreFarmImporterService;
    }
});
const _facilitymodel = require("../facilities/models/facility.model");
const _common = require("@nestjs/common");
const _seasonsservice = require("../seasons/seasons.service");
const _farmsservice = require("../farms/farms.service");
const _plotsservice = require("../farms/plots.service");
const _firestorehelperservice = require("./firestore.helper.service");
const _locationsservice = require("../locations/locations.service");
const _usermodel = require("../users/models/user.model");
const _personsservice = require("../persons/persons.service");
const _plotsmodel = require("../farms/models/plots.model");
const _constants = require("../common/constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirestoreFarmImporterService = class FirestoreFarmImporterService {
    parseDate(value) {
        if (!value) {
            return null;
        }
        if (value.toDate) {
            return value.toDate();
        }
        return new Date(value);
    }
    parseContactPerson(organisation, firestoreData, sameStuffDifferentFormat) {
        return {
            organisation,
            shortCode: firestoreData.id?.labelShort || firestoreData.contactFirstName + '-' + Math.random(),
            firstName: firestoreData.firstName,
            middleName: firestoreData.middleName,
            lastName: firestoreData.lastName,
            nickName: firestoreData.nickName,
            type: _usermodel.UserType.Farmer,
            email: firestoreData.email,
            phone: firestoreData.phone,
            phone2: firestoreData.phone2,
            gender: firestoreData.gender || firestoreData.contactGender,
            dateOfBirth: new Date(firestoreData.dob) || firestoreData.contactDob?.toDate(),
            dateOfBirthApproximate: (firestoreData.dobApproximate || firestoreData.contactDobApproximate) === 'true',
            education: firestoreData.education,
            identificationNumber: firestoreData.identificationNumber,
            identificationNumberType: firestoreData.identificationNumberType,
            maritalStatus: firestoreData.maritalStatus
        };
    }
    parseFacilityValues(firestoreFarm, farmShortCode, farmLabel, storedLocation, prismaPerson, org) {
        return {
            firestoreId: firestoreFarm.id.id,
            organisation: org,
            shortCode: farmShortCode,
            type: _facilitymodel.FacilityType.Farm,
            name: farmLabel,
            // TODO: Complete Address storing in Prisma
            address: firestoreFarm.address == null && firestoreFarm.city == null && firestoreFarm.postalCode == null && firestoreFarm.country == null ? null : {
                street: firestoreFarm.address,
                city: firestoreFarm.city,
                postalCode: firestoreFarm.postalCode,
                country: firestoreFarm.country
            },
            mainContactPerson: prismaPerson,
            areaTotalManual: firestoreFarm.areaTotal * _constants.SQUARE_METER_TO_HECTARES_MULTIPLIER,
            timezone: firestoreFarm.timezone,
            location: storedLocation
        };
    }
    parseFarmValues(firestoreFarm, seasonId) {
        return {
            firestoreId: firestoreFarm.id.id,
            approvalStatus: firestoreFarm.approvalStatus,
            creationStatus: firestoreFarm.creationStatus,
            contractDate: this.parseDate(firestoreFarm.contractDate),
            registrationDate: this.parseDate(firestoreFarm.registrationDate),
            certificationStartDate: this.parseDate(firestoreFarm.certificationStartDate),
            lastChemicalUseDate: this.parseDate(firestoreFarm.lastChemicalUseDate),
            lastInspectionDate: this.parseDate(firestoreFarm.lastInspectionDate),
            firstVisitDate: this.parseDate(firestoreFarm.firstVisitDate),
            // TODO: Seasonia ei ole ainakaan UAT-esimerkeissä?
            seasonId
        };
    }
    async importFarm(firestoreFarm, counter, seasons, locations, meta) {
        const organisation = meta.organisation;
        const farmShortCode = firestoreFarm.id.labelShort;
        const farmLabel = firestoreFarm.id.label;
        try {
            // TODO: SeasonCode piti määrittää siitä seasonista joka on active?
            let seasonId = seasons.find((s)=>s.shortCode === firestoreFarm.season?.labelShort)?.id;
            if (!seasonId) {
                // TODO: Tarkista missä seasoncode nyt on, vai onko ees tollasta arvoa
                this.logger.warn('No seasonCode found for farm ' + counter + ': ' + farmShortCode + ', assigning random one');
                seasonId = seasons[0].id;
            }
            const storedLocation = this.getActualLocation(firestoreFarm, locations);
            // 1) Create the person
            const contactPerson = this.parseContactPerson(organisation, firestoreFarm);
            // const contactPerson = {
            //   shortCode: firestoreFarm.contactFirstName + '-' + Math.random(),
            //   firstName:
            //     [
            //       firestoreFarm.contactFirstName,
            //       firestoreFarm.contactMiddleName,
            //     ].join(' ') ?? '',
            //   lastName: firestoreFarm.contactLastName ?? '',
            //   type: UserType.Farmer,
            //   email: firestoreFarm.email,
            //   phone: firestoreFarm.phone,
            //   gender: firestoreFarm.contactGender,
            //   dateOfBirth: firestoreFarm.contactDob?.toDate(),
            //   dateOfBirthApproximate: firestoreFarm.contactDobApproximate === 'true',
            // };
            const prismaPerson = await this.personsService.create({
                organisation,
                ...contactPerson
            }, {
                operationType: 'farmImport',
                updatedBy: firestoreFarm?.updatedBy?.label
            });
            const facilityValues = this.parseFacilityValues(firestoreFarm, farmShortCode, farmLabel, storedLocation, prismaPerson, organisation);
            // const facilityValues: FacilitiesDto = {
            //   firestoreId: firestoreFarm.id.id,
            //   organisation: meta.organisation,
            //   shortCode: farmShortCode,
            //   type: FacilityType.Farm,
            //   name: farmLabel,
            //   // TODO: Complete Address storing in Prisma
            //   address: {
            //     street: firestoreFarm.address,
            //     city: firestoreFarm.city,
            //     postalCode: firestoreFarm.postalCode,
            //     country: firestoreFarm.country,
            //   },
            //   mainContactPerson: prismaPerson as PersonsDto,
            //   areaTotalManual: firestoreFarm.areaTotal,
            //   timezone: firestoreFarm.timezone,
            //   location: location,
            // };
            const farmValues = this.parseFarmValues(firestoreFarm, seasonId);
            // const farmValues: FarmInputValues = {
            //   // NOTE: Shortcodea ei ole täällä vaan Facilityllä!
            //   firestoreId: firestoreFarm.id.id,
            //   approvalStatus: firestoreFarm.approvalStatus,
            //   creationStatus: firestoreFarm.creationStatus,
            //   cultivationStartDate: firestoreFarm.cultivationStartDate?.toDate(),
            //   contractDate: firestoreFarm.contractDate?.toDate(),
            //   registrationDate: firestoreFarm.registrationDate?.toDate(),
            //   certificationStartDate: firestoreFarm.certificationStartDate?.toDate(),
            //   lastChemicalUseDate: firestoreFarm.lastChemicalUseDate?.toDate(),
            //   lastInspectionDate: firestoreFarm.lastInspectionDate?.toDate(),
            //   firstVisitDate: firestoreFarm.firstVisitDate?.toDate(),
            //
            //   // TODO: Seasonia ei ole ainakaan UAT-esimerkeissä?
            //   seasonId,
            //
            //   // TODO: Are these needed?
            //   // certifications: '',
            //   // contracts: '',
            //   // countItems: '',
            //   // houseHoldCoordinate: '',
            //   // usedAsOriginFarmForProducts: '',
            // };
            // 2) Create the farm
            const prismaFarm = await this.farmsService.create({
                organisation: organisation,
                facilityValues,
                farmValues
            });
            // 3) Create plots for the farm
            // TODO: Could create with "set" inside farmService's prisma.create too, but the usual workflow is that
            // plots are created only after Farm already exists
            if (firestoreFarm.plots && firestoreFarm.plots.length > 0) {
                const plots = firestoreFarm.plots.map((plot)=>{
                    return this.plotsService.upsert({
                        organisation: organisation,
                        shortCode: plot.labelShort,
                        name: plot.label,
                        farmId: prismaFarm.id,
                        type: plot.type
                    }, {
                        operationType: 'farmImport',
                        updatedBy: firestoreFarm.updatedBy?.label
                    });
                });
                await Promise.all(plots);
            }
            return prismaFarm;
        } catch (err) {
            if (err.name === 'PrismaClientKnownRequestError' && err.code === 'P2002' && err.meta.target[0] === 'shortCode') {
                this.logger.error('Duplicate shortcode for farm ' + counter + ': ' + farmShortCode + ' / ' + farmLabel);
            } else {
                console.log('ERROR with farm ' + counter + ': ' + err, firestoreFarm);
                console.log(err);
                throw 'Farm error';
            }
        }
    }
    async importFarms(subCollections, meta) {
        const farms = await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(subCollections, 'farms', 50);
        const seasons = await this.seasonService.getMany({
            organisation: 'ltc'
        });
        const locations = await this.locationsService.getMany().then((l)=>l.data);
        let totalCount = 0;
        const promises = farms.map(async (firestoreFarm)=>{
            const counter = totalCount;
            totalCount++;
            await this.importFarm(firestoreFarm, counter, seasons, locations, meta);
        });
        const imported = await Promise.all(promises);
        return imported.filter((val)=>val); // Filter out exceptions
    }
    constructor(firestoreUtilsService, seasonService, farmsService, plotsService, locationsService, personsService){
        this.firestoreUtilsService = firestoreUtilsService;
        this.seasonService = seasonService;
        this.farmsService = farmsService;
        this.plotsService = plotsService;
        this.locationsService = locationsService;
        this.personsService = personsService;
        this.logger = new _common.Logger(FirestoreFarmImporterService.name);
        this.parseBoolean = (value)=>{
            return value && (value === 'true' || value === true);
        };
        this.parseNumber = (value)=>{
            const parsed = parseInt(value);
            return !isNaN(parsed) ? parsed : null;
        };
        this.parsePlotValues = (plot)=>{
            const { // Creation time data
            createdBy, createdDate, updatedBy, updatedDate, createdLocation, updatedLocation, // Actual data
            name, properties: surveyData, farm, auditActivityId, geodatas, geodatasFull, polygon, polygonFull, varieties, varietiesFull, primaryCrops, secondaryCrops, season, seasons, // Direct mapping to Plot
            traditionalOwners, // The rest
            ...moreSurveyTypeOfData } = plot;
            // console.log('geodatasFull', JSON.stringify(geodatasFull, null, 4));
            // console.log('polygonFull', JSON.stringify(polygonFull, null, 4));
            const geoData = geodatasFull[geodatasFull.length - 1];
            if (geodatasFull.length > 1) {
                this.logger.warn('More than 1 geodata for plot! Processing the last one', geodatasFull.map((geo)=>({
                        idLabelShort: geo.properties.idLabelShort,
                        createdDate: geo.createdDate,
                        isDeleted: geo.isDeleted,
                        isArchived: geo.isArchived,
                        enabled: geo.enabled,
                        datapoints: geo.data.length
                    })));
            }
            return {
                shortCode: plot.id.labelShort,
                // Plot data
                name: plot.name || plot.label,
                type: plot.type,
                cultivationStartDate: plot.cultivationStartDate,
                registrationDate: plot.registrationDate,
                lastChemicalUseDate: plot.lastChemicalUseDate,
                ownerName: plot.ownerName,
                principalOwnsLand: this.parseBoolean(plot.principalOwnsLand),
                principalLeasesLand: this.parseBoolean(plot.principalLeasesLand),
                hasRightToLand: this.parseBoolean(plot.hasRightToLand),
                hasLandTitle: this.parseBoolean(plot.hasLandTitle),
                establishedBefore2020: this.parseBoolean(plot.establishedBefore2020),
                hasShadeTrees: this.parseBoolean(plot.hasShadeTrees),
                distanceToForestKnown: this.parseBoolean(plot.distanceToForestKnown),
                // TODO! Add to DB
                // traditionalOwners: parseBoolean(traditionalOwners),
                traditionalOwnersPresent: this.parseBoolean(plot.traditionalOwnersPresent),
                distanceToForest: this.parseNumber(plot.distanceToForest),
                yieldEstimateProcessed: this.parseNumber(plot.yieldEstimateProcessed),
                yieldEstimateRaw: this.parseNumber(plot.yieldEstimateRaw),
                // Geodata
                areaSizeManual: geoData.areaManual * _constants.SQUARE_METER_TO_HECTARES_MULTIPLIER,
                polygonCoordinates: geoData.data.map((geo)=>[
                        geo.lng,
                        geo.lat
                    ]),
                polygonSource: _plotsmodel.PlotCoordinateSources.ORIJIN_APP
            };
        };
        this.getActualLocation = (firestoreFarm, locations = [])=>{
            let storedLocation = null;
            const subCountyCode = firestoreFarm.parentLocationParentParent?.labelShort;
            if (subCountyCode) {
                storedLocation = locations.find((loc)=>loc.shortCode === subCountyCode);
            } else {
                const farmShortCode = firestoreFarm.id.labelShort;
                this.logger.log('No subCounty found for farm ' + farmShortCode, {
                    parentLocation: firestoreFarm.parentLocation,
                    parentLocationParent: firestoreFarm.parentLocationParent,
                    parentLocationParentParent: firestoreFarm.parentLocationParentParent,
                    parentLocationParentParentParent: firestoreFarm.parentLocationParentParentParent
                });
            }
            return storedLocation;
        };
    }
};
FirestoreFarmImporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestorehelperservice.FirestoreUtilsService === "undefined" ? Object : _firestorehelperservice.FirestoreUtilsService,
        typeof _seasonsservice.SeasonsService === "undefined" ? Object : _seasonsservice.SeasonsService,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _plotsservice.PlotsService === "undefined" ? Object : _plotsservice.PlotsService,
        typeof _locationsservice.LocationsService === "undefined" ? Object : _locationsservice.LocationsService,
        typeof _personsservice.PersonsService === "undefined" ? Object : _personsservice.PersonsService
    ])
], FirestoreFarmImporterService);
