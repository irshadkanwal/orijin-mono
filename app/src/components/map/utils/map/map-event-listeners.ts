import { Polygon } from "@/types/farm";
import { GeoJSONSource, Map } from "mapbox-gl";
import { adjustVisibility } from "./map-utils";
import { setPolygonCardData } from "./map-data-handlers";
import { DATA, LAYERS } from "../config/farm-map-config";

export const addMapEventListeners = (
  map: Map,
  isBigMap: boolean,
  handlePolygonSelect: (polygon: Polygon) => void
): void => {
  map.on("zoom", () => {
    adjustVisibility(map, isBigMap);
  });
  map.on("click", LAYERS.CLUSTERS, (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [LAYERS.CLUSTERS],
    });
    if (features && features.length > 0) {
      const clusterId = features[0]?.properties?.["cluster_id"];
      (map.getSource(DATA.POINTS) as GeoJSONSource).getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;
          const geometry = features[0]?.geometry;
          if (geometry && "coordinates" in geometry) {
            map.easeTo({
              center: geometry.coordinates as [number, number],
              zoom,
            });
          }
        }
      );
    }
  });
  map.on("click", LAYERS.UNCLUSTERED_POINT, (event) => {
    setPolygonCardData(event, handlePolygonSelect, map);
  });

  map.on("click", LAYERS.LINES_FILL, (event) => {
    setPolygonCardData(event, handlePolygonSelect, map);
  });

  map.on("mouseenter", LAYERS.LINES_FILL, () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", LAYERS.LINES_FILL, () => {
    map.getCanvas().style.cursor = "";
  });
};
