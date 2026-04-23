import type {
  Plot,
  Polygon,
  Coordinates,
  Farm,
  PolygonForMap,
} from "@/types/farm";
import type {
  FacilityMinimal,
  MapData,
} from "../../map/utils/config/farm-map-config";

const getLatestSatellite = (plot: Plot) => {
  if (plot.satelliteAnalysis?.length === 0) {
    return null;
  }
  return plot.satelliteAnalysis[plot.satelliteAnalysis.length - 1];
};
const getCurrentPolygon = (
  plot: Plot,
  getActivePolygon = true
): Polygon | undefined => {
  if (plot.polygons?.length === 0) return undefined;
  return plot.polygons.filter(
    getActivePolygon ? (poly) => poly.active : (poly) => !poly.active
  )[0];
};

const convertToCoordsArray = (coordinateObject: {
  latitude: string;
  longitude: string;
}): Coordinates[] => {
  if (!coordinateObject) return [];
  return [
    [
      parseFloat(coordinateObject.latitude),
      parseFloat(coordinateObject.longitude),
    ],
  ] as Coordinates[];
};

function transformFarmData(
  farm: Farm,
  farmCoordinates: { latitude: string; longitude: string },
  farmId: string,
  polygonsForMap: Polygon[]
): MapData {
  const coordinates = convertToCoordsArray(farmCoordinates);
  const facility: FacilityMinimal = {
    id: farm.id,
    shortCode: farm.facility.shortCode,
    name: farm.facility.name,
    coordinate: coordinates ? coordinates[0] : undefined,
  };

  return {
    id: farmId,
    facility,
    polygons: polygonsForMap.map((polygon) => ({
      ...polygon,
      farmId: farm.id,
      farmShortCode: farm.facility.shortCode,
      facilityName: farm.facility.name,
    })),
    updatedAt: farm.updatedAt,
    updatedBy: farm.updatedBy,
  };
}

function filterPlots(
  plots: Plot[],
  plotId: string,
  activeOnly: boolean = true
) {
  if (plotId === "all") {
    const allPolygons: PolygonForMap[] = [];
    plots.forEach((plot: Plot) => {
      plot.polygons.forEach((polygon) => {
        if (polygon.active === activeOnly || polygon.active === null) {
          allPolygons.push({ ...polygon, plotShortCode: plot.shortCode });
        }
      });
    });
    return allPolygons;
  } else {
    const selectedPlot = plots.find((plot) => plot.id === plotId);
    if (selectedPlot) {
      return selectedPlot.polygons
        .filter(
          (polygon) => polygon.active === activeOnly || polygon.active === null
        )
        .map((polygon) => ({
          ...polygon,
          plotShortCode: selectedPlot.shortCode,
        }));
    }
  }
  return [];
}

function formatPlotShortCode(plot: Plot) {
  // limit the length of the plot shortCode to 15 characters and add an ellipsis
  const maxLength = 25;
  return plot.shortCode!.length > maxLength
    ? plot.shortCode!.slice(0, maxLength) + "..."
    : plot.shortCode;
}

export {
  getLatestSatellite,
  getCurrentPolygon,
  convertToCoordsArray,
  transformFarmData,
  filterPlots,
  formatPlotShortCode,
};
