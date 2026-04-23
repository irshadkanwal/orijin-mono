import { ReferenceData } from "@/components/reference/reference-data";
import {
  facilityTableFilters,
  initialFacilityColumns,
} from "@/config/facilities-column";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
interface QueryParams {
  page?: number;
  limit?: number;
  notFarm?: boolean; // Use '?' to make this property optional
}
export const Route = createFileRoute(rootKeys.configurationsFacilities)({
  loaderDeps: ({ search }) => {
    let queryParams: QueryParams = search;
    // Adding notFarm property
    queryParams.notFarm = true;
    const parsed = commonTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const { page, limit, name, notFarm } = parsed.data;
    return { page, limit, name, notFarm };
  },

  loader: async ({ deps, context, location }) => {
    // Extract the last path segment
    const lastPathSegment: string =
      location.pathname.split("/").filter(Boolean).pop() ?? "";
    const { queryClient, auth } = context;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    let data = await queryClient.ensureQueryData(
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

  component: ConfigurationFacilitiesComponent,
});

function ConfigurationFacilitiesComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsFacilities,
  });
  const { fetchData: locationData } = useCommonQuery({
    rootKey: rootKeys.configurationsFacilities,
    search: { page: 1, limit: 1000 },
    path: lastPathSegments.LOCATIONS,
  });

  const { fetchData: personData } = useCommonQuery({
    rootKey: rootKeys.configurationsFacilities,
    search: { page: 1, limit: 1000 },
    path: lastPathSegments.PERSON,
  });
  // Map through columns once and update meta lists
  const updatedColumns = initialFacilityColumns.map((column: any) => {
    switch (column.accessorKey) {
      case "locationId":
        let locations = locationData?.data.data
          .filter((d: any) => {
            return d?.mainType === "GLOBAL";
          })
        return {
          ...column,
          meta: { ...column.meta, list: locations || [] },
        };
        case "customLocationId":
          let customLocations = locationData?.data.data
            .filter((d: any) => {
              return d?.mainType === "CUSTOM";
            })
          return {
            ...column,
            meta: { ...column.meta, list: customLocations || [] },
          };
      case "mainContactPersonId":
        let persons = personData?.data.data.map((person: any) => ({
          id: person?.id,
          name: person?.firstName + " " + person?.lastName,
        }));
        return {
          ...column,
          meta: { ...column.meta, list: persons || [] },
        };
      default:
        return column;
    }
  });

  return (
    <div>
      <ReferenceData
        tableData={data}
        columns={updatedColumns}
        rootKey={rootKeys.configurationsFacilities}
        tableFilters={facilityTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Facilities"
      />
    </div>
  );
}
