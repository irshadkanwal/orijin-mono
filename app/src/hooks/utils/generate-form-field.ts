import {
  FieldProperty,
  FieldType,
  FormFields,
  FormError,
} from "@/types/custom-form";
import { AccessorKeyColumnDef } from "@tanstack/react-table";

export const columnToFieldMapping: Record<
  string,
  { property: FieldProperty; type: FieldType }
> = {
  text: {
    property: FieldProperty.INPUT,
    type: FieldType.TEXT,
  },
  number: {
    property: FieldProperty.INPUT,
    type: FieldType.NUMBER,
  },
  select: {
    property: FieldProperty.SELECT,
    type: FieldType.TEXT,
  },
  textarea: {
    property: FieldProperty.TEXTAREA,
    type: FieldType.TEXTAREA,
  },
  multiSelect: {
    property: FieldProperty.MULTI_SELECT,
    type: FieldType.TEXT,
  },
  datePicker: {
    property: FieldProperty.DATE_PICKER,
    type: FieldType.DATE,
  },
  email: {
    property: FieldProperty.INPUT,
    type: FieldType.EMAIL,
  },
  password: {
    property: FieldProperty.INPUT,
    type: FieldType.PASSWORD,
  },
  checkbox: {
    property: FieldProperty.CHECKBOX,
    type: FieldType.CHECKBOX,
  },
  locationDropdown: {
    property: FieldProperty.LOCATION_DROPDOWN,
    type: FieldType.TEXT,
  },
};

export interface CustomColumnMeta {
  type?: string;
  list?: { id: string; name: string }[];
  options?: { value: string; label: string }[];
  condition?: {
    field: string;
    values: string[];
    id?: string;
  };
  isHideInForm?: boolean;
  errors?: FormError[];
  isDisabled?: boolean;
  filterFieldId?: string;
  importId?: string;
  isVisible?: boolean;
}
type ColumnType<T> = AccessorKeyColumnDef<T, any> & { meta?: CustomColumnMeta };
const generateFormFieldsFromColumns = <T>(
  columns: ColumnType<T>[],
  data: T | null
): FormFields[] => {
  return columns.map((column) => {
    const columnId = column.accessorKey as keyof T; // Ensure column id is keyof T
    const id = column.id;
    const mapping = columnToFieldMapping[column.meta?.type || "text"] || {
      property: FieldProperty.INPUT,
      type: FieldType.TEXT,
    };
    let defaultValue: string | number | string[] = data
      ? String(data[columnId] ?? "")
      : "";

    if (mapping.type === FieldType.NUMBER) {
      defaultValue = Number(defaultValue);
    }

    if (mapping.property === FieldProperty.SELECT && column.meta?.list) {
      const selectedItem = column.meta.list.find(
        (item) => String(item.name) === defaultValue
      );
      if (selectedItem) {
        defaultValue = selectedItem.id;
      }
    }
    if (mapping.property === FieldProperty.MULTI_SELECT && column.meta?.list) {
      defaultValue = data ? String(data[columnId] ?? "").split(",") : [];
      const selectedItems = defaultValue.map((selectedItem) =>
        column.meta?.list?.find((item) => String(item.name) === selectedItem)
      );
      defaultValue = selectedItems
        .filter((item) => item !== undefined)
        .map((item) => item!.id);
    }
    const field: FormFields = {
      id: String(columnId),
      label: String(id),
      placeholder: `Please provide the ${String(id).toLowerCase()}`,
      property: mapping.property,
      type: mapping.type,
      errors: column?.meta?.errors ?? [FormError.REQUIRED],
      defaultValue: defaultValue,
      list: column.meta?.list || [],
      condition: column.meta?.condition,
      isDisabled: column.meta?.isDisabled,
      filterFieldId: column.meta?.filterFieldId,
    };

    return field;
  });
};

export { generateFormFieldsFromColumns };
