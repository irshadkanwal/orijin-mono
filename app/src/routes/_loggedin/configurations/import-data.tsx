import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { importSections, SectionType } from "@/config/import-sections";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { fileUpload } from "@/services/common-service";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";

export const Route = createFileRoute(rootKeys.configurationsImportData)({
  component: ConfigurationImportGoogleSheetsComponent,
});
function ConfigurationImportGoogleSheetsComponent() {
  const {
    auth: { organisations, currentUser },
  } = useRouteContext({ from: rootKeys.configurationsImportData as any });

  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState<SectionType | undefined>(undefined);

  const handleSubmit = async (data: any, file: any) => {
    console.log("Data: ", data);
    if (!file || !section) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response: any = await fileUpload(
        organisations.current,
        `${lastPathSegments.IMPORT_DATA}/${section?.id}`,
        formData,
        currentUser?.accessToken
      );
      toast({
        title: "Success",
        description: response.message || "Import data successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4  h-full p-4 sm:px-6 sm:py-4 md:gap-6">
      <PageTitle title="Import data" />
      <div className="flex flex-grow justify-center items-center">
        <div className="grid w-56 gap-4">
          <Select
            onValueChange={(value: any) => {
              console.log(value);
              setSection(value);
            }}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select entity to import" />
            </SelectTrigger>
            <SelectContent position="popper">
              {importSections.map((data: any) => (
                <SelectItem key={data.id} value={data}>
                  <div className="w-full flex justify-start px-4">
                    <span>{data.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            disabled={!section}
            className="w-full"
            onClick={() => setIsOpen(true)}
          >
            Import
          </Button>
          <ReactSpreadsheetImport
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={handleSubmit}
            fields={section?.listOfHeaders || []}
            isNavigationEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}
