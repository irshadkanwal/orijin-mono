import type {
  SupportServiceActivityType,
  SupportServiceCategory,
  SupportServiceCategoryType,
  SupportServiceInputType,
} from "@/types/support-service";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import {
  initialServiceActivityColumns,
  serviceActivityTableFilters,
} from "@/config/supporting-service-column";
import { Person } from "@/types/person";
import {
  BeneficiaryTypeEnum,
  SupportServiceTableQuery,
} from "@/types/support-service-types";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { ILocation } from "@/types/location";
import { ReferenceData } from "@/components/reference/reference-data";
import { commonTableQuerySchema } from "@/types/common-types";
import { DialogType } from "@/hooks/use-dialog";
import { useState } from "react";
import { ManageBeneficiaryDialog } from "./dialog/manage-beneficiary-dialog";
import { toast } from "../ui/use-toast";

export function SupportingServiceActivity({
  categoryTypes,
  categories,
  activityTypes,
  persons,
  inputTypes,
  locations,
  customLocations,
}: {
  categoryTypes: SupportServiceCategoryType[];
  categories: SupportServiceCategory[];
  activityTypes: SupportServiceActivityType[];
  persons: Person[];
  inputTypes: SupportServiceInputType[];
  locations: ILocation[];
  customLocations: ILocation[];
}) {
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: rootKeys.supportingServices });
  const search: SupportServiceTableQuery = useSearch({
    from: rootKeys.supportingServices,
  });

  const [items, setItems] = useState<any | null>(null);

  const { fetchData } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    search: {
      page: search.page,
      limit: search.limit,
      program: search.program,
      operator: search.operator,
      serviceType: search.serviceType,
      inputType: search.inputType,
      activityType: search.activityType,
      location: search.location,
      customLocation: search.customLocation,
      tab: search.tab,
    },
    path: lastPathSegments.SERVICE_ACTIVITIES,
  });

  const updatedTableFilters = serviceActivityTableFilters.map((filter: any) => {
    if (filter.key === "program" && filter.type === "faceted") {
      filter.options = categories.map((item: any) => ({
        label: item.name,
        value: item.shortCode,
      }));
    } else if (filter.key === "serviceType" && filter.type === "faceted") {
      filter.options = categoryTypes.map((item: any) => ({
        label: item.name,
        value: item.shortCode,
      }));
    } else if (filter.key === "inputType" && filter.type === "faceted") {
      filter.options = inputTypes.map((item: any) => ({
        label: item.name,
        value: item.shortCode,
      }));
    } else if (filter.key === "activityType" && filter.type === "faceted") {
      filter.options = activityTypes.map((item: any) => ({
        label: item.name,
        value: item.shortCode,
      }));
    } else if (filter.key === "location" && filter.type === "faceted") {
      filter.options = locations.map((item: any) => ({
        label: item.type,
        value: item.name,
      }));
    } else if (filter.key === "customLocation" && filter.type === "faceted") {
      filter.options = customLocations.map((item: any) => ({
        label: item.type,
        value: item.name,
      }));
    }
    return filter;
  });
  const [isManageBeneficiaryDialogOpen, setIsManageBeneficiaryDialogOpen] =
    useState(false);

  const updatedColumns = initialServiceActivityColumns.map((column: any) => {
    if (column.accessorKey === "supportingServiceCategoryTypeId") {
      column.meta.list = categoryTypes;
    }
    if (column.accessorKey === "supportingServiceCategoryId") {
      column.meta.list = categories;
    }
    if (column.accessorKey === "supportingServiceInputTypeId") {
      column.meta.list = inputTypes;
    }
    if (column.accessorKey === "supportingServiceActivityTypeId") {
      column.meta.list = activityTypes;
    }
    if (column.accessorKey === "locationId") {
      column.meta.list = locations;
    }
    if (column.accessorKey === "farmerGroupIds") {
      column.meta.list = customLocations;
    }
    if (column.accessorKey === "personIds") {
      column.meta.list = persons;
    }

    return column;
  });

  return (
    <div>
      <ReferenceData
        tableData={fetchData.data}
        columns={updatedColumns}
        rootKey={rootKeys.supportingServices}
        tableFilters={updatedTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegments.SERVICE_ACTIVITIES}
        title="Activities"
        actions={[
          {
            action: "manage-beneficiaries",
            label: "Manage Beneficiaries",
            dialogType: DialogType.MANAGE_BENEFICIARIES,
          },
        ]}
        onCustomFunction={(actionType, cell) => {
          if (actionType === DialogType.MANAGE_BENEFICIARIES) {
            if (
              cell.row.original.supportingServiceActivityType.beneficiaryType ===
              BeneficiaryTypeEnum.INDIVIDUAL
            ) {
              toast({
                title: "Error",
                description: "Can't manage individual beneficiaries",
                variant: "destructive",
              });
              return;
            }
            setItems(cell.row.original);
            setIsManageBeneficiaryDialogOpen(true);
          }
        }}
      />

      <ManageBeneficiaryDialog
        currentUser={currentUser}
        organisation={organisations.current}
        activity={items}
        isDialogOpen={isManageBeneficiaryDialogOpen}
        setDialogClose={() => {
          setIsManageBeneficiaryDialogOpen(false);
          fetchData.refetch();
        }}
        farmerGroups={customLocations}
      />
    </div>
  );
}
