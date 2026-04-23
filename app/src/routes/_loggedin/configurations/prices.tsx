import { ReferenceData } from "@/components/reference/reference-data";
import { initialPricesColumns, pricesTableFilters } from "@/config/prices-column";
import { lastPathSegments, rootKeys } from "@/config/rootKeys"
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute(rootKeys.configurationsPrices)({
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
    component: ConfigurationPriceComponent,
})

function ConfigurationPriceComponent() {
    const { data, lastPathSegment } = useLoaderData({ from: rootKeys.configurationsPrices })
    const { fetchData: productsQuery } = useCommonQuery({ rootKey: rootKeys.configurationsPrices, search: { page: 1, limit: 1000 }, path: lastPathSegments.PRODUCTS });


    const updatedColumns = initialPricesColumns.map((column: any) => {
        if (column.accessorKey === "productId") {
            column.meta.list = productsQuery.data.data;
        }
        return column;
    });

    return (
        <div>
            <ReferenceData
                tableData={data}
                columns={updatedColumns}
                rootKey={rootKeys.configurationsPrices}
                tableFilters={pricesTableFilters}
                tableQuerySchema={commonTableQuerySchema}
                lastPathSegment={lastPathSegment}
                title="Prices"
            />
        </div>
    )
}