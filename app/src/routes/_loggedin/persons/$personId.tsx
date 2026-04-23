import type { Person } from "@/types/person";
import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { personQueryOptions } from "@/services/person-service.ts";
import { Button } from "@/components/ui/button.tsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { PersonNotifications } from "@/components/persons/person-notifications.tsx";
import { PrintKeyValue } from "@/components/print-key-value.tsx";
import { DataTable } from "@/components/table/datatable";
import {
  initialServiceActivityColumns,
  serviceActivityColumnHelper,
} from "@/config/supporting-service-column";
import type { SupportServiceBeneficiary } from "@/types/support-service";
import { formatDate } from "@/lib/utils";
import {
  initialContactsColumns,
  initialWalletsColumns,
} from "@/config/persons-column.tsx";
import { rootKeys } from "@/config/rootKeys";
import { commonTableQuerySchema } from "@/types/common-types";

export const Route = createFileRoute(rootKeys.personId)({
  component: PersonPage,
  loader: (opts) => {
    return opts.context.queryClient.ensureQueryData(
      personQueryOptions(
        opts.context.auth.organisations.current,
        opts.params.personId,
        opts.context.auth.currentUser?.accessToken
      )
    );
  },
});

const TABS = {
  PERSON: "Person",
  SERVICES: "Services ",
  CONTACTS: "Contacts ",
  WALLETS: "Wallets ",
};

function PersonPage(): JSX.Element {
  const params = Route.useParams();
  const {
    auth: { currentUser, organisations },
  } = useRouteContext({ from: rootKeys.personId });
  const personQuery = useSuspenseQuery(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    personQueryOptions(
      organisations.current,
      params.personId,
      currentUser?.accessToken
    )
  );
  const person: Person = personQuery.data;
  const customLocation = person?.mainContactPersonFor?.[0]?.customLocation;
  const contacts = person?.contacts;
  console.log("contact", contacts);
  const wallets = (person?.contacts || []).flatMap((c) => {
    return c.wallets.map((w) => {
      return {
        ...w,
        contact: c,
      };
    });
  });
  console.log("wallets", wallets);
  // const customLocation = person?.contacts
  const supportingServiceActivities = person?.ServiceActivityBeneficiaries?.map(
    (item: SupportServiceBeneficiary) => {
      const { supportingServiceActivity } = item;
      return {
        ...supportingServiceActivity, // All properties from supportingServiceActivity
        customLocation, // Add customLocation as a new field
        itemValue: item.itemValue,
        itemsProcessed: item.itemsProcessed,
        primary: item.primary,
        score: item.score,
        total: item.total,
        grade: item.grade,
      };
    }
  );
  // const supportingServiceActivities = person?.con?.map(
  //     (item: { supportingServiceActivity: SupportServiceActivity }) => ({
  //       ...item.supportingServiceActivity,
  //       customLocation, // Add customLocation to each supportingServiceActivity
  //     })
  // );
  if (!person) {
    // TODO: Caused by the auth.organisations.current being fetched only after this page already starts to reload!
    // ..might get fixed with Zustand storing the value. But could then still happen if a new login is required, and login redirects directly here.
    return <>Loading</>;
  }

  const additionalColumns =
    supportingServiceActivities?.length > 0
      ? [
          serviceActivityColumnHelper.accessor((row) => row.primary, {
            id: "primary",
          }),
          serviceActivityColumnHelper.accessor(
            (row) => formatDate(row.createdAt),
            {
              id: "Activity createdAt",
            }
          ),
          serviceActivityColumnHelper.accessor(
            (row) => row.customLocation?.name,
            {
              id: "Person Custom location",
            }
          ),
        ]
      : [];
  const columns = [...initialServiceActivityColumns, ...additionalColumns];
  const contactsCols = [...initialContactsColumns];
  const walletsCols = [...initialWalletsColumns];
  // const facility: Facility = person?.facility;
  // const mainContactPerson: Person = facility?.mainContactPerson;
  const farmDetail = person?.mainContactPersonFor[0];
  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <Tabs defaultValue={TABS.PERSON}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger className="capitalize" value={TABS.PERSON}>
                {TABS.PERSON}
              </TabsTrigger>
              <TabsTrigger className="capitalize" value={TABS.SERVICES}>
                {TABS.SERVICES}
              </TabsTrigger>
              <TabsTrigger className="capitalize" value={TABS.CONTACTS}>
                {TABS.CONTACTS}
              </TabsTrigger>
              <TabsTrigger className="capitalize" value={TABS.WALLETS}>
                {TABS.WALLETS}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={TABS.PERSON}>
            <div className="grid items-start gap-4  md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <PersonNotifications person={person} />
              </div>
              <div className="grid gap-4 grid-cols-1">
                <Card className="overflow-hidden">
                  <CardContent className="p-6 text-sm">
                    <div className="grid gap-3">
                      <div className="font-semibold">Person Details</div>
                      <ul className="grid gap-3">
                        <PrintKeyValue
                          label={"firstName"}
                          value={person.firstName}
                        />
                        <PrintKeyValue
                          label={"middleName"}
                          value={person.middleName}
                        />
                        <PrintKeyValue
                          label={"lastName"}
                          value={person.lastName}
                        />
                        {/*<PrintKeyValue*/}
                        {/*  label={"contractDate"}*/}
                        {/*  value={person.contractDate}*/}
                        {/*  type={"date"}*/}
                        {/*/>*/}
                        {/*<PrintKeyValue*/}
                        {/*  label={"registrationDate"}*/}
                        {/*  value={person.registrationDate}*/}
                        {/*  type={"date"}*/}
                        {/*/>*/}
                        {/*<PrintKeyValue*/}
                        {/*  label={"lastInspectionDate"}*/}
                        {/*  value={person.lastInspectionDate}*/}
                        {/*  type={"date"}*/}
                        {/*/>*/}
                        {/*<PrintKeyValue*/}
                        {/*  label={"areaTotalManual (h)"}*/}
                        {/*  value={person.facility.areaTotalManual}*/}
                        {/*  type={"decimal"}*/}
                        {/*/>*/}
                        {/*<PrintKeyValue*/}
                        {/*  label={"areaTotalCalculated"}*/}
                        {/*  value={person.areaTotal}*/}
                        {/*  type={"decimal"}*/}
                        {/*/>*/}
                      </ul>
                      <Separator className="my-2" />
                      {farmDetail?.farm && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Farm Detail</span>
                            <Link
                              className="blue underline"
                              to={"/farms/" + farmDetail.farm.id}
                            >
                              View farm
                            </Link>
                          </div>
                          <ul className="grid gap-3">
                            <PrintKeyValue
                              label={"Approval status"}
                              value={farmDetail.farm.approvalStatus}
                            />
                            <PrintKeyValue
                              label={"contractDate"}
                              value={farmDetail.farm.contractDate}
                              type={"date"}
                            />
                            <PrintKeyValue
                              label={"registrationDate"}
                              value={farmDetail.farm.registrationDate}
                              type={"date"}
                            />
                            <PrintKeyValue
                              label={"lastInspectionDate"}
                              value={farmDetail.farm.lastInspectionDate}
                              type={"date"}
                            />
                            <PrintKeyValue
                              label={"areaTotalManual (h)"}
                              value={farmDetail.areaTotalManual}
                              type={"decimal"}
                            />
                            <PrintKeyValue
                              label={"areaTotalCalculated"}
                              value={farmDetail.farm.areaTotal}
                              type={"decimal"}
                            />
                          </ul>
                        </>
                      )}
                      {/*<div className="font-semibold">Contact Person / Personer</div>*/}
                      {/*{mainContactPerson && (*/}
                      {/*  <ul className="grid gap-3">*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"name"}*/}
                      {/*      value={*/}
                      {/*        mainContactPerson.firstName +*/}
                      {/*        " " +*/}
                      {/*        mainContactPerson.lastName*/}
                      {/*      }*/}
                      {/*    />*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"gender"}*/}
                      {/*      value={mainContactPerson.gender}*/}
                      {/*    />*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"dateOfBirth"}*/}
                      {/*      value={mainContactPerson.dateOfBirth}*/}
                      {/*      type={"date"}*/}
                      {/*    />*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"maritalStatus"}*/}
                      {/*      value={mainContactPerson.maritalStatus}*/}
                      {/*    />*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"phone"}*/}
                      {/*      value={mainContactPerson.phone}*/}
                      {/*    />*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"email"}*/}
                      {/*      value={mainContactPerson.email}*/}
                      {/*    />*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"identificationNumber"}*/}
                      {/*      value={mainContactPerson.identificationNumber}*/}
                      {/*    />*/}
                      {/*    <PrintKeyValue*/}
                      {/*      label={"identificationNumberType"}*/}
                      {/*      value={mainContactPerson.identificationNumberType}*/}
                      {/*    />*/}
                      {/*  </ul>*/}
                      {/*)}*/}
                      <Separator className="my-2" />

                      <div className="font-semibold">Processing facility</div>
                      <ul className="grid gap-3">
                        <PrintKeyValue
                          label={"parentFacility"}
                          value={person.parentFacilityName}
                        />
                      </ul>

                      <Separator className="my-2" />
                      <div className="font-semibold">Location</div>
                      <ul className="grid gap-3">
                        {/*<PrintKeyValue*/}
                        {/*  label={"Village"}*/}
                        {/*  value={person.facility.location?.name}*/}
                        {/*/>*/}
                        {/*<PrintKeyValue*/}
                        {/*  label={"Parish"}*/}
                        {/*  value={person.facility.location?.parent?.name}*/}
                        {/*/>*/}
                        {/*<PrintKeyValue*/}
                        {/*  label={"Subcounty"}*/}
                        {/*  value={person.facility.location?.parent?.parent?.name}*/}
                        {/*/>*/}
                        {/*<PrintKeyValue*/}
                        {/*  label={"District"}*/}
                        {/*  value={person.facility.location?.parent?.parent?.parent?.name}*/}
                        {/*/>*/}
                        {/*<pre>{JSON.stringify(person.facility.location, null, 4)}</pre>*/}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      Updated <time dateTime="{person.updatedAt}"></time>
                    </div>
                    <Pagination className="ml-auto mr-0 w-auto">
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
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
            </div>
          </TabsContent>

          <TabsContent value={TABS.SERVICES}>
            <div className="grid auto-rows-max items-start gap-2 md:gap-4 lg:col-span-1">
              <DataTable
                columns={columns}
                data={supportingServiceActivities || []}
                count={supportingServiceActivities.length}
                searchFrom={rootKeys.personId}
                filters={[]}
                tableQuerySchema={commonTableQuerySchema}
                fields={[]}
                isFiltrationActive={true}
              />
            </div>
          </TabsContent>

          <TabsContent value={TABS.CONTACTS}>
            <div className="grid auto-rows-max items-start gap-2 md:gap-4 lg:col-span-1">
              <DataTable
                columns={contactsCols}
                data={contacts || []}
                isFiltrationActive={false}
              />
            </div>
          </TabsContent>

          <TabsContent value={TABS.WALLETS}>
            <div className="grid auto-rows-max items-start gap-2 md:gap-4 lg:col-span-1">
              <DataTable
                columns={walletsCols}
                data={wallets || []}
                isFiltrationActive={false}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
