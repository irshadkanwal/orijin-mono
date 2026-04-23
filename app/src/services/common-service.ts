// Mutations

import { generateFilters } from "@/lib/utils";
import { CommonTableQuery } from "@/types/common-types";
import { queryOptions } from "@tanstack/react-query";
import {
  genericPaginatedFetch,
  genericPaginatedFetchWithoutOrganistaion,
  genericPostPutPatch,
  genericPostPutPatchWithOutOrganization,
  genericSingleFetch,
  genericSingleFetchWithoutOrganistaion,
} from "./service-util";

export const fetchAllQueryOptions = <T>(
  organisations: string,
  path: string,
  query: CommonTableQuery,
  token?: string
) =>
  queryOptions({
    queryKey: [path, organisations, token, query],
    queryFn: () => fetchAll<T>(organisations, path, query, token),
  });

export const fetchOneQueryOptions = (
  organisation: string,
  path: string,
  id: string,
  token?: string
) =>
  queryOptions({
    queryKey: [path, organisation, id, token],
    queryFn: () => fetchOne(organisation, path, id, token),
  });

// Services

const fetchAll = async <T>(
  organisation: string,
  path: string,
  query: CommonTableQuery,
  token?: string
): Promise<{ data: Array<T>; count?: number }> => {
  const filters = generateFilters(query, [
    "name",
    "shortCode",
    "type",
    "email",
    "idCode",
    "sort",
    "sortOrder",
    "notFarm",
    "categoryType",
    "program",
    "operator",
    "activityType",
    "serviceType",
    "inputType",
    "location",
    "customLocation",
    "mainType",
    "tab",
    "ageRanges",
  ]);
  if (!organisation || organisation === "") {
    return genericPaginatedFetchWithoutOrganistaion<any>(
      `/${path}`,
      token,
      query.page,
      query.limit,
      filters
    );
  } else {
    return genericPaginatedFetch<T>(
      organisation,
      `/${path}`,
      token,
      query.page,
      query.limit,
      filters
    );
  }
};

const fetchOne = async (
  organisation: string,
  path: string,
  id: string,
  token?: string
): Promise<any> => {
  if (!organisation || organisation === "") {
    return genericSingleFetchWithoutOrganistaion<any>(`/${path}`, id, token);
  } else {
    return genericSingleFetch<any>(organisation, path, id, token);
  }
};

const post = async (
  organisation: string,
  path: string,
  data: any,
  token?: string
): Promise<any> => {
  if (!organisation || organisation === "") {
    return genericPostPutPatchWithOutOrganization<any>(
      `/${path}`,
      "POST",
      data,
      token
    );
  } else {
    return genericPostPutPatch<any>(
      organisation,
      `/${path}`,
      "POST",
      data,
      token
    );
  }
};

const update = async (
  organisation: string,
  path: string,
  id: string,
  data: any,
  token?: string
): Promise<any> => {
  if (!organisation || organisation === "") {
    return genericPostPutPatchWithOutOrganization<any>(
      `/${path}/${id}`,
      "PATCH",
      data,
      token
    );
  } else {
    return genericPostPutPatch<any>(
      organisation,
      `/${path}/${id}`,
      "PATCH",
      data,
      token
    );
  }
};

const deleteById = async (
  organisation: string,
  path: string,
  id: string,
  token?: string
): Promise<any> => {
  if (!organisation || organisation === "") {
    return genericPostPutPatchWithOutOrganization<any>(
      `/${path}/${id}`,
      "DELETE",
      null,
      token
    );
  } else {
    return genericPostPutPatch<any>(
      organisation,
      `/${path}/${id}`,
      "DELETE",
      null,
      token
    );
  }
};

// Import
const fileUpload = async (
  organisation: string,
  path: string,
  data: any,
  token?: string
): Promise<any> => {
  return genericPostPutPatch<any>(
    organisation,
    `/${path}`,
    "POST",
    data,
    token,
    "multipart/form-data"
  );
};

const deleteMultiple = async (
  organisation: string,
  path: string,
  data: any,
  token?: string
): Promise<any> => {
  if (!organisation || organisation === "") {
    return genericPostPutPatchWithOutOrganization<any>(
      `/${path}`,
      "DELETE",
      data,
      token
    );
  } else {
    return genericPostPutPatch<any>(
      organisation,
      `/${path}`,
      "DELETE",
      data,
      token
    );
  }
};

export {
  fetchAll,
  fetchOne,
  post,
  update,
  deleteById,
  fileUpload,
  deleteMultiple,
};
