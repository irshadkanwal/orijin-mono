import type { MapData } from "@/components/map/utils/config/farm-map-config";
import { useMemo } from "react";
import type { Farm, Plot, Polygon } from "@/types/farm";

export const useExtractFacilityCoordinates = (
  farmsResponse: Farm[] | undefined
) => {
  return useMemo(() => {
    if (!farmsResponse) return [];
    return farmsResponse.flatMap((farm: Farm) => {
      const coordinate = farm.facility?.coordinate;
      // we need to return empty or map indexes will be off
      if (coordinate.length === 0) {
        return [[NaN, NaN]];
      }
      const coordinates = farm.facility.coordinate[0];

      return [[parseFloat(coordinates[0]), parseFloat(coordinates[1])]];
    });
  }, [farmsResponse]);
};

export const useTransformFarmsForMap = (
  farmsResponse: Farm[] | undefined
): Farm[] => {
  return useMemo(() => {
    if (!farmsResponse) return [];
    return farmsResponse.map((farm: Farm) => {
      const transformedCoordinate = Array.isArray(farm.facility.coordinate)
        ? farm.facility.coordinate?.map(
            (coord) =>
              // coord.map((value) =>
              typeof coord === "string" ? parseFloat(coord) : coord
            // )
          )
        : null;

      return {
        ...farm,
        facility: {
          ...farm.facility,
          coordinate: transformedCoordinate || [[NaN, NaN]], // Return NaN if coordinates are not available
        },
        plots: farm.plots.map((plot) => ({
          ...plot,
          polygons: plot.polygons?.map((polygon) => ({
            ...polygon,
            coordinates: (polygon.coordinates as number[][])?.map(
              ([lng, lat]) => [parseFloat(lng), parseFloat(lat)]
            ),
          })),
        })),
      };
    });
  }, [farmsResponse]);
};

export const useExtractFarmMapData = (farms: Farm[]): MapData[] => {
  return useMemo(() => {
    return farms.map((farm: Farm) => {
      const plots: Polygon[] = farm.plots.map((plot: Plot) => ({
        plotShortCode: plot.shortCode,
        areaSizeManual: plot.areaSizeManual,
        updatedBy: farm.updatedBy,
      }));
      const polygons: Polygon[] = farm.plots.flatMap((plot: Plot) =>
        plot.polygons.map((polygon: Polygon) => ({
          ...polygon,
          plotShortCode: plot.shortCode,
          updatedBy: farm.updatedBy,
        }))
      );
      return {
        id: farm.id,
        facility: farm.facility,
        polygons,
        plots,
        updatedBy: farm.updatedBy,
        updatedAt: farm.updatedAt,
      };
    });
  }, [farms]);
};
