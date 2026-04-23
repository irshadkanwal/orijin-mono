import { DialogType, useDialog } from "@/hooks/use-dialog";
import { Button } from "../ui/button";
import { ActionDialog } from "../table/actions-dialog";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { OrganisationRequest } from "@/types/organisation";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { useQueryClient } from "@tanstack/react-query";

export function FixWorkspacesDialog({ item }: { item: any }) {
  const { openDialog, isOpen, toggleDialog, dialogType, setDialogType } =
    useDialog();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { edit } = useCommonQuery({
    rootKey: rootKeys.configurationsOrganisations,
    search: {},
    path: lastPathSegments.ORGANISATIONS,
  });

  const submitRequest = async (data?: any) => {
    setIsLoading(true);
    try {
      const payload: OrganisationRequest = {
        id: item.id,
      };

      payload.isToAddWorkspaces = true;

      const response = await edit(payload);

      queryClient.invalidateQueries();
      toggleDialog();
      toast({
        title: "Success",
        description: response.message,
        variant: "success",
      });
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
    <>
      <div>
        <Button
          onClick={() => {
            openDialog();
            setDialogType(DialogType.ADD_WORKSPACES_TO_ORGANISATION);
          }}
          className="w-fit h-8 "
          size="sm"
          variant="destructive"
        >
          Fix Workspaces
        </Button>
      </div>

      <ActionDialog
        isOpen={isOpen}
        isLoading={isLoading}
        title={dialogType}
        data={item ?? {}}
        setDialogClose={toggleDialog}
        formFields={undefined}
        onSubmit={submitRequest}
        onHandleConfirmation={submitRequest}
      />
    </>
  );
}
