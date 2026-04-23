import { generateEntityFieldsFromColumns } from "@/hooks/utils/generate-entity-fields";
import {
  initialCropsColumns,
  initialCropVarietiesColumns,
} from "./crops-columns";
import {
  initialProductsColumns,
  initialProductTypesColumns,
} from "./products-column";
import { CustomEntityField } from "@/types/custom-entity-fields";
import { locationsTableColumns } from "./locations-column";
import { initialSeasonsColumns } from "./seasons-column";
import { initialPricesColumns } from "./prices-column";
import {
  initialServiceActivityTypeColumns,
  initialServiceBeneficiaryColumns,
  initialServiceCategoryColumns,
  initialServiceCategoryTypesColumns,
  initialServiceInputTypeColumns,
} from "./supporting-service-column";
import {
  initialContactsColumns,
  initialPersonsColumns,
  initialWalletsColumns,
} from "./persons-column";
import { farmsTableColumns, initialPlotsColumns } from "./farms-column";
import {
  initialCertificationsColumns,
  initialCertificationTypesColumns,
} from "./certification-types-columns";
import { initialVesselsColumns } from "./vessels-columns";

export interface SectionType {
  id: string;
  name: string;
  listOfHeaders: CustomEntityField[]; // Assuming this is an array of CustomEntityField
}

export const importSections: SectionType[] = [
  {
    id: "crops",
    name: "Crops",
    listOfHeaders: generateEntityFieldsFromColumns(initialCropsColumns as any),
  },
  {
    id: "varieties",
    name: "Crop Varieties",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialCropVarietiesColumns as any
    ),
  },
  {
    id: "producttypes",
    name: "Product Types",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialProductTypesColumns as any
    ),
  },
  {
    id: "products",
    name: "Products",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialProductsColumns as any
    ),
  },
  {
    id: "locations",
    name: "Locations",
    listOfHeaders: generateEntityFieldsFromColumns(
      locationsTableColumns as any
    ),
  },
  {
    id: "seasons",
    name: "Seasons",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialSeasonsColumns as any
    ),
  },
  {
    id: "prices",
    name: "Prices",
    listOfHeaders: generateEntityFieldsFromColumns(initialPricesColumns as any),
  },
  {
    id: "servicecategorytypes",
    name: "Service Category Types",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialServiceCategoryTypesColumns as any
    ),
  },
  {
    id: "servicecategories",
    name: "Service Categories",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialServiceCategoryColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any
    ),
  },
  {
    id: "serviceinputtypes",
    name: "Service Input Types",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialServiceInputTypeColumns as any
    ),
  },
  {
    id: "serviceactivitytypes",
    name: "Service Activity Types",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialServiceActivityTypeColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any
    ),
  },
  {
    id: "serviceceactivities",
    name: "Service Activities",
    listOfHeaders: generateEntityFieldsFromColumns([
      ...(initialServiceActivityTypeColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any),
      {
        accessorKey: "farmerGroupCodes",
        id: "Farmer group codes",
        meta: {
          importId: "farmerGroupCodes",
        },
      },
    ]),
  },
  {
    id: "serviceactivitybeneficiary",
    name: "Service Activity Beneficiaries",
    listOfHeaders: generateEntityFieldsFromColumns([
      ...(initialServiceBeneficiaryColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any),
      {
        accessorKey: "serviceActivityCode",
        id: "Activity",
        meta: {
          importId: "serviceActivityCode",
        },
      },
      {
        accessorKey: "beneficiaryCode",
        id: "Beneficiary",
        meta: {
          importId: "beneficiaryCode",
        },
      },
    ]),
  },
  {
    id: "persons",
    name: "Persons",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialPersonsColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any
    ),
  },
  {
    id: "facilities",
    name: "Facilities",
    listOfHeaders: generateEntityFieldsFromColumns([
      {
        accessorKey: "name",
        id: "Name",
      },
      {
        accessorKey: "shortCode",
        id: "Code",
      },
      {
        accessorKey: "type",
        id: "Type",
      },
      {
        accessorKey: "locationCode",
        id: "Location",
        meta: {
          importId: "locationCode",
        },
      },
      {
        accessorKey: "locationParentParentCode",
        id: "location Parent Parent Code",

        meta: {
          importId: "locationParentParentCode",
        },
      },
      {
        accessorKey: "parentLocationParentParentParent",
        id: "Parent Location Parent Parent Parent",
        meta: {
          importId: "parentLocationParentParentParent",
        },
      },
      {
        accessorKey: "parentFacilityCode",
        id: "Parent Facility Code",
        meta: {
          importId: "parentFacilityCode",
        },
      },
    ]),
  },
  {
    id: "farms",
    name: "Farms",
    listOfHeaders: generateEntityFieldsFromColumns([
      ...(farmsTableColumns().filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any),
      {
        accessorKey: "mainContactPersonCode",
        id: "Main contact person Code",
      },
      {
        accessorKey: "seasonCode",
        id: "Season Code",
      },
      {
        accessorKey: "phone",
        id: "Phone",
      },
      {
        accessorKey: "latitude",
        id: "Latitude",
      },
      {
        accessorKey: "longitude",
        id: "Longitude",
      },
      {
        accessorKey: "accuracy",
        id: "Accuracy",
      },
      {
        accessorKey: "altitude",
        id: "Altitude",
      },
      {
        accessorKey: "certificationStatus",
        id: "Certification Status",
      },
      {
        accessorKey: "areaTotalManual",
        id: "Area Total Manual",
      },
      {
        accessorKey: "contractDate",
        id: "Contract Date",
      },
      {
        accessorKey: "lastInspectionDate",
        id: "Last Inspection Date",
      },
      {
        accessorKey: "firstVisitDate",
        id: "First Visit Date",
      },
    ]),
  },
  {
    id: "certificationtypes",
    name: "Certification Types",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialCertificationTypesColumns as any
    ),
  },
  {
    id: "contacts",
    name: "Contacts",
    listOfHeaders: generateEntityFieldsFromColumns([
      ...(initialContactsColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any),
      {
        accessorKey: "personCode",
        id: "Person",
        meta: {
          importId: "personCode",
        },
      },
    ]),
  },
  {
    id: "wallets",
    name: "Wallets",
    listOfHeaders: generateEntityFieldsFromColumns([
      ...(initialWalletsColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any),
      {
        accessorKey: "personCode",
        id: "Person",
        meta: {
          importId: "personCode",
        },
      },
      {
        accessorKey: "contactCode",
        id: "Contact",
        meta: {
          importId: "contactCode",
        },
      },
    ]),
  },
  {
    id: "plots",
    name: "Plots",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialPlotsColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any
    ),
  },
  {
    id: "certifications",
    name: "Certifications",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialCertificationsColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any
    ),
  },
  {
    id: "vessels",
    name: "Vessels",
    listOfHeaders: generateEntityFieldsFromColumns(
      initialVesselsColumns.filter(
        (column: any) => !column?.meta?.isHideInForm
      ) as any
    ),
  },
  {
    id: "polygons",
    name: "Geo Polygons",
    listOfHeaders: generateEntityFieldsFromColumns([
      {
        accessorKey: "plotId",
        id: "Plot",
        meta: {
          importId: "plotCode",
        },
      },
      {
        accessorKey: "areaManual",
        id: "areaManual",
      },
      {
        accessorKey: "areaCalculated",
        id: "areaCalculated",
      },
      {
        accessorKey: "active",
        id: "active",
      },
      {
        accessorKey: "polygon",
        id: "Polygon",
      },
    ]),
  },
];
