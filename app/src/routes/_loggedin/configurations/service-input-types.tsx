import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import {
  initialServiceInputTypeColumns,
  serviceInputTypeTableFilters,
} from "@/config/supporting-service-column";
import { InputTypeType } from "@/types/support-service-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ReferenceData } from "@/components/reference/reference-data";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { useCommonQuery } from "@/hooks/common/use-common-queries";

export const Route = createFileRoute(rootKeys.configurationsInputTypes)({
  loaderDeps: ({ search }) => {
    const parsed = commonTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const { page, limit, shortCode } = parsed.data;
    return { page, limit, shortCode };
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
  component: ConfigurationInputTypeComponent,
});

function ConfigurationInputTypeComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsInputTypes,
  });
  const { fetchData: categoriesQuery } = useCommonQuery({
    rootKey: rootKeys.configurationsInputTypes,
    path: lastPathSegments.SERVICE_CATEGORIES,
    search: { page: 1, limit: 1000 },
  });
  const types = Object.values(InputTypeType).map((type) => ({
    id: type,
    name: type,
  }));

  const updatedColumns = initialServiceInputTypeColumns.map((column: any) => {
    if (column.accessorKey === "supportingServiceCategoryId") {
      column.meta.list = categoriesQuery.data.data;
    }
    if (column.accessorKey === "type") {
      column.meta.list = types;
    }
    return column;
  });

  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={updatedColumns}
        rootKey={rootKeys.configurationsInputTypes}
        tableFilters={serviceInputTypeTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Input Types"
      />
    </div>
  );
}
