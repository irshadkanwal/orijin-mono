import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { initialLotsColumns, lotsTableFilters } from "@/config/lots-column";
import { rootKeys } from "@/config/rootKeys";
import { commonTableQuerySchema } from "@/types/common-types";
import { fetchAllQueryOptions } from "@/services/common-service";
import { ReferenceData } from "@/components/reference/reference-data";

export const Route = createFileRoute(rootKeys.lots)({
  loaderDeps: ({ search }) => {
    const parsed = commonTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const { page, limit, idCode } = parsed.data;
    return { page, limit, idCode };
  },

  loader: async ({ deps, context, location }) => {
    // Extract the last path segment
    const lastPathSegment: string =
      location.pathname.split("/").filter(Boolean).pop() ?? "";
    const { queryClient, auth } = context;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data = await queryClient.ensureQueryData(
      fetchAllQueryOptions(
        auth.organisations.current,
        lastPathSegment,
        deps,
        auth.currentUser?.accessToken
      )
    );

    return {
      data,
      lastPathSegment,
    };
  },

  validateSearch: (search) => {
    const result = commonTableQuerySchema.safeParse(search);

    return result.success ? result.data : {};
  },

  component: LotsIndexComponent,
});

function LotsIndexComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.lots,
  });

  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={initialLotsColumns}
        rootKey={rootKeys.lots}
        tableFilters={lotsTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Lots"
      />
    </div>
  );
}
