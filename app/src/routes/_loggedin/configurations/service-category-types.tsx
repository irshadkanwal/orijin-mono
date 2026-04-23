import { ReferenceData } from "@/components/reference/reference-data";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import {
  initialServiceCategoryTypesColumns,
  serviceCategoryTypesTableFilters,
} from "@/config/supporting-service-column";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(rootKeys.configurationsCategoryTypes)({
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
  component: ConfigurationCategoryTypeComponent,
});

function ConfigurationCategoryTypeComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsCategoryTypes,
  });

  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={initialServiceCategoryTypesColumns}
        rootKey={rootKeys.configurationsCategoryTypes}
        tableFilters={serviceCategoryTypesTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Service Types"
      />
    </div>
  );
}
