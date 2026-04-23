import { ReferenceData } from "@/components/reference/reference-data";
import { ActionDialog } from "@/components/table/actions-dialog";
import { toast } from "@/components/ui/use-toast";
import { rootKeys } from "@/config/rootKeys";
import { initialUsersColumns, usersTableFilters } from "@/config/users-column";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { DialogType, useDialog } from "@/hooks/use-dialog";
import { generateFormFieldsFromColumns } from "@/hooks/utils/generate-form-field";
import { fetchAllQueryOptions } from "@/services/common-service";
import { commonTableQuerySchema } from "@/types/common-types";
import { UserRoles } from "@/types/users-types";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute(rootKeys.configurationsUsers)({
  loaderDeps: ({ search }) => {
    const parsed = commonTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const { page, limit, sort, sortOrder, email } = parsed.data;
    return { page, limit, sort, sortOrder, email };
  },

  loader: async ({ deps, context, location }) => {
    // Extract the last path segment
    const lastPathSegment: string =
      location.pathname.split("/").filter(Boolean).pop() ?? "";

    const { queryClient, auth } = context;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data = await queryClient.ensureQueryData(
      fetchAllQueryOptions(
        auth.organisations.current,
        lastPathSegment,
        deps,
        auth.currentUser?.accessToken
      )
    );
    return {
      data,
      lastPathSegment,
    };
  },
  validateSearch: (search) => {
    const result = commonTableQuerySchema.safeParse(search);
    return result.success ? result.data : {};
  },
  component: UserComponent,
});

function UserComponent() {
  const { data, lastPathSegment } = useLoaderData({
    from: rootKeys.configurationsUsers,
  });

  const { openDialog, isOpen, toggleDialog, dialogType, setDialogType } =
    useDialog();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<any>([]);
  const [items, setItems] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { deleteRows, updateRows } = useCommonQuery({
    rootKey: rootKeys.configurationsUsers,
    search: {},
    path: lastPathSegment,
  });

  const inputFields = [
    {
      accessorKey: "role",
      id: "role",
      meta: {
        list: Object.values(UserRoles).map((role) => ({
          id: role,
          name: role,
        })),
        type: "select",
      },
    },
  ];

  const submitRequest = async (data?: any) => {
    setIsLoading(true);
    try {
      const ids = items.map((item: any) => item.id.id);
      if (dialogType === DialogType.DELETE_SELECTED) {
        if (ids.length) {
          await deleteRows({ ids: ids });
          queryClient.invalidateQueries();
          toggleDialog();
        }
      } else {
        await updateRows({ ids: ids, ...data });
        queryClient.invalidateQueries();
        toggleDialog();
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
        tableData={data}
        columns={initialUsersColumns}
        rootKey={rootKeys.configurationsUsers}
        tableFilters={usersTableFilters}
        tableQuerySchema={commonTableQuerySchema}
        lastPathSegment={lastPathSegment}
        title="Users"
        actions={[
          {
            action: "delete",
            label: "Delete",
            dialogType: DialogType.DELETE,
            condition: lastPathSegment,
          },
          {
            action: "reset-password",
            label: "Reset Password",
            dialogType: DialogType.RESET_PASSWORD,
          },
        ]}
        onCustomFunction={(actionType, cell) => {
          setItems(cell);
          setDialogType(actionType);
          openDialog();
          if (actionType === DialogType.DELETE_SELECTED) {
            setFormFields(undefined);
          } else {
            setFormFields(generateFormFieldsFromColumns(inputFields, cell.row));
          }
        }}
      />
      <ActionDialog
        isOpen={isOpen}
        isLoading={isLoading}
        title={dialogType}
        data={{}}
        setDialogClose={toggleDialog}
        formFields={formFields}
        onSubmit={submitRequest}
        onHandleConfirmation={submitRequest}
      />
    </div>
  );
}
