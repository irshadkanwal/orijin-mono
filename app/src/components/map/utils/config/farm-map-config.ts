import type { Polygon } from "@/types/farm";
import type { Plot } from "@orijin-server/farms/models/plots.model.ts";

const UNCLUSTER_ZOOM_CUTOFF = 12;
const SINGLE_POINT_ZOOM_OFFSET = 16;
const MAPBOX_STYLE_URL = "mapbox://styles/mapbox/satellite-streets-v12";

export type FacilityMinimal = {
  id: string;
  shortCode: string;
  name: string;
  coordinate?: [number, number];
};

export type MapData = {
  id: string;
  facility: FacilityMinimal;
  polygons: Polygon[];
  plots: Plot[];
  updatedAt: Date;
  updatedBy: string;
};

const DATA = {
  POINTS: "points",
  LINES: "lines",
  INTERSECTION: "intersection",
  PERCENT: "percent",
  OVERLAPPING: "overlapping",
};

const LAYERS = {
  LINES_FILL: "lines-fill",
  LINES_OUTLINE: "lines-outline",
  CLUSTERS: "clusters",
  CLUSTERS_WITH_COUNT: "cluster-count",
  UNCLUSTERED_POINT: "unclustered-point",
  INTERSECTION_AREA: "intersection-area",
  OVERLAPPING_PERCENT: "overlapping-percent",
  OVERLAPPING_POLYGONS: "overlapping-polygons",
};

export {
  UNCLUSTER_ZOOM_CUTOFF,
  DATA,
  LAYERS,
  MAPBOX_STYLE_URL,
  SINGLE_POINT_ZOOM_OFFSET,
};
