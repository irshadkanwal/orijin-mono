"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GeocledianApiService", {
    enumerable: true,
    get: function() {
        return GeocledianApiService;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const oddTrickForJest = async ()=>{
    // Causes a "open handle TLSWRAP" without this... real magic.
    // https://stackoverflow.com/questions/69169492/async-external-function-leaves-open-handles-jest-supertest-express
    return process.nextTick(()=>{
    // nada
    });
};
let GeocledianApiService = class GeocledianApiService {
    async get(url) {
        await oddTrickForJest();
        const fullUrl = this.baseUrl + url + '?key=' + this.apiKey;
        try {
            const response = await this.httpService.axiosRef.get(fullUrl);
            return response.data;
        } catch (err) {
            this.logger.error('Error in GET: ' + fullUrl, err);
        }
    }
    async post(url, payload) {
        // this.baseUrl = 'http://localhost:3000/';
        try {
            await oddTrickForJest();
            const response = await this.httpService.axiosRef.post(this.baseUrl + url + '?key=' + this.apiKey, payload);
            return response.data;
        } catch (err) {
            this.logger.error(err);
            this.logger.error(err.response.data);
        }
    }
    async usageSummary() {
        return this.get('usage');
    }
    /**
   * https://geocledian.com/agknow/api/v4/docs#/EUDR%20-%20Beta/register_eudr_parcel_agknow_api_v4_eudr_parcels_post
   *
   * @param parcel
   */ async registerParcel(parcel) {
        // console.log('Trying', JSON.stringify(parcel, null, 4));
        const geometry = Array.isArray(parcel.coordinates[0]) ? {
            type: 'Polygon',
            coordinates: parcel.coordinates
        } : {
            type: 'Point',
            coordinates: parcel.coordinates
        };
        const payload = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: geometry,
                    properties: parcel.properties,
                    id: 0
                }
            ]
        };
        // console.log('as payload', JSON.stringify(payload, null, 4));
        return this.post('eudr/parcels', payload);
    }
    async getParcels() {
        return this.get('eudr/parcels');
    }
    async getParcel(id) {
        return this.get('eudr/parcels/' + id);
    }
    async getParcelRisk(id) {
        return this.get('eudr/parcels/' + id + '/risk');
    }
    constructor(httpService){
        this.httpService = httpService;
        this.logger = new _common.Logger(GeocledianApiService.name);
        this.apiKey = process.env.GEOCLEDIAN_KEY;
        this.baseUrl = 'https://geocledian.com/agknow/api/v4/';
    }
};
GeocledianApiService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService
    ])
], GeocledianApiService);
