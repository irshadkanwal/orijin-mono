import { DataTableFilter } from "@/components/table/datatable-types";
import { SortingButton } from "@/components/table/sorting-button";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import { rootKeys } from "./rootKeys";
import { UserRoles } from "@/types/users-types";
import { createWithoutCommonColumns } from "./common-columns";
import { commonTableQuerySchema } from "@/types/common-types";
import { FieldType, FormError } from "@/types/custom-form";
import { getOrganisationFromLocalStorage } from "@/store/organisation";

export const usersColumnHelper: ColumnHelper<any> = createColumnHelper<any>();

export const initialUsersColumns = createWithoutCommonColumns(
  usersColumnHelper,
  {
    name: {
      id: "Name",
      header: "Name",
      meta: {
        isVisible: true,
      },
    },
    email: {
      id: "email",
      header: () => (
        <SortingButton
          columnName="Email"
          searchFrom={rootKeys.configurationsUsers}
          filters={usersTableFilters}
          tableQuery={commonTableQuerySchema}
        ></SortingButton>
      ),
      meta: {
        isVisible: true,
        type: FieldType.EMAIL,
        errors: [FormError.REQUIRED, FormError.EMAIL],
      },
    },
    password: {
      id: "password",
      header: "Password",
      meta: {
        isVisible: false,
        type: FieldType.PASSWORD,
        errors: [FormError.REQUIRED, FormError.PASSWORD],
      },
    },
    role: {
      id: "role",
      header: "Role",
      cell: (cell: any) =>
        Object.entries(cell.row.original.workspaceRole).length > 0
          ? (() => {
              const storedOrgs = getOrganisationFromLocalStorage();
              const roles = Object.entries(cell.row.original.workspaceRole)
                .filter(([workspace, role]) =>
                  workspace.startsWith(storedOrgs?.current + "_")
                )
                .map(([workspace, role]: any) => role.replace(/ALL/i, ""));
              return roles.length > 1 ? roles[0] : roles || "";
            })()
          : "",
      meta: {
        list: Object.values(UserRoles).map((role) => ({
          id: role,
          name: role,
        })),
        type: "select",
      },
    },
  }
);

export const usersTableFilters: DataTableFilter[] = [
  { type: "text", key: "email", label: "Email" },
  {
    type: "sort",
    key: "sort",
    label: "Sort",
  },
  {
    type: "sortOrder",
    key: "sortOrder",
    label: "Sort Order",
  },
];
