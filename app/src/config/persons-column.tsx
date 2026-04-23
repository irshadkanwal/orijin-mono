import { type ColumnHelper, createColumnHelper } from "@tanstack/react-table";
import type { Person, Contact, Wallet } from "@/types/person";
import { Link } from "@tanstack/react-router";
import { SortingButton } from "@/components/table/sorting-button";
import type { DataTableFilter } from "@/components/table/datatable-types";
import { Icons } from "@/components/icons.tsx";
import { rootKeys } from "@/config/rootKeys";
import { personsTableQuerySchema } from "@/types/persons-types";
import { commonFilters, createWithoutCommonColumns } from "./common-columns";

// Contacts COLUMNS

export const contactsColumnHelper: ColumnHelper<Contact> =
  createColumnHelper<Contact>();
export const initialContactsColumns = createWithoutCommonColumns(
  contactsColumnHelper,
  {
    shortCode: {
      id: "shortCode",
      header: "Short Code",
    },
    firstName: {
      id: "firstName",
      header: "First Name",
    },
    lastName: {
      id: "lastName",
      header: "Last Name",
    },
    type: {
      id: "type",
      header: "Type",
    },
    email: {
      id: "email",
      header: "Email",
    },
    phone: {
      id: "phone",
      header: "Phone",
    },
    address: {
      id: "address",
      header: "Address",
    },
    primary: {
      id: "primary",
      header: "Primary",
    },
    registeredForMobileMoney: {
      id: "registeredForMobileMoney",
      header: "Registered For Mobile Money",
    },
    registeredUnderPrincipalsName: {
      id: "registeredUnderPrincipalsName",
      header: "Registered Under Principals Name",
    },
  }
);
export const contactsTableFilters: DataTableFilter[] = [...commonFilters];

// Wallets COLUMNS

export const walletsColumnHelper: ColumnHelper<Wallet> =
  createColumnHelper<Wallet>();
export const initialWalletsColumns = createWithoutCommonColumns(
  walletsColumnHelper,
  {
    shortCode: {
      id: "shortCode",
      header: "Short Code",
    },
    externalSystemName: {
      id: "externalSystemName",
      header: "External System Name",
    },
    phone: {
      id: "phone",
      header: "Phone",
    },
    type: {
      id: "type",
      header: "Type",
    },
    firstName: {
      id: "firstName",
      header: "First Name",
      cell: (cell: any) => cell.row.original.contact.firstName,
      meta: {
        isHideInForm: true,
      },
    },
    lastName: {
      id: "lastName",
      header: "Last Name",
      cell: (cell: any) => cell.row.original.contact.lastName,
      meta: {
        isHideInForm: true,
      },
    },
    externalName: {
      id: "externalName",
      header: "External Name",
    },
    externalFirstName: {
      id: "externalFirstName",
      header: "External First Name",
    },
    externalLastName: {
      id: "externalLastName",
      header: "External Last Name",
    },
    externalId: {
      id: "externalId",
      header: "External Id",
    },
    externalUuid: {
      id: "externalUuid",
      header: "External Uuid",
    },
    errorMsg: {
      id: "errorMsg",
      header: "Error Msg",
    },
    errorStatus: {
      id: "errorStatus",
      header: "Error Status",
    },
    name_on_network: {
      id: "name_on_network",
      header: "Name on Network",
    },
    name_matches_network_score: {
      id: "name_matches_network_score",
      header: "Name Matches Network Score",
    },
    name_matches_network_status: {
      id: "name_matches_network_status",
      header: "Name Matches Network Status",
    },
  }
);
export const walletsTableFilters: DataTableFilter[] = [...commonFilters];

// Persons COLUMNS

export const personsColumnHelper: ColumnHelper<Person> =
  createColumnHelper<Person>();
export const initialPersonsColumns = createWithoutCommonColumns(
  personsColumnHelper,
  {
    shortCode: {
      id: "shortCode",
      cell: (cell: any) => {
        return (
          <Link
            className="underline text-blue-500"
            to={"/persons/" + cell.row.original.id}
          >
            {cell.getValue()}
          </Link>
        );
      },
      // header: () => <span>ID</span>,
      footer: (cell: any) => cell.column.id,
      header: () => (
        <SortingButton
          columnName="ID"
          searchFrom={rootKeys.persons}
          filters={personsTableFilters}
          tableQuery={personsTableQuerySchema}
        ></SortingButton>
      ),
    },
    type: {
      id: "type",
      header: "Type",
    },
    firstName: {
      id: "firstName",
      cell: (cell: any) => <b>{cell.getValue()}</b>,
      header: () => (
        <SortingButton
          columnName="First Name"
          searchFrom={rootKeys.persons}
          filters={personsTableFilters}
          tableQuery={personsTableQuerySchema}
        ></SortingButton>
      ),
      footer: (cell: any) => cell.column.id,
    },
    middleName: {
      id: "middleName",
      header: "Middle Name",
    },
    lastName: {
      id: "lastName",
      header: "Last Name",
    },
    farmCode: {
      id: "farmCode",
      header: "Farm Code",
      cell: (cell: any) => cell.row.original.mainContactPersonFor[0]?.shortCode,
      meta: {
        isHideInForm: true,
      },
    },
    farmName: {
      id: "farmName",
      header: "Farm Name",
      cell: (cell: any) => cell.row.original.mainContactPersonFor[0]?.name,
      meta: {
        isHideInForm: true,
      },
    },
    email: {
      id: "email",
      header: "Email",
    },
    phone: {
      id: "phone",
      header: "Phone",
    },
    phone2: {
      id: "phone2",
      header: "Phone 2",
    },
    gender: {
      id: "gender",
    },
    dateOfBirth: {
      id: "dateOfBirth",
      header: "Date Of Birth",
    },
    dateOfBirthApproximate: {
      id: "dateOfBirthApproximate",
      header: "Date Of Birth Approximate",
    },
    identificationNumber: {
      id: "identificationNumber",
      header: "Identification Number",
    },
    identificationNumberType: {
      id: "identificationNumberType",
      header: "Identification Number Type",
    },
    education: {
      id: "education",
      header: "Education",
    },
    maritalStatus: {
      id: "maritalStatus",
      header: "Marital Status",
    },
    district: {
      id: "district",
      header: "District",
      cell: (cell: any) =>
        cell.row.original.mainContactPersonFor[0]?.location?.parent?.parent
          ?.parent?.name,
      meta: {
        isHideInForm: true,
      },
    },
    subCounty: {
      id: "subCounty",
      header: "Sub County",
      cell: (cell: any) =>
        cell.row.original.mainContactPersonFor[0]?.location?.parent?.parent
          ?.name,
      meta: {
        isHideInForm: true,
      },
    },
    // TODO: The lowest known location is not always a Village, determine these from the location types instead (in backend?)
    village: {
      id: "village",
      header: "Village",
      cell: (cell: any) =>
        cell.row.original.mainContactPersonFor[0]?.location?.name,
      meta: {
        isHideInForm: true,
      },
    },
    parish: {
      id: "parish",
      header: "Parish",
      cell: (cell: any) =>
        cell.row.original.mainContactPersonFor[0]?.location?.parent?.name,
      meta: {
        isHideInForm: true,
      },
    },
  }
);

export const personsTableFilters: DataTableFilter[] = [
  { type: "text", key: "shortCode", label: "Code" },
  {
    type: "faceted",
    key: "location",
    label: "Location",
    getColumn: (table) => table.getColumn("District"),
    options: [
      {
        value: "BUNDIBUGYO",
        label: "Village",
        icon: Icons.tractor,
      },
      {
        value: "BUBANDI",
        label: "Subcounty",
        icon: Icons.subcounty,
      },
      {
        value: "BUKONZO",
        label: "Village",
        icon: Icons.tractor,
      },
      {
        value: "BUTANDA",
        label: "District",
        icon: Icons.district,
      },
      {
        value: "KASENDA",
        label: "District",
        icon: Icons.district,
      },
      {
        value: "KASESE",
        label: "Subcounty",
        icon: Icons.subcounty,
      },
    ],
  },
];
