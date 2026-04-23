import { DialogType, useDialog } from "@/hooks/use-dialog";
import { generateFormFieldsFromColumns } from "@/hooks/utils/generate-form-field";
import { useState } from "react";
import { Button } from "../ui/button";
import { ActionDialog } from "../table/actions-dialog";
import { DataTable } from "../table/datatable";
import { lastPathSegments, type SearchFrom } from "@/config/rootKeys";
import { RowActions } from "../locations/actions-dropdown";
import { toast } from "../ui/use-toast";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { useSearch } from "@tanstack/react-router";
import { PageTitle } from "../page-title";
import {
  defaultActions,
  generateActions,
  IDefaultActions,
} from "@/hooks/utils/generate-actions";
export interface IReferenceDataProps {
  tableData: {
    data: any[];
    count?: number;
  };
  columns: any[];
  rootKey: SearchFrom;
  tableFilters: any[];
  tableQuerySchema: any;
  lastPathSegment: string;
  title: string;
  actions?: IDefaultActions[];
  onCustomFunction?: (actionType: DialogType, cell: any) => any;
}
export function ReferenceData({
  tableData,
  columns,
  rootKey,
  tableFilters,
  tableQuerySchema,
  lastPathSegment,
  title,
  actions,
  onCustomFunction,
}: IReferenceDataProps) {
  const { openDialog, isOpen, toggleDialog, dialogType, setDialogType } =
    useDialog();
  const [item, setItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const openCreateDialog = () => {
    setItem(null);
    setDialogType(DialogType.CREATE);
    openDialog();
  };
  const search = useSearch({ from: rootKey as any });
  const { fetchData, add, edit, deleteRowById, resetPassword } = useCommonQuery(
    {
      rootKey,
      search,
      path: lastPathSegment,
    }
  );

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      let success: any;
      if (dialogType === DialogType.CREATE) {
        success = await add(data);
      } else if (dialogType === DialogType.EDIT) {
        success = await edit(data);
      } else if (dialogType === DialogType.DELETE) {
        const id =
          lastPathSegment === lastPathSegments.ORGANISATIONS ||
          lastPathSegment === lastPathSegments.USERS
            ? data.id.id
            : data.id;
        success = await deleteRowById(id);
      } else if (dialogType === DialogType.RESET_PASSWORD) {
        success = await resetPassword(data.email);
        if (success.message) {
          toast({
            title: "Success",
            description: success.message,
            variant: "success",
          });
        }
      }
      if (success) toggleDialog();
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = (data: any) => handleSubmit(data);

  const handleEdit = (data: any) => handleSubmit({ id: item?.id, ...data });

  const handleConfirmation = () => handleSubmit(item);

  const submitFunction =
    dialogType === DialogType.CREATE ? handleCreate : handleEdit;

  const mergedActions =
    actions && actions?.length > 0
      ? [
          ...defaultActions.filter(
            (action) => !actions.some((a) => a.action === action.action)
          ),
          ...actions,
        ]
      : defaultActions;

  const handleAction = (actionType: DialogType, cell: any) => {
    if (
      actionType === DialogType.EDIT ||
      actionType === DialogType.DELETE ||
      actionType === DialogType.RESET_PASSWORD
    ) {
      setItem(cell.row.original);
      setDialogType(actionType);
      openDialog();
    } else if (onCustomFunction) {
      onCustomFunction(actionType, cell);
    }
  };

  const updatedColumns = [
    ...columns,
    ...(lastPathSegment !== lastPathSegments.PAYMENT_TRANSACTION &&
    lastPathSegment !== lastPathSegments.LOTS
      ? [
          {
            accessorKey: "Actions",
            id: "Actions",
            cell: (cell: any) => (
              <RowActions
                actions={generateActions(mergedActions, lastPathSegment).map(
                  (action) => ({
                    label: action.label,
                    handler: () => handleAction(action.dialogType, cell),
                  })
                )}
              />
            ),
          },
        ]
      : []),
  ];

  const columnsWithoutAction = updatedColumns.filter(
    (column) => column.id !== "Actions" && !column?.meta?.isHideInForm
  );
  const filter =
    DialogType.EDIT === dialogType
      ? columnsWithoutAction.filter((col) => col.meta?.isVisible !== false)
      : columnsWithoutAction;

  const formFields =
    dialogType === DialogType.CREATE || dialogType === DialogType.EDIT
      ? generateFormFieldsFromColumns(filter, item)
      : undefined;
  return (
    <>
      <main className="flex flex-col gap-4 p-4 sm:px-6 sm:py-4 md:gap-6 ">
        <div className="w-full flex justify-between items-end">
          <PageTitle title={title} />
          {lastPathSegment !== lastPathSegments.PAYMENT_TRANSACTION &&
            lastPathSegment !== lastPathSegments.LOTS && (
              <Button
                onClick={openCreateDialog}
                className="w-fit h-8 "
                size="sm"
                variant="outline"
              >
                Add
              </Button>
            )}
        </div>

        <ActionDialog
          isOpen={isOpen}
          isLoading={isLoading}
          title={dialogType}
          data={item ?? {}}
          setDialogClose={toggleDialog}
          formFields={formFields}
          onSubmit={submitFunction}
          onHandleConfirmation={() => {
            handleConfirmation();
          }}
        />
        <DataTable
          columns={updatedColumns}
          data={fetchData.data.data || tableData.data || []}
          count={fetchData.data.count || tableData.count || 0}
          searchFrom={rootKey}
          filters={tableFilters}
          tableQuerySchema={tableQuerySchema}
          fields={[]}
          isFiltrationActive={true}
          onMultipleSelection={onCustomFunction}
        />
      </main>
    </>
  );
}
