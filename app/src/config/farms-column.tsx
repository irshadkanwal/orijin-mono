import { type ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import type { Farm, Plot, Polygon } from "@/types/farm";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge.tsx";
import { SortingButton } from "@/components/table/sorting-button";
import type { DataTableFilter } from "@/components/table/datatable-types";
import { rootKeys } from "@/config/rootKeys";
import { farmsTableQuerySchema } from "@/types/farms-types";
import type { ILocation } from "@/types/location";
import { createColumns } from "./common-columns";

const printLocationTree = (location: ILocation) => {
  if (!location) return "";
  let displayName = location.name;
  if (!location.parent) {
    return displayName;
  }
  displayName += " - " + location.parent.name;
  if (!location.parent.parent) {
    return displayName;
  }
  displayName += " - " + location.parent.parent.name;
  if (!location.parent.parent.parent) {
    return displayName;
  }
  displayName += " - " + location.parent.parent.parent.name;
  return displayName;
};

const farmsColumnHelper: ColumnHelper<Farm> = createColumnHelper<Farm>();
// https://tanstack.com/table/v8/docs/guide/column-defs
export const farmsTableColumns = (
  farmsTableFilters: DataTableFilter[] = []
) => [
  // Shortcode
  farmsColumnHelper.accessor("facility.shortCode", {
    id: "shortCode",
    cell: (cell) => {
      return (
        <Link to={"/farms/" + cell.row.original.id}>
          {cell.row.original.facility.shortCode}
        </Link>
      );
    },
    // header: () => <span>ID</span>,
    footer: (cell) => cell.column.id,
    header: () => (
      <SortingButton
        columnName="ID"
        searchFrom={rootKeys.farms}
        filters={farmsTableFilters}
        tableQuery={farmsTableQuerySchema}
      ></SortingButton>
    ),
  }),

  farmsColumnHelper.accessor("season.shortCode", {
    id: "Season",
    cell: (cell) => cell.row.original.season?.shortCode,
    header: () => "Season",
    meta: {
      isHideInForm: true,
    },
  }),

  // Name
  farmsColumnHelper.accessor("facility.name", {
    id: "name",
    cell: (cell) => <b>{cell.row.original.facility.name}</b>,
    header: () => (
      <SortingButton
        columnName="Name"
        searchFrom={rootKeys.farms}
        filters={farmsTableFilters}
        tableQuery={farmsTableQuerySchema}
      ></SortingButton>
    ),
    footer: (cell) => cell.column.id,
  }),

  // Location
  farmsColumnHelper.accessor(
    // (row) => row.facility?.location?.parent?.parent?.parent?.name,
    (row) => {
      return printLocationTree(row.facility?.location);
    },
    {
      id: "Location",
      meta: {
        isHideInForm: true,
      },
    }
  ),

  // Custom location
  // TODO: Add Organisation-specific Settings, and define if this should be showed or not (yes for MH, no for others)
  farmsColumnHelper.accessor(
    // (row) => row.facility?.location?.parent?.parent?.parent?.name,
    (row) => {
      return printLocationTree(row.facility?.customLocation);
    },
    {
      id: "Farmer group",
      meta: {
        isHideInForm: true,
      },
    }
  ),

  // Plot count
  farmsColumnHelper.accessor(
    (row: Farm) => {
      // row.plots[0]?.polygons.find((poly) => poly.active).areaCalculated || '',
      return row.plots.length || 0;
    },
    {
      id: "Plots",
      meta: {
        isHideInForm: true,
      },
    }
  ),

  // Polygons
  farmsColumnHelper.accessor(
    (row: Farm) => {
      // TODO: Is this even reasonable? We would need a plot-specific status, not a common status for all
      if (row.plots.length === 0 || row.plots[0]?.polygons.length === 0) {
        return "NONE";
      }
      const activePolygons = row.plots[0]?.polygons?.filter(
        (poly: Polygon) => poly.active
      );
      if (!activePolygons || activePolygons.length === 0) {
        return "FAILED";
      }
      const poly = activePolygons[0];
      const warnings = [
        ...poly.polygonWarnings,
        ...poly.polygonInteractionWarnings,
      ]
        .filter((noNulls) => noNulls)
        .filter((warning) => warning.fixed === false);
      if (warnings.length > 0) {
        return "WARNINGS";
      }
      return "OK";
    },
    {
      id: "Polygons",
      cell: (cell) => {
        const status = cell.getValue();
        if (!status || status === "NONE") {
          return <Badge variant="outline">Not collected</Badge>;
        } else if (status === "FAILED") {
          return <Badge variant="destructive">Failed</Badge>;
        } else if (status === "WARNINGS") {
          return <Badge>Warnings</Badge>;
        } else {
          return <Badge variant="secondary">OK</Badge>;
        }
      },
      meta: {
        isHideInForm: true,
      },
    }
  ),

  // Farm size
  farmsColumnHelper.accessor(
    (row: Farm) => {
      // row.plots[0]?.polygons.find((poly) => poly.active).areaCalculated || '',
      const activePolygon = row.plots[0]?.polygons.find(
        (poly: any) => poly.active
      );
      if (activePolygon && activePolygon.areaCalculated) {
        return parseFloat(activePolygon.areaCalculated).toFixed(2) + " ha";
      }
      return "";
    },
    {
      id: "Size",
      meta: {
        isHideInForm: true,
      },
    }
  ),

  // Satellite done
  farmsColumnHelper.accessor(
    (row: Farm) => {
      const allAnalyses = row.plots.map((plot) => plot.satelliteAnalysis);
      const allAnalysesFlat = allAnalyses.flat();
      if (
        allAnalysesFlat.filter((x) => x.deforestationRisk === "high").length > 0
      ) {
        return "high";
      }
      if (
        allAnalysesFlat.filter((x) => x.deforestationRisk === "medium").length >
        0
      ) {
        return "medium";
      }
      if (
        allAnalysesFlat.filter((x) => x.deforestationRisk === "low").length > 0
      ) {
        return "low";
      }
      if (allAnalysesFlat.length > 0) {
        return "pending";
      }
      return "";
    },
    {
      id: "Defor risk",
      cell: (cell) => {
        //   console.log(cell.getValue());
        //   console.log(cell.row.original.plots[0]);
        if (cell.getValue() === "high" || cell.getValue() === "medium") {
          return <Badge variant="destructive">{cell.getValue()}</Badge>;
        }
        if (cell.getValue() === "low") {
          return <Badge variant="default">OK</Badge>;
        }
        return <Badge variant="outline">Not done</Badge>;
      },
      meta: {
        isHideInForm: true,
      },
    }
  ),

  farmsColumnHelper.accessor(
    (row: Farm) =>
      row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "",
    {
      id: "UpdatedAt",
      meta: {
        isHideInForm: true,
      },
    }
  ),

  farmsColumnHelper.accessor((row: Farm) => row.updatedBy, {
    id: "UpdatedBy",
    meta: {
      isHideInForm: true,
    },
  }),
];

/** Kind of UI-fy filters, settings props which only make sense on the frontend */
export const updateTableFilters = (
  filters?: DataTableFilter[] | null,
  only?: string[]
) => {
  return (
    (filters || [])
      .filter((filter) => (only ? only.includes(filter.key) : true))
      .map((filter: DataTableFilter) => {
        if (filter.key === "shortCode") {
          filter.size = "s";
        } else if (filter.key === "location") {
          filter.getColumn = (table) => table.getColumn("Location");
        } else if (filter.key === "customLocation") {
          filter.getColumn = (table) => table.getColumn("Farmer group");
        } else if (filter.key === "seasonCode") {
          filter.getColumn = (table) => table.getColumn("Season");
        } else if (filter.key === "polygonStatus") {
          filter.getColumn = (table) => table.getColumn("Polygons");
        }
        return filter;
      }) ?? []
  );
};

// Persons COLUMNS

export const plotsColumnHelper: ColumnHelper<Plot> = createColumnHelper<Plot>();

export const initialPlotsColumns = createColumns(plotsColumnHelper, {
  type: {
    id: "type",
    header: "Type",
  },
  status: {
    id: "status",
    header: "Status",
  },
  certificationStatus: {
    id: "certificationStatus",
    header: "Certification Status",
  },
  interCropped: {
    id: "interCropped",
    header: "Inter Cropped",
  },
  active: {
    id: "active",
    header: "Active",
  },
  yieldEstimateRaw: {
    id: "yieldEstimateRaw",
    header: "Yield Estimate Raw",
  },
  yieldEstimateProcessed: {
    id: "yieldEstimateProcessed",
    header: "Yield Estimate Processed",
  },
  cultivationStartDate: {
    id: "cultivationStartDate",
    header: "Cultivation Start Date",
  },
  registrationDate: {
    id: "registrationDate",
    header: "Registration Date",
  },
  lastChemicalUseDate: {
    id: "lastChemicalUseDate",
    header: "Last Chemical Use Date",
  },
  principalOwnsLand: {
    id: "principalOwnsLand",
    header: "Principal Owns Land",
  },
  principalLeasesLand: {
    id: "principalLeasesLand",
    header: "Principal Leases Land",
  },
  hasRightToLand: {
    id: "hasRightToLand",
    header: "Has Right To Land",
  },
  hasLandTitle: {
    id: "hasLandTitle",
    header: "Has Land Title",
  },
  ownerName: {
    id: "ownerName",
    header: "Owner Name",
  },
  establishedBefore2020: {
    id: "establishedBefore2020",
    header: "Established Before 2020",
  },
  hasShadeTrees: {
    id: "hasShadeTrees",
    header: "Has Shade Trees",
  },
  distanceToForestKnown: {
    id: "distanceToForestKnown",
    header: "Distance To Forest Known",
  },
  distanceToForest: {
    id: "distanceToForest",
    header: "Distance To Forest",
  },
  traditionalOwners: {
    id: "traditionalOwners",
    header: "Traditional Owners",
  },
  traditionalOwnersPresent: {
    id: "traditionalOwnersPresent",
    header: "Traditional Owners Present",
  },
  areaSizeManual: {
    id: "areaSizeManual",
    header: "Area Size Manual",
  },
  areaSizeOrganicManual: {
    id: "areaSizeOrganicManual",
    header: "Area Size Organic Manual",
  },
  farmId: {
    id: "farmId",
    header: "Farm Name",
    cell: (cell: any) => cell.row.original.farm?.name,
    meta: {
      type: "select",
      importId: "farmCode",
    },
  },
});
