const request = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [30.0320359, 0.6433227],
              [30.0321605, 0.6432342],
              [30.0321559, 0.642957],
              [30.031701, 0.6431071],
              [30.0321605, 0.6432342],
              [30.0320359, 0.6433227],
            ],
          ],
        ],
      },
      properties: {
        commodity: 'cocoa',
        name: 'Orijin Test One',
        foreign_id: 'BRA_284663_001',
        entity: 'Orijin test farm 1',
        area_rep: 12.4873,
        production_start: '2020-01-01',
        production_end: '2024-07-31',
        country_iso: 'UGA',
        process_timeseries: true,
        point_buffer_area: 4,
        area: 10.2,
        area_ratio: 0.818,
      },
      id: 0,
    },
  ],
};

// const response =
//   {
//    "content":  {
//        "area": 0.07856343604208496,
//          "area_rep": 12.4873,
//          "bounding_box": Array [
//            Array [
//                0.642957,
//                  30.031701,
//                ],
//              Array [
//                  0.6433227,
//                    30.0321605,
//                  ],
//            ],
//          "centroid": Object {
//            "coordinates": Array [
//                30.032005799999997,
//                  0.6430994333333334,
//                ],
//              "type": "Point",
//            },
//        "commodity": "cocoa",
//          "country_iso": "UGA",
//          "entity": "Orijin test farm 1",
//          "geohash": "sj26yeh",
//          "geometry": Object {
//            "coordinates": Array [
//                Array [
//                    Array [
//                        Array [
//                            30.0320359,
//                              0.6433227,
//                            ],
//                          Array [
//                              30.0321605,
//                                0.6432342,
//                              ],
//                          Array [
//                              30.0321559,
//                                0.642957,
//                              ],
//                          Array [
//                              30.031701,
//                                0.6431071,
//                              ],
//                          Array [
//                              30.0321605,
//                                0.6432342,
//                              ],
//                          Array [
//                              30.0320359,
//                                0.6433227,
//                              ],
//                        ],
//                    ],
//                ],
//              "type": "MultiPolygon",
//            },
//        "name": "Orijin Test One",
//          "parcel_id": 48503,
//          "point_buffer_area": 4,
//          "process_timeseries": true,
//          "production_end": "2024-07-31",
//          "production_start": "2020-12-31",
//          "validation": Object {
//            "attr_schema": Object {},
//            "attributes": Array [
//                Object {
//                  "message": "Warning: area reported differs significantly from the calculated area of the geometry",
//                    "name": "area_rep",
//                    "valid": false,
//                  },
//            ],
//            "foreign_id": "BRA_284663_001",
//              "generation_date": "2024-04-27T09:02:00",
//              "geometry": Object {
//                "messages": Array [
//                    "Warning: geometry was invalid - reason: 'Ring Self-intersection[30.0321605 0.6432342]'.",
//                    ],
//                  "valid": true,
//                },
//            "parcel_id": 48503,
//            },
//      },
//  }
//

//////////////
// SECOND TEST - without area values
//////////////

// "name": "Orijin Test One",
//   +     "parcel_id": 48504,
//   +     "point_buffer_area": 4,
//   +     "process_timeseries": true,
//   +     "production_end": "2024-07-31",
//   +     "production_start": "2020-12-31",
//   +     "validation": Object {
//   +       "attr_schema": Object {},
//   +       "attributes": Array [],
//     +       "foreign_id": "BRA_284663_001",
//     +       "generation_date": "2024-04-27T09:06:00",
//     +       "geometry": Object {
//     +         "messages": Array [
//       +           "Warning: geometry was invalid - reason: 'Ring Self-intersection[30.0321605 0.6432342]'.",
//         +         ],
//       +         "valid": true,
//       +       },
//   +       "parcel_id": 48504,
//     +     },
// +   },

//////////////
// THIRD TEST - invalid geometry was removed, successfull
//////////////

// Object {
//   +   "content": Object {
//     +     "area": 0.11357461769248585,
//       +     "bounding_box": Array [
//       +       Array [
//         +         0.642957,
//           +         30.031701,
//           +       ],
//         +       Array [
//           +         0.6433227,
//             +         30.0321605,
//             +       ],
//         +     ],
//       +     "centroid": Object {
//       +       "coordinates": Array [
//         +         30.031993469364288,
//           +         0.6431370109456676,
//           +       ],
//         +       "type": "Point",
//         +     },
//     +     "commodity": "cocoa",
//       +     "country_iso": "UGA",
//       +     "entity": "Orijin test farm 1",
//       +     "geohash": "sj26yeh",
//       +     "geometry": Object {
//       +       "coordinates": Array [
//         +         Array [
//           +           Array [
//             +             Array [
//               +               30.0320359,
//                 +               0.6433227,
//                 +             ],
//               +             Array [
//                 +               30.0321605,
//                   +               0.6432342,
//                   +             ],
//               +             Array [
//                 +               30.0321559,
//                   +               0.642957,
//                   +             ],
//               +             Array [
//                 +               30.031701,
//                   +               0.6431071,
//                   +             ],
//               +             Array [
//                 +               30.0320359,
//                   +               0.6433227,
//                   +             ],
//               +           ],
//             +         ],
//           +       ],
//         +       "type": "MultiPolygon",
//         +     },
//     +     "name": "Orijin Test One",
//       +     "parcel_id": 48505,
//       +     "point_buffer_area": 4,
//       +     "process_timeseries": true,
//       +     "production_end": "2024-07-31",
//       +     "production_start": "2020-12-31",
//       +     "validation": Object {
//       +       "attr_schema": Object {},
//       +       "attributes": Array [],
//         +       "foreign_id": "BRA_284663_001",
//         +       "generation_date": "2024-04-27T09:09:00",
//         +       "geometry": Object {},
//       +       "parcel_id": 48505,
//         +     },
//     +   },

// + vielä 48506 tuplatestinä ton jälkeen

// RISK REPOR 45806

// + Object {
//   +   "bbox": Array [
//     +     0.6429633827202417,
//       +     30.031700999999998,
//       +     0.6433227000000019,
//       +     30.032150146599697,
//       +   ],
//     +   "geometry": Object {
//     +     "bbox": null,
//       +     "coordinates": Array [
//       +       Array [
//         +         Array [
//           +           Array [
//             +             30.0320359,
//               +             0.6433227,
//               +           ],
//             +           Array [
//               +             30.0321605,
//                 +             0.6432342,
//                 +           ],
//             +           Array [
//               +             30.0321559,
//                 +             0.642957,
//                 +           ],
//             +           Array [
//               +             30.031701,
//                 +             0.6431071,
//                 +           ],
//             +           Array [
//               +             30.0320359,
//                 +             0.6433227,
//                 +           ],
//             +         ],
//           +       ],
//         +     ],
//       +     "type": "MultiPolygon",
//       +   },
//   +   "id": 48506,
//     +   "properties": Object {
//     +     "area": 0.1128,
//       +     "area_rep": null,
//       +     "baseline_date": "2020-12-31",
//       +     "commodity": "cocoa",
//       +     "country_iso": "UGA",
//       +     "country_risk": "standard",
//       +     "deforestation_area_ha": null,
//       +     "deforestation_index": null,
//       +     "deforestation_risk": "low",
//       +     "degradation_area_ha": null,
//       +     "degradation_index": null,
//       +     "degradation_risk": null,
//       +     "entity": "Orijin test farm 1",
//       +     "forest_change_png": null,
//       +     "generation_date": "2024-04-24T11:13",
//       +     "geohash": "sj26yeh",
//       +     "landcover_forest_coverage": null,
//       +     "landcover_no_trees_coverage": null,
//       +     "landcover_plantation_coverage": null,
//       +     "landcover_png_baseline_date": null,
//       +     "landcover_shrubs_coverage": null,
//       +     "map_utils_forest_change_legend_png": null,
//       +     "map_utils_landcover_legend_png": null,
//       +     "map_utils_scalebar": null,
//       +     "model_version": "1.0.8",
//       +     "name": "Orijin Test One",
//       +     "parcel_id": 48506,
//       +     "point_buffer_area": 4,
//       +     "production_end": "2024-07-31",
//       +     "production_start": "2020-12-31",
//       +     "rgb_png_baseline_date": null,
//       +     "rgb_png_production_enddate": null,
//       +     "sdate": null,
//       +     "validation": null,
//       +   },
//   +   "type": "Feature",

////////////////
//
// SECOND TEST WITH RANDOM BOX
//
////////////////

// + Object {
//   +   "content": Object {
//     +     "area": 11.27484967140959,
//       +     "bounding_box": Array [
//       +       Array [
//         +         0.3759467226322357,
//           +         33.4958436186148,
//           +       ],
//         +       Array [
//           +         0.3789556940700294,
//             +         33.49886733357488,
//             +       ],
//         +     ],
//       +     "centroid": Object {
//       +       "coordinates": Array [
//         +         33.49735547609484,
//           +         0.37745120835113255,
//           +       ],
//         +       "type": "Point",
//         +     },
//     +     "commodity": "cocoa",
//       +     "country_iso": "UGA",
//       +     "entity": "Orijin test farm 2",
//       +     "geohash": "sjbq8d4",
//       +     "geometry": Object {
//       +       "coordinates": Array [
//         +         Array [
//           +           Array [
//             +             Array [
//               +               33.4958436186148,
//                 +               0.3789556940700294,
//                 +             ],
//               +             Array [
//                 +               33.4958436186148,
//                   +               0.3759467226322357,
//                   +             ],
//               +             Array [
//                 +               33.49886733357488,
//                   +               0.3759467226322357,
//                   +             ],
//               +             Array [
//                 +               33.49886733357488,
//                   +               0.3789556940700294,
//                   +             ],
//               +             Array [
//                 +               33.4958436186148,
//                   +               0.3789556940700294,
//                   +             ],
//               +           ],
//             +         ],
//           +       ],
//         +       "type": "MultiPolygon",
//         +     },
//     +     "name": "Orijin Test Two",
//       +     "parcel_id": 48510,
//       +     "point_buffer_area": 4,
//       +     "process_timeseries": true,
//       +     "production_end": "2024-04-30",
//       +     "production_start": "2020-12-31",
//       +     "validation": Object {
//       +       "attr_schema": Object {},
//       +       "attributes": Array [],
//         +       "foreign_id": "BRA_284663_001",
//         +       "generation_date": "2024-04-30T15:47:00",
//         +       "geometry": Object {},
//       +       "parcel_id": 48510,
//         +     },
//     +   },
//   + }

////////////////
//
// THIRD TEST WITH SIGNLE POINT IN TANZANIA
//
////////////////

// REQUEST

// [Nest] 96561  - 05/02/2024, 10:42:12 AM    WARN [AppLoggerMiddleware] {
//   "type": "FeatureCollection",
//     "features": [
//     {
//       "type": "Feature",
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           36.249878,
//           -8.206945
//         ]
//       },
//       "properties": {
//         "commodity": "cocoa",
//         "name": "Orijin Test Three with single point",
//         "foreign_id": "BRA_284663_001",
//         "entity": "Orijin Test Farm 3",
//         "production_start": "2020-01-01",
//         "production_end": "2024-07-31",
//         "country_iso": "TZA",
//         "process_timeseries": true,
//         "point_buffer_area": 4
//       },
//       "id": 0
//     }
//   ]
// }

// RESPONSE

// + Object {
//   +   "content": Object {
//     +     "area": 3.9155407989984967,
//       +     "bounding_box": Array [
//       +       Array [
//         +         -8.207940808200382,
//           +         36.24887188688179,
//           +       ],
//         +       Array [
//           +         -8.205949189303455,
//             +         36.25088411311822,
//             +       ],
//         +     ],
//       +     "centroid": Object {
//       +       "coordinates": Array [
//         +         36.24987800000001,
//           +         -8.206944999067938,
//           +       ],
//         +       "type": "Point",
//         +     },
//     +     "commodity": "cocoa",
//       +     "country_iso": "TZA",
//       +     "entity": "Orijin Test Farm 3",
//       +     "geohash": "ey6njpp",
//       +     "geometry": Object {
//       +       "coordinates": Array [
//         +         Array [
//           +           Array [
//             +             Array [
//               +               36.25088411311822,
//                 +               -8.206945,
//                 +             ],
//               +             Array [
//                 +               36.250864780936766,
//                   +               -8.207139272738475,
//                   +             ],
//               +             Array [
//                 +               36.25080752731731,
//                   +               -8.20732607959496,
//                   +             ],
//               +             Array [
//                 +               36.25071455248434,
//                   +               -8.207498241702117,
//                   +             ],
//               +             Array [
//                 +               36.250589429408535,
//                   +               -8.207649142989757,
//                   +             ],
//               +             Array [
//                 +               36.25043696649953,
//                   +               -8.207772984433204,
//                   +             ],
//               +             Array [
//                 +               36.25026302282143,
//                   +               -8.20786500690242,
//                   +             ],
//               +             Array [
//                 +               36.25007428293222,
//                   +               -8.207921674048562,
//                   +             ],
//               +             Array [
//                 +               36.249878,
//                   +               -8.207940808200382,
//                   +             ],
//               +             Array [
//                 +               36.24968171706779,
//                   +               -8.207921674048562,
//                   +             ],
//               +             Array [
//                 +               36.249492977178576,
//                   +               -8.20786500690242,
//                   +             ],
//               +             Array [
//                 +               36.24931903350047,
//                   +               -8.207772984433204,
//                   +             ],
//               +             Array [
//                 +               36.24916657059147,
//                   +               -8.207649142989757,
//                   +             ],
//               +             Array [
//                 +               36.249041447515665,
//                   +               -8.207498241702117,
//                   +             ],
//               +             Array [
//                 +               36.2489484726827,
//                   +               -8.20732607959496,
//                   +             ],
//               +             Array [
//                 +               36.24889121906324,
//                   +               -8.207139272738475,
//                   +             ],
//               +             Array [
//                 +               36.24887188688179,
//                   +               -8.206945,
//                   +             ],
//               +             Array [
//                 +               36.24889121906324,
//                   +               -8.206750727166522,
//                   +             ],
//               +             Array [
//                 +               36.2489484726827,
//                   +               -8.206563920039489,
//                   +             ],
//               +             Array [
//                 +               36.249041447515665,
//                   +               -8.206391757527426,
//                   +             ],
//               +             Array [
//                 +               36.24916657059147,
//                   +               -8.206240855762163,
//                   +             ],
//               +             Array [
//                 +               36.24931903350047,
//                   +               -8.206117013841098,
//                   +             ],
//               +             Array [
//                 +               36.249492977178576,
//                   +               -8.206024990966974,
//                   +             ],
//               +             Array [
//                 +               36.24968171706779,
//                   +               -8.205968323550278,
//                   +             ],
//               +             Array [
//                 +               36.249878,
//                   +               -8.205949189303455,
//                   +             ],
//               +             Array [
//                 +               36.25007428293222,
//                   +               -8.205968323550278,
//                   +             ],
//               +             Array [
//                 +               36.25026302282143,
//                   +               -8.206024990966974,
//                   +             ],
//               +             Array [
//                 +               36.25043696649953,
//                   +               -8.206117013841098,
//                   +             ],
//               +             Array [
//                 +               36.250589429408535,
//                   +               -8.206240855762163,
//                   +             ],
//               +             Array [
//                 +               36.25071455248434,
//                   +               -8.206391757527426,
//                   +             ],
//               +             Array [
//                 +               36.25080752731731,
//                   +               -8.206563920039489,
//                   +             ],
//               +             Array [
//                 +               36.250864780936766,
//                   +               -8.206750727166522,
//                   +             ],
//               +             Array [
//                 +               36.25088411311822,
//                   +               -8.206945,
//                   +             ],
//               +           ],
//             +         ],
//           +       ],
//         +       "type": "MultiPolygon",
//         +     },
//     +     "name": "Orijin Test Three with single point",
//       +     "parcel_id": 48512,
//       +     "point_buffer_area": 4,
//       +     "process_timeseries": true,
//       +     "production_end": "2024-07-31",
//       +     "production_start": "2020-12-31",
//       +     "validation": Object {
//       +       "attr_schema": Object {},
//       +       "attributes": Array [],
//         +       "foreign_id": "BRA_284663_001",
//         +       "generation_date": "2024-05-02T07:42:00",
//         +       "geometry": Object {
//         +         "messages": Array [
//           +           "Info: geometry was registered as point. Converted to approximately 4.0 ha using a radius of 112 m.",
//             +         ],
//           +         "valid": true,
//           +       },
//       +       "parcel_id": 48512,
//         +     },
//     +   },
//   + }

// RESPONSE 2 KUN VAIHDOIN BUFFERIN 4 -> 1

// + Object {
//   +   "content": Object {
//     +     "area": 0.9788851997479046,
//       +     "bounding_box": Array [
//       +       Array [
//         +         -8.207442904412233,
//           +         36.2493749434409,
//           +       ],
//         +       Array [
//           +         -8.20644709496373,
//             +         36.250381056559114,
//             +       ],
//         +     ],
//       +     "centroid": Object {
//       +       "coordinates": Array [
//         +         36.24987800000002,
//           +         -8.20694499976699,
//           +       ],
//         +       "type": "Point",
//         +     },
//     +     "commodity": "cocoa",
//       +     "country_iso": "TZA",
//       +     "entity": "Orijin Test Farm 3",
//       +     "geohash": "ey6njpp",
//       +     "geometry": Object {
//       +       "coordinates": Array [
//         +         Array [
//           +           Array [
//             +             Array [
//               +               36.250381056559114,
//                 +               -8.206945,
//                 +             ],
//               +             Array [
//                 +               36.25037139046839,
//                   +               -8.207042136381116,
//                   +             ],
//               +             Array [
//                 +               36.25034276365865,
//                   +               -8.207135539843177,
//                   +             ],
//               +             Array [
//                 +               36.25029627624217,
//                   +               -8.207221620947369,
//                   +             ],
//               +             Array [
//                 +               36.25023371470427,
//                   +               -8.207297071650896,
//                   +             ],
//               +             Array [
//                 +               36.25015748324977,
//                   +               -8.207358992432326,
//                   +             ],
//               +             Array [
//                 +               36.25007051141071,
//                   +               -8.20740500371755,
//                   +             ],
//               +             Array [
//                 +               36.249976141466114,
//                   +               -8.207433337324444,
//                   +             ],
//               +             Array [
//                 +               36.249878,
//                   +               -8.207442904412233,
//                   +             ],
//               +             Array [
//                 +               36.24977985853389,
//                   +               -8.207433337324444,
//                   +             ],
//               +             Array [
//                 +               36.24968548858929,
//                   +               -8.20740500371755,
//                   +             ],
//               +             Array [
//                 +               36.24959851675024,
//                   +               -8.207358992432326,
//                   +             ],
//               +             Array [
//                 +               36.24952228529574,
//                   +               -8.207297071650896,
//                   +             ],
//               +             Array [
//                 +               36.24945972375783,
//                   +               -8.207221620947369,
//                   +             ],
//               +             Array [
//                 +               36.24941323634135,
//                   +               -8.207135539843177,
//                   +             ],
//               +             Array [
//                 +               36.249384609531624,
//                   +               -8.207042136381116,
//                   +             ],
//               +             Array [
//                 +               36.2493749434409,
//                   +               -8.206945,
//                   +             ],
//               +             Array [
//                 +               36.249384609531624,
//                   +               -8.206847863595137,
//                   +             ],
//               +             Array [
//                 +               36.24941323634135,
//                   +               -8.206754460065438,
//                   +             ],
//               +             Array [
//                 +               36.24945972375783,
//                   +               -8.20666837886002,
//                   +             ],
//               +             Array [
//                 +               36.24952228529574,
//                   +               -8.206592928037088,
//                   +             ],
//               +             Array [
//                 +               36.24959851675024,
//                   +               -8.20653100713625,
//                   +             ],
//               +             Array [
//                 +               36.24968548858929,
//                   +               -8.206484995749799,
//                   +             ],
//               +             Array [
//                 +               36.24977985853389,
//                   +               -8.206456662075267,
//                   +             ],
//               +             Array [
//                 +               36.249878,
//                   +               -8.20644709496373,
//                   +             ],
//               +             Array [
//                 +               36.249976141466114,
//                   +               -8.206456662075267,
//                   +             ],
//               +             Array [
//                 +               36.25007051141071,
//                   +               -8.206484995749799,
//                   +             ],
//               +             Array [
//                 +               36.25015748324977,
//                   +               -8.20653100713625,
//                   +             ],
//               +             Array [
//                 +               36.25023371470427,
//                   +               -8.206592928037088,
//                   +             ],
//               +             Array [
//                 +               36.25029627624217,
//                   +               -8.20666837886002,
//                   +             ],
//               +             Array [
//                 +               36.25034276365865,
//                   +               -8.206754460065438,
//                   +             ],
//               +             Array [
//                 +               36.25037139046839,
//                   +               -8.206847863595137,
//                   +             ],
//               +             Array [
//                 +               36.250381056559114,
//                   +               -8.206945,
//                   +             ],
//               +           ],
//             +         ],
//           +       ],
//         +       "type": "MultiPolygon",
//         +     },
//     +     "name": "Orijin Test Three with single point",
//       +     "parcel_id": 48513,
//       +     "point_buffer_area": 1,
//       +     "process_timeseries": true,
//       +     "production_end": "2024-07-31",
//       +     "production_start": "2020-12-31",
//       +     "validation": Object {
//       +       "attr_schema": Object {},
//       +       "attributes": Array [],
//         +       "foreign_id": "BRA_284663_001",
//         +       "generation_date": "2024-05-02T07:45:00",
//         +       "geometry": Object {
//         +         "messages": Array [
//           +           "Info: geometry was registered as point. Converted to approximately 1.0 ha using a radius of 56 m.",
//             +         ],
//           +         "valid": true,
//           +       },
//       +       "parcel_id": 48513,
//         +     },
//     +   },
//   + }
//
