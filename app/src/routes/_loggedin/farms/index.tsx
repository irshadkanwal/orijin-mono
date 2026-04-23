import {
  createFileRoute,
  useLoaderData,
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { DataTable } from "@/components/table/datatable.tsx";
import { farmsQueryOptions } from "@/services/farm-service.ts";
import type { FarmsTableQuery } from "@/types/farms-types.ts";
// eslint-disable-next-line no-duplicate-imports
import { farmsTableQuerySchema } from "@/types/farms-types.ts";
import { rootKeys } from "@/config/rootKeys";
import {
  farmsTableColumns,
  updateTableFilters,
} from "@/config/farms-column.tsx";
import "./farms.style.css";
import { useCallback } from "react";
import {
  Tabs as FarmTabType,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { filtersQueryOptions } from "@/services/filters-service";
import {
  useTransformFarmsForMap,
  useExtractFarmMapData,
} from "@/components/utils/process-farm-data";
import PlotsTable from "@/components/farms/farm-plots-tab";
import { PageTitle } from "@/components/page-title";
import { useQuery } from "@tanstack/react-query";
import { DataTableToolbar } from "@/components/table/datatable-toolbar";
import { MapDataSetter } from "@/components/map/map-data-setter";

const FarmTab = {
  FARMS: "farms",
  PLOTS: "plots",
  MAP: "map",
} as const;

type FarmTabType = (typeof FarmTab)[keyof typeof FarmTab];

export const Route = createFileRoute(rootKeys.farms)({
  loaderDeps: ({ search }: { search: FarmsTableQuery }) => {
    const parsed = farmsTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      console.warn("Invalid search parameters", parsed.error);
      throw new Error("Invalid search parameters");
    }
    return { ...parsed.data };
  },

  loader: async ({ deps, context }) => {
    const { queryClient, auth } = context;

    const farmsPromise = queryClient.ensureQueryData(
      farmsQueryOptions(
        auth.organisations.current,
        deps,
        auth.currentUser?.accessToken
      )
    );

    const filtersPromise = queryClient.ensureQueryData(
      filtersQueryOptions(
        "farms",
        auth.organisations.current,
        auth.currentUser?.accessToken
      )
    );

    const [farms, filters] = await Promise.all([farmsPromise, filtersPromise]);

    // filter the filters to only include the ones we want
    const filterList = [
      "shortCode",
      "location",
      "customLocation",
      "seasonCode",
      "polygonStatus",
      "deforestation",
      "updatedWithin",
    ];

    const farmFilters = updateTableFilters(filters, filterList);
    return { farms, filters: farmFilters };
  },

  component: FarmsIndexComponent,
});

function FarmsIndexComponent() {
  const { auth } = useRouteContext({ from: rootKeys.farms });
  const { farms, filters } = useLoaderData({
    from: rootKeys.farms,
  });

  const activeTab: FarmTabType = useSearch({
    from: rootKeys.farms,
    select: (search) =>
      search.tab && Object.values(FarmTab).includes(search.tab)
        ? (search.tab as FarmTabType)
        : FarmTab.FARMS,
  });

  const search = useSearch({ from: rootKeys.farms });
  const navigate = useNavigate();
  const handleTabChange = useCallback(
    (tab: string) => {
      void navigate({
        search: (search) => ({ ...search, tab }),
      });
    },
    [navigate]
  );

  const { data: farmsForMap } = useQuery(
    farmsQueryOptions(
      auth.organisations.current,
      { ...search, minimalResults: true, page: 1, limit: 9999 },
      auth.currentUser?.accessToken
    )
  );

  const transformedData = useTransformFarmsForMap(farmsForMap?.data ?? []);
  const mapData = useExtractFarmMapData(transformedData);
  return (
    <>
      <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-6 lg:grid-cols-1 xl:grid-cols-1">
        <PageTitle title={"Farms"} />
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <FarmTabType
            value={activeTab}
            onValueChange={(e) => {
              handleTabChange(e);
            }}
          >
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value={FarmTab.FARMS}>List as Farms</TabsTrigger>
                <TabsTrigger value={FarmTab.PLOTS}>List as Plots</TabsTrigger>
                <TabsTrigger value={FarmTab.MAP}>View Map</TabsTrigger>
              </TabsList>
            </div>
            <div>
              <TabsContent value={FarmTab.FARMS}>
                <DataTable
                  columns={farmsTableColumns(filters)}
                  data={farms.data}
                  count={farms.count || 0}
                  searchFrom={rootKeys.farms}
                  filters={filters}
                  tableQuerySchema={farmsTableQuerySchema}
                  fields={["shortCode", "location"]}
                  isFiltrationActive={true}
                  tab={FarmTab.FARMS}
                />
              </TabsContent>
              <TabsContent value={FarmTab.PLOTS}>
                <PlotsTable
                  tab={FarmTab.PLOTS}
                  farms={farms.data}
                  count={farms.count || 0}
                  filters={filters.filter((f) => f.key === "seasonCode")}
                />
              </TabsContent>
              <TabsContent value={FarmTab.MAP}>
                <div className="grid auto-rows-max items-start gap-2 md:gap-4 lg:col-span-2">
                  <DataTableToolbar
                    searchFrom={rootKeys.farms}
                    filters={filters}
                    tableQuerySchema={farmsTableQuerySchema}
                  />
                  <MapDataSetter mapData={mapData} isBigMap={true} />
                </div>
              </TabsContent>
            </div>
          </FarmTabType>
        </div>
      </main>
    </>
  );
}
