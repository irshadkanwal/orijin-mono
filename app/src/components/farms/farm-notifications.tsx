import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { Farm } from "@/types/farm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSuspenseQuery } from "@tanstack/react-query";
import { farmSeasonsQueryOptions } from "@/services/farm-service";
import type { UserWithToken } from "@/types/auth";
import { useNavigate } from "@tanstack/react-router";

export function FarmNotifications({
  farm,
  organisationId,
  currentUser,
}: {
  organisationId: string;
  farm: Farm;
  currentUser?: UserWithToken;
}): JSX.Element {
  const response = useSuspenseQuery(
    farmSeasonsQueryOptions(organisationId, farm.id, currentUser?.accessToken)
  );
  const farmSeasons = response.data;
  const navigation = useNavigate();

  return (
    // <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
    <div className="grid gap-4 grid-cols-1">
      <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {farm.facility.shortCode}
            </h3>

            {farmSeasons && farmSeasons.find((s) => s.farmId) && (
              <Select
                value={farm.seasonId}
                onValueChange={(seasonId) => {
                  console.log(seasonId);
                  void navigation({
                    to: `/farms/${farmSeasons.find((s) => s.seasonId == seasonId)?.farmId}`,
                    state: {},
                  });
                }}
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue>
                    <span>
                      Season{" "}
                      {
                        farmSeasons.find((s) => s.seasonId === farm.seasonId)
                          ?.seasonCode
                      }
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper">
                  {farmSeasons?.map((data) => (
                    <SelectItem
                      key={data.seasonId}
                      value={data.seasonId}
                      disabled={!data.farmId}
                    >
                      {data.seasonCode}
                      {data.farmId ? (
                        ""
                      ) : (
                        <span className="text-destructive"> Not exists</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed">
            {farm.facility.name}
          </CardDescription>
        </CardHeader>
        {/*<CardFooter>*/}
        {/*  <Button>Assign Farm Inspection</Button>*/}
        {/*</CardFooter>*/}
      </Card>
      {/*<Card x-chunk="dashboard-05-chunk-1">*/}
      {/*  <CardHeader className="pb-2">*/}
      {/*    <CardDescription>This Week</CardDescription>*/}
      {/*    <CardTitle className="text-4xl">$1,329</CardTitle>*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <div className="text-xs text-muted-foreground">*/}
      {/*      +25% from last week*/}
      {/*    </div>*/}
      {/*  </CardContent>*/}
      {/*  <CardFooter>*/}
      {/*    <Progress value={25} aria-label="25% increase" />*/}
      {/*  </CardFooter>*/}
      {/*</Card>*/}
      {/*<Card x-chunk="dashboard-05-chunk-2">*/}
      {/*  <CardHeader className="pb-2">*/}
      {/*    <CardDescription>This Month</CardDescription>*/}
      {/*    <CardTitle className="text-4xl">$5,329</CardTitle>*/}
      {/*  </CardHeader>*/}
      {/*  <CardContent>*/}
      {/*    <div className="text-xs text-muted-foreground">*/}
      {/*      +10% from last month*/}
      {/*    </div>*/}
      {/*  </CardContent>*/}
      {/*  <CardFooter>*/}
      {/*    <Progress value={12} aria-label="12% increase" />*/}
      {/*  </CardFooter>*/}
      {/*</Card>*/}
    </div>
  );
}
