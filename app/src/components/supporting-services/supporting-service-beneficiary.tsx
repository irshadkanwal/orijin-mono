import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import {
  SupportServiceActivity,
  SupportServiceBeneficiary,
  SupportServiceCategory,
  SupportServiceCategoryType,
  SupportServiceInputType,
} from "@/types/support-service";
import { DataTable } from "../table/datatable";
import { initialServiceBeneficiaryColumns } from "@/config/supporting-service-column";
import {
  SupportServiceTableQuery,
  supportServiceTableQuerySchema,
} from "@/types/support-service-types";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { supportingServicesActivitiesQueryOptions } from "@/services/supportingService-service";
import { Person } from "@/types/person";
import { ageRanges, genderTypes } from "@/types/persons-types";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { ILocation } from "@/types/location";

export interface IDropdown {
  label: string;
  value: string;
}

export function SupportingServiceBeneficiary({
  persons,
  categories,
  categoryTypes,
  inputTypes,
  locations,
  customLocations,
}: {
  persons: Person[];
  categories: SupportServiceCategory[];
  categoryTypes: SupportServiceCategoryType[];
  inputTypes: SupportServiceInputType[];
  locations: ILocation[];
  customLocations: ILocation[];
}) {
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: rootKeys.supportingServices });

  const { fetchData: activitiesQuery } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.SERVICE_ACTIVITIES,
    search: { page: 1, limit: 1000 },
  });

  const uniqueOperators = Array.from(
    new Set(
      activitiesQuery.data.data.map(
        (supportingServiceActivity: SupportServiceActivity | any) =>
          supportingServiceActivity.operator
      )
    )
  );

  const tableFilters = [
    {
      type: "faceted",
      key: "operator",
      label: "Operator",
      getColumn: (table: any) => table.getColumn("activity"),
      options: uniqueOperators.map((operator: string) => ({
        label: operator,
        value: operator,
      })),
    },
    {
      type: "faceted",
      key: "activityType",
      label: "Activity Type",
      getColumn: (table: any) => table.getColumn("activity type"),
      options: activitiesQuery.data.data
        .map(
          ({
            supportingServiceActivityType,
          }: SupportServiceActivity | any) => ({
            label: supportingServiceActivityType.name,
            value: `${supportingServiceActivityType.name}-${supportingServiceActivityType.supportingServiceCategory.name}`,
          })
        )
        .filter(
          (item: IDropdown, index: number, self: IDropdown[]) =>
            index ===
            self.findIndex(
              (t: IDropdown) => t.label === item.label && t.value === item.value
            )
        ),
    },
    {
      type: "faceted",
      key: "personName",
      label: "Person",
      getColumn: (table: any) => table.getColumn("name"),
      options: persons.map(({ firstName, lastName, shortCode }) => ({
        label: shortCode,
        value: `${firstName} ${lastName}`,
      })),
    },
    {
      type: "faceted",
      key: "location",
      label: "Location",
      getColumn: (table: any) => table.getColumn("location"),
      options: locations.map((item: any) => ({
        label: item.type,
        value: item.name,
      })),
    },
    {
      type: "faceted",
      key: "customLocation",
      label: "Custom location",
      getColumn: (table: any) => table.getColumn("location"),
      options: customLocations.map((item: any) => ({
        label: item.type,
        value: item.name,
      })),
    },
    {
      type: "faceted",
      key: "program",
      label: "Program",
      getColumn: (table: any) => table.getColumn("program"),
      options: categories.map((category) => ({
        label: category.name,
        value: category.shortCode,
      })),
    },
    {
      type: "faceted",
      key: "serviceType",
      label: "Service Type",
      getColumn: (table: any) => table.getColumn("service type"),
      options: categoryTypes.map((category) => ({
        label: category.name,
        value: category.shortCode,
      })),
    },
    {
      type: "faceted",
      key: "inputType",
      label: "Input Type",
      getColumn: (table: any) => table.getColumn("input type"),
      options: inputTypes.map((inputType: SupportServiceInputType) => ({
        label: inputType.name,
        value: inputType.shortCode,
      })),
    },
    {
      type: "faceted",
      key: "gender",
      label: "Gender",
      getColumn: (table: any) => table.getColumn("gender"),
      options: genderTypes.map((gender: string) => ({
        label: gender,
        value: gender,
      })),
    },
    {
      type: "faceted",
      key: "ageRange",
      label: "Age Range",
      getColumn: (table: any) => table.getColumn("age"),
      options: ageRanges,
    },
  ];

  const search: SupportServiceTableQuery = useSearch({
    from: rootKeys.supportingServices,
  });
  const { fetchData: supportingServiceActivities } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.SERVICE_ACTIVITIES,
    search: {
      page: search.page,
      limit: search.limit,
      personName: search.personName,
      activityType: search.activityType,
      location: search.location,
      customLocation: search.customLocation,
      program: search.program,
      serviceType: search.serviceType,
      inputType: search.inputType,
      gender: search.gender,
      operator: search.operator,
      tab:search.tab,
      ageRanges: search.ageRange
    }
  });

  // Assuming supportingServiceActivities contains the necessary structure
  const beneficiaries: SupportServiceBeneficiary[] =
    supportingServiceActivities.data.data.flatMap(
      (item: SupportServiceActivity) => {
        return item.ServiceActivityBeneficiaries;
      }
    );

  return (
    <main className="grid flex-1 items-start gap-y-2 sm:px-6 sm:py-4 md:p-0 md:gap-y-4 lg:grid-cols-1 xl:grid-cols-1">
      <DataTable
        columns={initialServiceBeneficiaryColumns}
        data={beneficiaries}
        count={beneficiaries.length}
        filters={tableFilters}
        searchFrom={rootKeys.supportingServices}
        tableQuerySchema={supportServiceTableQuerySchema}
        fields={["personName", "activityType"]}
        isFiltrationActive={true}
        tab="beneficiaries"
      />
    </main>
  );
}
