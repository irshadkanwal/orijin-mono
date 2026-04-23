import { memo, useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, {
  type GeoJSONSource,
  type Map,
  type MapMouseEvent,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  DATA,
  defineVisibilityFromZoom,
  displayPlotData,
  Features,
  LAYERS,
  scaleMapToContents,
  unclusterZoomCutoff,
} from "./story-data-provider";
import { Polygon } from "@/types/farm";

type Props = {
  features: Features;
  setIsSinglePlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSinglePlotId: React.Dispatch<React.SetStateAction<string>>;
};

const FarmMap = memo(
  ({ features, setIsSinglePlot, setIsSinglePlotId }: Props) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const [PlotData, setPlotData] = useState<GeoJSON.Feature[] | null>(null);
    const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(
      null
    );

    const updateMapData = useCallback(() => {
      if (!mapRef.current) return;

      const map: Map = mapRef.current;

      // features.markerCordinates.forEach((marker: any) => {
      //   new mapboxgl.Marker().setLngLat(marker).addTo(map);
      // });

      if (map.getSource(DATA.POINTS)) {
        (map.getSource(DATA.POINTS) as GeoJSONSource).setData({
          type: "FeatureCollection",
          features: features.farmFeatures,
        });
      }
      if (map.getSource(DATA.LINES)) {
        (map.getSource(DATA.LINES) as GeoJSONSource).setData({
          type: "FeatureCollection",
          features: features.polygonFeatures,
        });
      }

      scaleMapToContents(map, features);
    }, [features]);

    const initializeMap = useCallback(() => {
      mapboxgl.accessToken = import.meta.env.VITE_APP_MAP_BOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [0, 0],
        zoom: 1,
        trackResize: true,
      });

      mapRef.current = map;

      map.on("style.load", () => {
        map.addSource(DATA.POINTS, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
          cluster: true,
          clusterMaxZoom: unclusterZoomCutoff,
          clusterRadius: 50,
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
            "circle-color": [
              "case",
              ["==", ["get", "shapeType"], "singlePoint"],
              "red",
              "#888888",
            ],
            "circle-radius": 8,
            "circle-stroke-width": 1,
            "circle-stroke-color": [
              "case",
              ["==", ["get", "shapeType"], "singlePoint"],
              "red",
              "#fff",
            ],
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
              ["==", ["get", "shapeType"], "singlePoint"],
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

        map.on("zoom", () => {
          defineVisibilityFromZoom(map);
        });

        map.on("click", LAYERS.CLUSTERS, (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: [LAYERS.CLUSTERS],
          });

          if (features && features.length > 0) {
            const clusterId = features[0]?.properties?.["cluster_id"];
            (
              map.getSource(DATA.POINTS) as GeoJSONSource
            ).getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              map.easeTo({
                center: features[0]?.geometry.coordinates,
                zoom,
              });
            });
          }
        });

        map.on("click", LAYERS.UNCLUSTERED_POINT, (event: MapMouseEvent) => {
          displayPlotData(event, setSelectedPolygon, map);
        });

        map.on("click", LAYERS.LINES_FILL, (event: MapMouseEvent) => {
          displayPlotData(event, setSelectedPolygon, map);
        });

        map.on("mouseenter", LAYERS.LINES_FILL, () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", LAYERS.LINES_FILL, () => {
          map.getCanvas().style.cursor = "";
        });

        defineVisibilityFromZoom(map);
        updateMapData();
      });
    }, [features]);

    useEffect(() => {
      if (!mapRef.current) {
        initializeMap();
      } else {
        updateMapData();
      }
    }, [features]);

    function onCardClose() {
      setSelectedPolygon(null);
      setIsSinglePlot(false);
      mapRef.current?.setPaintProperty(LAYERS.LINES_FILL, "fill-color", [
        "case",
        ["==", ["get", "shapeType"], "singlePoint"],
        "#f0484b",
        "#888888",
      ]);
    }

    function showSingleFarm(singleFeature: string, data: GeoJSON.Feature[]) {
      setIsSinglePlot(true);
      const foundData = data.filter(
        (item) => item.properties?.["id"] === singleFeature
      );

      setIsSinglePlotId(foundData[0]?.properties?.["id"]);
      setPlotData(foundData);

      scaleMapToContents(mapRef.current as Map, foundData);
    }

    function showSinglePlot(plotId: string) {
      const singlePlot = PlotData?.find(
        (plot) => plot.properties?.["plotId"] === plotId
      );

      setSelectedPolygon(singlePlot?.properties as Polygon);

      scaleMapToContents(mapRef.current as Map, [singlePlot!]);
    }

    return (
      <div style={{ position: "relative" }}>
        <div ref={mapContainer} style={{ width: "100%", height: "80vh" }} />
        {selectedPolygon && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
              zIndex: 1,
              maxWidth: "250px",
              border: "1px solid #ccc",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <button
              onClick={() => onCardClose()}
              className="absolute top-0 right-2"
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            <div className="flex flex-col">
              <p>
                <strong>Farm: </strong>
                {selectedPolygon.farmShortCode}
              </p>

              <p>
                <strong>Plot: </strong>
                PLOT-{selectedPolygon.plotId.split("PLOT-")}
              </p>

              <p>
                <strong>Facility: </strong>
                {selectedPolygon.facilityName}
              </p>
              <p>
                <strong>Area:</strong>{" "}
                {Number(selectedPolygon.areaCalculated).toFixed(2)} ha
              </p>

              <>
                {Array.isArray(PlotData) && PlotData.length > 1 ? (
                  PlotData?.map((plot) => {
                    return (
                      <button
                        key={plot.properties?.["plotId"]}
                        className="underline text-blue-700 text-left "
                        onClick={() =>
                          showSinglePlot(plot.properties?.["plotId"])
                        }
                      >
                        PLOT-{plot.properties?.["plotId"]}
                      </button>
                    );
                  })
                ) : (
                  <button
                    onClick={() =>
                      showSingleFarm(
                        selectedPolygon.id,
                        features.polygonFeatures
                      )
                    }
                    className="underline text-blue-700 text-left "
                  >
                    Show farm
                  </button>
                )}
                {selectedPolygon && (
                  <>
                    <div></div>
                    <button
                      onClick={() => {
                        onCardClose();
                        setIsSinglePlot(false);
                        updateMapData();
                      }}
                      className="underline text-red-700 text-left "
                    >
                      Show All Farms
                    </button>
                  </>
                )}
              </>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default FarmMap;
