import { Product, ProductType } from "@/types/product";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createColumns } from "./common-columns";
import { DataTableFilter } from "@/components/table/datatable-types";


// PRODUCT TYPES COLUMNS
export const productTypesColumnHelper: ColumnHelper<ProductType> = createColumnHelper<ProductType>();

export const initialProductTypesColumns = createColumns(productTypesColumnHelper, {
    cropId: {
        id: "Crop Name",
        header: "Crop Name",
        cell: (cell: any) => cell.row.original?.crop?.name,
        meta: {
            type: "select",
            list: [],
            errors: [],
            importId: "cropCode"
        },
    },

});

export const productTypesTableFilters: DataTableFilter[] = [...commonFilters];


export const productColumnHelper: ColumnHelper<Product> = createColumnHelper<Product>();

export const initialProductsColumns = createColumns(productColumnHelper, {
    sku: {
        id: "SKU",
        header: "SKU",
        meta: {
            type: "text",
            errors: [],
        },
    },
    description: {
        id: "Description",
        header: "Description",
        meta: {
            type: "text",
            errors: [],
        },
    },
    productTypeId: {
        id: "Product Type",
        header: "Product Type",
        cell: (cell: any) => cell.row.original.productType.name,
        meta: {
            type: "select",
            list: [],
            importId: "productTypeCode"
        },
    },
    originVarietyId: {
        id: "Origin Variety",
        header: "Origin Variety",
        cell: (cell: any) => cell.row.original.originVariety.name,
        meta: {
            type: "select",
            list: [],
            importId: "cropVarietyCodes"
        },
    },
    originLocationId: {
        id: "Origin Location",
        header: "Origin Location",
        cell: (cell: any) => cell.row.original.originLocation.name,
        meta: {
            type: "select",
            list: [],
            importId: "originLocationCodes"
        },
    },
    grade: {
        id: "Grade",
        header: "Grade",
        cell: (cell: any) => cell.row.original.grade,
        meta: {
            type: "number",
            errors: [],
        },
    },
    organic: {
        id: "Organic",
        header: "Organic",
        meta: {
            type: "checkbox",
            errors: [],
        },
    },
    singleOrigin: {
        id: "Single Origin",
        header: "Single Origin",
        meta: {
            type: "checkbox",
            errors: [],
        },
    }
})

export const productsTableFilters: DataTableFilter[] = [...commonFilters];