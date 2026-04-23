"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return LatLong;
    }
});
let LatLong = class LatLong {
    get latLong() {
        return '[' + this.lat + ',' + this.lon + ']';
    }
    getCoordsArray() {
        return [
            this.lat,
            this.lon
        ];
    }
    getLatLon() {
        return {
            lat: this.lat,
            lon: this.lon
        };
    }
    constructor(lat, lon){
        this.lat = null;
        this.lon = null;
        this.lat = lat;
        this.lon = lon;
    }
};
