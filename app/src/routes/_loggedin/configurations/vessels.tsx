import { ReferenceData } from "@/components/reference/reference-data";
import {
  vesselsTableFilters,
  initialVesselsColumns,
} from "@/config/vessels-columns";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useCommonQuery } from "@/hooks/common/use-common-queries";

export const Route = createFileRoute(rootKeys.configurationsVessels)({
  loaderDeps: ({ search }) => {
    const parsed = commonTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const { page, limit, name } = parsed.data;
    return { page, limit, name };
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
      lastPathSegment
    };
  },

  validateSearch: (search) => {
    const result = commonTableQuerySchema.safeParse(search);
    return result.success ? result.data : {};
  },

  component: ConfigurationVesselsComponent,
});

function ConfigurationVesselsComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsVessels,
  });
 // Combined query for fetching facilities and plots
const { fetchData: facilitiesData } = useCommonQuery({
  rootKey: rootKeys.configurationsVessels,
  search: { page: 1, limit: 1000 },
  path: lastPathSegments.FACILITIES,
});

const { fetchData: plotData } = useCommonQuery({
  rootKey: rootKeys.configurationsVessels,
  search: { page: 1, limit: 1000 },
  path: lastPathSegments.PLOT,
});

// Map through columns once and update meta lists
const updatedColumns = initialVesselsColumns.map((column: any) => {
  switch (column.accessorKey) {
    case "facilityId":
      return { ...column, meta: { ...column.meta, list: facilitiesData?.data.data || [] } };
    case "plotId":
      return { ...column, meta: { ...column.meta, list: plotData?.data || [] } };
    default:
      return column;
  }
});


  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={updatedColumns}
        rootKey={rootKeys.configurationsVessels}
        tableFilters={vesselsTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Vessels"
      />
    </div>
  );
}
