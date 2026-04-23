import { useState, useEffect } from "react";
import { deleteActivity } from "@/services/supportingService-service";
import type { SupportServiceActivity } from "@/types/support-service";
import { useToast } from "@/components/ui/use-toast";
import { useDialog } from "@/hooks/use-dialog";
import { rootKeys } from "@/config/rootKeys";
import { useRouteContext } from "@tanstack/react-router";

export function useSupportingServiceActivity(refetch: () => void) {
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: rootKeys.supportingServices });
  const [reloadData, setReloadData] = useState(false);
  const [activity, setActivity] = useState<SupportServiceActivity | null>(null);
  const { toast } = useToast();

  const {
    isOpen: isDialogOpen,
    openDialog: openActivityDialog,
    closeDialog: closeActivityDialog,
  } = useDialog();

  const {
    isOpen: isConfirmationDialogOpen,
    openDialog: openConfirmationDialog,
    closeDialog: closeConfirmationDialog,
  } = useDialog();

  const {
    isOpen: isManageBeneficiaryDialogOpen,
    openDialog: openManageBeneficiaryDialog,
    closeDialog: closeManageBeneficiaryDialog,
  } = useDialog();

  const handleEdit = (data: SupportServiceActivity | null) => {
    openActivityDialog();
    setActivity(data);
  };

  const conformationTrigger = async () => {
    try {
      const query = await deleteActivity(
        organisations.current,
        activity?.id,
        currentUser?.accessToken
      );
      if (query) {
        setReloadData(true);
        closeConfirmationDialog();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (data: SupportServiceActivity | null) => {
    openConfirmationDialog();
    setActivity(data);
  };

  const handleBeneficiary = (data: SupportServiceActivity | null) => {
    openManageBeneficiaryDialog();
    setActivity(data);
  };

  useEffect(() => {
    if (reloadData) {
      refetch(); // Trigger data refetch when reloadData state changes
      setReloadData(false); // Reset reloadData state after refetching
    }
  }, [reloadData, refetch]);

  const closeDialog = () => {
    closeActivityDialog();
    setReloadData(true);
  };

  const closeBeneficiaryDialog = () => {
    closeManageBeneficiaryDialog();
    setReloadData(true);
  };

  return {
    isDialogOpen,
    isConfirmationDialogOpen,
    isManageBeneficiaryDialogOpen,
    activity,
    setActivity,
    handleEdit,
    conformationTrigger,
    handleDelete,
    handleBeneficiary,
    closeDialog,
    closeBeneficiaryDialog,
    setIsDialogOpen: openActivityDialog,
    setIsConfirmationDialogOpen: openConfirmationDialog,
    setIsManageBeneficiaryDialogOpen: openManageBeneficiaryDialog,
  };
}
