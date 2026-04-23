import { ReferenceData } from "@/components/reference/reference-data";
import { initialProductsColumns, productsTableFilters } from "@/config/products-column";
import { lastPathSegments, rootKeys } from "@/config/rootKeys"
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute(rootKeys.configurationsProducts)({
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
    component: ConfigurationProductComponent,
})

function ConfigurationProductComponent() {
    const { data, lastPathSegment } = useLoaderData({ from: rootKeys.configurationsProducts })
    const { fetchData: productTypesQuery } = useCommonQuery({ rootKey: rootKeys.configurationsProducts, search: { page: 1, limit: 1000 }, path: lastPathSegments.PRODUCT_TYPES })
    const { fetchData: cropVariestiesQuery } = useCommonQuery({ rootKey: rootKeys.configurationsProducts, search: { page: 1, limit: 1000 }, path: lastPathSegments.CROP_VARIETIES })
    const { fetchData: locationsQuery } = useCommonQuery({ rootKey: rootKeys.configurationsProducts, search: { page: 1, limit: 1000 }, path: lastPathSegments.LOCATIONS })
    const updatedColumns = initialProductsColumns.map((column: any) => {
        if (column.accessorKey === "productTypeId") {
            column.meta.list = productTypesQuery.data.data;
        } else if (column.accessorKey === "originVarietyId") {
            column.meta.list = cropVariestiesQuery.data.data;
        } else if (column.accessorKey === "originLocationId") {
            column.meta.list = locationsQuery.data.data;
        }
        return column;
    });
    return (
        <div>
            <ReferenceData
                tableData={data}
                columns={updatedColumns}
                rootKey={rootKeys.configurationsProducts}
                tableFilters={productsTableFilters}
                tableQuerySchema={commonTableQuerySchema}
                lastPathSegment={lastPathSegment}
                title="Products"
            />
        </div>
    )
}