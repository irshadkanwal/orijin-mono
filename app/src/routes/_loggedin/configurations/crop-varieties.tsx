import { ReferenceData } from "@/components/reference/reference-data";
import { cropVarietiesTableFilters, initialCropVarietiesColumns } from "@/config/crops-columns";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(rootKeys.configurationsCropVarieties)({
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
    component: CropVarietyComponent,
});
function CropVarietyComponent() {
    const { data, lastPathSegment } = useLoaderData({ from: rootKeys.configurationsCropVarieties })
    const { fetchData: cropsQuery } = useCommonQuery({ rootKey: rootKeys.configurationsCropVarieties, search: { page: 1, limit: 1000 }, path: lastPathSegments.CROPS });

    const updatedColumns = initialCropVarietiesColumns.map((column: any) => {
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
                rootKey={rootKeys.configurationsCropVarieties}
                tableFilters={cropVarietiesTableFilters}
                tableQuerySchema={commonTableQuerySchema}
                lastPathSegment={lastPathSegment}
                title="Crop Varieties"
            />
        </div>
    )
}