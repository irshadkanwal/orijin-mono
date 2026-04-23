import { ManageBeneficiariesForm } from "@/components/forms/manage-beneficiary-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { SupportServiceActivity } from "@/types/support-service";
import { useState } from "react";
import { UserWithToken } from "@/types/auth";
import { ILocation } from "@/types/location";
interface IManageBeneficiaryDialogProps {
  currentUser: UserWithToken | undefined;
  organisation: string;
  activity: SupportServiceActivity;
  isDialogOpen: boolean;
  setDialogClose: (isClosed: boolean) => void;
  farmerGroups: ILocation[];
}

export function ManageBeneficiaryDialog({
  currentUser,
  organisation,
  activity,
  isDialogOpen,
  setDialogClose,
  farmerGroups,
}: IManageBeneficiaryDialogProps) {
  const [isCloseableDialog, setIsCloseableDialog] = useState(true);
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(status) => {
        if (isCloseableDialog) {
          setDialogClose(status);
        } else {
          if (
            window.confirm(
              "Do you want to close the dialog? Persons will not be updated in the activity. Please submit before closing the dialog"
            )
          ) {
            setDialogClose(status);
          }
        }
      }}
    >
      <DialogContent
        className="min-w-[40vw] sm:max-w-[425px] overflow-y-auto min-h-[60vh] max-h-[80vh]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex flex-col gap-8">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Manage Beneficiaries
            </DialogTitle>
          </DialogHeader>
          <ManageBeneficiariesForm
            currentUser={currentUser}
            organisation={organisation}
            activity={activity}
            setIsCloseable={(status) => {
              setIsCloseableDialog(status);
              if (status) setDialogClose(status);
            }}
            farmerGroups={farmerGroups}
          ></ManageBeneficiariesForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
