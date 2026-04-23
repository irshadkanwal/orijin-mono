import { queryOptions } from "@tanstack/react-query";
import {
  genericPaginatedFetch,
  genericPostPutPatch,
  genericSingleFetch,
} from "./service-util";

import type { ILocation } from "@/types/location";
import { LocationsTableQuery } from "@/types/locations-types";

// Mutations
export const locationsQueryOptions = (
  organisation: string,
  query: LocationsTableQuery,
  token?: string
) =>
  queryOptions({
    queryKey: ["locations", organisation, token, query],
    queryFn: () => fetchLocations(organisation, query, token),
  });

export const filteredLocationsQueryOptions = (
  organisation: string,
  types: string[],
  token?: string
) =>
  queryOptions({
    queryKey: ["locations", organisation, types, token],
    queryFn: () => fetchFilteredLocations(organisation, types, token),
  });

export const locationsForFiltersQueryOptions = (
  organisation: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["locations", organisation, token],
    queryFn: () => fetchLocationsForFilters(organisation, token),
  });

// Service methods
export const fetchLocations = async (
  organisation: string,
  query: LocationsTableQuery,
  token?: string
): Promise<{ data: Array<ILocation>; count?: number }> => {
  let filters: Record<string, string> = {};
  const filterProperties = [
    "shortCode",
    "location",
    "sort",
    "sortOrder",
    "name",
    "type",
  ];
  filterProperties.forEach((prop) => {
    if (query[prop as keyof LocationsTableQuery]) {
      filters[prop] = query[prop as keyof LocationsTableQuery] as string;
    }
  });
  const result = await genericPaginatedFetch<ILocation>(
    organisation,
    "/locations",
    token,
    query.page,
    query.limit,
    filters
  );
  return result;
};

export const addLocation = async (
  organisation: string,
  location: ILocation,
  token?: string
): Promise<ILocation> => {
  return genericPostPutPatch<ILocation>(
    organisation,
    "/locations",
    "POST",
    location,
    token
  );
};

export const updateLocation = async (
  organisation: string,
  location: ILocation,
  token?: string
): Promise<ILocation> => {
  return genericPostPutPatch<ILocation>(
    organisation,
    `/locations/${location.id}`,
    "PUT",
    location,
    token
  );
};

export const deleteLocation = async (
  organisation: string,
  location: ILocation,
  token?: string
): Promise<void | null> => {
  return genericPostPutPatch<ILocation>(
    organisation,
    `/locations/${location.id}`,
    "DELETE",
    location,
    token
  );
};

export const fetchFilteredLocations = async (
  organisation: string,
  types: string[],
  token?: string
): Promise<Array<ILocation>> => {
  return genericPostPutPatch<ILocation>(
    organisation,
    "/locationsFilterByType",
    "POST",
    types,
    token
  );
};

export const fetchLocationsForFilters = async (
  organisation: string,
  token?: string
): Promise<Array<ILocation> | null> => {
  return genericSingleFetch<Array<ILocation>>(
    organisation,
    "/locations-filter",
    "",
    token
  );
};
