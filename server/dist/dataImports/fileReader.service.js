"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileReaderService", {
    enumerable: true,
    get: function() {
        return FileReaderService;
    }
});
const _common = require("@nestjs/common");
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _xlsx = /*#__PURE__*/ _interop_require_wildcard(require("xlsx"));
const _fastxmlparser = require("fast-xml-parser");
const _papaparse = /*#__PURE__*/ _interop_require_wildcard(require("papaparse"));
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
let FileReaderService = class FileReaderService {
    readDirectory(directory) {
        const directoryPath = this.getFullPath(directory);
        return _fs.readdirSync(directoryPath);
    }
    convertExcelDateToJSDate(excelDate) {
        // Get the number of milliseconds from Unix epoch.
        if (!excelDate || excelDate === '') return null;
        const unixTime = (excelDate - 25569) * 86400 * 1000;
        return new Date(unixTime);
    }
    async readExcelFile(file, headerRow = 1) {
        const buf = _fs.readFileSync(this.getFullPath(file));
        const workbook = _xlsx.read(buf, {
            type: 'buffer'
        });
        const results = {};
        for (const sheetName of workbook.SheetNames){
            const jsonData = _xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
                range: headerRow - 1
            });
            const rows = Object.keys(jsonData);
            results[sheetName] = [];
            for (const rowNumber of rows){
                results[sheetName].push(jsonData[rowNumber]);
            }
        }
        return results;
    }
    async readFileAndParseCsv(file) {
        try {
            const data = await _fs.promises.readFile(this.getFullPath(file), 'utf8');
            const lines = data.split('\n');
            const nonEmptyLines = lines.filter((line)=>line.trim() !== '');
            const dataWithoutEmpties = nonEmptyLines.join('\n');
            const fileContents = _papaparse.parse(dataWithoutEmpties, {
                header: true
            });
            return fileContents.data;
        } catch (err) {
            this.logger.error('Error reading file:', err);
        }
    }
    async readCsvFile(file) {
        try {
            const data = await _fs.promises.readFile(this.getFullPath(file), 'utf8');
            const lines = data.split('\n').filter((line)=>line.trim()); // Remove empty lines
            const headers = lines[0].split(',');
            const results = lines.slice(1).map((line)=>{
                const values = line.split(',');
                return headers.reduce((obj, header, index)=>{
                    obj[header] = values[index];
                    return obj;
                }, {});
            });
            return results;
        } catch (err) {
            this.logger.error('Error reading file:', err);
        }
    }
    /**
   * Yes yes I'm not Excel, but combining all the various data types here.. should rename Service later.
   *
   * @param file
   */ async readXmlFile(file) {
        //xml file from https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ms762271(v=vs.85)
        const xmlFile = (0, _fs.readFileSync)(this.getFullPath(file), 'utf8');
        const parser = new _fastxmlparser.XMLParser({
            ignoreAttributes: false
        });
        return parser.parse(xmlFile);
    }
    readExcelBuffer(buffer, isSingleSheet) {
        const workbook = _xlsx.read(buffer, {
            type: 'buffer'
        });
        const results = {};
        if (isSingleSheet) {
            const jsonData = _xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            return jsonData;
        }
        for (const sheetName of workbook.SheetNames){
            const jsonData = _xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            results[sheetName] = jsonData;
        }
        return results;
    }
    async readCsvBuffer(buffer) {
        try {
            const data = buffer.toString('utf8');
            const fileContents = _papaparse.parse(data, {
                header: true,
                skipEmptyLines: true
            });
            return fileContents.data;
        } catch (err) {
            this.logger.error('Error reading CSV buffer:', err);
            throw err;
        }
    }
    readXmlBuffer(buffer) {
        try {
            const xmlData = buffer.toString('utf8');
            const parser = new _fastxmlparser.XMLParser({
                ignoreAttributes: false
            });
            return parser.parse(xmlData);
        } catch (err) {
            this.logger.error('Error reading XML buffer:', err);
            throw err;
        }
    }
    parseCoordinatesFromString(value) {
        let split = value.split(';');
        let split2 = value.split(',');
        let result = [];
        if (split2.length > 2) {
            split = split2;
        }
        if (split.length % 2 === 0) {
            let current = {
                lat: null,
                lng: null
            };
            let index = 0;
            for (let item of split){
                if (item.indexOf('0 ') >= 0) {
                    item = item.replace('0 ', '');
                }
                if (index % 2 === 0) {
                    current = {
                        lat: null,
                        lng: null
                    };
                    current.lng = parseFloat(item);
                } else {
                    current.lat = parseFloat(item);
                    result.push(current);
                }
                index++;
            }
            return result;
        } else {
            throw Error("coordinates need to be paired, remember to use ';' to separate " + split.length);
        }
    }
    constructor(){
        this.logger = new _common.Logger(FileReaderService.name);
        this.getFullPath = (file)=>{
            const fullPath = process.cwd() + file;
            return fullPath;
        };
    }
};
FileReaderService = _ts_decorate([
    (0, _common.Injectable)()
], FileReaderService);
