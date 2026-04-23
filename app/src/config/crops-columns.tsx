import { DataTableFilter } from "@/components/table/datatable-types";
import { Crop, CropVariety } from "@/types/crops";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createColumns } from "./common-columns";

// CROPS COLUMNS
export const cropsColumnHelper: ColumnHelper<Crop> = createColumnHelper<Crop>();

export const initialCropsColumns = createColumns(cropsColumnHelper);

export const cropsTableFilters: DataTableFilter[] = [...commonFilters];

// CROP VARIETIES COLUMNS

export const cropVarietiesColumnHelper: ColumnHelper<CropVariety> =
    createColumnHelper<CropVariety>();

export const initialCropVarietiesColumns = createColumns(cropVarietiesColumnHelper, {
    cropId: {
        id: "Crop Name",
        header: "Crop Name",
        cell: (cell: any) => cell.row.original.crop.name,
        meta: {
            type: "select",
            list: [],
            importId: "cropCode"
        },
    },
    description: {
        id: "description",
        meta: {
            errors: [],
        },
    },
});

export const cropVarietiesTableFilters: DataTableFilter[] = [...commonFilters];
