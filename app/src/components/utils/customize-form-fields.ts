import {
  FieldProperty,
  FieldType,
  FormError,
  FormFields,
} from "@/types/custom-form";
import {
  areaUnitList,
  filteredCountryCode,
  filteredDialCodesAlpha,
  kilogramUnitList,
  languageList,
  temperatureUnitList,
} from "@/lib/countryCode";

export const formUsernameFields: FormFields[] = [
  {
    id: "name",
    property: FieldProperty.INPUT,
    label: "Enter new name",
    type: FieldType.TEXT, // or FieldType.TEXT
    placeholder: "Enter your name",
    defaultValue: "",
    errors: [FormError.REQUIRED],
  },
];
export const formPasswordFields = [
  {
    id: "oldPassword",
    property: FieldProperty.INPUT,
    label: "Old Password",
    type: FieldType.PASSWORD, // or FieldType.TEXT
    placeholder: "Enter old password",
    defaultValue: "",
    errors: [FormError.REQUIRED],
  },
  {
    id: "password",
    property: FieldProperty.INPUT,
    label: "New Password",
    type: FieldType.PASSWORD, // or FieldType.TEXT
    placeholder: "Enter new password",
    defaultValue: "",
    errors: [FormError.PASSWORD, FormError.REQUIRED],
  },
  {
    id: "confirmPassword",
    property: FieldProperty.INPUT,
    label: "Confirm Password",
    type: FieldType.PASSWORD, // or FieldType.TEXT
    placeholder: "Re-Enter new password",
    defaultValue: "",
    errors: [
      FormError.PASSWORD,
      FormError.REQUIRED,
      FormError.CONFIRM_PASSWORD,
    ],
    confirmPassId: "password",
  },
];

export const columnMetadata = [
  {
    id: "phone Country Code",
    accessorKey: "phoneCountryCode",
    meta: {
      type: "select",
      list: filteredDialCodesAlpha,
    },
  },
  {
    id: "Phone Validation Phone Only Regex",
    accessorKey: "phoneValidationPhoneOnlyRegex",
  },
  {
    id: "Phone Validation Regex",
    accessorKey: "phoneValidationRegex",
  },
  {
    id: "Standard Area Unit",
    accessorKey: "standardAreaUnit",
    meta: {
      type: "select",
      list: areaUnitList,
    },
  },
  {
    id: "standard Area Unit For Import",
    accessorKey: "standardAreaUnitForImport",
    meta: {
      type: "select",
      list: areaUnitList,
    },
  },
  {
    id: "standard Date Format",
    accessorKey: "standardDateFormat",
    meta: {
      type: "select",
      list: [
        { id: "yyyy-mm-dd", name: "yyyy-mm-dd" },
        { id: "mm/dd/yyyy", name: "mm/dd/yyyy" },
        { id: "dd/mm/yyyy", name: "dd/mm/yyyy" },
        { id: "yyyy/mm/dd", name: "yyyy/mm/dd" },
        { id: "dd-mm-yyyy", name: "dd-mm-yyyy" },
        { id: "mm-dd-yyyy", name: "mm-dd-yyyy" },
        { id: "yyyy-mm-dd hh:mm:ss", name: "yyyy-mm-dd hh:mm:ss" },
        { id: "dd MMM yyyy", name: "dd MMM yyyy" },
        { id: "MMM dd, yyyy", name: "MMM dd, yyyy" },
        { id: "yyyy-MM-ddTHH:mm:ssZ", name: "yyyy-MM-ddTHH:mm:ssZ" },
        { id: "dd/LL/yy", name: "dd/LL/yy" }, // Added based on provided data
      ],
    },
  },
  {
    id: "standard Date Time Format",
    accessorKey: "standardDateTimeFormat",
    meta: {
      type: "select",
      list: [
        { id: "yyyy-mm-ddTHH:mm:ss", name: "yyyy-mm-ddTHH:mm:ss" },
        { id: "mm/dd/yyyy hh:mm:ss a", name: "mm/dd/yyyy hh:mm:ss a" },
        { id: "dd/mm/yyyy HH:mm:ss", name: "dd/mm/yyyy HH:mm:ss" },
        { id: "yyyy-mm-dd HH:mm:ss", name: "yyyy-mm-dd HH:mm:ss" },
        { id: "yyyy/mm/dd HH:mm:ss", name: "yyyy/mm/dd HH:mm:ss" },
        { id: "dd-MM-yyyy HH:mm:ss", name: "dd-MM-yyyy HH:mm:ss" },
        { id: "MMM dd, yyyy hh:mm:ss a", name: "MMM dd, yyyy hh:mm:ss a" },
        { id: "yyyy-MM-ddTHH:mm:ssZ", name: "yyyy-MM-ddTHH:mm:ssZ" },
        { id: "yyyy-MM-ddTHH:mm:ss.SSS", name: "yyyy-MM-ddTHH:mm:ss.SSS" },
        { id: "dd MMM yyyy, HH:mm:ss", name: "dd MMM yyyy, HH:mm:ss" },
        { id: "dd/LL/yy HH:mm", name: "dd/LL/yy HH:mm" }, // Added based on provided data
      ],
    },
  },
  {
    id: "standard Rounding",
    accessorKey: "standardRounding",
    meta: {
      type: "select",
      list: [
        { id: "0", name: "0" },
        { id: "1", name: "1" },
        { id: "2", name: "2" },
        { id: "3", name: "3" },
        { id: "4", name: "4" },
      ],
      errors: [FormError.REQUIRED, FormError.NUMBER],
    },
  },
  {
    id: "standard Weight Unit",
    accessorKey: "standardWeightUnit",
    meta: {
      type: "select",
      list: kilogramUnitList,
    },
  },
  {
    id: "Test Workspace (eg: org_test)",
    accessorKey: 'testWorkspace',
    meta: {
      errors: [],
    },
   },
  {
    id: "Master Workspace (eg: org_master)",
    accessorKey: 'masterWorkspace',
    meta: {
      errors: [],
    }
  },
];

export const locality = [
  {
    id: "available Currency Units",
    accessorKey: "availableCurrencyUnits",
  },
  {
    id: "available Locales",
    accessorKey: "availableLocales",
    meta: {
      type: "select",
      list: languageList,
      errors: [FormError.REQUIRED],
    },
  },
  {
    id: "available Temperature Units",
    accessorKey: "availableTemperatureUnits",
    meta: {
      type: "select",
      list: temperatureUnitList,
      errors: [FormError.REQUIRED],
    },
  },
  {
    id: "available Weight Units",
    accessorKey: "availableWeightUnits",
    meta: {
      type: "select",
      list: kilogramUnitList,
      errors: [FormError.REQUIRED],
    },
  },
  {
    id: "default Country",
    accessorKey: "defaultCountry",
  },
  {
    id: "default Country Code",
    accessorKey: "defaultCountryCode",
    meta: {
      type: "select",
      list: filteredCountryCode,
      errors: [FormError.REQUIRED],
    },
  },
  {
    id: "default Currency Unit",
    accessorKey: "defaultCurrencyUnit",
  },
  {
    id: "default Locale",
    accessorKey: "defaultLocale",
    meta: {
      type: "select",
      list: languageList,
      errors: [FormError.REQUIRED],
    },
  },
  {
    id: "default Temperature Unit",
    accessorKey: "defaultTemperatureUnit",
    meta: {
      type: "select",
      list: temperatureUnitList,
      errors: [FormError.REQUIRED],
    },
  },
  {
    id: "default Weight Unit",
    accessorKey: "defaultWeightUnit",
    meta: {
      type: "select",
      list: kilogramUnitList,
      errors: [FormError.REQUIRED],
    },
  },
];