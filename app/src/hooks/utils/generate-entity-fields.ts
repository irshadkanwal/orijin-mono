import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { CustomColumnMeta } from "./generate-form-field";
import { CustomEntityField } from "@/types/custom-entity-fields";

type ColumnType<T> = AccessorKeyColumnDef<T, any> & { meta?: CustomColumnMeta };
export const generateEntityFieldsFromColumns = <T>(
  columns: ColumnType<T>[]
): CustomEntityField[] => {
  return columns.map((column) => {
    const key = column.meta?.importId ?? (column.accessorKey as keyof T); // Ensure column id is keyof T
    const label = column.id;
    return {
      label: String(label),
      key: String(key),
      fieldType: {
        type: "input",
      },

      validations: column?.meta?.errors?.map((error) => ({
        rule: error,
        errorMessage: `Please provide the ${String(key).toLowerCase()}`,
        level: "error",
        validate: (value: any) => value.length > 0,
      })),
    };
  });
};
