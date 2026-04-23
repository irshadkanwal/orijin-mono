import { Plot, Farm } from "@/types/farm";
import { DataTable } from "../table/datatable";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { rootKeys } from "@/config/rootKeys";
import { farmsTableQuerySchema } from "@/types/farms-types";
import { DataTableFilter } from "../table/datatable-types";

type PlotsTableProps = {
  tab: string;
  farms: Farm[];
  count: number;
  filters: DataTableFilter[];
};

const plotsColumnHelper: ColumnHelper<Farm | Plot> = createColumnHelper<
  Farm | Plot
>();

export const plotsTableColumns = [
  // Farm Shortcode
  plotsColumnHelper.accessor("facility.shortCode", {
    id: "shortCode",
    cell: (cell) => {
      return (
        <Link to={"/farms/" + cell.row.original.id}>{cell.getValue()}</Link>
      );
    },
    header: () => <span>Farm ID</span>,
    footer: (cell) => cell.column.id,
  }),

  plotsColumnHelper.accessor((row: Farm) => row.season?.shortCode, {
    id: "seasonCode",
    header: () => <span>Season</span>,
  }),

  // Plot Shortcode
  plotsColumnHelper.accessor((row: Farm) => row.plots[0]?.shortCode, {
    id: "plotShortCode",
    header: () => <span>Plot ID</span>,
    footer: (cell) => cell.column.id,
  }),

  // Plot size with adding polygon areas
  plotsColumnHelper.accessor(
    (row: Farm) => {
      const plot = row.plots[0] as Plot;
      if (!plot) return "0.00";
      const polygonAreas = plot.polygons.map(
        (polygon) => polygon.areaCalculated || 0 // Ensure that areaCalculated is a number
      );
      const totalArea = polygonAreas.reduce((a, b) => a + b, 0);
      if (totalArea > 0 && totalArea < 1e-2) {
        return "<0.01";
      }

      return Number(totalArea).toFixed(2);
    },
    {
      id: "plotSize",
      header: () => <span>Plot Size</span>,
      footer: (cell) => cell.column.id,
    }
  ),
  plotsColumnHelper.accessor(
    (row: Farm) => {
      const coordinates = row.plots[0]?.polygons[0]?.coordinates?.[0];
      return coordinates && coordinates.length >= 2
        ? coordinates[0].toFixed(2) // Return latitude
        : ""; // Return an empty string if any check fails
    },
    {
      id: "latitude",
      header: () => <span>Latitude</span>,
    }
  ),
  plotsColumnHelper.accessor(
    (row: Farm) => {
      const coordinates = row.plots[0]?.polygons[0]?.coordinates?.[0];
      return coordinates && coordinates.length >= 2
        ? coordinates[1].toFixed(2) // Return latitude
        : ""; // Return an empty string if any check fails
    },
    {
      id: "longitude",
      header: () => <span>Longitude</span>,
    }
  ),
];
export default function PlotsTable({
  tab,
  farms,
  count,
  filters,
}: PlotsTableProps) {
  // const plots = farms.flatMap((farm) => farm.plots) as Plot[];

  return (
    <DataTable
      tab={tab}
      data={farms}
      count={count}
      fields={["facility.shortCode", "facility.name"]}
      searchFrom={rootKeys.farms}
      filters={filters}
      tableQuerySchema={farmsTableQuerySchema}
      columns={plotsTableColumns}
      isFiltrationActive={true}
    ></DataTable>
  );
}
