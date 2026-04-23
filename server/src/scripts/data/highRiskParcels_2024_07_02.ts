import { GeocledianCommodity } from '../../geocledian/geocledian.model';

export const highRiskParcels_2024_07_02 = [
  {
    request: {
      // type: 'FeatureCollection',
      // features: [
      //   {
      //     type: 'Feature',
      coordinates: [
        [36.251403167148744, -8.157206522732187],
        [36.250137164493715, -8.157206522732187],
        [36.250137164493715, -8.158757081608107],
        [36.251403167148744, -8.158757081608107],
        [36.251403167148744, -8.157206522732187],
      ],
      properties: {
        commodity: GeocledianCommodity.cocoa,
        name: 'Area 16',
        foreign_id: 'Area 16',
        entity: 'Area 16',
        production_start: '2020-01-01',
        production_end: '2024-05-01',
        country_iso: 'TZA',
        process_timeseries: true,
      },
      // },
      // ],
    },
    registrationResponse: {
      content: {
        parcel_id: 50760,
        commodity: 'cocoa',
        name: 'Area 16',
        foreign_id: 'Area 16',
        entity: 'Area 16',
        production_start: '2020-12-31',
        production_end: '2024-05-01',
        country_iso: 'TZA',
        point_buffer_area: 4,
        process_timeseries: true,
        area: 2.457437626492948,
        centroid: { type: 'Point', coordinates: [Array] },
        bounding_box: [[Array], [Array]],
        geohash: 'ey6nnr7',
        validation: {
          foreign_id: 'Area 16',
          parcel_id: 50760,
          geometry: {},
          attr_schema: {},
          attributes: [],
          generation_date: '2024-07-02T19:12:00',
        },
        geometry: { type: 'MultiPolygon', coordinates: [Array] },
      },
    },
    riskResponse: {
      type: 'Feature',
      geometry: { type: 'MultiPolygon', coordinates: [[Array]] },
      properties: {
        parcel_id: 50760,
        name: 'Area 16',
        entity: 'Area 16',
        commodity: 'cocoa',
        production_start: '2020-12-31',
        production_end: '2024-05-01',
        country_iso: 'TZA',
        area: 2.3925,
        geohash: 'ey6nnr7',
        point_buffer_area: 4,
        deforestation_risk: 'low',
        deforestation_index: 0,
        deforestation_area_ha: 0,
        baseline_date: '2020-12-31',
        sdate: '2024-05-02',
        landcover_forest_coverage: 0,
        landcover_plantation_coverage: 0.66,
        landcover_shrubs_coverage: 0.32,
        landcover_no_trees_coverage: 0.02,
        landcover_png_baseline_date:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50760/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        rgb_png_baseline_date:
          'https://global.geocledian.com/agknow/api/v4/parcels/50760/visible/sentinel2/3575916.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        rgb_png_production_enddate:
          'https://global.geocledian.com/agknow/api/v4/parcels/50760/visible/sentinel2/3575746.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        forest_change_png:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50760/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        country_risk: 'standard',
        model_version: '1.1.0',
        generation_date: '2024-07-02T20:01:00',
        map_utils_landcover_legend_png:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50760/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
        map_utils_forest_change_legend_png:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50760/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
        map_utils_scalebar:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50760/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true',
      },
      id: 50760,
      bbox: [
        -8.158724469174626, 36.250137164493715, -8.157206522732187,
        36.251387238034546,
      ],
    },
  },
  {
    request: {
      // type: 'FeatureCollection',
      // features: [
      //   {
      //     type: 'Feature',
      coordinates: [
        [36.247176005741274, -8.159330574462905],
        [36.246403529544985, -8.159330574462905],
        [36.246403529544985, -8.160052749479688],
        [36.247176005741274, -8.160052749479688],
        [36.247176005741274, -8.159330574462905],
      ],
      properties: {
        commodity: GeocledianCommodity.cocoa,
        name: 'Area 17',
        foreign_id: 'Area 17',
        entity: 'Area 17',
        production_start: '2020-01-01',
        production_end: '2024-05-01',
        country_iso: 'TZA',
        process_timeseries: true,
        // area_rep: 12.4873,
        // point_buffer_area: 4,
        // area: 10.2,
        // area_ratio: 0.818,
      },
    },
    registrationResponse: {
      content: {
        parcel_id: 50761,
        commodity: 'cocoa',
        name: 'Area 17',
        foreign_id: 'Area 17',
        entity: 'Area 17',
        production_start: '2020-12-31',
        production_end: '2024-05-01',
        country_iso: 'TZA',
        point_buffer_area: 4,
        process_timeseries: true,
        area: 0.6983755873895495,
        centroid: { type: 'Point', coordinates: [Array] },
        bounding_box: [[Array], [Array]],
        geohash: 'ey6nnqd',
        validation: {
          foreign_id: 'Area 17',
          parcel_id: 50761,
          geometry: {},
          attr_schema: {},
          attributes: [],
          generation_date: '2024-07-02T19:13:00',
        },
        geometry: { type: 'MultiPolygon', coordinates: [Array] },
      },
    },
    riskResponse: {
      type: 'Feature',
      geometry: { type: 'MultiPolygon', coordinates: [[Array]] },
      properties: {
        parcel_id: 50761,
        name: 'Area 17',
        entity: 'Area 17',
        commodity: 'cocoa',
        production_start: '2020-12-31',
        production_end: '2024-05-01',
        country_iso: 'TZA',
        area: 0.6799,
        geohash: 'ey6nnqd',
        point_buffer_area: 4,
        deforestation_risk: 'low',
        deforestation_index: 0,
        deforestation_area_ha: 0,
        baseline_date: '2020-12-31',
        sdate: '2024-05-02',
        landcover_forest_coverage: 0,
        landcover_plantation_coverage: 0,
        landcover_shrubs_coverage: 0.66,
        landcover_no_trees_coverage: 0.34,
        landcover_png_baseline_date:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50761/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        rgb_png_baseline_date:
          'https://global.geocledian.com/agknow/api/v4/parcels/50761/visible/sentinel2/3575915.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        rgb_png_production_enddate:
          'https://global.geocledian.com/agknow/api/v4/parcels/50761/visible/sentinel2/3575741.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        forest_change_png:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50761/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c',
        country_risk: 'standard',
        model_version: '1.1.0',
        generation_date: '2024-07-02T20:02:00',
        map_utils_landcover_legend_png:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50761/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
        map_utils_forest_change_legend_png:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50761/risk/1/forest_change.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&legend=true',
        map_utils_scalebar:
          'https://global.geocledian.com/agknow/api/v4/eudr/parcels/50761/risk/1/landcover_mask.png?key=c703c131-cd80-4002-86a4-4c9deb416e2c&scale=true',
      },
      id: 50761,
      bbox: [
        -8.160046024604286, 36.246403529544985, -8.159330574462917,
        36.24720841095402,
      ],
    },
  },
];
