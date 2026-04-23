import { useState, useEffect } from "react";
import {
  downloadGeoJsonFile,
  exportTableToExcel,
} from "@/hooks/utils/export-helpers";
import { ColumnDef } from "@tanstack/react-table";
import { QueryClient } from "@tanstack/react-query";
import { AppAuth } from "@/types/auth";
import { getTableDataForExport } from "@/services/export-service";
import { useDataTable } from "./use-data-table";

type TableExportHandlerProps<TData, TValue> = {
  auth: AppAuth;
  queryClient: QueryClient;
  columns: ColumnDef<TData, TValue>[];
  pathName: string;
  visibleColumns: string[];
};

export const useTableExportHandler = <TData, TValue>({
  auth,
  queryClient,
  columns,
  pathName,
  visibleColumns,
}: TableExportHandlerProps<TData, TValue>) => {
  const [exportData, setExportData] = useState<TData[]>([]);
  const [shouldExport, setShouldExport] = useState(false);

  const tableInstance = useDataTable(exportData, columns);

  useEffect(() => {
    if (shouldExport && exportData.length > 0) {
      const rows = tableInstance.table.getCoreRowModel().rows.map((row) =>
        row
          .getVisibleCells()
          .filter((cell) => visibleColumns.includes(cell.column.id))
          .map((cell) => cell.getValue())
      );

      exportTableToExcel(visibleColumns, rows, "all-table-data");
      setShouldExport(false);
    }
  }, [shouldExport, exportData, visibleColumns, tableInstance]);

  const handleExportAll = async (
    filters: Record<string, any>,
    isV1DataTable?: boolean
  ) => {
    const v1Path = `/firebase/documents`;
    const v1Filters = isV1DataTable
      ? {
          workspace: `${auth.organisations.current}_master`,
          collection: filters["tab"] || "prodlots",
        }
      : {};
    try {
      const data = await getTableDataForExport({
        auth,
        queryClient,
        pathName: isV1DataTable ? v1Path : pathName,
        filters: {
          ...filters,
          ...v1Filters,
          page: 1,
          limit: 9999,
        },
        isV1DataTable,
      });

      setExportData(data as TData[]);
      setShouldExport(true);
    } catch (error) {
      console.error("Failed to export all table data:", error);
    }
  };

  const handleExportAllGeoJson = async (filters: Record<string, any>) => {
    try {
      // Fetch farms and their plots with polygons
      const data = await getTableDataForExport({
        auth,
        queryClient,
        pathName,
        filters,
      });
      const polygons = data
        .flatMap((farm) =>
          farm.plots.map((plot) => {
            const activePolygons = plot.polygons.filter(
              (polygon) => polygon.active
            );

            if (activePolygons.length > 0) {
              const polygon = activePolygons[0];
              const isSinglePoint = polygon.coordinates.length === 1;

              // If it has only one point, it's a Point; otherwise, it's a Polygon
              return {
                properties: {
                  farmShortCode: farm.facility.shortCode,
                  plotShortCode: plot.shortCode,
                  updatedBy: farm.updatedBy,
                  updatedAt: farm.updatedAt,
                },
                geometry: isSinglePoint
                  ? {
                      type: "Point",
                      coordinates: polygon.coordinates[0],
                    }
                  : {
                      type: "Polygon",
                      coordinates: [polygon.coordinates],
                    },
              };
            }

            return null;
          })
        )
        .filter((polygon) => polygon);

      const geoJson = {
        type: "FeatureCollection",
        features: polygons.map((polygon) => ({
          type: "Feature",
          properties: polygon.properties,
          geometry: polygon.geometry,
        })),
      };

      downloadGeoJsonFile(geoJson, "GeoJson-Export");
    } catch (error) {
      console.error("Failed to export GeoJSON data as Excel:", error);
    }
  };

  return {
    handleExportAllGeoJson,
    handleExportAll,
    tableInstance,
  };
};
