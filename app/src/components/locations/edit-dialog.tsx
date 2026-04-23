import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ILocationsEditDialogProps = {
  isDialogOpen: boolean;
  setDialogClose: (value: boolean) => void;
  cell: any;
};
import {
  FieldProperty,
  FieldType,
  FormError,
  FormFields,
} from "@/types/custom-form";
import { Form } from "../forms/form";

export default function LocationsEditDialog({
  isDialogOpen,
  setDialogClose,
  cell,
}: ILocationsEditDialogProps) {
  const generateFormFields = (): FormFields[] => {
    return [
      {
        id: "name",
        label: "Name",
        placeholder: "Please provide the name",
        property: FieldProperty.INPUT,
        type: FieldType.TEXT,
        errors: [FormError.REQUIRED],
        defaultValue: cell.name,
      },
      {
        id: "shortCode",
        label: "Short Code",
        placeholder: "Please provide the short code",
        property: FieldProperty.INPUT,
        type: FieldType.TEXT,
        errors: [FormError.REQUIRED],
        defaultValue: cell.shortCode,
      },
      {
        id: "type",
        label: "Type",
        placeholder: "Please provide the type",
        property: FieldProperty.INPUT,
        type: FieldType.TEXT,
        errors: [FormError.REQUIRED],
        defaultValue: cell.type,
      },
      {
        id: "organisation",
        label: "Organisation",
        placeholder: "Please provide the organisation",
        property: FieldProperty.SELECT,
        type: FieldType.TEXT,
        errors: [FormError.REQUIRED],
        defaultValue: cell.organisation,
      },
    ];
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogClose}>
      <DialogContent className="min-w-[40vw] sm:max-w-[425px] overflow-y-auto max-h-[70vh]">
        <DialogHeader>
          <DialogTitle className="capitalize">Edit Location</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form
          formFields={generateFormFields()}
          isLoading={false}
          onSubmit={(data) => console.log(data)}
          data={cell}
        ></Form>
      </DialogContent>
    </Dialog>
  );
}
