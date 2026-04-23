"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appForScriptsmodule = require("./appForScripts.module");
const _firestoreFarmInspectionGetterservice = require("../firestore/firestoreFarmInspectionGetter.service");
const _firestoreservice = require("../firestore/firestore.service");
const _farmsservice = require("../farms/farms.service");
const _polygonUtilservice = require("../polygonUtil/polygonUtil.service");
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
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
const init = async ()=>{
    console.log('== Get latest polygons from Firestore via API and import them as farm inspections == ');
    const context = await _core.NestFactory.createApplicationContext(_appForScriptsmodule.AppModuleForScripts);
    await context.init();
    const farmService = context.get(_farmsservice.FarmsService);
    const polygonUtil = context.get(_polygonUtilservice.PolygonUtilService);
    const firestoreService = context.get(_firestoreservice.FirestoreService);
    const firestoreFarmInspectionGetterService = context.get(_firestoreFarmInspectionGetterservice.FirestoreFarmInspectionGetterService);
    // Get all farms and their polygons for LTC
    const farms = await farmService.getMany({
        organisation: 'ltc',
        seasonCode: '2024/25'
    });
    console.log('Processing: ' + farms.data.length);
    // Convert them to GeoJSON if active
    const goodPolygons = farms.data.flatMap((farm)=>farm.plots.map((plot)=>{
            const activePolygons = plot.polygons.filter((polygon)=>polygon.active);
            // console.log(activePolygons);
            if (activePolygons.length > 0) {
                const coords = activePolygons[0].coordinates;
                if (coords.length < 4) {
                    console.log('Polygon with less than 3 coordinates found: ' + farm.facility.shortCode + ' ' + plot.shortCode + ' ' + coords.length);
                    return null;
                }
                return {
                    properties: {
                        farmShortCode: farm.facility.shortCode,
                        plotShortCode: plot.shortCode,
                        updatedBy: farm.updatedBy,
                        updatedAt: farm.updatedAt
                    },
                    coordinates: coords
                };
            }
            return null;
        })).filter((polygon)=>polygon);
    const unfixablePolygons = farms.data.flatMap((farm)=>farm.plots.map((plot)=>{
            const activePolygons = plot.polygons.filter((polygon)=>polygon.active);
            if (plot.polygons.length > 0 && activePolygons.length === 0 && plot.polygons[0].coordinates) {
                return {
                    properties: {
                        farmShortCode: farm.facility.shortCode,
                        plotShortCode: plot.shortCode,
                        updatedBy: farm.updatedBy,
                        updatedAt: farm.updatedAt
                    },
                    coordinates: plot.polygons[0].coordinates
                };
            }
            return null;
        })).filter((polygon)=>polygon);
    if (!_fs.existsSync('test/out')) {
        _fs.mkdirSync('test/out');
    }
    _fs.writeFileSync('test/out/ltc-fixed-polygons.json', JSON.stringify(polygonUtil.convertToGeoJson(goodPolygons, false)));
    _fs.writeFileSync('test/out/ltc-unfixable-polygons.json', JSON.stringify(polygonUtil.convertToGeoJson(unfixablePolygons, false)));
};
init();
