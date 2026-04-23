import { queryOptions } from "@tanstack/react-query";
import {
  genericPaginatedFetch,
  genericPostPutPatch,
  genericSingleFetch,
} from "@/services/service-util.ts";
import type { SupportServiceActivity } from "@/types/support-service";
import { SupportServiceTableQuery } from "@/types/support-service-types";
import { generateFilters } from "@/lib/utils";

///////
// Support Service Activity
//////

export const supportingServicesActivitiesQueryOptions = (
  organisation: string,
  query: SupportServiceTableQuery,
  token?: string
) =>
  queryOptions({
    queryKey: [
      "supportingServiceActivity",
      organisation,
      token,
      query.page,
      query.limit,
      query.personName,
      query.activityType,
      query.location,
      query.customLocation,
      query.program,
      query.serviceType,
      query.inputType,
      query.ageRange,
      query.gender,
      query.operator,
    ],
    queryFn: () => fetchSupportingServiceActivities(organisation, query, token),
  });

export const supportingServicesActivityQueryOptions = (
  organisation: string,
  id: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["supportingServiceActivity", organisation, id, token],
    queryFn: () =>
      fetchSingleSupportingServiceActivity(organisation, id, token),
  });

export const postSupportingServicesActivityQueryOptions = (
  organisation: string,
  data: any,
  token?: string
) =>
  queryOptions({
    queryKey: ["supportingServiceActivity", organisation, data, token],
    queryFn: () => postActivity(organisation, data, token),
  });

// Service methods ----------------

//////
// Support Service Activities
//////

export const fetchSupportingServiceActivities = async (
  organisation: string,
  query: SupportServiceTableQuery,
  token?: string
): Promise<{ data: Array<SupportServiceActivity>; count?: number }> => {
  const filters = generateFilters(query, [
    "personName",
    "activityType",
    "location",
    "customLocation",
    "program",
    "serviceType",
    "inputType",
    "ageRange",
    "gender",
    "operator",
    "isCompleteBeneficiaries"
  ]);
  return genericPaginatedFetch<SupportServiceActivity>(
    organisation,
    "/serviceactivities",
    token,
    query.page,
    query.limit,
    filters
  );
};

export const fetchSingleSupportingServiceActivity = async (
  organisation: string,
  id: string,
  token?: string
): Promise<SupportServiceActivity> => {
  return genericSingleFetch<SupportServiceActivity>(
    organisation,
    "/serviceactivities",
    id,
    token
  );
};

export const postActivity = async (
  organisation: string,
  data: SupportServiceActivity,
  token?: string
): Promise<SupportServiceActivity> => {
  return genericPostPutPatch<SupportServiceActivity>(
    organisation,
    "/serviceactivities",
    "POST",
    data,
    token
  );
};

export const updateActivity = async (
  organisation: string,
  id: string,
  data: SupportServiceActivity,
  token?: string
): Promise<SupportServiceActivity> => {
  return genericPostPutPatch<SupportServiceActivity>(
    organisation,
    `/serviceactivities/${id}`,
    "PATCH",
    data,
    token
  );
};

export const deleteActivity = async (
  organisation: string,
  id: string,
  token?: string
): Promise<SupportServiceActivity> => {
  return genericPostPutPatch<SupportServiceActivity>(
    organisation,
    `/serviceactivities/${id}`,
    "DELETE",
    null,
    token
  );
};
