import { ReferenceData } from "@/components/reference/reference-data";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import {
  initialServiceCategoryColumns,
  serviceCategoryTableFilters,
} from "@/config/supporting-service-column";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(rootKeys.configurationsPrograms)({
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
  component: ConfigurationProgramComponent,
});

function ConfigurationProgramComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsPrograms,
  });
  const { fetchData: categoryTypesQuery } = useCommonQuery({
    rootKey: rootKeys.configurationsPrograms,
    search: { page: 1, limit: 1000 },
    path: lastPathSegments.SERVICE_CATEGORY_TYPES,
  });

  const updatedColumns = initialServiceCategoryColumns.map((column: any) => {
    if (column.accessorKey === "supportingServiceCategoryTypeId") {
      column.meta.list = categoryTypesQuery.data.data;
    }
    return column;
  });

  const updatedTableFilters = serviceCategoryTableFilters.map((filter: any) => {
    if (filter.key === "categoryType" && filter.type === "faceted") {
      filter.options = categoryTypesQuery.data.data.map((item: any) => ({
        label: item.name,
        value: item.shortCode,
      }));
    }
    return filter;
  });

  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={updatedColumns}
        rootKey={rootKeys.configurationsPrograms}
        tableFilters={updatedTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Programs"
      />
    </div>
  );
}
