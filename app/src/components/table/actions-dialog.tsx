import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/forms/form";
import { FormFields } from "@/types/custom-form";
import { Icons } from "../icons";

type IDialogProps = {
  isOpen: boolean;
  setDialogClose: () => void;
  title: string;
  formFields?: FormFields[];
  onSubmit: (data: any) => void;
  data?: any;
  isLoading: boolean;
  onHandleConfirmation?: () => void;
};

export function ActionDialog({
  isOpen,
  setDialogClose,
  title,
  formFields,
  onSubmit,
  data,
  isLoading,
  onHandleConfirmation,
}: IDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setDialogClose}>
      <DialogContent className="min-w-[40vw] sm:max-w-[425px] overflow-y-auto min-h-[30vh] max-h-[70vh]">
        <div className="flex flex-col gap-8">
          <DialogHeader>
            <DialogTitle className="capitalize">{title}</DialogTitle>
          </DialogHeader>
          <div>
            {formFields ? (
              <Form
                formFields={formFields}
                onSubmit={onSubmit}
                data={data}
                isLoading={isLoading}
              />
            ) : (
              <>
                <p>Are you sure you want to {title} this item?</p>
                <div className="flex justify-start mt-4 gap-4">
                  <Button
                    onClick={onHandleConfirmation}
                    className="w-fit capitalize"
                    size="sm"
                    variant="destructive"
                    color=""
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {title}
                  </Button>
                  <Button
                    onClick={setDialogClose}
                    className="w-fit"
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
