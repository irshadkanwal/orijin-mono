import type { DataTableFilter } from "@/components/table/datatable-types";
import { genericSingleFetchWithoutOrganistaion } from "./service-util";

export const filtersQueryOptions = (
  filterKey: string,
  orgId: string,
  token?: string
) => ({
  queryKey: ["filters", filterKey],
  queryFn: () => fetchFilters(filterKey, orgId, token),
});

async function fetchFilters(
  filterKey: string,
  orgId: string,
  token?: string
): Promise<DataTableFilter[] | null> {
  return genericSingleFetchWithoutOrganistaion<DataTableFilter[]>(
    `/${orgId}/filters/${filterKey}`,
    "",
    token
  );
}
