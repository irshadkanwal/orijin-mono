import { ReferenceData } from "@/components/reference/reference-data";
import { ActionDialog } from "@/components/table/actions-dialog";
import { toast } from "@/components/ui/use-toast";
import {
  initialOrganisationsColumns,
  organisationsTableFilters,
} from "@/config/organisation-columns";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { DialogType, useDialog } from "@/hooks/use-dialog";
import { generateFormFieldsFromColumns } from "@/hooks/utils/generate-form-field";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { OrganisationRequest } from "@/types/organisation";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute(rootKeys.configurationsOrganisations)({
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
    const lastPathSegment: string =
      location.pathname.split("/").filter(Boolean).pop() ?? "";

    const { queryClient, auth } = context;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const organisationsPromise = queryClient.ensureQueryData(
      fetchAllQueryOptions(
        "",
        lastPathSegment,
        deps,
        auth.currentUser?.accessToken
      )
    );
    const usersPromise = queryClient.ensureQueryData(
      fetchAllQueryOptions(
        "",
        lastPathSegments.USERS,
        { page: 1, limit: 1000 },
        auth.currentUser?.accessToken
      )
    );

    const [organisations, users] = await Promise.all([
      organisationsPromise,
      usersPromise,
    ]);
    return {
      organisations,
      users,
      lastPathSegment,
    };
  },
  validateSearch: (search) => {
    const result = commonTableQuerySchema.safeParse(search);
    return result.success ? result.data : {};
  },
  component: OrganisationsComponent,
});

function OrganisationsComponent() {
  const { organisations, users, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsOrganisations,
  });

  const { openDialog, isOpen, toggleDialog, dialogType, setDialogType } =
    useDialog();
  const [item, setItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<any>([]);

  const inputFields = [
    {
      accessorKey: "userId",
      id: "name",
      meta: {
        type: "locationDropdown",
        list: users.data
          .map((user: any) => ({
            id: user.id.id,
            name: user.name,
            type: user.email,
          }))
          .filter((user) => user.name),
      },
    },
  ];

  const { edit } = useCommonQuery({
    rootKey: rootKeys.configurationsOrganisations,
    search: {},
    path: lastPathSegment,
  });

  const submitRequest = async (data?: any) => {
    setIsLoading(true);
    try {
      const payload: OrganisationRequest = {
        id: item.id,
      };
      payload.userId = data.userId;

      const response = await edit(payload);
      if (response.data) {
        toggleDialog();
        setItem(null);
        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ReferenceData
        tableData={organisations}
        columns={initialOrganisationsColumns}
        rootKey={rootKeys.configurationsOrganisations}
        tableFilters={organisationsTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Organisations"
        actions={[
          {
            action: "delete",
            label: "Delete",
            dialogType: DialogType.DELETE,
            condition: lastPathSegment,
          },
          {
            action: "add-user-to-organisation",
            label: "Add User",
            dialogType: DialogType.ADD_USER_TO_ORGANISATION,
          },
        ]}
        onCustomFunction={(actionType, cell) => {
          if (actionType === DialogType.ADD_USER_TO_ORGANISATION) {
            setFormFields(generateFormFieldsFromColumns(inputFields, item));
            setItem(cell.row.original);
            setDialogType(actionType);
            openDialog();
          }
        }}
      />

      <ActionDialog
        isOpen={isOpen}
        isLoading={isLoading}
        title={dialogType}
        data={item ?? {}}
        setDialogClose={toggleDialog}
        formFields={formFields}
        onSubmit={submitRequest}
        onHandleConfirmation={submitRequest}
      />
    </div>
  );
}
