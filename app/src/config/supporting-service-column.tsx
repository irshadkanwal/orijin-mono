import { DataTableFilter } from "@/components/table/datatable-types";
import {
  AgeStatus,
  calculateAge,
  calculateThePercentageOfGender,
  calculateTheStatusOfAge,
  countAgeGroups,
  formatDate,
  getAllFacilitySize,
  getUniqueParentNamesOfCustomLocation,
  getUniquePersonNames,
  ParentLevels,
} from "@/lib/utils";
import {
  SupportServiceActivity,
  SupportServiceActivityType,
  SupportServiceBeneficiary,
  SupportServiceCategory,
  SupportServiceCategoryType,
  SupportServiceInputType,
} from "@/types/support-service";
import { Link } from "@tanstack/react-router";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { tablePathSegments } from "./rootKeys";
import {
  ActivityType,
  BeneficiaryTypeEnum,
} from "@/types/support-service-types";
import { createWithoutCommonColumns } from "./common-columns";
import { FormError } from "@/types/custom-form";

export const serviceActivityColumnHelper: ColumnHelper<SupportServiceActivity> =
  createColumnHelper<SupportServiceActivity>();

export const initialServiceActivityColumns = createWithoutCommonColumns(
  serviceActivityColumnHelper,
  {
    shortCode: {
      id: "Code",
      header: "Code",
      meta: {
        errors: [],
      },
    },
    supportingServiceCategoryTypeId: {
      id: "Service Type",
      header: "Service Type",
      cell: (cell: any) => {
        return (
          <Link
            to={tablePathSegments.CATEGORY_TYPES}
            search={{
              shortCode:
                cell.row.original.supportingServiceCategoryType?.shortCode || 'MISSING',
            }}
            className="underline text-blue-500"
          >
            {cell.row.original.supportingServiceCategoryType?.name}
          </Link>
        );
      },
      meta: {
        errors: [FormError.REQUIRED],
        type: "select",
        list: [],
        importId: "supportingServiceCategoryTypeCode",
      },
    },
    supportingServiceCategoryId: {
      id: "Program",
      header: "Program",
      cell: (cell: any) => {
        return (
          <Link
            to={tablePathSegments.CATEGORIES}
            search={{
              shortCode: cell.row.original.supportingServiceCategory.shortCode,
            }}
            className="underline text-blue-500"
          >
            {cell.row.original.supportingServiceCategory.name}
          </Link>
        );
      },
      meta: {
        type: "select",
        errors: [FormError.REQUIRED],
        list: [],
        isDisabled: true,
        filterFieldId: "supportingServiceCategoryTypeId",
      },
    },
    supportingServiceInputTypeId: {
      id: "Input Type",
      header: "Input Type",
      cell: (cell: any) => {
        return (
          <Link
            to={tablePathSegments.INPUT_TYPES}
            search={{
              shortCode:
                cell.row.original.supportingServiceInputType?.shortCode,
            }}
            className="underline text-blue-500"
          >
            {cell.row.original.supportingServiceInputType?.name}
          </Link>
        );
      },
      meta: {
        type: "select",
        errors: [FormError.REQUIRED],
        list: [],
        importId: "supportingServiceInputTypeCode",
        filterFieldId: "supportingServiceCategoryId",
        isVisible: false,
      },
    },
    supportingServiceActivityTypeId: {
      id: "Activity Type",
      header: "Activity Type",
      cell: (cell: any) => {
        return (
          <Link
            to={tablePathSegments.ACTIVITY_TYPES}
            search={{
              shortCode:
                cell.row.original.supportingServiceActivityType?.shortCode,
            }}
            className="underline text-blue-500"
          >
            {cell.row.original.supportingServiceActivityType?.name}
          </Link>
        );
      },
      meta: {
        type: "select",
        errors: [FormError.REQUIRED],
        list: [],
        isDisabled: true,
        filterFieldId: "supportingServiceCategoryId",
        importId: "supportingServiceActivityTypeCode",
        isVisible: false,
      },
    },
    farmerGroupIds: {
      id: "Farmer Group",
      header: "Farmer Group",
      cell: (cell: any) =>
        getUniqueParentNamesOfCustomLocation(
          ParentLevels.LEVEL_0,
          cell.row.original.serviceActivityLocations
        ),
      meta: {
        type: "multiSelect",
      },
    },
    personIds: {
      id: "Farmers",
      header: "Farmers",
      cell: (cell: any) =>
        getUniquePersonNames(cell.row.original.ServiceActivityBeneficiaries),
      meta: {
        type: "multiSelect",
        isDisabled: true,
        filterFieldId: "farmerGroupIds",
      },
    },
    itemsProcessed: {
      id: "Items Processed",
      header: "Items Processed",
      meta: {
        type: "number",
        errors: [],
      },
    },
    itemValue: {
      id: "Item Value",
      header: "Item Value",
      meta: {
        type: "number",
        errors: [],
      },
    },
    score: {
      id: "Score",
      meta: {
        type: "number",
        errors: [],
      },
    },
    total: {
      id: "Total",
      meta: {
        type: "number",
        errors: [],
      },
    },
    operator: {
      id: "Operator",
      cell: (cell: any) => {
        return (
          <Link to={"/supporting-services/" + cell.row.original.id}>
            {cell.getValue()}
          </Link>
        );
      },
    },
    locationId: {
      id: "Location",
      header: "Location",
      cell: (cell: any) => cell.row.original.location?.name,
      meta: {
        type: "select",
        errors: [],
        importId: "locationCode",
      },
    },
    locationCode: {
      id: "Location Code",
      header: "Location Code",
      cell: (cell: any) => cell.row.original.location?.shortCode,

      meta: {
        isHideInForm: true,
      },
    },
    dateOfService: {
      id: "Date of Service",
      header: "Date of Service",
      cell: (cell: any) => formatDate(cell.getValue()),
      meta: {
        type: "datePicker",
      },
    },

    description: {
      id: "Description",
      meta: {
        errors: [],
      },
    },
    beneficiaryCount: {
      id: "Beneficiary Count",
      header: "Beneficiary Count",
      cell: (cell: any) =>
        cell.row.original.ServiceActivityBeneficiaries?.length,
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
    femaleCount: {
      id: "Female Count",
      header: "Female Count",
      cell: (cell: any) =>
        cell.row.ServiceActivityBeneficiaries?.filter(
          (beneficiary: any) =>
            beneficiary.person.gender.toLowerCase() === "female"
        ).length,
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
    maleCount: {
      id: "Male Count",
      header: "Male Count",
      cell: (cell: any) =>
        cell.row.ServiceActivityBeneficiaries?.filter(
          (beneficiary: any) =>
            beneficiary.person.gender.toLowerCase() === "male"
        ).length,
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
    femalePercentage: {
      id: "Female %",
      header: "Female %",
      cell: (cell: any) =>
        calculateThePercentageOfGender(
          "female",
          cell.row.original.ServiceActivityBeneficiaries
        ) + "%",
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
    youthCountPercentage: {
      id: "Youth Count + %",
      header: "Youth Count + %",
      cell: (cell: any) => {
        const { count, percentage } = countAgeGroups(
          AgeStatus.YOUTH,
          cell.row.original.ServiceActivityBeneficiaries
        );
        return `${count} + ${percentage}%`;
      },
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
    elderCountPercentage: {
      id: "Elder Count + %",
      header: "Elder Count + %",
      cell: (cell: any) => {
        const { count, percentage } = countAgeGroups(
          AgeStatus.ELDER,
          cell.row.original.ServiceActivityBeneficiaries
        );
        return `${count} + ${percentage}%`;
      },
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
    beneficiary: {
      id: "Beneficiary",
      meta: {
        isHideInForm: true,
      },
      cell: (cell: any) => {
        return (
          <Link
            to={tablePathSegments.SERVICES}
            search={{
              tab: "beneficiaries",
              operator: cell.row.original?.operator,
            }}
            className="underline text-blue-500"
          >
            View Beneficiaries
          </Link>
        );
      },
    },
    locationParentCode: {
      id: "Location Parent Code",
      header: "Activity Location Parent",
      cell: (cell: any) => cell.row.original.location?.parent?.shortCode,
      meta: {
        isHideInForm: true,
        isVisible: false,
      },
    },
    locationParentParentCode: {
      id: "Location Parent Parent Code",
      header: "Activity Location Parent Parent",
      cell: (cell: any) =>
        cell.row.original.location?.parent?.parent?.shortCode,
      meta: {
        isHideInForm: true,
        isVisible: false,
      },
    },
    programCode: {
      id: "Program Code",
      header: "Program Code",
      cell: (cell: any) =>
        cell.row.original.supportingServiceCategory?.shortCode,
      meta: {
        isHideInForm: true,
        isVisible: false,
      },
    },
    serviceTypeCode: {
      id: "Service Type Code",
      header: "Service Type Code",
      cell: (cell: any) =>
        cell.row.original.supportingServiceCategoryType?.shortCode,
      meta: {
        isHideInForm: true,
        isVisible: false,
      },
    },
    inputTypeCode: {
      id: "Input Type Code",
      header: "Input Type Code",
      cell: (cell: any) =>
        cell.row.original.supportingServiceInputType?.shortCode,
      meta: {
        isHideInForm: true,
        isVisible: false,
      },
    },
    farmerGroupParentCode: {
      id: "Farmer Group Parent Code",
      header: "Farmer Group Parent",
      cell: (cell: any) =>
        getUniqueParentNamesOfCustomLocation(
          ParentLevels.LEVEL_1,
          cell.row.original.serviceActivityLocations
        ),
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
    farmerGroupParentParentCode: {
      id: "Farmer Group Parent Parent Code",
      header: "Farmer Group Parent Parent",
      cell: (cell: any) =>
        getUniqueParentNamesOfCustomLocation(
          ParentLevels.LEVEL_2,
          cell.row.original.serviceActivityLocations
        ),
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    },
  }
);

export const serviceActivityTableFilters: DataTableFilter[] = [
  {
    key: "operator",
    label: "Operator",
    type: "text",
  },
  {
    type: "faceted",
    key: "location",
    label: "Location",
  },
  {
    type: "faceted",
    key: "customLocation",
    label: "Custom location",
  },
  {
    type: "faceted",
    key: "program",
    label: "program",
  },
  {
    type: "faceted",
    key: "serviceType",
    label: "Service Type",
  },
  {
    type: "faceted",
    key: "inputType",
    label: "Input Type",
  },
  {
    type: "faceted",
    key: "activityType",
    label: "Activity Type",
  },
];

export const serviceCategoryColumnHelper: ColumnHelper<SupportServiceCategory> =
  createColumnHelper<SupportServiceCategory>();

export const initialServiceCategoryColumns = [
  serviceCategoryColumnHelper.accessor("shortCode", {
    id: "code",
    header: "Code",
  }),
  serviceCategoryColumnHelper.accessor("name", {
    id: "name",
    header: "Name",
  }),
  serviceCategoryColumnHelper.accessor("supportingServiceCategoryTypeId", {
    id: "Program Type",
    header: "Program Type",
    cell: (cell) => cell.row.original.supportingServiceCategoryType.shortCode,
    meta: {
      type: "select",
      list: [],
      importId: "supportingServiceCategoryTypeCode",
    },
  }),
  serviceCategoryColumnHelper.accessor("supportingServiceCategoryTypeName", {
    id: "Program Type Name",
    header: "Program Type Name",
    cell: (cell: any) => cell.row.original.supportingServiceCategoryType.name,
    meta: {
      isHideInForm: true,
      errors: [],
    },
  }),
  serviceCategoryColumnHelper.accessor("programType", {
    id: "programType",
    header: "Program Type",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.CATEGORY_TYPES}
          search={{
            name: cell.row.original.supportingServiceCategoryType.name,
          }}
          className="underline text-blue-500"
        >
          View ProgramTypes
        </Link>
      );
    },
    meta: {
      isHideInForm: true,
    },
  }),
  serviceCategoryColumnHelper.accessor("activity", {
    id: "activity",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.SERVICES}
          search={{
            tab: "activities",
            program: cell.row.original?.shortCode,
          }}
          className="underline text-blue-500"
        >
          View Activities
        </Link>
      );
    },
    meta: {
      isHideInForm: true,
    },
  }),
  serviceCategoryColumnHelper.accessor("description", {
    id: "Description",
    header: "Description",
  }),
];

export const serviceCategoryTableFilters: DataTableFilter[] = [
  {
    key: "shortCode",
    label: "Short Code",
    type: "text",
  },
  {
    key: "categoryType",
    label: "Program Type",
    type: "faceted",
  },
];

export const serviceCategoryTypesColumnHelper: ColumnHelper<SupportServiceCategoryType> =
  createColumnHelper<SupportServiceCategoryType>();

export const initialServiceCategoryTypesColumns = [
  serviceCategoryTypesColumnHelper.accessor("shortCode", {
    id: "code",
  }),
  serviceCategoryTypesColumnHelper.accessor("category", {
    id: "category",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.CATEGORIES}
          search={{ categoryType: cell.row.original.shortCode }}
          className="underline text-blue-500"
        >
          View Categories
        </Link>
      );
    },
    meta: {
      isHideInForm: true,
    },
  }),
  serviceCategoryTypesColumnHelper.accessor("name", {
    id: "name",
  }),
  serviceCategoryTypesColumnHelper.accessor("description", {
    id: "description",
  }),
];

export const serviceCategoryTypesTableFilters: DataTableFilter[] = [
  {
    key: "shortCode",
    label: "Short Code",
    type: "text",
  },
];

export const serviceBeneficiaryColumnHelper: ColumnHelper<SupportServiceBeneficiary> =
  createColumnHelper<SupportServiceBeneficiary>();

export const initialServiceBeneficiaryColumns = [
  serviceBeneficiaryColumnHelper.accessor((row) => row.person.shortCode, {
    id: "code",
    meta: {
      isHideInForm: true,
    },
  }),
  serviceBeneficiaryColumnHelper.accessor("Operator", {
    id: "operator",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.SERVICES}
          search={{
            tab: "activities",
            operator: cell.row.original.supportingServiceActivity.operator,
          }}
          className="underline text-blue-500"
        >
          View Activities
        </Link>
      );
    },
    meta: {
      isHideInForm: true,
    },
  }),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.person.firstName + " " + row.person.lastName,
    {
      id: "name",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor((row) => row.person.gender, {
    id: "gender",
    meta: {
      isHideInForm: true,
    },
  }),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => calculateAge(row.person.dateOfBirth),
    {
      id: "age",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => calculateTheStatusOfAge(row.person.dateOfBirth),
    {
      id: "Age Flag",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.supportingServiceActivity.location.shortCode,
    {
      id: "location",
      header: "Activity Location",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) =>
      getUniqueParentNamesOfCustomLocation(
        ParentLevels.LEVEL_1,
        row.supportingServiceActivity.serviceActivityLocations
      ),
    {
      id: "Farmer Group parent",
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) =>
      getUniqueParentNamesOfCustomLocation(
        ParentLevels.LEVEL_2,
        row.supportingServiceActivity.serviceActivityLocations
      ),
    {
      id: "Farmer Group parent parent",
      meta: {
        isHideInForm: true,
        isVisible: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => formatDate(row.supportingServiceActivity.createdAt),
    {
      id: "date",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.supportingServiceActivity.supportingServiceActivityType.name,
    {
      id: "activity type",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.supportingServiceActivity.supportingServiceCategory.shortCode,
    {
      id: "program",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor("primary", {
    id: "primary",
    cell: (cell) => cell.row.original.primary,
  }),
  serviceBeneficiaryColumnHelper.accessor("itemValue", {
    id: "itemValue",
    cell: (cell) => cell.row.original.itemValue,
  }),
  serviceBeneficiaryColumnHelper.accessor("itemsProcessed", {
    id: "itemsProcessed",
    cell: (cell) => cell.row.original.itemsProcessed,
  }),
  serviceBeneficiaryColumnHelper.accessor("values", {
    id: "values",
    cell: (cell) => cell.row.original.values,
  }),
  serviceBeneficiaryColumnHelper.accessor("grade", {
    id: "grade",
    cell: (cell) => cell.row.original.grade,
  }),
  serviceBeneficiaryColumnHelper.accessor("score", {
    id: "score",
    cell: (cell) => cell.row.original.score,
  }),
  serviceBeneficiaryColumnHelper.accessor("total", {
    id: "total",
    cell: (cell) => cell.row.original.total,
  }),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.supportingServiceActivity.location?.parent?.shortCode,
    {
      id: "activity location parent",
      header: "Activity Location Parent",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.supportingServiceActivity.location?.parent?.parent?.shortCode,
    {
      id: "activity location parent parent",
      header: "Activity Location Parent Parent",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.person.mainContactPersonFor[0]?.location?.shortCode,
    {
      id: "person location",
      header: "Person Location",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) => row.person.mainContactPersonFor[0]?.location?.parent?.shortCode,
    {
      id: "person location parent",
      header: "Person Location Parent",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) =>
      row.person.mainContactPersonFor[0]?.location?.parent?.parent?.shortCode,
    {
      id: "person location parent parent",
      header: "Person Location Parent Parent",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) =>
      row.supportingServiceActivity.supportingServiceCategoryType?.shortCode,
    {
      id: "service type",
      meta: {
        isHideInForm: true,
      },
    }
  ),
  serviceBeneficiaryColumnHelper.accessor(
    (row) =>
      row.supportingServiceActivity.supportingServiceInputType?.shortCode,
    {
      id: "input type",
      meta: {
        isHideInForm: true,
      },
    }
  ),

  serviceBeneficiaryColumnHelper.accessor(
    (row) => getAllFacilitySize(row.person).faciityTotalArea,
    {
      id: "size",
      meta: {
        isHideInForm: true,
      },
    }
  ),
];

export const serviceBeneficiaryTableFilters: DataTableFilter[] = [
  {
    key: "shortCode",
    label: "Code",
    type: "text",
  },
  {
    key: "name",
    label: "Name",
    type: "text",
  },
];

export const serviceActivityTypeColumnHelper: ColumnHelper<SupportServiceActivityType> =
  createColumnHelper<SupportServiceActivityType>();

export const initialServiceActivityTypeColumns = [
  serviceActivityTypeColumnHelper.accessor("shortCode", {
    id: "code",
    header: "Code",
    meta: {
      errors: [],
    },
  }),
  serviceActivityTypeColumnHelper.accessor("name", {
    id: "name",
    meta: {
      errors: [],
    },
  }),
  serviceActivityTypeColumnHelper.accessor("type", {
    id: "type",
    meta: {
      type: "select",
      list: Object.values(ActivityType).map((type) => ({
        id: type,
        name: type.toLocaleLowerCase(),
      })),
    },
  }),
  serviceActivityTypeColumnHelper.accessor("beneficiaryType", {
    id: "beneficiaryType",
    meta: {
      type: "select",
      list: Object.values(BeneficiaryTypeEnum).map((type) => ({
        id: type,
        name: type.toLocaleLowerCase(),
      })),
    },
  }),

  serviceActivityTypeColumnHelper.accessor("supportingServiceCategoryId", {
    id: "program",
    header: "Program",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.CATEGORIES}
          search={{
            shortCode: cell.row.original.supportingServiceCategory.shortCode,
          }}
          className="underline text-blue-500"
        >
          {cell.row.original.supportingServiceCategory.name}
        </Link>
      );
    },
    meta: {
      type: "select",
      list: [],
      importId: "supportingServiceCategoryCode",
    },
  }),
  serviceActivityTypeColumnHelper.accessor("supportingServiceInputTypeId", {
    id: "Input Type",
    header: "Input Type",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.INPUT_TYPES}
          search={{
            shortCode: cell.row.original.supportingServiceInputType?.shortCode,
          }}
          className="underline text-blue-500"
        >
          {cell.row.original.supportingServiceInputType?.name}
        </Link>
      );
    },
    meta: {
      type: "select",
      list: [],
      errors: [],
      isDisabled: true,
      filterFieldId: "supportingServiceCategoryId",
      importId: "supportingServiceInputTypeCode",
    },
  }),
  serviceActivityTypeColumnHelper.accessor("activity", {
    id: "activity",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.SERVICES}
          search={{
            tab: "activities",
            activityType: cell.row.original?.shortCode,
          }}
          className="underline text-blue-500"
        >
          View Activities
        </Link>
      );
    },
    meta: {
      isHideInForm: true,
    },
  }),
  serviceActivityTypeColumnHelper.accessor("description", {
    id: "description",
    meta: {
      errors: [],
    },
  }),
];

export const serviceActivityTypeTableFilters: DataTableFilter[] = [
  {
    key: "shortCode",
    label: "Short Code",
    type: "text",
  },
];

export const serviceInputTypeColumnHelper: ColumnHelper<SupportServiceInputType> =
  createColumnHelper<SupportServiceInputType>();

export const initialServiceInputTypeColumns = [
  serviceInputTypeColumnHelper.accessor("shortCode", {
    id: "code",
    header: "Code",
    meta: {
      errors: [],
    },
  }),
  serviceInputTypeColumnHelper.accessor("name", {
    id: "name",
    meta: {},
  }),
  serviceInputTypeColumnHelper.accessor("type", {
    id: "type",
    meta: {
      type: "select",
      list: [],
    },
  }),

  serviceInputTypeColumnHelper.accessor("supportingServiceCategoryId", {
    id: "program",
    header: "Program",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.CATEGORIES}
          search={{
            shortCode: cell.row.original.supportingServiceCategory.shortCode,
          }}
          className="underline text-blue-500"
        >
          {cell.row.original.supportingServiceCategory.name}
        </Link>
      );
    },
    meta: {
      type: "select",
      list: [],
      importId: "supportingServiceCategoryCode",
    },
  }),
  serviceActivityTypeColumnHelper.accessor("activity", {
    id: "activity",
    cell: (cell: any) => {
      return (
        <Link
          to={tablePathSegments.SERVICES}
          search={{
            tab: "activities",
            inputType: cell.row.original?.shortCode,
          }}
          className="underline text-blue-500"
        >
          Used by activities
        </Link>
      );
    },
    meta: {
      isHideInForm: true,
    },
  }),
  serviceInputTypeColumnHelper.accessor("description", {
    id: "description",
    meta: {
      errors: [],
    },
  }),
];

export const serviceInputTypeTableFilters: DataTableFilter[] = [
  {
    key: "shortCode",
    label: "Short Code",
    type: "text",
  },
];
