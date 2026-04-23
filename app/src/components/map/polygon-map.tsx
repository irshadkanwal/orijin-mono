import { memo, useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, {
  type GeoJSONSource,
  type LngLatLike,
  type Map,
  type MapMouseEvent,
} from "mapbox-gl";
import type { Coordinates, Polygon } from "@/types/farm";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "@tanstack/react-router";

type Props = {
  markerCoordinates?: Coordinates[];
  polygons: Polygon[];
  callback: (data: Polygon) => void;
  farmsWithoutPolygons?: Coordinates[];
  largeView?: boolean;
};

const unclusterZoomCutoff = 12;

const DATA = {
  POINTS: "points",
  LINES: "lines",
};

const LAYERS = {
  LINES_FILL: "lines-fill",
  LINES_OUTLINE: "lines-outline",
  CLUSTERS: "clusters",
  CLUSTERS_WITH_COUNT: "cluster-count",
  UNCLUSTERED_POINT: "unclustered-point",
};

const scaleMapToContents = (map: Map, polygons: Polygon[]) => {
  const fitBoundsOptions = { padding: 20 };
  const bounds = new mapboxgl.LngLatBounds();
  polygons.forEach((polygon) => {
    polygon.coordinates.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });
  });
  map.fitBounds(bounds, fitBoundsOptions);
};

const makePolygonsIntoDatasources = (
  map: Map,
  polygons: Polygon[],
  coordinates: Coordinates[]
) => {
  // TODO: Define if we need this at all. The data point just adds a round element at starting point of the polygon.
  // Could be combined with the markers, which display the farm's given location
  if (map.getSource(DATA.POINTS)) {
    (map.getSource(DATA.POINTS) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: polygons.map((polygon, index) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: polygon.coordinates[0],
        },
        properties: {
          index,
          plotId: polygon.plotId,
        },
      })),
    });
  }

  if (map.getSource(DATA.LINES)) {
    (map.getSource(DATA.LINES) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: polygons.map((polygon, index) => {
        if (
          polygon.coordinates[0] &&
          polygon.coordinates[0] !==
            polygon.coordinates[polygon.coordinates.length - 1]
        ) {
          polygon.coordinates.push(polygon.coordinates[0]);
        }

        return {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [polygon.coordinates],
          },
          properties: {
            index,
            plotId: polygon.plotId,
          },
        };
      }),
    });
  }
};

const makeFarmsWithoutPlotsIntoDatasources = (
  map: Map,
  coordinates: Coordinates[]
) => {
  if (map.getSource(DATA.POINTS)) {
    (map.getSource(DATA.POINTS) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: coordinates.map((coordinate, index) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates[index],
        },
        properties: {
          index,
          plotId: "farm" + index,
        },
      })),
    });
  }
};

const defineVisibilityFromZoom = (map: Map) => {
  const zoom = map.getZoom();
  if (zoom >= unclusterZoomCutoff) {
    // Enable
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0.5);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 1);
    // Disable
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 0);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 0);

    // Adjust unclustered point opacity based on selection
    map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-opacity", 1);
  } else {
    // Enable
    map.setPaintProperty(LAYERS.CLUSTERS, "circle-opacity", 1);
    map.setPaintProperty(LAYERS.CLUSTERS_WITH_COUNT, "text-opacity", 1);
    // Disable
    map.setPaintProperty(LAYERS.LINES_FILL, "fill-opacity", 0);
    map.setPaintProperty(LAYERS.LINES_OUTLINE, "line-opacity", 0);
  }
};

const displayPlotData = (
  e: MapMouseEvent & { features: any[] },
  polygons: Polygon[],
  setSelectedPolygon: React.Dispatch<React.SetStateAction<string>>,
  map: Map
) => {
  if (e.features && e.features.length > 0) {
    const feature = e.features[0];
    let polygon;
    if (feature.layer.id === LAYERS.UNCLUSTERED_POINT) {
      // Find the corresponding polygon by plotId when a point is clicked
      polygon = polygons.find((p) => p.plotId === feature.properties.plotId);
      if (!polygon) {
        // If no polygon exists, create a dummy polygon object to show information
        polygon = {
          plotId: feature.properties.plotId,
          farmShortCode: feature.properties.plotId,
          coordinates: [],
          // Add any other relevant default properties here
        };
      }
    } else {
      // Find the polygon by index if clicked on the polygon layer
      polygon = polygons[feature.properties.index];
    }
    if (polygon) {
      setSelectedPolygon(polygon);
      map.setPaintProperty(LAYERS.LINES_FILL, "fill-color", [
        "case",
        ["==", ["get", "plotId"], polygon.plotId],
        "#11b4da", // Color for the clicked polygon
        "#888888", // Default color
      ]);

      map.setPaintProperty(LAYERS.UNCLUSTERED_POINT, "circle-color", [
        "case",
        ["==", ["get", "plotId"], polygon.plotId],
        "#11b4da", // Color for the clicked point
        "#888888", // Default color for points
      ]);
    }
  }
};

const PolygonMap = memo(
  ({
    markerCoordinates = [],
    polygons,
    callback,
    farmsWithoutPolygons,
    largeView = false,
  }: Props) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(
      null
    );

    // const updateMapData = useCallback(() => {
    //   if (!mapRef.current) return;

    //   const map: Map = mapRef.current;

    //   markerCoordinates.forEach((marker) => {
    //     new mapboxgl.Marker().setLngLat(marker).addTo(map);
    //   });
    //   if (!polygons || polygons.length === 0) {
    //     makeFarmsWithoutPlotsIntoDatasources(
    //       map,
    //       farmsWithoutPolygons || markerCoordinates
    //     );
    //     return;
    //   }

    //   makeFarmsWithoutPlotsIntoDatasources(
    //     map,
    //     farmsWithoutPolygons || markerCoordinates
    //   );
    //   makePolygonsIntoDatasources(map, polygons, markerCoordinates);
    //   scaleMapToContents(map, polygons);
    // }, [polygons]);
    const updateMapData = useCallback(() => {
      if (!mapRef.current) return;

      const map: Map = mapRef.current;

      // markerCoordinates.forEach((marker) => {
      //   new mapboxgl.Marker().setLngLat(marker).addTo(map);
      // });

      if (map.getSource(DATA.POINTS)) {
        const farmFeatures = (farmsWithoutPolygons || markerCoordinates).map(
          (coordinate, index) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: coordinate,
            },
            properties: {
              index,
              plotId: "farm" + index, // Unique ID for each farm without polygons
            },
          })
        );

        const polygonFeatures = polygons.map((polygon, index) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: polygon.coordinates[0], // Use the first coordinate of the polygon as the point location
          },
          properties: {
            index,
            plotId: polygon.plotId,
          },
        }));
        const combinedFeatures = [...farmFeatures, ...polygonFeatures];

        (map.getSource(DATA.POINTS) as GeoJSONSource).setData({
          type: "FeatureCollection",
          features: combinedFeatures,
        });
      }

      if (map.getSource(DATA.LINES)) {
        (map.getSource(DATA.LINES) as GeoJSONSource).setData({
          type: "FeatureCollection",
          features: polygons.map((polygon, index) => {
            if (
              polygon.coordinates[0] &&
              polygon.coordinates[0] !==
                polygon.coordinates[polygon.coordinates.length - 1]
            ) {
              polygon.coordinates.push(polygon.coordinates[0]);
            }

            return {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [polygon.coordinates],
              },
              properties: {
                index,
                plotId: polygon.plotId,
              },
            };
          }),
        });
      }

      if (polygons && polygons.length > 0) {
        scaleMapToContents(map, polygons);
      }
    }, [polygons, farmsWithoutPolygons, markerCoordinates]);

    const initializeMap = useCallback(() => {
      mapboxgl.accessToken = import.meta.env.VITE_APP_MAP_BOX_TOKEN;

      let startingPosition: LngLatLike = [0, 0];
      if (polygons.length > 0 && polygons[0]?.coordinates[0]) {
        startingPosition = polygons[0].coordinates[0];
      } else if (markerCoordinates.length > 0) {
        startingPosition = markerCoordinates[0] as [number, number];
      }

      // See https://docs.mapbox.com/mapbox-gl-js/api/map/ for all options
      const map = new mapboxgl.Map({
        container: mapContainer.current as HTMLDivElement,
        // style: "mapbox://styles/mapbox/streets-v11",
        style: "mapbox://styles/mapbox/satellite-streets-v12", // style URL
        // projection: "globe", // Display the map as a globe, since satellite-v9 defaults to Mercator
        center: startingPosition,
        zoom: 17, // starting zoom - but scaleMapToContents should override this
        trackResize: true, // Doesn't still really work?
      });

      mapRef.current = map;

      map.on("load", () => {
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
            "circle-color": "#11b4da",
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
            "fill-color": "#888888",
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
                center: features[0]?.geometry.coordinates as [number, number],
                zoom,
              });
            });
          }
        });

        map.on("click", LAYERS.UNCLUSTERED_POINT, (event) => {
          displayPlotData(event, polygons, setSelectedPolygon, map);
        });

        map.on("click", LAYERS.LINES_FILL, (event) => {
          displayPlotData(event, polygons, setSelectedPolygon, map);
        });

        map.on("mouseenter", LAYERS.LINES_FILL, () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", LAYERS.LINES_FILL, () => {
          map.getCanvas().style.cursor = "";
        });

        // Initial data load
        defineVisibilityFromZoom(map);
        updateMapData();
      });
    }, [polygons, callback, updateMapData]);

    useEffect(() => {
      if (!mapRef.current) {
        initializeMap();
      } else {
        updateMapData(); // Update data when polygons change
      }
    }, [polygons]);

    return (
      <div style={{ position: "relative" }}>
        <div
          ref={mapContainer}
          style={{ width: "100%", height: largeView ? "80vh" : "500px" }}
        />
        {selectedPolygon && (
          // TODO: Find a generic Shadcn component
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
              onClick={() => {
                setSelectedPolygon(null);
                // Reset the color of the polygons
                mapRef.current?.setPaintProperty(
                  LAYERS.LINES_FILL,
                  "fill-color",
                  "#888888"
                );
              }}
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

            {/*TODO: Grab plot (and farm) shortcode + make link to farm, if in big map page */}
            <div className="flex flex-col">
              <p>
                <strong>Area:</strong>{" "}
                {Number(selectedPolygon.areaCalculated).toFixed(2)} ha
              </p>
              <p>
                <strong>Farm: </strong>
                {selectedPolygon.farmShortCode}
              </p>
              {selectedPolygon.plotShortCode && (
                <p>
                  <strong>Plot: </strong>
                  {selectedPolygon.plotShortCode}
                </p>
              )}
              {largeView && (
                <Link
                  className="blue underline"
                  to={"/farms/" + selectedPolygon.farmId}
                >
                  Open farm
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default PolygonMap;
