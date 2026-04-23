import { useMemo } from "react";
import type { Farm, Plot } from "@/types/farm";

export const useExtractPolygons = (farmsResponse: Farm[] | undefined) => {
  return useMemo(() => {
    if (!farmsResponse) return [];
    return farmsResponse.flatMap((farm: Farm) =>
      farm.plots.flatMap((plot: Plot) =>
        plot.polygons
          .filter((poly) => poly.active)
          .map((poly) => ({
            ...poly,
            farmId: farm.id,
            farmShortCode: farm.facility.shortCode,
            plotShortCode: plot.shortCode,
          }))
      )
    );
  }, [farmsResponse]);
};
