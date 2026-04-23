"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LyonDataImportService", {
    enumerable: true,
    get: function() {
        return LyonDataImportService;
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
const _facilitymodel = require("../facilities/models/facility.model");
const _plotsmodel = require("../farms/models/plots.model");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const ORGANISATION = 'lyonagro';
let LyonDataImportService = class LyonDataImportService {
    async seedSoy() {
        const soy = await this.prisma.crop.findUnique({
            where: {
                shortCode_organisation: {
                    shortCode: 'soy',
                    organisation: ORGANISATION
                }
            }
        });
        if (!soy) {
            const soy = await this.prisma.crop.create({
                data: {
                    shortCode: 'soy',
                    name: 'Soy',
                    organisation: ORGANISATION
                }
            });
            await this.prisma.cropVariety.create({
                data: {
                    shortCode: 'soy-1',
                    name: 'Soy',
                    cropId: soy.id,
                    organisation: ORGANISATION
                }
            });
        }
    }
    async importLyon() {
        await this.seedSoy();
        const directory = '/importData/lyon/';
        const allData = await this.collectData(directory);
        // console.log(JSON.stringify(allData, null, 4));
        const promises = allData.map(async (data)=>{
            const facilityValues = {
                areaTotalManual: 0,
                name: data.farmName,
                organisation: ORGANISATION,
                shortCode: data.farmName,
                type: _facilitymodel.FacilityType.Farm
            };
            const plot = {
                name: '',
                organisation: ORGANISATION,
                shortCode: data.farmName + 'PLOT-1',
                type: _plotsmodel.PlotType.Permanent,
                polygonSource: _plotsmodel.PlotCoordinateSources.IMPORT,
                polygonCoordinates: data.parsedCoordinates.map((coord)=>[
                        coord.long,
                        coord.lat
                    ])
            };
            const farmValues = {
                plots: [
                    plot
                ]
            };
            return await this.farmsService.create({
                organisation: ORGANISATION,
                facilityValues,
                farmValues
            });
        });
        await Promise.all(promises);
        this.logger.log('Farms created: ' + promises.length);
    }
    async collectData(directory) {
        const collectedData = [];
        for (const folder of [
            'GPS 5',
            'GPS 4',
            'GPS 3',
            'GPS 2',
            'GPS 1'
        ]){
            const files = this.fileReaderService.readDirectory(directory + folder);
            const promises = files.map(async (file)=>{
                console.log(file);
                const contents = await this.fileReaderService.readXmlFile(directory + folder + '/' + file);
                const data = contents['gpx']['trk'];
                const farmName = data.name;
                // The folders contain old & new data (GPS 1 = oldest, GPS 5 = newest), so we take only the most recent instance we find
                if (!collectedData.find((collected)=>collected.farmName === farmName)) {
                    const coordinatesArray = data.trkseg.trkpt;
                    const parsedCoordinates = [];
                    for (const coord of coordinatesArray){
                        //   <trkpt lat="9.3721298128" lon="-0.4243460018">
                        //   <ele>157.31</ele>
                        //   <time>2023-07-05T14:45:16Z</time>
                        parsedCoordinates.push({
                            lat: parseFloat(coord['@_lat']),
                            long: parseFloat(coord['@_lon']),
                            elevation: coord.ele,
                            time: coord.time
                        });
                    }
                    collectedData.push({
                        farmName,
                        parsedCoordinates
                    });
                }
                this.logger.log('file ' + file + ' fully processed, total count ' + collectedData.length);
            });
            await Promise.all(promises);
            this.logger.log('Folder ' + folder + ' fully processed, total count ' + collectedData.length);
        }
        return collectedData;
    }
    constructor(prisma, fileReaderService, personsService, farmsService, plotsService, locationsService, seasonsService){
        this.prisma = prisma;
        this.fileReaderService = fileReaderService;
        this.personsService = personsService;
        this.farmsService = farmsService;
        this.plotsService = plotsService;
        this.locationsService = locationsService;
        this.seasonsService = seasonsService;
        this.logger = new _common.Logger(LyonDataImportService.name);
    }
};
LyonDataImportService = _ts_decorate([
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
], LyonDataImportService);
