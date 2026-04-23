"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NahuaDataImportService", {
    enumerable: true,
    get: function() {
        return NahuaDataImportService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _fileReaderservice = require("./fileReader.service");
const _usermodel = require("../users/models/user.model");
const _facilitymodel = require("../facilities/models/facility.model");
const _plotsmodel = require("../farms/models/plots.model");
const _farmsservice = require("../farms/farms.service");
const _seedSeasons = require("../common/seed/seedSeasons");
const _commondataImportservice = require("./common.dataImport.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const ORGANISATION = 'cm_nahua';
const countryIso = 'CRI';
const folder = '/importData/COSTA RICA - NAHUA/';
let NahuaDataImportService = class NahuaDataImportService {
    async readKml(fileName) {
        const xml = await this.fileReaderService.readXmlFile(folder + fileName);
        const polygonString = xml['kml'].Document.Placemark.Polygon.outerBoundaryIs.LinearRing.coordinates;
        return polygonString.split(' ').map((latLongAlt)=>{
            const coords = latLongAlt.split(',');
            return [
                parseFloat(coords[0]),
                parseFloat(coords[1])
            ];
        });
    }
    async parseAndCreateFarms(farms) {
        const storedFarms = [];
        for (const farmRow of farms){
            const farmNumber = String(farmRow.ID3).padStart(4, '0');
            const shortCode = 'FARM-' + farmNumber;
            const storedFarm = storedFarms.find((storedFarm)=>storedFarm.facility.shortCode === shortCode);
            if (storedFarm) {
                this.logger.warn(`Farm ${farmNumber} already exists: ` + storedFarm.id);
                continue;
            }
            const name = farmRow.Nombre || '';
            this.logger.log('Going to create farm ' + shortCode + ' for ' + name);
            const personDto = {
                dateOfBirth: undefined,
                firstName: name.split(' ')[0],
                lastName: name.slice(name.split(' ')[0].length),
                type: _usermodel.UserType.Farmer,
                shortCode: 'FARMER-' + farmNumber,
                organisation: ORGANISATION
            };
            const facilityValues = {
                areaTotalManual: farmRow.area_ha,
                name: name,
                shortCode,
                type: _facilitymodel.FacilityType.Farm,
                organisation: ORGANISATION,
                mainContactPerson: personDto,
                coordinate: farmRow.Latitud && farmRow.Longitud ? {
                    // I've got these mixed up in the DB!!
                    latitude: farmRow.Longitud,
                    longitude: farmRow.Latitud
                } : undefined,
                countryIso
            };
            const plotDto = {
                name: shortCode + '-P1',
                shortCode: shortCode + '-P1',
                type: _plotsmodel.PlotType.Permanent,
                organisation: ORGANISATION,
                areaSizeManual: farmRow.area_ha
            };
            const polygonFile = farmRow.Poligon;
            const coordinates = polygonFile ? await this.readKml(polygonFile) : null;
            if (coordinates) {
                plotDto.polygonCoordinates = coordinates;
                plotDto.polygonSource = _plotsmodel.PlotCoordinateSources.IMPORT;
            }
            const payload = {
                facilityValues: facilityValues,
                farmValues: {
                    plots: [
                        plotDto
                    ],
                    seasonCode: '2023/24'
                },
                organisation: ORGANISATION
            };
            // console.log(JSON.stringify(payload, null, 4));
            try {
                const stored = await this.farmsService.create(payload);
                storedFarms.push(stored);
            } catch (err) {
                this.logger.error('err', err);
            }
        }
        return storedFarms;
    }
    async importNahua() {
        const existingSeasons = await this.prisma.season.findMany({
            where: {
                organisation: ORGANISATION
            }
        });
        if (existingSeasons.length === 0) {
            await (0, _seedSeasons.seedSeasons)(this.prisma, ORGANISATION, false);
        }
        await this.commonDataImportService.seedCommodity('cocoa', ORGANISATION);
        const file = folder + '25- E119 Farmers data.xlsx';
        const excelContents = await this.fileReaderService.readExcelFile(file);
        const sheet = excelContents['E119 Farmers data'];
        const storedFarms = await this.parseAndCreateFarms(sheet);
        return storedFarms;
    }
    constructor(prisma, farmsService, fileReaderService, commonDataImportService){
        this.prisma = prisma;
        this.farmsService = farmsService;
        this.fileReaderService = fileReaderService;
        this.commonDataImportService = commonDataImportService;
        this.logger = new _common.Logger(NahuaDataImportService.name);
    }
};
NahuaDataImportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _fileReaderservice.FileReaderService === "undefined" ? Object : _fileReaderservice.FileReaderService,
        typeof _commondataImportservice.CommonDataImportService === "undefined" ? Object : _commondataImportservice.CommonDataImportService
    ])
], NahuaDataImportService);
