import { DATA, LAYERS, UNCLUSTER_ZOOM_CUTOFF } from "../config/farm-map-config";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "mapbox-gl";
import { adjustVisibility } from "./map-utils";
export const initializeMapLayers = (
  map: Map,
  isBigMap: boolean,
  updateMapData: () => void
): Promise<void> => {
  return new Promise((resolve) => {
    map.on("style.load", () => {
      map.addSource(DATA.POINTS, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
        cluster: true,
        clusterMaxZoom: UNCLUSTER_ZOOM_CUTOFF,
        clusterRadius: 50,
      });

      map.addSource(DATA.INTERSECTION, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: LAYERS.INTERSECTION_AREA,
        type: "fill",
        source: DATA.INTERSECTION,
        layout: {},
        paint: {
          "fill-color": "red",
          "fill-opacity": 0.5,
        },
      });

      map.addSource(DATA.OVERLAPPING, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: LAYERS.OVERLAPPING_POLYGONS,
        type: "fill",
        source: DATA.OVERLAPPING,
        layout: {
          visibility: "none",
        },
        paint: {
          "fill-color": "red",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: LAYERS.CLUSTERS,
        type: "circle",
        source: DATA.POINTS,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            20,
            "#f1f075",
            50,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
          "circle-opacity": 1,
        },
      });

      map.addLayer({
        id: LAYERS.OVERLAPPING_PERCENT,
        source: DATA.INTERSECTION,
        type: "symbol",
        layout: {
          "text-field": ["get", "percent"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-opacity": 1,
          "text-halo-color": "#fff",
          "text-color": "black",
          "text-halo-width": 2,
        },
      });

      map.addLayer({
        id: LAYERS.CLUSTERS_WITH_COUNT,
        type: "symbol",
        source: DATA.POINTS,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-opacity": 1,
        },
      });

      map.addLayer({
        id: LAYERS.UNCLUSTERED_POINT,
        type: "circle",
        source: DATA.POINTS,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": isBigMap ? "#11b4da" : "#ccf70c",
          "circle-radius": 8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
          "circle-opacity": 1,
        },
      });

      map.addSource(DATA.LINES, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: LAYERS.LINES_FILL,
        type: "fill",
        source: DATA.LINES,
        layout: {},
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "shapeType"], "circle"],
            "#f0484b",
            "#888888",
          ],
          "fill-opacity": 0,
        },
      });

      map.addLayer({
        id: LAYERS.LINES_OUTLINE,
        type: "line",
        source: DATA.LINES,
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 1,
          "line-opacity": 0,
        },
      });
      adjustVisibility(map, isBigMap);
      updateMapData();
      resolve();
    });
  });
};
