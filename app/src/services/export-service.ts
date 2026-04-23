import {
  genericPaginatedFetch,
  genericPaginatedFetchWithoutOrganistaion,
} from "./service-util";
import { queryOptions } from "@tanstack/react-query";
import { AppAuth } from "@/types/auth";
import { QueryClient } from "@tanstack/react-query";
import { fetchDocuments } from "./firebase-service";

export const exportTableDataQueryOptions = (
  organisation: string,
  token: string,
  pathName: string,
  filters: Record<string, string>,
  isV1DataTable?: boolean
) =>
  queryOptions({
    queryKey: [
      "export-table-data",
      organisation,
      token,
      pathName,
      filters,
      isV1DataTable,
    ],
    queryFn: () =>
      fetchExportTableData(
        organisation,
        token,
        pathName,
        filters,
        isV1DataTable
      ),
  });

export const fetchExportTableData = async <T>(
  organisation: string,
  token: string,
  pathName: string,
  filters: Record<string, string>,
  isV1DataTable?: boolean
) => {
  if (isV1DataTable) {
    return await fetchDocuments(pathName, filters, token);
  } else {
    if (pathName === "/users") {
      return await genericPaginatedFetchWithoutOrganistaion<{
        data: Array<T>;
        count: number;
      }>(pathName, token, 1, 9999, filters);
    }
    const { page, limit, ...filtersWithoutPagination } = filters;

    return await genericPaginatedFetch<{ data: Array<T>; count: number }>(
      organisation,
      pathName,
      token,
      1,
      9999,
      filtersWithoutPagination
    );
  }
};

type getTableDataForExportProps = {
  auth: AppAuth;
  queryClient: QueryClient;
  pathName: string;
  filters: Record<string, any>;
  isV1DataTable?: boolean;
};

export const getTableDataForExport = async ({
  auth,
  queryClient,
  pathName,
  filters,
  isV1DataTable,
}: getTableDataForExportProps) => {
  const dataPromise = queryClient.ensureQueryData(
    exportTableDataQueryOptions(
      auth.organisations.current,
      auth.currentUser?.accessToken!,
      pathName,
      filters,
      isV1DataTable
    )
  );
  const data = (await dataPromise).data;
  return data;
};
