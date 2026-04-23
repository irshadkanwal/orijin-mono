import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Separator } from "../ui/separator";
import FarmSeasonHistoryChart from "../charts/FarmSeasonHistoryChart";
import type { Farm } from "@/types/farm";
import type { UserWithToken } from "@/types/auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { farmSeasonsHistoryQueryOptions } from "@/services/farm-service";
import { CountSubType, CountType } from "@/components/farms/single-plot.tsx";

type FarmSeasonHistoryProps = {
  organisationId: string;
  farm: Farm;
  currentUser?: UserWithToken | null | undefined;
};

const FarmSeasonHistory = ({
  farm,
  currentUser,
  organisationId,
}: FarmSeasonHistoryProps) => {
  const queryResponse = useSuspenseQuery(
    farmSeasonsHistoryQueryOptions(
      organisationId,
      farm.id,
      currentUser?.accessToken
    )
  );
  const TREE_MULTIPLIER = 100;
  const farmSeasonsHistory = React.useMemo(() => {
    const farmSeasons = queryResponse?.data?.filter((item) => item.farm);
    return farmSeasons?.map((farmSeason) => {
      const farm = farmSeason.farm;
      const numberOfPlots = farm?.plots?.length;
      const contactPerson = farm?.facility?.mainContactPerson?.firstName;
      const countOfTrees = farm?.plots.reduce((acc, plot) => {
        const productive = plot.plotCountItems.filter(
          (count) =>
            count.type === CountType.MainCrop &&
            count.subType === CountSubType.Productive
        );
        console.log("got prod", productive);
        return acc + (productive[0]?.count / TREE_MULTIPLIER || 0);
      }, 0);
      return {
        id: farmSeason.seasonId,
        seasonShortCode: farmSeason.seasonCode,
        contactPerson: contactPerson,
        areaOfFarm:
          farmSeason.farm.plots.reduce((acc, plot) => {
            const activePolygon = plot.polygons?.filter(
              (poly) => poly.active
            )[0];
            const size = activePolygon
              ? parseFloat(activePolygon.areaCalculated)
              : plot.areaSizeManual;
            acc += size;
            return acc;
          }, 0) || 0,
        numberOfPlots: numberOfPlots || 0,
        countOfTrees: countOfTrees,
      };
    });
  }, [queryResponse]);

  if (!farmSeasonsHistory?.length) {
    return (
      <Card className="my-4 overflow-hidden">
        <CardHeader className="px-7">
          <div className="font-semibold">Farm Season History</div>
          <div className="hidden text-sm text-muted-foreground md:inline">
            No history found for this farm
          </div>
        </CardHeader>
      </Card>
    );
  }
  return (
    <>
      <Card className="my-4 overflow-hidden">
        <CardHeader className="px-7">
          <div className="font-semibold">Farm KPI's across seasons</div>
          <div className="hidden text-sm text-muted-foreground md:inline">
            Visual representation of the area of the farm and number of plots
            across different seasons.
          </div>
          <Separator className="my-2" />
        </CardHeader>
        <CardContent>
          <FarmSeasonHistoryChart chartData={farmSeasonsHistory} />
        </CardContent>
      </Card>

      <Card className="my-4 overflow-hidden">
        <CardHeader className="px-7">
          <div className="font-semibold">Farm Season History</div>
          <div className="hidden text-sm text-muted-foreground md:inline">
            View detailed information about the farm for each season.
          </div>
          <Separator className="my-2" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Season</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Area of Farm (acres)
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Number of Plots
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Productive trees count
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Contact Person
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farmSeasonsHistory?.map((season, index) => (
                <TableRow key={index}>
                  <TableCell>{season.seasonShortCode}</TableCell>
                  <TableCell>{season.areaOfFarm.toFixed(2)}</TableCell>
                  <TableCell>{season.numberOfPlots}</TableCell>
                  <TableCell>
                    {(season.countOfTrees * TREE_MULTIPLIER).toFixed(0)}
                  </TableCell>
                  <TableCell>{season.contactPerson}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default FarmSeasonHistory;
