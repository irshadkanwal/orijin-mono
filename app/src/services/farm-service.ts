import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Farm, Plot, Polygon } from "@/types/farm";
import {
  genericPaginatedFetch,
  genericPostPutPatchWithOutOrganization,
  genericSingleFetch,
} from "@/services/service-util.ts";
import type { FarmsTableQuery } from "@/types/farms-types";
import type { ChangesDto } from "@orijin-server/changes/dto/changes.dto";

// Mutations
export const farmsQueryOptions = (
  organisation: string,
  query: FarmsTableQuery,
  token?: string
) =>
  queryOptions({
    queryKey: ["farms", organisation, token, query],
    queryFn: () => fetchFarms(organisation, query, token),
    placeholderData: { data: [], count: 0 },
  });

export const farmQueryOptions = (
  organisation: string,
  farmId: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["farms", organisation, farmId, token],
    queryFn: () => fetchFarm(organisation, farmId, token),
  });

export const useRequestAnalysisUpdateMutation = (
  organisation: string,
  token: string,
  fetchFunction: any
) => {
  const queryClient = useQueryClient();
  // https://tanstack.com/query/v5/docs/framework/react/guides/mutations
  return useMutation({
    mutationFn: async (parcelId: string) => {
      return fetchFunction(organisation, token, parcelId);
    },
    onSuccess: async () => {
      console.log("Success! Should invalidate queries");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await queryClient.invalidateQueries(); // Did nothing to update the Farm
      // await router.invalidate()
    },
    onError: (error) => {
      console.error("Error requesting analysis update", error);
    },
    onSettled: () => {
      console.log("Request analysis update settled");
    },
  });
};

// Service methods
export const fetchFarms = async (
  organisation: string,
  query: FarmsTableQuery,
  token?: string
): Promise<{ data: Array<Farm>; count?: number }> => {
  // TODO: Make this stripping of pagination details generic! Will be needed in other paginated fetches too.
  const { page, limit, minimalResults, ...actualFilters } = query;
  const filters: Record<string, string> = {};
  Object.keys(actualFilters).forEach((prop) => {
    filters[prop] = query[prop as keyof FarmsTableQuery] as string;
  });

  return genericPaginatedFetch<Farm>(
    organisation,
    minimalResults ? "/farms-minimal" : "/farms",
    token,
    page,
    limit,
    filters
  );
};

export const fetchFarmsTotalCount = async (
  organisation: string,
  token?: string
): Promise<number | null> => {
  return genericSingleFetch<number>(organisation, `/count`, "", token);
};

export const fetchFarm = async (
  organisation: string,
  farmId: string,
  token?: string
): Promise<Farm> => {
  return genericSingleFetch<Farm>(organisation, `/farms`, farmId, token);
};

export const requestAnalysisStart = async (
  organisation: string,
  token: string,
  farmId: string
) => {
  return genericSingleFetch<Farm[]>(
    organisation,
    `/startAnalysis/farm`,
    farmId,
    token
  );
};

export const requestAnalysisUpdate = async (
  organisation: string,
  token: string,
  plotId: string
) => {
  return genericSingleFetch<Plot[]>(
    organisation,
    `/analysisResult/plot`,
    plotId,
    token
  );
};

export const farmHistoryQueryOptions = (
  organisationId: string,
  farmId: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["farmsHistory", organisationId, farmId, token],
    queryFn: () => fetchFarmHistory(organisationId, farmId, token),
  });

export const fetchFarmHistory = async (
  organisation: string,
  farmId: string,
  token?: string
) => {
  return genericSingleFetch<ChangesDto[]>(
    organisation,
    `/changes/farms`,
    farmId,
    token
  );
};

export const farmSeasonsQueryOptions = (
  organisationId: string,
  farmId: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["farmsSeasons", organisationId, farmId, token],
    queryFn: () => fetchFarmSeasons(organisationId, farmId, token),
  });

export const fetchFarmSeasons = async (
  organisation: string,
  farmId: string,
  token?: string
) => {
  return genericSingleFetch<
    {
      seasonId: string;
      seasonCode: string;
      farmId?: string;
    }[]
  >(organisation, `/farm/seasons`, farmId, token);
};

export const farmSeasonsHistoryQueryOptions = (
  organisationId: string,
  farmId: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["farmsSeasonsHistory", organisationId, farmId, token],
    queryFn: () => fetchFarmSeasonsHistory(organisationId, farmId, token),
  });

export const fetchFarmSeasonsHistory = async (
  organisation: string,
  farmId: string,
  token?: string
) => {
  return genericSingleFetch<
    {
      seasonId: string;
      seasonCode: string;
      farm: Farm | null;
    }[]
  >(organisation, `/farm/season/history`, farmId, token);
};

export const fetchFarmPlots = async (
  organisation: string,
  token?: string
): Promise<Plot[] | null> => {
  return genericSingleFetch<Plot[]>(organisation, `/plots`, "", token);
};

export const dashboardQueryOptions = (organisation: string, token?: string) =>
  queryOptions({
    queryKey: ["farms", organisation, token],
    queryFn: () => fetchFarmPlots(organisation, token),
  });

export const updatePolygon = async (
  token: string,
  polygonId: string,
  data: any
) => {
  return genericPostPutPatchWithOutOrganization<Polygon[]>(
    `/geopolygons/${polygonId}`,
    "PATCH",
    data,
    token
  );
};

type UpdatePolygonMutationVariables = Partial<Polygon>;
export const useUpdatePolygon = (token: string, fetchFunction: any) => {
  return useMutation({
    mutationFn: async (mutationVariables: UpdatePolygonMutationVariables) => {
      const { id, ...rest } = mutationVariables;
      return fetchFunction(token, mutationVariables.id, {
        ...rest,
      });
    },
    onSuccess: async () => {
      console.log("Success! Should invalidate queries");
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Error Updating Polygon", error);
    },
    onSettled: () => {
      console.log("Update polygon settled");
    },
  });
};
