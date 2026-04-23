import { ReferenceData } from "@/components/reference/reference-data";
import { locationsTableColumns, locationsTableFilters } from "@/config/locations-column";
import { rootKeys } from "@/config/rootKeys"
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute(rootKeys.configurationsLocations)({
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
        const lastPathSegment: string = location.pathname.split('/').filter(Boolean).pop() ?? '';
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
        }
    },
    validateSearch: (search) => {
        const result = commonTableQuerySchema.safeParse(search);
        return result.success ? result.data : {};
    },
    component: ConfigurationLocationComponent,
})

function ConfigurationLocationComponent() {
    const { data, lastPathSegment } = useLoaderData({ from: rootKeys.configurationsLocations })
    const updatedColumns = locationsTableColumns.map((column: any) => {
        if (column.accessorKey === "parentId") {
            column.meta.list = data.data.map((location) => ({
                id: location.id,
                name: location.name,
            }));
        }
        return column;
    });

    return (
        <div>
            <ReferenceData
                tableData={data}
                columns={updatedColumns}
                rootKey={rootKeys.configurationsLocations}
                tableFilters={locationsTableFilters}
                tableQuerySchema={commonTableQuerySchema}
                lastPathSegment={lastPathSegment}
                title="Locations"
            />
        </div>
    )
}