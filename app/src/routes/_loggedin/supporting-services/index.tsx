import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportingServiceActivity } from "@/components/supporting-services/supporting-service-activity";
import { lastPathSegments, rootKeys } from "@/config/rootKeys";
import { useSupportingServiceActivityQuery } from "@/hooks/supporting-service/activity/user-supporting-service-activity-query";
import { SupportingServiceBeneficiary } from "@/components/supporting-services/supporting-service-beneficiary";
import {
  SupportServiceTableQuery,
  supportServiceTableQuerySchema,
} from "@/types/support-service-types";
import { useCommonQuery } from "@/hooks/common/use-common-queries";
import { PageTitle } from "@/components/page-title";
import { SupportingServiceBeneficiaryDashboard } from "@/components/supporting-services/supporting-service-dashboard";
export const Route = createFileRoute(rootKeys.supportingServices)({
  loaderDeps: ({ search }) => {
    const parsed = supportServiceTableQuerySchema.safeParse(search);
    if (!parsed.success) {
      throw new Error("Invalid search parameters");
    }
    const {
      page,
      limit,
      sort,
      sortOrder,
      personName,
      activityType,
      location,
      customLocation,
      program,
      serviceType,
      inputType,
      gender,
      ageRange,
      operator,
      tab,
    } = parsed.data;
    return {
      page,
      limit,
      sort,
      sortOrder,
      personName,
      activityType,
      location,
      customLocation,
      program,
      serviceType,
      inputType,
      gender,
      ageRange,
      operator,
      tab,
    };
  },
  validateSearch: (search) => {
    const result = supportServiceTableQuerySchema.safeParse(search);
    return result.success ? result.data : {};
  },
  component: SupportingServicesIndexComponent,
});

const TABS = {
  ACTIVITIES: "activities",
  BENEFICIARIES: "beneficiaries",
  DASHBOARD: "dashboard",
};

function SupportingServicesIndexComponent() {
  const search: SupportServiceTableQuery = useSearch({
    from: rootKeys.supportingServices,
  });
  const navigate = useNavigate();
  const { fetchData: activityTypesQuery } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.SERVICE_ACTIVITY_TYPES,
    search: { page: 1, limit: 1000 },
  });
  const { fetchData: categoriesQuery } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.SERVICE_CATEGORIES,
    search: { page: 1, limit: 1000 },
  });
  const { fetchData: categoryTypesQuery } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.SERVICE_CATEGORY_TYPES,
    search: { page: 1, limit: 1000 },
  });
  const { fetchData: inputTypesQuery } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.SERVICE_INPUT_TYPES,
    search: { page: 1, limit: 1000 },
  });
  const { fetchData: locationQuery } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.LOCATION_FILTER,
    search: { page: 1, limit: 1000, mainType: "GLOBAL" },
  });
  const { fetchData: customLocationQuery } = useCommonQuery({
    rootKey: rootKeys.supportingServices,
    path: lastPathSegments.LOCATION_FILTER,
    search: { page: 1, limit: 1000, mainType: "CUSTOM" },
  });

  const { persons } = useSupportingServiceActivityQuery();
  const mapPersons: any[] = persons.data.map((person) => {
    return {
      ...person,
      name: `${person.firstName} ${person.lastName}`,
      formattedData: `${person.type || "Unknown Type"} / ${person.shortCode}`,
      farmerGroupIds: person.mainContactPersonFor.filter(
        (mainContactPerson) =>
          mainContactPerson.mainContactPersonId === person.id
      )[0]?.customLocationId,
    };
  });
  return (
    <>
      <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-6 lg:grid-cols-1 xl:grid-cols-1">
        <PageTitle title="Supporting Services" />
        <Tabs value={search.tab}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger
                className="capitalize"
                value={TABS.DASHBOARD}
                onClick={() => navigate({ search: { tab: TABS.DASHBOARD } })}
              >
                {TABS.DASHBOARD}
              </TabsTrigger>
              <TabsTrigger
                className="capitalize"
                value={TABS.BENEFICIARIES}
                onClick={() =>
                  navigate({ search: { tab: TABS.BENEFICIARIES } })
                }
              >
                {TABS.BENEFICIARIES}
              </TabsTrigger>
              <TabsTrigger
                className="capitalize"
                value={TABS.ACTIVITIES}
                onClick={() => navigate({ search: { tab: TABS.ACTIVITIES } })}
              >
                {TABS.ACTIVITIES}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={TABS.DASHBOARD}>
            <SupportingServiceBeneficiaryDashboard />
          </TabsContent>
          <TabsContent value={TABS.ACTIVITIES}>
            <SupportingServiceActivity
              categoryTypes={categoryTypesQuery.data.data}
              categories={categoriesQuery.data.data}
              activityTypes={activityTypesQuery.data.data}
              persons={mapPersons}
              inputTypes={inputTypesQuery.data.data}
              locations={locationQuery.data}
              customLocations={customLocationQuery.data}
            />
          </TabsContent>
          <TabsContent value={TABS.BENEFICIARIES}>
            <SupportingServiceBeneficiary
              persons={persons.data}
              categories={categoriesQuery.data.data}
              categoryTypes={categoryTypesQuery.data.data}
              inputTypes={inputTypesQuery.data.data}
              locations={locationQuery.data}
              customLocations={customLocationQuery.data}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
