import { genericSingleFetch } from "@/services/service-util";
import type { FarmsDashboardQuery } from "@/types/farms-types.ts";

interface warningCount {
  [key: string]: number;
}

export const fetchFarmsStats = async (
  organisation: string,
  queryParams: FarmsDashboardQuery,
  token?: string
) => {
  return genericSingleFetch<any>(
    organisation,
    `/farm-stats`,
    "",
    token,
    queryParams
  );
};

export const fetchLocationsStats = async (
  organisation: string,
  token?: string
): Promise<any> => {
  const result = await genericSingleFetch<any>(
    organisation,
    "/location-stats",
    "",
    token
  );
  return result;
};

export const fetchPersonsStats = async (
  organisation: string,
  token?: string
): Promise<any> => {
  const result = await genericSingleFetch<any>(
    organisation,
    "/persons",
    "",
    token
  );
  return result;
};

export const fetchFarmsPerLocation = async (
  organisation: string,
  queryParams: FarmsDashboardQuery,
  token?: string
): Promise<any> => {
  const result = await genericSingleFetch<any>(
    organisation,
    "/locationsByType",
    "",
    token,
    queryParams
  );
  return result;
};
