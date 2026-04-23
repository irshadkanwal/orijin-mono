import type { Facility, Farm, Person } from "@/types/farm";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { farmQueryOptions } from "@/services/farm-service.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { FarmNotifications } from "@/components/farms/farm-notifications.tsx";
import { FarmPlots } from "@/components/farms/farm-plots.tsx";
import { FarmSurveys } from "@/components/farms/farm-surveys.tsx";
import { CenteredSpinner } from "@/components/centered-spinner";
import { FarmHistory } from "@/components/farms/farm-history";
import { FarmDetailsCard } from "@/components/farms/farm-details.card";
import { JsonDisplay } from "@/components/farms/json-display.tsx";
import FarmSeasonHistory from "@/components/farms/farm-season-history";
import { Icons } from "@/components/icons.tsx";

export const Route = createFileRoute("/_loggedin/farms/$farmId")({
  component: FarmPage,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      farmQueryOptions(
        opts.context.auth.organisations.current,
        opts.params.farmId,
        opts.context.auth.currentUser?.accessToken
      )
    );
  },
});

const TABS = {
  PLOTS: "plots",
  SURVEYS: "surveys",
  HISTORY: "history",
  INCOMING_JSON: "incoming-json",
  RAW_RESPONSE: "rawResponse",
  FARM_SEASON_HISTORY: "farmSeasonHistory",
};

function FarmPage(): JSX.Element {
  const params = Route.useParams();
  const {
    auth: { currentUser, organisations, isAdmin },
  } = useRouteContext({ from: "/_loggedin/farms/$farmId" });
  const farmQuery = useSuspenseQuery(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    farmQueryOptions(
      organisations.current,
      params.farmId,
      currentUser?.accessToken
    )
  );
  const farm: Farm = farmQuery.data;
  if (!farm) {
    // TODO: Caused by the auth.organisations.current being fetched only after this page already starts to reload!
    // ..might get fixed with Zustand storing the value. But could then still happen if a new login is required, and login redirects directly here.
    return <CenteredSpinner />;
  }
  const facility: Facility = farm?.facility;
  const mainContactPerson: Person = facility?.mainContactPerson;

  return (
    <>
      <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <FarmNotifications
            farm={farm}
            currentUser={currentUser}
            organisationId={organisations.current}
          />
          {/*Tabs & map*/}
          <Tabs defaultValue={TABS.PLOTS}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value={TABS.PLOTS}>
                  <Icons.landPlot className="mx-2" />
                  Plots
                </TabsTrigger>
                <TabsTrigger value={TABS.SURVEYS}>
                  <Icons.notebook className="mx-2" />
                  Surveys
                </TabsTrigger>
                <TabsTrigger value={TABS.FARM_SEASON_HISTORY}>
                  <Icons.fileStack className="mx-2" />
                  Farm Season History
                </TabsTrigger>
                <TabsTrigger value={TABS.HISTORY}>
                  <Icons.history className="mx-2" />
                  Audit log
                </TabsTrigger>
                {isAdmin ? (
                  <>
                    <TabsTrigger value={TABS.INCOMING_JSON}>
                      <Icons.lock className="mx-2" />
                      Incoming JSON
                    </TabsTrigger>
                    <TabsTrigger value={TABS.RAW_RESPONSE}>
                      <Icons.lock className="mx-2" />
                      Raw response
                    </TabsTrigger>
                  </>
                ) : null}
              </TabsList>
            </div>
            <TabsContent value={TABS.PLOTS}>
              <FarmPlots
                farmId={farm.id}
                plots={farm.plots}
                farmCoordinates={farm.facility.coordinate}
                farm={farm}
                key={params.farmId}
              />
            </TabsContent>
            <TabsContent value={TABS.SURVEYS}>
              <FarmSurveys farm={farm} />
            </TabsContent>
            <TabsContent value={TABS.HISTORY}>
              <FarmHistory
                farm={farm}
                currentUser={currentUser}
                organisationId={organisations.current}
              />
            </TabsContent>
            <TabsContent value={TABS.INCOMING_JSON}>
              <JsonDisplay jsonArray={farm.incomingPayloads} />
            </TabsContent>
            <TabsContent value={TABS.RAW_RESPONSE}>
              <JsonDisplay jsonArray={[farm]} />
            </TabsContent>
            <TabsContent value={TABS.FARM_SEASON_HISTORY}>
              <FarmSeasonHistory
                farm={farm}
                currentUser={currentUser}
                organisationId={organisations.current}
              />
            </TabsContent>
          </Tabs>
        </div>
        {/*Right-hand side box*/}
        <FarmDetailsCard farm={farm} mainContactPerson={mainContactPerson} />
      </main>
    </>
  );
}
