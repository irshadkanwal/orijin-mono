import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "@/components/table/datatable.tsx";
import { personsQueryOptions } from "@/services/person-service.ts";
import { personsTableQuerySchema } from "@/types/persons-types.ts";
import { initialPersonsColumns, personsTableFilters } from "@/config/persons-column";
import { rootKeys } from "@/config/rootKeys";
import { usePersonsQuery } from "@/hooks/persons/use-persons-query.ts";
import { PageTitle } from "@/components/page-title";

export const Route = createFileRoute(rootKeys.persons)({
  loaderDeps: ({ search }) => {
    const parsed = personsTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const { page, limit, shortCode, location, sort, sortOrder } = parsed.data;
    return { page, limit, shortCode, location, sort, sortOrder };
  },

  loader: (opts) => {
    const { queryClient, auth } = opts.context;
    const { page, limit, shortCode, location, sort, sortOrder } = opts.deps;
    return queryClient.ensureQueryData(
      personsQueryOptions(
        auth.organisations.current,
        {
          page,
          limit,
          shortCode,
          location,
          sort,
          sortOrder,
        },
        auth.currentUser?.accessToken
      )
    );
  },
  validateSearch: (search) => {
    const result = personsTableQuerySchema.safeParse(search);
    return result.success ? result.data : {};
  },

  component: PersonsIndexComponent,
});

function PersonsIndexComponent() {
  const persons = usePersonsQuery();
  return (
    <>
      <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-6 lg:grid-cols-1 xl:grid-cols-1">
        <PageTitle title={"Persons"} />
        <DataTable
          columns={initialPersonsColumns}
          data={persons.data.data}
          count={persons.data.count || 0}
          searchFrom={rootKeys.persons}
          filters={personsTableFilters}
          tableQuerySchema={personsTableQuerySchema}
          fields={["shortCode", "location"]}
          isFiltrationActive={true}
        />
      </main>
    </>
  );
}
