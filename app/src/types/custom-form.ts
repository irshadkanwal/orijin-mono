export enum FieldProperty {
  INPUT = "input",
  TEXTAREA = "textarea",
  SELECT = "select",
  MULTI_SELECT = "multi-select",
  DATE_PICKER = "date-picker",
  LOCATION_DROPDOWN = "location-dropdown",
  CHECKBOX = "checkbox",
  PASSWORD = "password",
}

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  TEXTAREA = "textarea",
  EMAIL = "email",
  PASSWORD = "password",
  CHECKBOX = "checkbox",
}

export enum FormError {
  REQUIRED = "required",
  EMAIL = "email",
  MIN = "min",
  MAX = "max",
  NUMBER = "number",
  PASSWORD = "password",
  CONFIRM_PASSWORD = "confirmPassword",
}

export interface FormFields {
  id: string;
  label: string;
  placeholder?: string;
  property: FieldProperty;
  type?: FieldType;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  defaultValue?: string | number | string[];
  list?: {
    id: string;
    name: string;
    formattedData?: string;
    shortCode?: string;
  }[];
  errors: FormError[];
  isDisabled?: boolean;
  condition?: {
    field: string;
    values: string[];
    id?: string;
  };
  filterFieldId?: string;
  confirmPassId?: string;
}

export interface ExcludeField {
  name: string;
  value: string;
  fieldDependsOn?: string;
}

export interface IFormProps {
  formFields: FormFields[];
  isLoading: boolean;
  onSubmit: (data: any) => void;
  data?: any;
  customForm?: React.ReactNode;
}
