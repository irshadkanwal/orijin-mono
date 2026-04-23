import { ReferenceData } from "@/components/reference/reference-data";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import {
  initialServiceActivityTypeColumns,
  serviceActivityTypeTableFilters,
} from "@/config/supporting-service-column";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(rootKeys.configurationsActivityTypes)({
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
  component: ConfigurationActivityTypeComponent,
});

function ConfigurationActivityTypeComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsActivityTypes,
  });
  const { fetchData: categoriesQuery } = useCommonQuery({
    rootKey: rootKeys.configurationsActivityTypes,
    search: { page: 1, limit: 1000 },
    path: lastPathSegments.SERVICE_CATEGORIES,
  });
  const { fetchData: inputTypesQuery } = useCommonQuery({
    rootKey: rootKeys.configurationsActivityTypes,
    search: { page: 1, limit: 1000 },
    path: lastPathSegments.SERVICE_INPUT_TYPES,
  });

  const updatedColumns = initialServiceActivityTypeColumns.map(
    (column: any) => {
      if (column.accessorKey === "supportingServiceCategoryId") {
        column.meta.list = categoriesQuery.data.data;
      }
      if (column.accessorKey === "supportingServiceInputTypeId") {
        column.meta.list = inputTypesQuery.data.data;
      }
      return column;
    }
  );

  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={updatedColumns}
        rootKey={rootKeys.configurationsActivityTypes}
        tableFilters={serviceActivityTypeTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Activity Types"
      />
    </div>
  );
}
