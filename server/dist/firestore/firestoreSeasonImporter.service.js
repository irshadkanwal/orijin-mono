"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreSeasonImporterService", {
    enumerable: true,
    get: function() {
        return FirestoreSeasonImporterService;
    }
});
const _common = require("@nestjs/common");
const _seasonsservice = require("../seasons/seasons.service");
const _firestorehelperservice = require("./firestore.helper.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirestoreSeasonImporterService = class FirestoreSeasonImporterService {
    async importSeason(subCollections, meta) {
        const seasons = await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(subCollections, 'seasons');
        const promises = seasons.map(async (season)=>{
            // console.log(season.id, '=>', season);
            try {
                return await this.seasonService.create({
                    organisation: meta.organisation,
                    shortCode: season.id.labelShort,
                    name: season.id.label,
                    startsAt: season.startDate?.toDate(),
                    active: season.enabled || false
                });
            } catch (err) {
                this.logger.error(err);
                console.log(err);
            }
        });
        const imported = await Promise.all(promises);
        return imported.filter((val)=>val); // Filter out exceptions
    }
    constructor(firestoreUtilsService, seasonService){
        this.firestoreUtilsService = firestoreUtilsService;
        this.seasonService = seasonService;
        this.logger = new _common.Logger(FirestoreSeasonImporterService.name);
    }
};
FirestoreSeasonImporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestorehelperservice.FirestoreUtilsService === "undefined" ? Object : _firestorehelperservice.FirestoreUtilsService,
        typeof _seasonsservice.SeasonsService === "undefined" ? Object : _seasonsservice.SeasonsService
    ])
], FirestoreSeasonImporterService);
