"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "KokoaKamiliDataImportService", {
    enumerable: true,
    get: function() {
        return KokoaKamiliDataImportService;
    }
});
const _common = require("@nestjs/common");
const _nestjsprisma = require("nestjs-prisma");
const _fileReaderservice = require("./fileReader.service");
const _farmsservice = require("../farms/farms.service");
const _usermodel = require("../users/models/user.model");
const _facilitymodel = require("../facilities/models/facility.model");
const _plotsmodel = require("../farms/models/plots.model");
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
const ORGANISATION = 'kamili';
const groupByFarmer = (results)=>{
    const groupedResults = {};
    results.forEach((result)=>{
        const { farmerNumber } = result;
        if (!groupedResults[farmerNumber]) {
            groupedResults[farmerNumber] = [];
        }
        groupedResults[farmerNumber].push(result);
    });
    return groupedResults;
};
const groupById = (results)=>{
    const groupedResults = {};
    results.forEach((result)=>{
        const { Farmer_Plot_ID } = result;
        if (!groupedResults[Farmer_Plot_ID]) {
            groupedResults[Farmer_Plot_ID] = [];
        }
        groupedResults[Farmer_Plot_ID].push(result);
    });
    return groupedResults;
};
let KokoaKamiliDataImportService = class KokoaKamiliDataImportService {
    parsePolygons(polygonLines) {
        const parsedLines = polygonLines.map((polygonLine)=>{
            return {
                ...polygonLine,
                Timestamp_Captured: this.fileReaderService.convertExcelDateToJSDate(polygonLine.Timestamp_Captured)
            };
        });
        const polygonsPerPlot = {};
        const grouped = groupById(parsedLines);
        for (const [id, coordinates] of Object.entries(grouped)){
            polygonsPerPlot[id] = coordinates.sort((a, b)=>a.Timestamp_Captured.getTime() - b.Timestamp_Captured.getTime()).filter((poly)=>poly.GPS_Location && poly.GPS_Location !== '' && poly.Inspection_Submission_Status === 'Approved').map((poly)=>{
                const [long, lat] = poly.GPS_Location.split(',');
                return {
                    lat: parseFloat(lat),
                    long: parseFloat(long),
                    time: poly.Timestamp_Captured
                };
            });
        }
        return polygonsPerPlot;
    }
    async parseAndCreateFarms(farmersAndPlots, polygonsPerPlot, activeSeason) {
        const farmsToCreate = [];
        for (const farmLine of farmersAndPlots){
            // .filter((ff) => ff.Farmer === 2343)
            if (farmLine.Active === true) {
                const values = {
                    farmerNumber: farmLine.Farmer,
                    farmerName: farmLine.Farmer_Name,
                    plotId: farmLine.ID,
                    plotName: farmLine.Plot,
                    updatedAt: this.fileReaderService.convertExcelDateToJSDate(farmLine.Updated_Timestamp),
                    updatedBy: farmLine.Updated_By
                };
                farmsToCreate.push(values);
            }
        }
        // Add all Farmers and Farms
        const storedFarms = [];
        const grouped = groupByFarmer(farmsToCreate);
        for (const entry of Object.entries(grouped)){
            if (!entry[0]) {
                return;
            }
            const farmerNubmer = String(entry[0]).padStart(4, '0');
            const data = entry[1];
            const shortCode = data[0].farmerName.replace(' ', '');
            const name = data[0].farmerName;
            const personDto = {
                dateOfBirth: undefined,
                firstName: name.split(' ')[0],
                lastName: name.split(' ')[1],
                type: _usermodel.UserType.Farmer,
                shortCode: 'FARMER-' + farmerNubmer,
                organisation: ORGANISATION
            };
            const facilityValues = {
                areaTotalManual: 0,
                name: name,
                shortCode: 'FARM-' + farmerNubmer,
                type: _facilitymodel.FacilityType.Farm,
                organisation: ORGANISATION,
                mainContactPerson: personDto,
                countryIso: 'TZA'
            };
            const plotDtos = data.map((plot)=>{
                let finishedDto = {
                    name: plot.plotName || 'n/a',
                    shortCode: plot.plotId,
                    type: _plotsmodel.PlotType.Permanent,
                    organisation: ORGANISATION
                };
                if (polygonsPerPlot[plot.plotId] && polygonsPerPlot[plot.plotId].length > 0) {
                    const polygonCoordinates = polygonsPerPlot[plot.plotId].map((poly)=>[
                            poly.lat,
                            poly.long
                        ]);
                    finishedDto = {
                        ...finishedDto,
                        polygonCoordinates,
                        polygonSource: _plotsmodel.PlotCoordinateSources.IMPORT
                    };
                } else {
                    this.logger.warn('No polygon for plot ' + plot.plotId);
                }
                return finishedDto;
            });
            const farmValues = {
                plots: plotDtos,
                seasonId: activeSeason.id
            };
            const farm = await this.farmsService.create({
                facilityValues: facilityValues,
                farmValues: farmValues,
                organisation: ''
            });
            storedFarms.push(farm);
        }
        return storedFarms;
    }
    async importKamili() {
        await this.commonDataImportService.emptyDbForOrganisation(this.prisma, ORGANISATION);
        const existingSeasons = await this.prisma.season.findMany({
            where: {
                organisation: ORGANISATION
            }
        });
        if (existingSeasons.length === 0) {
            await (0, _seedSeasons.seedSeasons)(this.prisma, ORGANISATION, false);
        }
        await this.commonDataImportService.seedCommodity('cocoa', ORGANISATION);
        const file = '/importData/kamili/Kokoa Kamili_2022.xlsx';
        const excelContents = await this.fileReaderService.readExcelFile(file);
        const activeSeason = await this.prisma.season.findFirst({
            where: {
                organisation: ORGANISATION,
                active: true
            }
        });
        const polygonsPerPlot = this.parsePolygons(excelContents['Plot_Corners']);
        const storedFarms = await this.parseAndCreateFarms(excelContents['Farmer_Plots'], polygonsPerPlot, activeSeason);
        return storedFarms;
    }
    constructor(prisma, fileReaderService, farmsService, commonDataImportService){
        this.prisma = prisma;
        this.fileReaderService = fileReaderService;
        this.farmsService = farmsService;
        this.commonDataImportService = commonDataImportService;
        this.logger = new _common.Logger(KokoaKamiliDataImportService.name);
    }
};
KokoaKamiliDataImportService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _nestjsprisma.PrismaService === "undefined" ? Object : _nestjsprisma.PrismaService,
        typeof _fileReaderservice.FileReaderService === "undefined" ? Object : _fileReaderservice.FileReaderService,
        typeof _farmsservice.FarmsService === "undefined" ? Object : _farmsservice.FarmsService,
        typeof _commondataImportservice.CommonDataImportService === "undefined" ? Object : _commondataImportservice.CommonDataImportService
    ])
], KokoaKamiliDataImportService);
