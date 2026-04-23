"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreFarmInspectionGetterService", {
    enumerable: true,
    get: function() {
        return FirestoreFarmInspectionGetterService;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _firestorefarminspectionservice = require("./firestore.farm.inspection.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirestoreFarmInspectionGetterService = class FirestoreFarmInspectionGetterService {
    async getFromV1Api(org, farmFirestoreId, preventDuplicates = true) {
        const response = await this.httpService.axiosRef.post('https://us-central1-orijin-prod.cloudfunctions.net/entity/getEntity', {
            referenceObjectId: {
                id: farmFirestoreId,
                refcollection: 'farms'
            },
            userId: {
                id: 'RPgeSkgbHzeC1rANI7VFb5KUmD52',
                refcollection: 'platformusers'
            },
            workspace: 'ltc_master24',
            organisation: 'ltc',
            configKey: 'ltc'
        });
        const resultJson = response.data;
        // console.log(util.inspect(response.data, null, 99)); // Mega-json object
        await this.farmInspectionService.process(resultJson, org, preventDuplicates);
        this.logger.log('Done');
    }
    constructor(httpService, farmInspectionService){
        this.httpService = httpService;
        this.farmInspectionService = farmInspectionService;
        this.logger = new _common.Logger(FirestoreFarmInspectionGetterService.name);
    }
};
FirestoreFarmInspectionGetterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService,
        typeof _firestorefarminspectionservice.FirestoreFarmInspectionService === "undefined" ? Object : _firestorefarminspectionservice.FirestoreFarmInspectionService
    ])
], FirestoreFarmInspectionGetterService);
