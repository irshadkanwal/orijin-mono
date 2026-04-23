import type { Person } from "@/types/person";
import { queryOptions } from "@tanstack/react-query";
import {
  genericPaginatedFetch,
  genericPostPutPatch,
  genericSingleFetch,
} from "./service-util";
import type { PersonsTableQuery } from "@/types/persons-types.ts";
import type { z } from "zod";
import { omit } from "@/lib/utils";

export const personsQueryOptions = (
  organisation: string,
  query: z.output<PersonsTableQuery>,
  token?: string
) =>
  queryOptions({
    queryKey: [
      "persons",
      organisation,
      token,
      query.page,
      query.limit,
      query.sort,
      query.sortOrder,
    ],
    queryFn: () => fetchPersons(organisation, query, token),
  });

export const personQueryOptions = (
  organisation: string,
  personId: string,
  token?: string
) =>
  queryOptions({
    queryKey: ["persons", organisation, personId, token],
    queryFn: () => fetchPerson(organisation, personId, token),
  });

// Service methods
export const fetchPersons = async (
  organisation: string,
  query: z.output<PersonsTableQuery>,
  token?: string
): Promise<{ data: Array<Person>; count?: number }> => {
  return genericPaginatedFetch<Person>(
    organisation,
    "/persons",
    token,
    query.page,
    query.limit,
    omit(query, "page", "limit")
  );
};

export const fetchPerson = async (
  organisation: string,
  personId: string,
  token?: string
): Promise<Person> => {
  return genericSingleFetch<Person>(organisation, `/persons`, personId, token);
};

// Mutation

export const filteredPersonsQueryOptions = (
  organisation: string,
  types: string[],
  token?: string
) =>
  queryOptions({
    queryKey: ["persons", organisation, types, token],
    queryFn: () => fetchFilteredPersons(organisation, types, token),
  });

export const fetchFilteredPersons = async (
  organisation: string,
  types: string[],
  token?: string
): Promise<Array<Person>> => {
  // TODO: Change to use regular getMany endpoint with filters
  return genericPostPutPatch<Person>(
    organisation,
    "/personsFilterByType",
    "POST",
    types,
    token
  );
};

export const postPerson = async (
  organisation: string,
  data: Person,
  token?: string
): Promise<Person> => {
  // TODO: Change to use regular getMany endpoint with filters
  return genericPostPutPatch<Person>(
    organisation,
    "/persons",
    "POST",
    data,
    token
  );
};
