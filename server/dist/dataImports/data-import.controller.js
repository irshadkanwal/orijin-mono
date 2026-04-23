"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DataImportController", {
    enumerable: true,
    get: function() {
        return DataImportController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _fileReaderservice = require("./fileReader.service");
const _dataImportservice = require("./dataImport.service");
const _plotsmodel = require("../farms/models/plots.model");
const _chance = require("chance");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const chance = new _chance.Chance();
let DataImportController = class DataImportController {
    async importData(org, type, file) {
        if (!file) {
            throw new _common.BadRequestException('No file uploaded.');
        }
        const { buffer, mimetype } = file;
        let parsedData;
        try {
            if (mimetype.includes('csv')) {
                parsedData = await this.fileReaderService.readCsvBuffer(buffer);
            } else if (mimetype.includes('excel') || mimetype.includes('spreadsheetml')) {
                parsedData = this.fileReaderService.readExcelBuffer(buffer, true);
            } else {
                throw new _common.BadRequestException('Unsupported file type.');
            }
            if (type === 'polygons' && parsedData) {
                parsedData.forEach((item)=>{
                    // Parse polygon field and update the coordinates field
                    item.coordinates = this.fileReaderService.parseCoordinatesFromString(item.polygon);
                    item.shortCode = item.shortCode ?? 'Poly-' + chance.word({
                        length: 3
                    });
                    item.source = item.source ?? _plotsmodel.PlotCoordinateSources.IMPORT;
                    delete item.polygon; // Remove polygon field
                    delete item.orgId;
                    delete item.areaManual;
                });
            }
            const imported = await this.dataImportService.importFromJson(parsedData, type, org, true);
            const failed = (imported || []).filter((a)=>!a);
            return {
                message: `Import complete. Successful: ${imported.length - failed.length}: Failed: ${failed.length}`
            };
        } catch (error) {
            console.error('Error in controller: ------', error);
            throw new _common.BadRequestException(error?.message || 'Failed to parse file.');
        }
    }
    constructor(fileReaderService, dataImportService){
        this.fileReaderService = fileReaderService;
        this.dataImportService = dataImportService;
    }
};
_ts_decorate([
    (0, _common.Post)(':org/upload-file/:type'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _common.Param)('org')),
    _ts_param(1, (0, _common.Param)('type')),
    _ts_param(2, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DataImportController.prototype, "importData", null);
DataImportController = _ts_decorate([
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileReaderservice.FileReaderService === "undefined" ? Object : _fileReaderservice.FileReaderService,
        typeof _dataImportservice.DataImportService === "undefined" ? Object : _dataImportservice.DataImportService
    ])
], DataImportController);
