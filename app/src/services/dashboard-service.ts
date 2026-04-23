import { queryOptions } from "@tanstack/react-query";

import {
  fetchFarmsPerLocation,
  fetchFarmsStats,
  fetchLocationsStats,
  fetchPersonsStats,
} from "@/services/dashboard-util";
import type { FarmsDashboardQuery } from "@/types/farms-types.ts";

export const farmStatsQueryOptions = (
  organisation: string,
  queryParams: FarmsDashboardQuery,
  token?: string
) =>
  queryOptions({
    queryKey: ["farm-stats", organisation, token, queryParams],
    queryFn: () => fetchFarmsStats(organisation, queryParams, token),
  });

export const locationsStatsQueryOptions = (
  organisation: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["locations-stats", organisation, token],
    queryFn: () => fetchLocationsStats(organisation, token),
  });

export const personsStatsQueryOptions = (
  organisation: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["persons-stats", organisation, token],
    queryFn: () => fetchPersonsStats(organisation, token),
  });

export const farmsPerLocationQueryOptions = (
  organisation: string,
  queryParams: FarmsDashboardQuery,
  token?: string
) =>
  queryOptions({
    queryKey: ["farms-per-location", organisation, token, queryParams],
    queryFn: () => fetchFarmsPerLocation(organisation, queryParams, token),
  });
