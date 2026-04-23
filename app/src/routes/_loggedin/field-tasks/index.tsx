import { rootKeys } from "@/config/rootKeys";
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { FieldTasksBreadCrumb } from "@/components/field-tasks/bread-crumb";
import {
  fetchColumnsQueryOptions,
  fetchDocumentsQueryOptions,
  fetchWorkspacesQueryOptions,
} from "@/services/firebase-service";
import { Card } from "@/components/ui/card";
import { fieldTaskQuerySchema } from "@/types/field-task";
import { DataTable } from "@/components/table/datatable";
import {
  transformBackendColumns,
  transformBackendFilters,
} from "@/config/firebase-v1-config";
import { generateDynamicColumns } from "@/components/utils/generate-columns-from-data";

export const Route = createFileRoute(rootKeys.fieldTasks)({
  loaderDeps: ({ search }) => {
    const parsedQuery = fieldTaskQuerySchema.safeParse(search);
    if (!parsedQuery.success) {
      throw new Error("Invalid search parameters");
    }
    return { ...parsedQuery.data };
  },
  loader: async ({ deps, context }) => {
    const { queryClient, auth } = context;

    const workspacePromise = queryClient.ensureQueryData(
      fetchWorkspacesQueryOptions(
        auth.organisations.current,
        `/firebase/workspaces`,
        auth.currentUser?.accessToken
      )
    );

    const documentsPromise = queryClient.ensureQueryData(
      fetchDocumentsQueryOptions(
        "/firebase/documents",
        deps,
        auth.currentUser?.accessToken
      )
    );
    let columnsPromise;
    if (deps.collection) {
      columnsPromise = queryClient.ensureQueryData(
        fetchColumnsQueryOptions(
          "/firebase/collection-columns",
          `${deps.collection}`,
          auth.currentUser?.accessToken
        )
      );
    }

    const [workspaces, documents, columns] = await Promise.all([
      workspacePromise,
      documentsPromise,
      columnsPromise,
    ]);

    let filters;
    let renderedColumns;

    if (columns?.columns.length > 0) {
      renderedColumns = transformBackendColumns(columns?.columns);
      filters = transformBackendFilters(columns?.filters);
    }
    if (documents.data.length > 0) {
      renderedColumns = generateDynamicColumns(documents.data);
    }

    return {
      workspaces,
      documents,
      search: deps,
      columns: renderedColumns,
      filters,
    };
  },
  component: FieldTasksIndexComponent,
});

function FieldTasksIndexComponent() {
  const { workspaces, documents, search, columns, filters } = useLoaderData({
    from: rootKeys.fieldTasks,
  });
  const navigate = useNavigate({ from: Route.fullPath });

  const updateWorkspaceAndCollectionParams = (
    workspace: string,
    collection: string
  ) => {
    navigate({
      search: {
        workspace,
        collection,
      },
    });
  };

  const tableTabName = `${search.workspace}-${search.collection}`;
  return (
    <div className="p-4">
      <Card className="p-2 w-fit mb-4">
        <FieldTasksBreadCrumb
          workspaces={workspaces || []}
          search={search}
          onNavigate={updateWorkspaceAndCollectionParams}
        />
      </Card>
      {documents.data && documents.data.length > 0 ? (
        <DataTable
          data={documents.data}
          count={documents.count || 10}
          columns={columns || []}
          searchFrom={rootKeys.fieldTasks}
          filters={filters || []}
          tableQuerySchema={fieldTaskQuerySchema}
          fields={[]}
          isFiltrationActive={true}
          tab={tableTabName}
        ></DataTable>
      ) : (
        <></>
      )}
    </div>
  );
}
