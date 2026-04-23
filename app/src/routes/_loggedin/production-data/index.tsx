import { DataTable } from "@/components/table/datatable";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { generateDynamicColumns } from "@/components/utils/generate-columns-from-data";
import {
  transformBackendColumns,
  transformBackendFilters,
} from "@/config/firebase-v1-config";
import { rootKeys } from "@/config/rootKeys";
import { useTabHandler } from "@/hooks/use-tab-handler";
import {
  fetchColumnsQueryOptions,
  fetchDocumentsQueryOptions,
} from "@/services/firebase-service";
import { tableFilterQuerySchema } from "@/types/table-filter";
import { TabsContent } from "@radix-ui/react-tabs";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { z } from "zod";

const ProdQuerySchema = tableFilterQuerySchema
  .extend({
    workspace: z.string().optional(),
    collection: z.string().optional(),
    tab: z.string().default("prodlots"),
  })
  .catchall(z.any());
type ProdQuery = z.output<typeof ProdQuerySchema>;
export const Route = createFileRoute(rootKeys.productionData)({
  loaderDeps: ({ search }: { search: ProdQuery }) => {
    const parsed = ProdQuerySchema.safeParse(search);
    if (!parsed.success) {
      console.warn("Invalid search parameters", parsed.error);
      throw new Error("Invalid search parameters");
    }
    return { ...parsed.data };
  },

  loader: async ({ deps, context }) => {
    const { queryClient, auth } = context;
    const currentTab = deps.tab ? deps.tab : "prodlots";
    const workspace = `${auth.organisations.current}_master`;
    const depsWithOrg = {
      workspace: workspace,
      collection: currentTab,
      ...deps,
    };
    const documentsPromise = queryClient.ensureQueryData(
      fetchDocumentsQueryOptions(
        "/firebase/documents",
        depsWithOrg,
        auth.currentUser?.accessToken
      )
    );

    const columnsPromise = queryClient.ensureQueryData(
      fetchColumnsQueryOptions(
        "/firebase/collection-columns",
        `${currentTab}`,
        auth.currentUser?.accessToken
      )
    );

    const [documents, columns] = await Promise.all([
      documentsPromise,
      columnsPromise,
    ]);

    // if we have column that means we have the display
    // definition on the backend
    let filters;
    let renderedColumns;
    const typedColumns = columns as { columns: any[]; filters: any[] };
    if (typedColumns.columns.length > 0) {
      renderedColumns = transformBackendColumns(typedColumns.columns);
      filters = transformBackendFilters(typedColumns.filters);
    }
    if (typedColumns.columns.length < 1 && documents.data.length > 0) {
      renderedColumns = generateDynamicColumns(documents.data);
    }
    return { documents, filters, columns: renderedColumns };
  },
  component: ProductionDataComponent,
});

const ProdTabs = {
  PRODLOTS: "prodlots",
  LOTSECTIONS: "lotsections",
  PAYMENTTRANSACTIONS: "paymentTransactions",
};

function ProductionDataComponent() {
  const { columns, documents, filters } = useLoaderData({
    from: rootKeys.productionData,
  });
  const { activeTab, handleTabChange } = useTabHandler(
    ProdTabs,
    ProdTabs.PRODLOTS,
    rootKeys.productionData
  );
  return (
    <main className="p-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value={ProdTabs.PRODLOTS}>Production Lots</TabsTrigger>
          <TabsTrigger value={ProdTabs.LOTSECTIONS}>Lot Sections</TabsTrigger>
          <TabsTrigger value={ProdTabs.PAYMENTTRANSACTIONS}>
            Payment Transaction
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <DataTable
            searchFrom={rootKeys.productionData}
            data={documents.data || []}
            count={documents.count || 10}
            columns={columns || []}
            filters={filters || []}
            fields={[]}
            key={activeTab}
            isFiltrationActive={true}
            tableQuerySchema={ProdQuerySchema}
            tab={activeTab}
            isV1DataTable={true}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
