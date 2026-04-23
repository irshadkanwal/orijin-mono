"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Coordinates;
    }
});
const _classtransformer = require("class-transformer");
const _LatLong = /*#__PURE__*/ _interop_require_default(require("../refdata/LatLong"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Coordinates = class Coordinates {
    // static ofGeoCoordinates(input: GeoLocationInput): Coordinates {
    //   const latLong1 = new LatLong(input.coords.latitude, input.coords.longitude);
    //   const coordinates = new Coordinates(latLong1, input.coords.altitude);
    //   coordinates.speed = input.coords.speed;
    //   coordinates.altitudeAccuracy = input.coords.altitudeAccuracy;
    //   coordinates.accuracy = input.coords.accuracy;
    //   return coordinates;
    // }
    static of(lat, long, altitude) {
        return new Coordinates(new _LatLong.default(lat, long), altitude);
    }
    constructor(latLong, altitude){
        this.latLong = new _LatLong.default(null, null);
        this.altitude = null;
        this.accuracy = null;
        this.altitudeAccuracy = null;
        this.speed = null;
        this.altitudeMin = null;
        this.altitudeMax = null;
        this.name = null;
        this.latLong = latLong;
        this.altitude = altitude;
    }
};
_ts_decorate([
    (0, _classtransformer.Type)(()=>_LatLong.default),
    _ts_metadata("design:type", typeof _LatLong.default === "undefined" ? Object : _LatLong.default)
], Coordinates.prototype, "latLong", void 0);
