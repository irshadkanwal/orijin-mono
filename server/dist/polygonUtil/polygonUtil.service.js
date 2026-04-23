"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PolygonUtilService", {
    enumerable: true,
    get: function() {
        return PolygonUtilService;
    }
});
const _common = require("@nestjs/common");
const _turf = /*#__PURE__*/ _interop_require_wildcard(require("@turf/turf"));
const _plotsmodel = require("../farms/models/plots.model");
const _constants = require("../common/constants");
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
const firstNotSameAsLast = (firstCoord, lastCoord)=>{
    return firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1];
};
const getMaxAllowedDistanceBetweenPoints = (polygonSource)=>{
    return polygonSource === _plotsmodel.PlotCoordinateSources.ORIJIN_APP ? 30.0 // Our app should be very precise
     : 1000.0; // Imported data can be pretty much anything..
};
const haveWarn = (warningName, polygonWarnings)=>{
    return !!polygonWarnings.find((warn)=>warn.key === warningName);
};
let PolygonUtilService = class PolygonUtilService {
    // constructor(private readonly logger: Logger) {}
    convertToGeoJson(polygons, withPoint = true) {
        return {
            type: 'FeatureCollection',
            features: polygons.map((polygon)=>{
                const pointFeature = {
                    type: 'Feature',
                    properties: polygon.properties,
                    geometry: {
                        coordinates: polygon.coordinates[0],
                        type: 'Point'
                    },
                    id: 0
                };
                const polyFeature = {
                    type: 'Feature',
                    properties: polygon.properties,
                    geometry: {
                        coordinates: [
                            polygon.coordinates
                        ],
                        type: 'Polygon'
                    }
                };
                return withPoint ? [
                    pointFeature,
                    polyFeature
                ] : [
                    polyFeature
                ];
            }).filter((x)=>x).flat()
        };
    }
    shiftPolygon(coordinates, howMuch = 0.0005) {
        // TODO: Determine shift need from coordinate boundaries or something..
        return coordinates.map((coord)=>{
            return [
                coord[0] + howMuch,
                coord[1]
            ];
        });
    }
    /**
   * Area in square meters
   *
   * @param geoJson
   */ calculateArea(geoJson) {
        // const polygon = turf.polygon([
        //   [
        //     [125, -15],
        //     [113, -22],
        //     [154, -27],
        //     [144, -15],
        //     [125, -15],
        //   ],
        // ]);
        const area = _turf.area(geoJson);
        // console.log(area);
        return area;
    }
    selfIntersects(coordinates) {
        return _turf.kinks(_turf.polygon([
            coordinates
        ])).features.length > 0;
    }
    getPolygonInteractionWarnings(warningType, polygonIdA, polygonIdB) {
        if (warningType?.createOverlapWarning) {
            return {
                key: 'Interaction-polygon-overlapping',
                fixed: false,
                polygons: {
                    connect: [
                        {
                            id: polygonIdA
                        },
                        {
                            id: polygonIdB
                        }
                    ]
                }
            };
        }
    }
    checkDistanceBetweenPoints(coordinates, polygonSource) {
        const maxMetersBetweenPoints = getMaxAllowedDistanceBetweenPoints(polygonSource);
        for(let i = 0; i < coordinates.length; i++){
            const nextPoint = coordinates[i === coordinates.length - 1 ? 0 : i + 1];
            const distanceToNextPoint = this.getDistanceBetweenCoordinates(coordinates[i], nextPoint).distance;
            if (distanceToNextPoint > maxMetersBetweenPoints) return true;
        }
    }
    isTooLarge(coordinates, plotCode) {
        const tooLargeInSquareMeters = 30 * _constants.HECTARE_TO_SQUARE_METER_MULTIPLIRE; // TODO: Make commodity-specific
        const area = _turf.area(_turf.polygon([
            coordinates
        ]));
        const tooLarge = area > tooLargeInSquareMeters;
        if (tooLarge) {
            this.logger.warn('Area too large for ' + plotCode + ': ' + area + ' m2, max allowed: ' + tooLargeInSquareMeters);
        }
        return tooLarge;
    }
    isTooSmall(coordinates, plotCode) {
        const tooSmallInSquareMeters = 10;
        const area = _turf.area(_turf.polygon([
            coordinates
        ]));
        const tooSmall = area < 10;
        if (tooSmall) {
            this.logger.warn('Area too small for ' + plotCode + ': ' + area + ' m2, min allowed: ' + tooSmallInSquareMeters);
        }
        return tooSmall;
    }
    completePolygonAndGetWarnings(coordinates, polygonSource, plotCode) {
        // Just a single point - no need to verify further
        if (coordinates.length === 1) {
            return {
                completedPolygon: coordinates,
                polygonWarnings: []
            };
        }
        const polygonWarnings = [];
        // First and last point are not equivalent - an obvious fix, not worth of even a warning
        const firstCoord = coordinates[0];
        const lastCoord = coordinates[coordinates.length - 1];
        if (firstNotSameAsLast(firstCoord, lastCoord)) {
            coordinates.push(coordinates[0]);
        }
        // Not enough points, can't proceed
        if (coordinates.length <= 3) {
            return {
                completedPolygon: null,
                polygonWarnings: [
                    {
                        key: 'Not-enough-points',
                        fixed: false
                    }
                ]
            };
        }
        // Distance too large
        if (this.checkDistanceBetweenPoints(coordinates, polygonSource)) {
            polygonWarnings.push({
                key: 'Spikes',
                fixed: false
            });
        }
        // Self-intersects
        let areaAsSquareMeters = null;
        if (this.selfIntersects(coordinates)) {
            polygonWarnings.push({
                key: 'Self-intersects',
                fixed: false
            });
        } else {
            // Only meaningful if not self-intersecting
            try {
                areaAsSquareMeters = _turf.area(_turf.polygon([
                    coordinates
                ]));
            } catch (error) {
                this.logger.error('Error while calculating area', error?.message);
            }
            if (this.isTooLarge(coordinates, plotCode)) {
                polygonWarnings.push({
                    key: 'Area-too-large',
                    fixed: false
                });
            }
            if (this.isTooSmall(coordinates, plotCode)) {
                polygonWarnings.push({
                    key: 'Area-too-small',
                    fixed: false
                });
            }
        }
        return {
            completedPolygon: coordinates,
            polygonWarnings,
            areaAsSquareMeters
        };
    }
    fixPolygon(coordinates, originalWarnings, polygonSource, plotShortCode) {
        // console.log(
        //   'Checking incoming polygon, GeoJSON: ',
        //   this.convertToGeoJson([{ coordinates }]),
        // );
        // Will never be able to fix
        if (haveWarn('Not-enough-points', originalWarnings) || haveWarn('Distance-between-every-point-is-too-large', originalWarnings)) {
            this.logger.warn('Unfixable polygon due to warnings ' + JSON.stringify(originalWarnings));
            return null;
        }
        // Able to fix
        const warningsAfterFixAttempt = [];
        let fixedCoordinates = [
            ...coordinates
        ]; // Copy to avoid modifying the original
        // Fix spikes
        if (haveWarn('Spikes', originalWarnings)) {
            fixedCoordinates = this.fixSpikes(fixedCoordinates, polygonSource);
            if (fixedCoordinates.length <= 3) {
                this.logger.warn('Unfixable polygon due to spikes for ' + plotShortCode);
                return null;
            }
            warningsAfterFixAttempt.push({
                key: 'Spikes',
                fixed: true
            });
        }
        // Fix self-intersects
        if (haveWarn('Self-intersects', originalWarnings)) {
            const intersectionFixed = this.fixSelfIntersectWithConcave(fixedCoordinates, plotShortCode);
            if (intersectionFixed) {
                fixedCoordinates = intersectionFixed;
                warningsAfterFixAttempt.push({
                    key: 'Self-intersects',
                    fixed: true
                });
            } else {
                warningsAfterFixAttempt.push({
                    key: 'Self-intersects',
                    fixed: false
                });
            }
        }
        // const remainingWarnings: PolygonWarning[] =
        //   this.completePolygonAndGetWarnings(fixedCoordinates, polygonSource);
        const areaAsSquareMetersAfterFix = _turf.area(_turf.polygon([
            fixedCoordinates
        ]));
        const isTooLargeAfterFixing = this.isTooLarge(fixedCoordinates, plotShortCode);
        if (isTooLargeAfterFixing) {
            warningsAfterFixAttempt.push({
                key: 'Area-too-large',
                fixed: false
            });
            return null;
        } else if (haveWarn('Area-too-large', originalWarnings)) {
            this.logger.log('Not too large after fixing: ' + areaAsSquareMetersAfterFix + ' but had earlier warning in ', originalWarnings);
            warningsAfterFixAttempt.push({
                key: 'Area-too-large',
                fixed: true
            });
        }
        if (this.isTooSmall(fixedCoordinates, plotShortCode)) {
            warningsAfterFixAttempt.push({
                key: 'Area-too-small',
                fixed: false
            });
            return null;
        }
        return {
            warningsAfterFixAttempt: warningsAfterFixAttempt,
            fixedCoordinates: fixedCoordinates,
            areaAsSquareMetersAfterFix: areaAsSquareMetersAfterFix
        };
    }
    checkPolygonOverlappingForOrg(polygons, coordinates, polygonId) {
        if (!coordinates?.length || !polygons?.length || coordinates.length === 1) {
            return null;
        }
        const newPolygon = this.createPolygon([
            coordinates
        ]);
        const overlappingPolygons = [];
        const outdatedWarnings = [];
        polygons.forEach((otherPolygon)=>{
            const targetPolygon = this.createPolygon([
                otherPolygon.coordinates
            ]);
            const existingInteractionWarnings = otherPolygon.polygonInteractionWarnings;
            if (polygonId !== otherPolygon.id) {
                try {
                    const isOverlapping = this.isPolygonOverlapping(newPolygon, targetPolygon);
                    if (isOverlapping) {
                        overlappingPolygons.push(otherPolygon);
                    }
                } catch (error) {
                    this.logger.error('Error while checking for overlap: ' + error?.message);
                // this.logger.error({ coordinates, otherPolygon });
                }
                existingInteractionWarnings.forEach((warning)=>{
                    if (warning['polygons'].map((polygon)=>polygon.id).includes(polygonId)) {
                        outdatedWarnings.push(warning);
                    }
                });
            }
        });
        return {
            polygons: overlappingPolygons,
            outdatedWarnings
        };
    }
    fixSpikes(originalPolygon, polygonSource) {
        const polygon = [
            ...originalPolygon
        ];
        // If polygon has been closed by pushing first point to the end too, remove the last point to
        // avoid inaccurate first point guiding the simplification
        const first = polygon[0];
        const last = polygon[polygon.length - 1];
        if (first[0] === last[0] && first[1] === last[1]) {
            polygon.pop();
        }
        // Accuracy often improves towards the end, so travel from last point to first for better results
        const polygonReversed = [
            ...polygon
        ].reverse();
        const maxMetersBetweenPoints = getMaxAllowedDistanceBetweenPoints(polygonSource);
        const simplified = [
            polygonReversed[0]
        ]; // Always keep the last point
        for(let i = 0; i < polygonReversed.length - 1;){
            const currentPoint = simplified[simplified.length - 1];
            let nextPointIndex = i + 1;
            let foundClosePoint = false;
            while(nextPointIndex < polygonReversed.length){
                const nextPoint = polygonReversed[nextPointIndex];
                const distance = this.getDistanceBetweenCoordinates(currentPoint, nextPoint);
                if (distance.distance <= maxMetersBetweenPoints) {
                    simplified.push(nextPoint);
                    i = nextPointIndex;
                    foundClosePoint = true;
                    break;
                }
                nextPointIndex++;
            }
            if (!foundClosePoint) {
                break; // No more close points found, end the loop
            }
        }
        simplified.reverse(); // Back to original order
        simplified.push(simplified[0]); // Close the polygon
        return simplified;
    }
    /**
   * DISABLED as this distorts the original polygon too much now.
   *
   * TODO: try with Turf.buffer and play with tolerances etc.
   *
   * @param coordinates
   */ fixSelfIntersectWithSimplify(coordinates) {
        const polygon = _turf.polygon([
            coordinates
        ]);
        const fixedCoordinates = fix(polygon, 0.1);
        function fix(pol, tolerance) {
            const fixPolygon = _turf.simplify(pol, {
                tolerance: tolerance,
                highQuality: true
            });
            const isKink = _turf.kinks(fixPolygon).features.length;
            if (isKink && _turf.round(tolerance, 1) < 1) {
                return fix(pol, _turf.round(tolerance + 0.1, 1));
            } else return fixPolygon.geometry.coordinates[0];
        }
        return fixedCoordinates.length ? fixedCoordinates : coordinates;
    }
    fixSelfIntersectWithConcave(originalCoordinates, plotShortCode) {
        function fix(pol) {
            const fixPolygon = _turf.concave(pol);
            return fixPolygon.geometry.coordinates[0];
        }
        const coordinatesAsPoints = _turf.featureCollection(originalCoordinates.map((coord)=>_turf.point(coord)));
        try {
            const fixedCoordinates = fix(coordinatesAsPoints);
            return fixedCoordinates.length ? fixedCoordinates : null;
        } catch (err) {
            this.logger.warn('Failed self-intersection fix with concave for ' + plotShortCode + ', err: ' + err);
            this.logger.warn(this.convertToGeoJson([
                {
                    coordinates: originalCoordinates,
                    properties: {}
                }
            ]));
            return null;
        }
    }
    getDistanceBetweenCoordinates(coordinate1, coordinate2) {
        const point1 = _turf.point(coordinate1);
        const point2 = _turf.point(coordinate2);
        const distance = _turf.distance(point1, point2, {
            units: 'meters'
        });
        return {
            distance: distance,
            points: [
                point1,
                point2
            ]
        };
    }
    createPolygon(coordinates) {
        if (coordinates.length === 1) {
            return coordinates;
        }
        return _turf.polygon(coordinates);
    }
    isPolygonOverlapping(polygonSource, polygonTarget) {
        // sometimes throws error if data is like [ [ [ 30.1731571, 0.858141 ] ] ]
        try {
            return _turf.booleanOverlap({
                type: 'Polygon',
                coordinates: polygonSource
            }, {
                type: 'Polygon',
                coordinates: polygonTarget
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    constructor(){
        this.logger = new _common.Logger(PolygonUtilService.name);
    }
};
PolygonUtilService = _ts_decorate([
    (0, _common.Injectable)()
], PolygonUtilService);
