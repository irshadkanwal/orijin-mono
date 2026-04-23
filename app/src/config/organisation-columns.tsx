import { Organisation } from "@/types/organisation";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { createWithoutCommonColumns } from "./common-columns";
import { DataTableFilter } from "@/components/table/datatable-types";
import { FixWorkspacesDialog } from "@/components/dialog/fix-workspaces-dialog";
import { Button } from "@/components/ui/button";

export const organisationsColumnHelper: ColumnHelper<Organisation> =
  createColumnHelper<Organisation>();

export const initialOrganisationsColumns = createWithoutCommonColumns(
  organisationsColumnHelper,
  {
    id: {
      id: "ID",
      header: "ID",
      cell: (cell: any) => cell.row.original.id.id,
      meta: {
        isHideInForm: true,
      },
    },
    name: {
      id: "Name",
      header: "Name",
    },
    workspaces: {
      header: "Workspaces",
      cell: (cell: any) => {
        const workspaces = cell.getValue();

        // If there are no workspaces, return empty
        if (!workspaces) {
          return <FixWorkspacesDialog item={cell.row.original} />;
        }
        const relevantWorkspaces = workspaces.filter(
          (workspace: any) =>
            workspace.id === cell.row.original.id.id + "_test" ||
            workspace.id === cell.row.original.id.id + "_master"
        );

        return relevantWorkspaces.length >= 2 ? (
          <Button
            className="w-fit h-8 "
            size="sm"
            variant="success"
            disabled={true}
          >
            Workspaces are ok
          </Button>
        ) : (
          <FixWorkspacesDialog item={cell.row.original} />
        );
      },
      meta: {
        isHideInForm: true,
      },
    },
  }
);

export const organisationsTableFilters: DataTableFilter[] = [
  {
    key: "name",
    label: "Name",
    type: "text",
  },
];
