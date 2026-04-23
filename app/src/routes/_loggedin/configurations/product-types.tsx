import { ReferenceData } from "@/components/reference/reference-data";
import { initialProductTypesColumns, productTypesTableFilters } from "@/config/products-column";
import { lastPathSegments, rootKeys } from "@/config/rootKeys"
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute(rootKeys.configurationsProductTypes)({
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
    component: ConfigurationProductTypeComponent,
})

function ConfigurationProductTypeComponent() {
    const { data, lastPathSegment } = useLoaderData({ from: rootKeys.configurationsProductTypes })
    const { fetchData: cropsQuery } = useCommonQuery({ rootKey: rootKeys.configurationsProductTypes, search: { page: 1, limit: 1000 }, path: lastPathSegments.CROPS });
    const updatedColumns = initialProductTypesColumns.map((column: any) => {
        if (column.accessorKey === "cropId") {
            column.meta.list = cropsQuery.data.data;
        }
        return column;
    });
    return (
        <div>
            <ReferenceData
                tableData={data}
                columns={updatedColumns}
                rootKey={rootKeys.configurationsProductTypes}
                tableFilters={productTypesTableFilters}
                tableQuerySchema={commonTableQuerySchema}
                lastPathSegment={lastPathSegment}
                title="Product Types"
            />
        </div>
    )
}