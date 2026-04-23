import type { Farm, Features } from "@/types/farm";
import {
  LAYERS,
  SINGLE_POINT_ZOOM_OFFSET,
  UNCLUSTER_ZOOM_CUTOFF,
} from "../config/farm-map-config";
import type { Map } from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import { mapMarkers } from "./map-data-handlers";

export function scaleMap(map: Map, features: Features) {
  const bounds = new mapboxgl.LngLatBounds();

  const coordinates: GeoJSON.Position[] = features.polygonFeatures.flatMap(
    (polygon) => {
      if (polygon.geometry.type === "Polygon") {
        return polygon.geometry.coordinates.flat();
      }
      return [];
    }
  );

  if (coordinates.length > 0) {
    setBoundsFromCoordinates(bounds, coordinates);
    if (coordinates.length === 1) {
      map.fitBounds(bounds, {
        padding: 20,
        maxZoom: SINGLE_POINT_ZOOM_OFFSET,
      });
    } else {
      map.fitBounds(bounds, { padding: 20 });
    }
    // if (!isBigMap) {
    //   addFacilityCoordinateToBounds(bounds, mapData[0]);
    // }
  }
}

function setBoundsFromCoordinates(
  bounds: mapboxgl.LngLatBounds,
  coordinates: number[][]
) {
  coordinates
    .filter((coords) => coords && coords.length > 0)
    .forEach((coord) => {
      try {
        bounds.extend(coord as mapboxgl.LngLatLike);
      } catch (err) {
        console.log("Error with coords" + JSON.stringify(coord), err);
      }
    });
}

function addFacilityCoordinateToBounds(
  bounds: mapboxgl.LngLatBounds,
  farm: Farm | undefined
) {
  if (farm && farm.facility && farm.facility.coordinate) {
    const coords = farm.facility.coordinate;
    if (coords[0] && coords[1]) {
      bounds.extend([coords[0], coords[1]]);
    }
  }
}
export function adjustVisibility(map: Map, isBigMap: boolean) {
  const zoom = map.getZoom();

  if (!isBigMap) {
    // If it's a small map, ensure everything is always visible
    map.setLayoutProperty(LAYERS.UNCLUSTERED_POINT, "visibility", "none");
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0.5);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 1);
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 0);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 0);
    map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-opacity", 0);
  } else if (zoom >= UNCLUSTER_ZOOM_CUTOFF) {
    // Enable lines and points, disable clusters
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0.5);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 1);
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 0);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 0);
    map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-opacity", 1);
  } else {
    // Enable clusters, disable lines and points
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 1);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 1);
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 0);
    map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-opacity", 0);
  }

  if (!isBigMap && zoom < UNCLUSTER_ZOOM_CUTOFF) {
    map.setLayoutProperty(LAYERS.UNCLUSTERED_POINT, "visibility", "visible");
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 0);
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 1);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 1);
    map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-opacity", 1);
    mapMarkers["smallMap"]?.forEach(
      (marker) => (marker.getElement().style.display = "none")
    );
  } else {
    mapMarkers["smallMap"]?.forEach(
      (marker) => (marker.getElement().style.display = "block")
    );
  }
}
