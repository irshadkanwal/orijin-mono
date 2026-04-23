"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    REQUIRED_POLYGON_LENGTH: function() {
        return REQUIRED_POLYGON_LENGTH;
    },
    convertProperties: function() {
        return convertProperties;
    },
    convertToCsv: function() {
        return convertToCsv;
    },
    convertToCsvOurGeoData: function() {
        return convertToCsvOurGeoData;
    },
    convertToPreGeodataFormat: function() {
        return convertToPreGeodataFormat;
    },
    isVAlid: function() {
        return isVAlid;
    }
});
function convertProperties(data, points) {
    return {
        wip: data.wip,
        entity: data.entityParent.labelShort,
        label: data.entityParent.labelShort,
        areaAc: data.areaAc,
        areaHa: data.areaHa,
        selfIntersects: data.selfIntersects,
        areaCalculated: data.areaCalculated,
        areaManual: data.areaManual,
        pointCount: points.length,
        createdDate: data.createdDate.toDate(),
        updatedBy: data.updatedBy.label,
        notes: data.notes,
        name: data.name,
        farm: data.entityParent.label
    };
}
const REQUIRED_POLYGON_LENGTH = 4;
function convertToPreGeodataFormat(geodatas) {
    const polygons1 = geodatas.map((geodata)=>{
        return {
            coordinates: geodata.data,
            properties: {
                ...geodata,
                data: undefined
            }
        };
    });
    return polygons1;
}
function isVAlid(geodata) {
    return geodata.data.length >= REQUIRED_POLYGON_LENGTH && geodata.areaHa && parseFloat(geodata.areaHa + '') < 10;
}
function convertToCsv(data, index) {
    return {
        index,
        status: data.wip ? 'WIP ' : 'Done',
        ...data,
        createdDate: data.createdDate.toDate().toISOString()
    };
}
function convertToCsvOurGeoData(data, index) {
    return {
        index,
        status: data.wip ? 'WIP ' : 'Done',
        ...data,
        createdDate: data.createdDate.toISOString()
    };
}
