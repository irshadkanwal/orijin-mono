import { Certification, CertificationType } from "@/types/certification";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { commonFilters, createColumns } from "./common-columns";
import { DataTableFilter } from "@/components/table/datatable-types";
import { formatDate } from "@/lib/utils";

// Certification Types COLUMNS
export const certificationTypesColumnHelper: ColumnHelper<CertificationType> =
  createColumnHelper<CertificationType>();

export const initialCertificationTypesColumns = createColumns(
  certificationTypesColumnHelper
);

export const certificationTypesTableFilters: DataTableFilter[] = [
  ...commonFilters,
];

// Certification COLUMNS
export const certificationsColumnHelper: ColumnHelper<Certification> =
  createColumnHelper<Certification>();

export const initialCertificationsColumns = createColumns(
  certificationsColumnHelper,
  {
    status: {
      id: "status",
    },
    startAt: {
      id: "startsAt",
      header: "Starts At",
      cell: (cell: any) => formatDate(cell.row.original.startsAt),
      meta: {
        type: "date",
      },
    },
    endAt: {
      id: "endsAt",
      header: "Ends At",
      cell: (cell: any) => formatDate(cell.row.original.endsAt),
      meta: {
        type: "date",
        errors: [],
      },
    },
    certificationTypeId: {
      id: "Certification Type",
      header: "Certification Type",
      cell: (cell: any) => cell.row.original.certificationType?.name,
      meta: {
        type: "select",
        importId: "certificationTypeCode",
      },
    },
    farmId: {
      id: "Farm",
      header: "Farm",
      cell: (cell: any) => cell.row.original.farm?.name,
      meta: {
        type: "select",
        importId: "farmCode",
        errors: [],
      },
    },
    plotId: {
      id: "Plot",
      header: "Plot",
      cell: (cell: any) => cell.row.original.plot?.name,
      meta: {
        type: "select",
        importId: "plotCode",
        errors: [],
      },
    },
  }
);

export const certificationsTableFilters: DataTableFilter[] = [...commonFilters];
