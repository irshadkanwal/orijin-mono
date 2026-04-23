import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { rootKeys } from "@/config/rootKeys";
import { PageTitle } from "@/components/page-title";
import {
  Tabs as OrgConfigTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { useEffect, useState } from "react";
import { Form } from "@/components/forms/form";
import {
  columnMetadata,
  locality,
} from "@/components/utils/customize-form-fields";
import { fetchOneQueryOptions, update } from "@/services/common-service";
import { generateFormFieldsFromColumns } from "@/hooks/utils/generate-form-field";
import { toast } from "@/components/ui/use-toast";
import { GeneralConfig, LocalityConfig } from "@/types/organisationConfig";
enum OrgConfigTab {
  GENERAL = "general",
  LOCATION = "locality",
}

const getDefaultGeneralConfig = (): GeneralConfig => ({
  phoneCountryCode: "",
  phoneValidationPhoneOnlyRegex: "",
  phoneValidationRegex: "",
  standardAreaUnit: "",
  standardAreaUnitForImport: "",
  standardDateFormat: "",
  standardDateTimeFormat: "",
  standardRounding: "",
  standardWeightUnit: "",
  testWorkspace: "",
  masterWorkspace: "",
});
const getDefaultLocalityConfig = (): LocalityConfig => ({
  availableCurrencyUnits: "",
  availableLocales: "",
  availableTemperatureUnits: "",
  availableWeightUnits: "",
  defaultCountry: "",
  defaultCountryCode: "",
  defaultCurrencyUnit: "",
  defaultLocale: "",
  defaultTemperatureUnit: "",
  defaultWeightUnit: "",
});

export const Route = createFileRoute(
  rootKeys.organisationConfigurationsByConfig
)({
  loader: async ({ deps, context, location }) => {
    // Extract the last path segment
    const lastPathSegment: string =
      location.pathname.split("/").filter(Boolean).pop() ?? "";
    const { queryClient, auth } = context;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    let data;
    if (auth.currentUser?.uid) {
      data = await queryClient.ensureQueryData(
        fetchOneQueryOptions(
          auth?.organisations.current,
          `/${lastPathSegment}`,
          "",
          auth.currentUser?.accessToken
        )
      );
    }
    return {
      data,
      lastPathSegment,
      auth,
    };
  },

  component: OrganisationConfig,
});

function OrganisationConfig() {
  const { data, lastPathSegment, auth } = useLoaderData({
    from: rootKeys.organisationConfigurationsByConfig,
  });

  const [activeTab, setActiveTab] = useState<OrgConfigTab>(
    OrgConfigTab.GENERAL
  );
  const [isLoading, setIsLoading] = useState(false);
  const [queryData, setQueryData] = useState<
    (GeneralConfig | LocalityConfig)[]
  >([]);

  const handleTabChange = (tab: OrgConfigTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (data) {
      setQueryData(data.config?.[activeTab]);
    } else {
      setQueryData(
        activeTab === OrgConfigTab.GENERAL
          ? getDefaultGeneralConfig()
          : getDefaultLocalityConfig()
      );
    }
  }, [data, activeTab]);

  const submit = async (formData: Record<string, any>) => {
    setIsLoading(true);

    const isGeneralTab = activeTab === OrgConfigTab.GENERAL;
    const key = isGeneralTab ? "general" : "locality";

    const payload: any = { [key]: formData };

    if (isGeneralTab) {
      payload.general.masterWorkspace =
        payload.general.masterWorkspace ||
        `${auth.organisations.current}_master`;
      payload.general.testWorkspace =
        payload.general.testWorkspace || `${auth.organisations.current}_test`;
      setQueryData(payload.general);
    } else {
      setQueryData(payload.locality);
    }

    try {
      if (auth.currentUser?.uid) {
        await update(
          auth.organisations.current,
          lastPathSegment,
          auth.currentUser.uid,
          payload,
          auth.currentUser.accessToken
        );
        toast({
          title: "Success",
          description: "Organisation config updated",
          variant: "success",
        });
      } else {
        throw new Error("No current user UID found.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = generateFormFieldsFromColumns(columnMetadata, queryData);
  const formFieldsLocality = generateFormFieldsFromColumns(locality, queryData);
  return (
    <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-6 lg:grid-cols-1 xl:grid-cols-1">
      <PageTitle title={"Manage Organisation"} />
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <OrgConfigTabs
          value={activeTab}
          onValueChange={(e) => handleTabChange(e)}
        >
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value={OrgConfigTab.GENERAL}>General</TabsTrigger>
              <TabsTrigger value={OrgConfigTab.LOCATION}>Locality</TabsTrigger>
            </TabsList>
          </div>
          <div className="w-[50%]">
            <TabsContent value={OrgConfigTab.GENERAL}>
              <div>
                <Form
                  formFields={formFields}
                  onSubmit={(e) => submit(e)}
                  isLoading={isLoading}
                  data={queryData || getDefaultGeneralConfig()}
                />
              </div>
            </TabsContent>
            <TabsContent value={OrgConfigTab.LOCATION}>
              <div>
                <Form
                  formFields={formFieldsLocality}
                  onSubmit={(e) => submit(e)}
                  isLoading={isLoading}
                  data={queryData || getDefaultLocalityConfig()}
                />
              </div>
            </TabsContent>
          </div>
        </OrgConfigTabs>
      </div>
    </main>
  );
}
