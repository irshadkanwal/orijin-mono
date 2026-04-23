import { Form } from "@/components/forms/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  IManageActivityDialogProps,
  SupportServiceActivity,
} from "@/types/support-service";
import {
  postActivity,
  updateActivity,
} from "@/services/supportingService-service";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { rootKeys } from "@/config/rootKeys";
import { useRouteContext } from "@tanstack/react-router";
import { BeneficiaryTypeEnum } from "@/types/support-service-types";

export function ManageActivityDialog({
  formFields,
  isDialogOpen,
  setDialogClose,
  activity,
  onReload,
}: IManageActivityDialogProps) {
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: rootKeys.supportingServices });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const submit = async (data: SupportServiceActivity) => {
    setIsLoading(true);
    try {
      data.organisation = organisations.current;
      let query;

      if (data.beneficiaryType === BeneficiaryTypeEnum.INDIVIDUAL) {
        delete data["farmerGroupIds"];
        data["personIds"] = [data["personIds"]];
      } else if (data.beneficiaryType === BeneficiaryTypeEnum.GROUP) {
        delete data["personIds"];
      }
      if (activity) {
        query = await updateActivity(
          organisations.current,
          activity.id,
          data,
          currentUser?.accessToken
        );
      } else {
        query = await postActivity(
          organisations.current,
          data,
          currentUser?.accessToken
        );
      }
      if (query) {
        setDialogClose(false);
        onReload();
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogClose}>
      <DialogContent className="min-w-[40vw] sm:max-w-[425px] overflow-y-auto min-h-[60vh] max-h-[80vh]">
        <div className="flex flex-col gap-8">
          <DialogHeader>
            <DialogTitle className="capitalize">Activity</DialogTitle>
          </DialogHeader>
          <Form
            formFields={formFields}
            isLoading={isLoading}
            onSubmit={submit}
            data={activity}
          ></Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
