import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { type Map } from "mapbox-gl";
import type { Features, Polygon } from "@/types/farm";
import { LAYERS, MAPBOX_STYLE_URL } from "./utils/config/farm-map-config";
import { Card } from "../ui/card";
import "mapbox-gl/dist/mapbox-gl.css";
import { PolygonCard } from "./polygon-card";
import { initializeMapLayers } from "./utils/map/map-layers";
import { addMapEventListeners } from "./utils/map/map-event-listeners";
import { addDataToMap } from "./utils/map/map-data-handlers";
import { scaleMap } from "./utils/map/map-utils";

type FarmMapProps = {
  isBigMap: boolean;
  features: Features;
  selectedPlot?: string;
};

export const FarmMap = memo(
  ({ isBigMap, features, selectedPlot }: FarmMapProps) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(
      null
    );

    const [zoom, setZoom] = useState<string>();
    const [lng, setLng] = useState<string>();
    const [lat, setLat] = useState<string>();

    const MAP_HEIGHT = isBigMap ? "h-[63vh]" : "h-[450px]";

    const updateMapData = useCallback(() => {
      if (!mapRef.current) return;
      const map: Map = mapRef.current;
      addDataToMap(map, features, isBigMap);
      scaleMap(map, features);

      mapRef.current.on("move", () => {
        setLng(mapRef.current?.getCenter().lng.toFixed(4));
        setLat(mapRef.current?.getCenter().lat.toFixed(4));
        setZoom(mapRef.current?.getZoom().toFixed(2));
      });
    }, [features, isBigMap]);

    const handleSelectPolygon = (polygon: Polygon) => {
      setSelectedPolygon(polygon);
    };
    const handleCardClose = () => {
      setSelectedPolygon(null);
      mapRef.current?.setPaintProperty(LAYERS.LINES_FILL, "fill-color", [
        "case",
        ["==", ["get", "shapeType"], "circle"],
        "#f0484b",
        "#888888",
      ]);
      mapRef.current?.setLayoutProperty(
        LAYERS.OVERLAPPING_POLYGONS,
        "visibility",
        "none"
      );
    };

    const initializeMap = useCallback(async () => {
      mapboxgl.accessToken = import.meta.env.VITE_APP_MAP_BOX_TOKEN;
      const map: Map = new mapboxgl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: MAPBOX_STYLE_URL,
        center: [0, 0],
        zoom: 1,
        trackResize: true,
      });

      mapRef.current = map;

      await initializeMapLayers(map, isBigMap, updateMapData);
      addMapEventListeners(map, isBigMap, handleSelectPolygon);
    }, [features, updateMapData]);

    useEffect(() => {
      if (!mapRef.current) {
        void initializeMap();
      } else {
        updateMapData();
      }
    }, [features]);

    const currentSelectedPolygon = React.useMemo(() => {
      return {
        ...selectedPolygon,
        overlappingPolygons: features.uniquePolygons,
      };
    }, [selectedPolygon]);

    const showcard = isBigMap
      ? selectedPolygon
      : selectedPolygon?.plotId === selectedPlot;

    return (
      <>
        <Card ref={mapContainer} className={`w-full ${MAP_HEIGHT}`}>
          {showcard && (
            <PolygonCard
              polygon={currentSelectedPolygon}
              onClose={handleCardClose}
            />
          )}
        </Card>
        <div className="flex caption-bottom text-sm">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </>
    );
  }
);
