import { farmsQueryOptions } from "@/services/farm-service.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import { rootKeys } from "@/config/rootKeys.ts";
import type { FarmsTableQuery } from "@/types/farms-types.ts";

export const useFarmsQuery = (searchFrom: rootKeys) => {
  const {
    auth: { organisations, currentUser },
  } = useRouteContext({ from: rootKeys.farms });
  const search: FarmsTableQuery = useSearch({ from: searchFrom });

  return useSuspenseQuery(
    farmsQueryOptions(organisations.current, search, currentUser?.accessToken)
  );
};
