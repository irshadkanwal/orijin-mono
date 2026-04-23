import {
  genericPaginatedFetchWithoutOrganistaion,
  genericPostPutPatchWithOutOrganization,
  genericSingleFetch,
} from "@/services/service-util";
import { Workspace } from "@/components/field-tasks/bread-crumb";
import { FieldTaskQuery } from "@/types/field-task";
import { generateDynamicFiltersWithExclude } from "@/lib/utils";

export interface FirebaseDocument {
  id: any;
  [key: string]: any;
}

export const fetchWorkspacesQueryOptions = (
  org: string,
  path: string,
  token?: string
) => {
  return {
    queryKey: ["workspaces", org, path, token],
    queryFn: async () => await fetchWorkspaces(org, path, token),
  };
};

export const fetchDocumentsQueryOptions = (
  path: string,
  query: FieldTaskQuery,
  token?: string
) => {
  return {
    queryKey: [path, query, token],
    queryFn: async () => await fetchDocuments(path, query, token),
  };
};

export const fetchColumnsQueryOptions = (
  path: string,
  collection: string,
  token?: string
) => {
  return {
    queryKey: [path, collection, token],
    queryFn: async () => {
      return genericSingleFetch(collection, path, "", token);
    },
  };
};

export const fetchWorkspaces = async (
  org: string,
  path: string,
  token?: string
): Promise<Workspace[] | null> => {
  return genericSingleFetch(org, path, "", token);
};

export const fetchDocuments = async (
  path: string,
  query: FieldTaskQuery | any,
  token?: string
) => {
  const filters = generateDynamicFiltersWithExclude(query);
  return genericPaginatedFetchWithoutOrganistaion(
    path,
    token,
    query.page,
    query.limit,
    filters
  );
};

export const updateOrDeleteDocument = async (
  path: string,
  id: string,
  data: any,
  method: "PUT" | "PATCH" | "DELETE",
  token?: string
) => {
  return genericPostPutPatchWithOutOrganization(
    `${path}/${id}`,
    method,
    data,
    token
  );
};
