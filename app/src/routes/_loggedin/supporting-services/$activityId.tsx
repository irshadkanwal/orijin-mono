import { PrintKeyValue } from "@/components/print-key-value";
import { ActivityNotification } from "@/components/supporting-services/activity-notification";
import { DataTable } from "@/components/table/datatable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { initialPersonsColumns } from "@/config/persons-column";
import { formatDate } from "@/lib/utils";
import { supportingServicesActivityQueryOptions } from "@/services/supportingService-service";
import { Person } from "@/types/farm";
import { SupportServiceActivity } from "@/types/support-service";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute(
  "/_loggedin/supporting-services/$activityId"
)({
  component: ActivityDetailPage,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      supportingServicesActivityQueryOptions(
        opts.context.auth.organisations.current,
        opts.params.activityId,
        opts.context.auth.currentUser?.accessToken
      )
    );
  },
});

function ActivityDetailPage() {
  const params = Route.useParams();
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: `/_loggedin/supporting-services/$activityId` });
  const activityQuery = useSuspenseQuery(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    supportingServicesActivityQueryOptions(
      organisations.current,
      params.activityId,
      currentUser?.accessToken
    )
  );
  const activity: SupportServiceActivity = activityQuery.data;
  const persons = activity?.ServiceActivityBeneficiaries?.map(
    (item: { person: Person }) => item.person
  );

  const personColumns = initialPersonsColumns.slice(0, 6).map((item) => {
    const { header, ...rest } = item;
    return rest;
  });
  if (!activity) {
    return <div>Activity not found</div>;
  }

  return (
    <>
      <main className="grid items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <ActivityNotification activity={activity} />
          {persons.length > 0 && (
            <div className="grid auto-rows-max items-start gap-2 md:gap-4 lg:col-span-1">
              <h1 className="ml-4 font-bold">Persons</h1>
              <DataTable
                columns={personColumns}
                data={persons || []}
                isFiltrationActive={false}
              />
            </div>
          )}
        </div>
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Activity Details</div>
                <ul className="grid gap-3">
                  <PrintKeyValue
                    label={"organisation"}
                    value={activity.organisation}
                  />
                  <PrintKeyValue label={"operator"} value={activity.operator} />

                  <PrintKeyValue
                    label={"beneficiary type"}
                    value={activity.beneficiaryType}
                  />
                  <PrintKeyValue
                    label={"date Of Service"}
                    value={formatDate(activity.dateOfService)}
                  />
                </ul>
                <Separator className="my-2" />

                <Separator className="my-2" />

                <div className="font-semibold">Location</div>
                <ul className="grid gap-3">
                  <PrintKeyValue
                    label={"short Code"}
                    value={activity.location.shortCode}
                  />
                  <PrintKeyValue
                    label={"name"}
                    value={activity.location.name}
                  />
                  <PrintKeyValue
                    label={"type"}
                    value={activity.location.type}
                  />
                  <PrintKeyValue
                    label={"main Type"}
                    value={activity.location.mainType}
                  />
                </ul>

                <Separator className="my-2" />
                <div className="font-semibold">Activity Type</div>
                <ul className="grid gap-3">
                  <PrintKeyValue
                    label={"short Code"}
                    value={activity.supportingServiceActivityType.shortCode}
                  />
                  <PrintKeyValue
                    label={"name"}
                    value={activity.supportingServiceActivityType.name}
                  />
                  <PrintKeyValue
                    label={"description"}
                    value={activity.supportingServiceActivityType.description}
                  />
                  <PrintKeyValue
                    label={"type"}
                    value={activity.supportingServiceActivityType.type}
                  />
                </ul>

                <Separator className="my-2" />
                <div className="font-semibold">Category</div>
                <ul className="grid gap-3">
                  <PrintKeyValue
                    label={"short code"}
                    value={activity.supportingServiceCategory.shortCode}
                  />
                  <PrintKeyValue
                    label={"name"}
                    value={activity.supportingServiceCategory.name}
                  />
                  <PrintKeyValue
                    label={"description"}
                    value={activity.supportingServiceCategory.description}
                  />
                  <PrintKeyValue
                    label={"type"}
                    value={activity.supportingServiceCategory.type}
                  />
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated{" "}
                <time dateTime="{person.updatedAt}">
                  {formatDate(activity.updatedAt)}
                </time>
              </div>
              <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      disabled={true}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Previous Order</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      disabled={true}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Next Order</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
