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
    convertKamiliToGeocledian: function() {
        return convertKamiliToGeocledian;
    },
    kamiliParcels: function() {
        return kamiliParcels;
    }
});
const _geocledianmodel = require("../../geocledian/geocledian.model");
const convertKamiliToGeocledian = (kamiliParcel)=>{
    const feature = kamiliParcel.features[0];
    return {
        // type: 'FeatureCollection',
        // features: [
        //   {
        //     type: 'Feature',
        coordinates: feature.geometry.coordinates[0],
        properties: {
            commodity: _geocledianmodel.GeocledianCommodity.cocoa,
            name: feature.properties.Polygon_ID,
            foreign_id: feature.properties.Polygon_ID,
            entity: feature.properties.Polygon_ID,
            production_start: '2020-01-01',
            production_end: '2024-05-01',
            country_iso: 'TZA',
            process_timeseries: true
        }
    };
};
const kamiliParcels = [
    {
        // parcel_id: 48532,
        request: {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features: [
                {
                    type: 'Feature',
                    properties: {
                        Polygon_ID: '2022_4_1df9b396_zamd',
                        ID: "{'61582c80', '50aaa68c', '4d30f338', '89df2e23'}",
                        Farmer: '{4.0}',
                        Organic_Survey_ID: "{'7844aa11'}",
                        Farmer_Plot_ID: "{'1df9b396'}",
                        Plotted_By: "{'zamda.gumbo@kokoakamili.com'}",
                        GPS_Location: "{'-8.178818, 36.228957', '-8.177451, 36.228890', '-8.177267, 36.229622', '-8.178466, 36.229726'}",
                        Timestamp_Captured: "{Timestamp('2022-11-17 12:14:43'), Timestamp('2022-11-17 12:05:32'), Timestamp('2022-11-17 12:11:02'), Timestamp('2022-11-17 12:08:09')}",
                        Inspection_Submission_Status: "{'Approved'}"
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    36.228957,
                                    -8.178818
                                ],
                                [
                                    36.22889,
                                    -8.177451
                                ],
                                [
                                    36.229622,
                                    -8.177267
                                ],
                                [
                                    36.229726,
                                    -8.178466
                                ],
                                [
                                    36.228957,
                                    -8.178818
                                ]
                            ]
                        ]
                    }
                }
            ]
        },
        response: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [
                        Array
                    ]
                ],
                bbox: null
            },
            properties: {
                parcel_id: 48532,
                name: '2022_4_1df9b396_zamd',
                entity: '2022_4_1df9b396_zamd',
                commodity: 'cocoa',
                production_start: '2020-12-31',
                production_end: '2024-05-01',
                country_iso: 'TZA',
                area_rep: null,
                area: 1.2014,
                geohash: 'ey6njgk',
                point_buffer_area: 4,
                validation: null,
                deforestation_risk: 'low',
                deforestation_index: 0,
                deforestation_area_ha: 0,
                degradation_risk: null,
                degradation_area_ha: null,
                degradation_index: null,
                baseline_date: '2020-12-31',
                sdate: '2024-05-02',
                landcover_forest_coverage: 0,
                landcover_plantation_coverage: 0,
                landcover_shrubs_coverage: 0.2,
                landcover_no_trees_coverage: 0.8,
                landcover_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48532/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/parcels/48532/visible/sentinel2/3406273.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_production_enddate: 'https://global.geocledian.com/agknow/api/v4/parcels/48532/visible/sentinel2/3406097.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                forest_change_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48532/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                country_risk: 'standard',
                model_version: '1.0.9',
                generation_date: '2024-05-12T20:00:00',
                map_utils_landcover_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48532/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_forest_change_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48532/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_scalebar: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48532/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true'
            },
            id: 48532,
            bbox: [
                -8.178782019677849,
                36.22888999999999,
                -8.177267000000008,
                36.2296920692412
            ]
        }
    },
    {
        // 48533,
        request: {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features: [
                {
                    type: 'Feature',
                    properties: {
                        Polygon_ID: '2022_4_7870ea71_zamd',
                        ID: "{'fb9a7946', 'e76f1fce', '095d73b9', 'd1ebdc54'}",
                        Farmer: '{4.0}',
                        Organic_Survey_ID: "{'93955768'}",
                        Farmer_Plot_ID: "{'7870ea71'}",
                        Plotted_By: "{'zamda.gumbo@kokoakamili.com'}",
                        GPS_Location: "{'-8.181507, 36.236352', '-8.181356, 36.235792', '-8.181909, 36.235721', '-8.181988, 36.236353'}",
                        Timestamp_Captured: "{Timestamp('2022-11-17 12:43:13'), Timestamp('2022-11-17 12:40:34'), Timestamp('2022-11-17 12:46:42'), Timestamp('2022-11-17 12:37:45')}",
                        Inspection_Submission_Status: "{'Approved'}"
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    36.236353,
                                    -8.181988
                                ],
                                [
                                    36.235721,
                                    -8.181909
                                ],
                                [
                                    36.235792,
                                    -8.181356
                                ],
                                [
                                    36.236352,
                                    -8.181507
                                ],
                                [
                                    36.236353,
                                    -8.181988
                                ]
                            ]
                        ]
                    }
                }
            ]
        },
        response: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [
                        Array
                    ]
                ],
                bbox: null
            },
            properties: {
                parcel_id: 48533,
                name: '2022_4_7870ea71_zamd',
                entity: '2022_4_7870ea71_zamd',
                commodity: 'cocoa',
                production_start: '2020-12-31',
                production_end: '2024-05-01',
                country_iso: 'TZA',
                area_rep: null,
                area: 0.3804,
                geohash: 'ey6njud',
                point_buffer_area: 4,
                validation: null,
                deforestation_risk: 'low',
                deforestation_index: 0,
                deforestation_area_ha: 0,
                degradation_risk: null,
                degradation_area_ha: null,
                degradation_index: null,
                baseline_date: '2020-12-31',
                sdate: '2024-05-02',
                landcover_forest_coverage: 0,
                landcover_plantation_coverage: 0.26,
                landcover_shrubs_coverage: 0.12,
                landcover_no_trees_coverage: 0.62,
                landcover_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48533/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/parcels/48533/visible/sentinel2/3406386.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_production_enddate: 'https://global.geocledian.com/agknow/api/v4/parcels/48533/visible/sentinel2/3406125.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                forest_change_png: null,
                country_risk: 'standard',
                model_version: '1.0.9',
                generation_date: '2024-05-12T20:00:00',
                map_utils_landcover_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48533/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_forest_change_legend_png: null,
                map_utils_scalebar: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48533/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true'
            },
            id: 48533,
            bbox: [
                -8.181981628757235,
                36.23572099999999,
                -8.181355999999992,
                36.23634662875723
            ]
        }
    },
    {
        // 48534,
        request: {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features: [
                {
                    type: 'Feature',
                    properties: {
                        Polygon_ID: '2022_4_d7b63011_zamd',
                        ID: "{'0cb8c139', 'e7d96fdd', 'f8fe1f7f', '6fddd730'}",
                        Farmer: '{4.0}',
                        Organic_Survey_ID: "{'2b522c3a'}",
                        Farmer_Plot_ID: "{'d7b63011'}",
                        Plotted_By: "{'zamda.gumbo@kokoakamili.com'}",
                        GPS_Location: "{'-8.176097, 36.228937', '-8.175980, 36.228396', '-8.176593, 36.228400', '-8.176517, 36.229106'}",
                        Timestamp_Captured: "{Timestamp('2022-11-17 11:56:22'), Timestamp('2022-11-17 11:58:14'), Timestamp('2022-11-17 12:01:33'), Timestamp('2022-11-17 11:54:10')}",
                        Inspection_Submission_Status: "{'Approved'}"
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    36.2284,
                                    -8.176593
                                ],
                                [
                                    36.228396,
                                    -8.17598
                                ],
                                [
                                    36.228937,
                                    -8.176097
                                ],
                                [
                                    36.229106,
                                    -8.176517
                                ],
                                [
                                    36.2284,
                                    -8.176593
                                ]
                            ]
                        ]
                    }
                }
            ]
        },
        response: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [
                        Array
                    ]
                ],
                bbox: null
            },
            properties: {
                parcel_id: 48534,
                name: '2022_4_d7b63011_zamd',
                entity: '2022_4_d7b63011_zamd',
                commodity: 'cocoa',
                production_start: '2020-12-31',
                production_end: '2024-05-01',
                country_iso: 'TZA',
                area_rep: null,
                area: 0.3903,
                geohash: 'ey6njgn',
                point_buffer_area: 4,
                validation: null,
                deforestation_risk: 'low',
                deforestation_index: 0,
                deforestation_area_ha: 0,
                degradation_risk: null,
                degradation_area_ha: null,
                degradation_index: null,
                baseline_date: '2020-12-31',
                sdate: '2024-05-02',
                landcover_forest_coverage: 0,
                landcover_plantation_coverage: 0,
                landcover_shrubs_coverage: 0.03,
                landcover_no_trees_coverage: 0.97,
                landcover_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48534/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/parcels/48534/visible/sentinel2/3406407.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_production_enddate: 'https://global.geocledian.com/agknow/api/v4/parcels/48534/visible/sentinel2/3406129.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                forest_change_png: null,
                country_risk: 'standard',
                model_version: '1.0.9',
                generation_date: '2024-05-12T20:00:00',
                map_utils_landcover_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48534/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_forest_change_legend_png: null,
                map_utils_scalebar: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48534/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true'
            },
            id: 48534,
            bbox: [
                -8.176606057021795,
                36.228396,
                -8.175980000000008,
                36.22911149373918
            ]
        }
    },
    {
        // 48535,
        request: {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features: [
                {
                    type: 'Feature',
                    properties: {
                        Polygon_ID: '2022_7_ccc862a2_shab',
                        ID: "{'af87f713', '67135591', '36ccaa61', '4679cb98'}",
                        Farmer: '{7.0}',
                        Organic_Survey_ID: "{'d907bd5b'}",
                        Farmer_Plot_ID: "{'ccc862a2'}",
                        Plotted_By: "{'shaban.lyambilo@kokoakamili.com'}",
                        GPS_Location: "{'-8.224720, 36.248241', '-8.224758, 36.248105', '-8.222975, 36.247595', '-8.222886, 36.247762'}",
                        Timestamp_Captured: "{Timestamp('2022-11-08 12:42:58'), Timestamp('2022-11-08 12:44:11'), Timestamp('2022-11-08 12:47:30'), Timestamp('2022-11-08 12:42:41')}",
                        Inspection_Submission_Status: "{'Approved'}"
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    36.248105,
                                    -8.224758
                                ],
                                [
                                    36.247595,
                                    -8.222975
                                ],
                                [
                                    36.247762,
                                    -8.222886
                                ],
                                [
                                    36.248241,
                                    -8.22472
                                ],
                                [
                                    36.248105,
                                    -8.224758
                                ]
                            ]
                        ]
                    }
                }
            ]
        },
        response: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [
                        Array
                    ]
                ],
                bbox: null
            },
            properties: {
                parcel_id: 48535,
                name: '2022_7_ccc862a2_shab',
                entity: '2022_7_ccc862a2_shab',
                commodity: 'cocoa',
                production_start: '2020-12-31',
                production_end: '2024-05-01',
                country_iso: 'TZA',
                area_rep: null,
                area: 0.3721,
                geohash: 'ey6nhye',
                point_buffer_area: 4,
                validation: null,
                deforestation_risk: 'low',
                deforestation_index: 0,
                deforestation_area_ha: 0,
                degradation_risk: null,
                degradation_area_ha: null,
                degradation_index: null,
                baseline_date: '2020-12-31',
                sdate: '2024-05-02',
                landcover_forest_coverage: 0,
                landcover_plantation_coverage: 0.06,
                landcover_shrubs_coverage: 0,
                landcover_no_trees_coverage: 0.94,
                landcover_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48535/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/parcels/48535/visible/sentinel2/3406485.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_production_enddate: 'https://global.geocledian.com/agknow/api/v4/parcels/48535/visible/sentinel2/3406185.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                forest_change_png: null,
                country_risk: 'standard',
                model_version: '1.0.9',
                generation_date: '2024-05-12T20:00:00',
                map_utils_landcover_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48535/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_forest_change_legend_png: null,
                map_utils_scalebar: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48535/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true'
            },
            id: 48535,
            bbox: [
                -8.224755012262193,
                36.247595,
                -8.22288600000001,
                36.24821800408739
            ]
        }
    },
    {
        // 48536,
        request: {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features: [
                {
                    type: 'Feature',
                    properties: {
                        Polygon_ID: '2022_10_190a82b4_shab',
                        ID: "{'26a60ccf', '29640528', '1c19be13', 'acb0c962', '96f499c3'}",
                        Farmer: '{10.0}',
                        Organic_Survey_ID: "{'253ce21e'}",
                        Farmer_Plot_ID: "{'190a82b4'}",
                        Plotted_By: "{'shabu.ligwema@kokoakamili.com'}",
                        GPS_Location: "{'-8.220023, 36.233437', '-8.220617, 36.233538', '-8.219895, 36.232515', '-8.220790, 36.232938', '-8.219540, 36.233033'}",
                        Timestamp_Captured: "{Timestamp('2022-11-28 10:10:31'), Timestamp('2022-11-28 10:08:57'), Timestamp('2022-11-28 10:04:19'), Timestamp('2022-11-28 10:12:24'), Timestamp('2022-11-28 10:06:25')}",
                        Inspection_Submission_Status: "{'Approved'}"
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    36.233538,
                                    -8.220617
                                ],
                                [
                                    36.232938,
                                    -8.22079
                                ],
                                [
                                    36.232515,
                                    -8.219895
                                ],
                                [
                                    36.233033,
                                    -8.21954
                                ],
                                [
                                    36.233437,
                                    -8.220023
                                ],
                                [
                                    36.233538,
                                    -8.220617
                                ]
                            ]
                        ]
                    }
                }
            ]
        },
        response: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [
                        Array
                    ]
                ],
                bbox: null
            },
            properties: {
                parcel_id: 48536,
                name: '2022_10_190a82b4_shab',
                entity: '2022_10_190a82b4_shab',
                commodity: 'cocoa',
                production_start: '2020-12-31',
                production_end: '2024-05-01',
                country_iso: 'TZA',
                area_rep: null,
                area: 0.9374,
                geohash: 'ey6nhun',
                point_buffer_area: 4,
                validation: null,
                deforestation_risk: 'low',
                deforestation_index: 0,
                deforestation_area_ha: 0,
                degradation_risk: null,
                degradation_area_ha: null,
                degradation_index: null,
                baseline_date: '2020-12-31',
                sdate: '2024-05-02',
                landcover_forest_coverage: 0,
                landcover_plantation_coverage: 0.34,
                landcover_shrubs_coverage: 0,
                landcover_no_trees_coverage: 0.66,
                landcover_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48536/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/parcels/48536/visible/sentinel2/3406492.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_production_enddate: 'https://global.geocledian.com/agknow/api/v4/parcels/48536/visible/sentinel2/3406241.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                forest_change_png: null,
                country_risk: 'standard',
                model_version: '1.0.9',
                generation_date: '2024-05-12T20:00:00',
                map_utils_landcover_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48536/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_forest_change_legend_png: null,
                map_utils_scalebar: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48536/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true'
            },
            id: 48536,
            bbox: [
                -8.220789668131916,
                36.23251499999999,
                -8.219540000000011,
                36.23349688210363
            ]
        }
    },
    {
        // 48537,
        request: {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features: [
                {
                    type: 'Feature',
                    properties: {
                        Polygon_ID: '2022_11_74885a5a_boni',
                        ID: "{'11d0b818', '58ea5564', '88de2c4b', 'b85a4ae9'}",
                        Farmer: '{11.0}',
                        Organic_Survey_ID: "{'133de150'}",
                        Farmer_Plot_ID: "{'74885a5a'}",
                        Plotted_By: "{'boniface.lyenge@kokoakamili.com'}",
                        GPS_Location: "{'-8.241995, 36.241298', '-8.241465, 36.241330', '-8.241670, 36.240373', '-8.242033, 36.240938'}",
                        Timestamp_Captured: "{Timestamp('2022-11-30 13:49:04'), Timestamp('2022-11-30 13:54:09'), Timestamp('2022-11-30 13:50:00'), Timestamp('2022-11-30 13:55:13')}",
                        Inspection_Submission_Status: "{'Approved'}"
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    36.240938,
                                    -8.242033
                                ],
                                [
                                    36.240373,
                                    -8.24167
                                ],
                                [
                                    36.24133,
                                    -8.241465
                                ],
                                [
                                    36.241298,
                                    -8.241995
                                ],
                                [
                                    36.240938,
                                    -8.242033
                                ]
                            ]
                        ]
                    }
                }
            ]
        },
        response: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [
                        Array
                    ]
                ],
                bbox: null
            },
            properties: {
                parcel_id: 48537,
                name: '2022_11_74885a5a_boni',
                entity: '2022_11_74885a5a_boni',
                commodity: 'cocoa',
                production_start: '2020-12-31',
                production_end: '2024-05-01',
                country_iso: 'TZA',
                area_rep: null,
                area: 0.3977,
                geohash: 'ey6nhmq',
                point_buffer_area: 4,
                validation: null,
                deforestation_risk: 'low',
                deforestation_index: 0,
                deforestation_area_ha: 0,
                degradation_risk: null,
                degradation_area_ha: null,
                degradation_index: null,
                baseline_date: '2020-12-31',
                sdate: '2024-05-02',
                landcover_forest_coverage: 0.34,
                landcover_plantation_coverage: 0.29,
                landcover_shrubs_coverage: 0.08,
                landcover_no_trees_coverage: 0.29,
                landcover_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48537/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/parcels/48537/visible/sentinel2/3406530.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_production_enddate: 'https://global.geocledian.com/agknow/api/v4/parcels/48537/visible/sentinel2/3406281.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                forest_change_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48537/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                country_risk: 'standard',
                model_version: '1.0.9',
                generation_date: '2024-05-12T20:00:00',
                map_utils_landcover_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48537/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_forest_change_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48537/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_scalebar: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48537/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true'
            },
            id: 48537,
            bbox: [
                -8.242002717836648,
                36.240373,
                -8.241465,
                36.24135881603385
            ]
        }
    },
    {
        // 48538,
        request: {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                }
            },
            features: [
                {
                    type: 'Feature',
                    properties: {
                        Polygon_ID: '2022_14_536c4c35_john',
                        ID: "{'8eb50abd', '82597c7f', 'a4261b05', 'a952d473'}",
                        Farmer: '{14.0}',
                        Organic_Survey_ID: "{'f7e48ccf'}",
                        Farmer_Plot_ID: "{'536c4c35'}",
                        Plotted_By: "{'john.katambi@kokoakamili.com'}",
                        GPS_Location: "{'-8.223935, 36.243664', '-8.224317, 36.243546', '-8.224012, 36.242815', '-8.224484, 36.243000'}",
                        Timestamp_Captured: "{Timestamp('2022-12-02 11:39:04'), Timestamp('2022-12-02 11:31:34'), Timestamp('2022-12-02 11:35:41'), Timestamp('2022-12-02 11:33:01')}",
                        Inspection_Submission_Status: "{'Approved'}"
                    },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    36.243,
                                    -8.224484
                                ],
                                [
                                    36.242815,
                                    -8.224012
                                ],
                                [
                                    36.243664,
                                    -8.223935
                                ],
                                [
                                    36.243546,
                                    -8.224317
                                ],
                                [
                                    36.243,
                                    -8.224484
                                ]
                            ]
                        ]
                    }
                }
            ]
        },
        response: {
            type: 'Feature',
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [
                        Array
                    ]
                ],
                bbox: null
            },
            properties: {
                parcel_id: 48538,
                name: '2022_14_536c4c35_john',
                entity: '2022_14_536c4c35_john',
                commodity: 'cocoa',
                production_start: '2020-12-31',
                production_end: '2024-05-01',
                country_iso: 'TZA',
                area_rep: null,
                area: 0.3679,
                geohash: 'ey6nhvg',
                point_buffer_area: 4,
                validation: null,
                deforestation_risk: 'low',
                deforestation_index: 0,
                deforestation_area_ha: 0,
                degradation_risk: null,
                degradation_area_ha: null,
                degradation_index: null,
                baseline_date: '2020-12-31',
                sdate: '2024-05-02',
                landcover_forest_coverage: 0.08,
                landcover_plantation_coverage: 0,
                landcover_shrubs_coverage: 0,
                landcover_no_trees_coverage: 0.92,
                landcover_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48538/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_baseline_date: 'https://global.geocledian.com/agknow/api/v4/parcels/48538/visible/sentinel2/3406560.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                rgb_png_production_enddate: 'https://global.geocledian.com/agknow/api/v4/parcels/48538/visible/sentinel2/3406409.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
                forest_change_png: null,
                country_risk: 'standard',
                model_version: '1.0.9',
                generation_date: '2024-05-12T20:00:00',
                map_utils_landcover_legend_png: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48538/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
                map_utils_forest_change_legend_png: null,
                map_utils_scalebar: 'https://global.geocledian.com/agknow/api/v4/eudr/parcels/48538/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true'
            },
            id: 48538,
            bbox: [
                -8.224472289716461,
                36.242815,
                -8.22393500000001,
                36.24362093457468
            ]
        }
    }
];
