export enum GeocledianCommodity {
  cattle = 'cattle',
  cocoa = 'cocoa',
  coffee = 'coffee',
  oilpalm = 'oilpalm',
  rubber = 'rubber',
  soya = 'soya',
  wood = 'wood',
}

export enum GeocledianStatus {
  PENDING = 'PENDING',
  ANALYZED = 'ANALYZED',
}

export type GeoCledianParcelProperties = {
  commodity: GeocledianCommodity;
  name: string;
  foreign_id: string;
  entity: string;
  area_rep?: number;
  production_start: string;
  production_end: string;
  country_iso: string;
  process_timeseries: boolean;
  point_buffer_area?: number;
  'point_buffer_area,'?: number;
};

// Coordinates:
// number[][] = polygon = [[36.251, -8.15], [36.250, -8.157], [36.249, -8.157]]
// number[]   = point   = [36.251, -8.157]
export type GeoCledianParcel = {
  coordinates: number[][] | number[];
  properties: GeoCledianParcelProperties;
};

/**
 *     type: 'MultiPolygon',
 *     coordinates: [
 *       [
 *         [
 *           [36.295803, -8.126165],
 *           [36.295333, -8.125192],
 *           [36.293371, -8.125919],
 *           [36.293923, -8.126959],
 *           [36.295803, -8.126165],
 *         ],
 *       ],
 *     ],
 *     bbox: null,
 */
type GeoCledianResponseGeometry = {
  type: 'MultiPolygon';
  coordinates: number[][][];
  bbox: null;
};

export type GeoCledianResponseProperties = {
  parcel_id: number;
  name: string;
  entity: string;
  commodity: string;
  production_start: string;
  production_end: string;
  country_iso: string;
  area_rep: null;
  area: number;
  geohash: string;
  point_buffer_area: number;
  validation: null;
  deforestation_risk: string;
  deforestation_index: number;
  deforestation_area_ha: number;
  degradation_risk: null;
  degradation_area_ha: null;
  degradation_index: null;
  baseline_date: string;
  sdate: string;
  landcover_forest_coverage: number;
  landcover_plantation_coverage: number;
  landcover_shrubs_coverage: number;
  landcover_no_trees_coverage: number;
  landcover_png_baseline_date: string;
  rgb_png_baseline_date: string;
  rgb_png_production_enddate: string;
  forest_change_png: null;
  country_risk: string;
  model_version: string;
  generation_date: string;
  map_utils_landcover_legend_png: string;
  map_utils_forest_change_legend_png: null;
  map_utils_scalebar: string;
};

export type GeoCledianSubmitResponseWrapper = {
  content: GeoCledianSubmitResponseContent;
};

export type GeoCledianSubmitResponseContent = {
  parcel_id: string; //  51441,
  commodity: string; //  'cocoa',
  name: string; //  'Sarah Maglass',
  foreign_id: string; //  'clzxo8dmd0007wtmhohwjwhyb',
  entity: string; //  'Sarah Maglass',
  production_start: string; //  '2020-12-31',
  production_end: string; //  '2024-07-31',
  country_iso: string; //  'TZA',
  area_rep: string; //  null,
  point_buffer_area: string; //  null,
  process_timeseries: string; //  true,
  area: number; // 2.8343157957613228,
  // centroid: {
  //   type: 'Point';
  //   coordinates: [36.294593442302705, -8.126062220178097];
  // };
  bounding_box: number[][]; // [[-8.126959, 36.293371], [-8.125192, 36.295803]];
  geohash: string; // 'ey6nrp4';
  // validation: {
  //   foreign_id: 'clzxo8dmd0007wtmhohwjwhyb';
  //   parcel_id: 51441;
  //   geometry: {
  //     valid: null;
  //     messages: null;
  //   };
  //   attr_schema: {
  //     valid: null;
  //     message: null;
  //   };
  //   attributes: [];
  //   generation_date: '2024-08-17T11:47:00';
  // };
  geometry: GeoCledianResponseGeometry;
};

export type GeoCledianRiskResponse = {
  type: 'Feature';
  geometry: GeoCledianResponseGeometry;
  properties: GeoCledianResponseProperties;
  id: number;
  bbox: number[];
};
