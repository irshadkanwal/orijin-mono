"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _config1 = /*#__PURE__*/ _interop_require_default(require("../common/configs/config"));
const _fileReaderservice = require("./fileReader.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/**
 * TODO: Decide what to do with this test, not really usefull.. keeping as skip
 */ describe.skip('ExcelImport', ()=>{
    let excelImportService;
    beforeEach(async ()=>{
        const app = await _testing.Test.createTestingModule({
            imports: [
                _config.ConfigModule.forRoot({
                    isGlobal: true,
                    load: [
                        _config1.default
                    ]
                })
            ],
            providers: [
                _fileReaderservice.FileReaderService
            ]
        }).compile();
        app.useLogger(new _common.Logger());
        excelImportService = app.get(_fileReaderservice.FileReaderService);
    });
    describe('Excel reading', ()=>{
        it('Should read in a file', async ()=>{
            const file = process.cwd() + '/importData/LTC-Step5-FARMS-HMA.xlsx';
            const result = await excelImportService.readExcelFile(file);
            expect(result).toEqual({});
        });
    });
});
