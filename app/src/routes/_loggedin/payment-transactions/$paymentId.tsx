import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { fetchOneQueryOptions } from "@/services/common-service";
import { PrintKeyValue } from "@/components/print-key-value";
import { rootKeys } from "@/config/rootKeys";

export const Route = createFileRoute(
  rootKeys.paymentTransactionsId
)({
  loader: async ({ deps, context, location }) => {
    // Extract the last path segment
    const lastPathSegment: string =
      location.pathname.split("/").filter(Boolean).pop() ?? "";
    const { queryClient, auth } = context;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const data = await queryClient.ensureQueryData(
      fetchOneQueryOptions(
        auth.organisations.current,
        "/payment-transactions",
        lastPathSegment,
        auth.currentUser?.accessToken
      )
    );
    return {
      data,
      lastPathSegment,
    };
  },
  
  component: PaymentTransactionsPage,
});

function PaymentTransactionsPage(): JSX.Element {
  const { data } = useLoaderData({
    from: rootKeys.paymentTransactionsId,
  });

  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
        <div className="grid items-start gap-4  md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>
                  Account Name:{" "}
                  {data?.payeeFirstName + " " + data?.payeeLastName}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  {data && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          Payment Transactions Detail:
                        </span>
                      </div>
                      <ul className="grid gap-3">
                        <PrintKeyValue label={"amount"} value={data?.amount} />
                        <PrintKeyValue
                          label={"createdAt"}
                          value={data?.createdAt}
                        />

                        <PrintKeyValue
                          label={"conversionToUSD"}
                          value={data?.conversionToUSD}
                        />
                        <PrintKeyValue
                          label={"currency"}
                          value={data?.currency}
                        />
                        <PrintKeyValue label={"status"} value={data?.status} />
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1">
            <Card className="overflow-hidden">
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  {data?.farm && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Farm Detail</span>
                        <Link
                          className="blue underline"
                          to={"/farms/" + data.farm.id}
                        >
                          View farm
                        </Link>
                      </div>
                      <ul className="grid gap-3">
                        <PrintKeyValue
                          label={"Approval status"}
                          value={data.farm.approvalStatus}
                        />
                        <PrintKeyValue
                          label={"contractDate"}
                          value={data.farm.contractDate}
                          type={"date"}
                        />
                        <PrintKeyValue
                          label={"registrationDate"}
                          value={data.farm.registrationDate}
                          type={"date"}
                        />
                        <PrintKeyValue
                          label={"lastInspectionDate"}
                          value={data.farm.lastInspectionDate}
                          type={"date"}
                        />
                        <PrintKeyValue
                          label={"areaTotalManual (h)"}
                          value={data.areaTotalManual}
                          type={"decimal"}
                        />
                        <PrintKeyValue
                          label={"areaTotalCalculated"}
                          value={data.farm.areaTotal}
                          type={"decimal"}
                        />
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
