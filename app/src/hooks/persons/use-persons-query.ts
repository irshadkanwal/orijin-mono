import { useEffect } from "react";
import { personsQueryOptions } from "@/services/person-service.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import { rootKeys } from "@/config/rootKeys.ts";
import type { PersonsTableQuery } from "@/types/persons-types.ts";

export const usePersonsQuery = () => {
  const {
    auth: { organisations, currentUser },
  } = useRouteContext({ from: rootKeys.persons });
  const search: PersonsTableQuery = useSearch({ from: rootKeys.persons });

  const personQuery = useSuspenseQuery(
    personsQueryOptions(
      organisations.current,
      {
        page: search.page,
        limit: search.limit,
        shortCode: search.shortCode,
        location: search.location,
        sort: search.sort,
        sortOrder: search.sortOrder,
      },
      currentUser?.accessToken
    )
  );

  useEffect(() => {
    void personQuery.refetch();
  }, [search, personQuery]);

  return personQuery;
};
