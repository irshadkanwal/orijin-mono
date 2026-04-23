import { queryOptions } from "@tanstack/react-query";
import {
  genericPaginatedFetchWithoutOrganistaion,
} from "./service-util";
import { Organisation } from "@/types/organisation";

export const organisationsQueryOptions = (token?: string) =>
  queryOptions({
    queryKey: ["f-organisations", token],
    queryFn: () => fetchOrganisations(token),
  });

export const fetchOrganisations = async (
  token?: string
): Promise<{ data: Array<Organisation> }> => {
  return genericPaginatedFetchWithoutOrganistaion<Organisation>(
    "/f-organisations",
    token
  );
};