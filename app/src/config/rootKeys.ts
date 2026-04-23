export enum rootKeys {
  loggedIn = "/_loggedin",
  farms = "/_loggedin/farms/",
  farmsEudrReport = "/_loggedin/farms/eudr-report",
  persons = "/_loggedin/persons/",
  supportingServices = "/_loggedin/supporting-services/",
  dashboard = "/_loggedin/dashboard",

  fieldTasks = "/_loggedin/field-tasks/",
  productionData = "/_loggedin/production-data/",
  configurationsPrograms = "/_loggedin/configurations/service-categories",
  configurationsActivityTypes = "/_loggedin/configurations/service-activity-types",
  configurationsInputTypes = "/_loggedin/configurations/service-input-types",
  configurationsCrops = "/_loggedin/configurations/crops",
  configurationsCropVarieties = "/_loggedin/configurations/crop-varieties",
  configurationsProductTypes = "/_loggedin/configurations/product-types",
  configurationsProducts = "/_loggedin/configurations/products",
  configurationsSeasons = "/_loggedin/configurations/seasons",
  configurationsPrices = "/_loggedin/configurations/prices",
  configurationsLocations = "/_loggedin/configurations/locations",
  configurationsImportData = "/_loggedin/configurations/import-data",
  configurationsCategoryTypes = "/_loggedin/configurations/service-category-types",
  configurationsOrganisations = "/_loggedin/configurations/organisations",
  configurationsUsers = "/_loggedin/configurations/users",
  lots = "/_loggedin/lots/",
  paymentTransactions = "/_loggedin/payment-transactions/",
  lotsId = "/_loggedin/lots/$lotId",
  paymentTransactionsId = "/_loggedin/payment-transactions/$paymentId",
  organisationConfigurationsByConfig = "/_loggedin/organisation-config/",
  configurationsCertificationTypes = "/_loggedin/configurations/certification-types",
  configurationsVessels = "/_loggedin/configurations/vessels",
  configurationsFacilities = "/_loggedin/configurations/facilities",
  personId = "/_loggedin/persons/$personId",
}

export type SearchFrom = rootKeys;
export type RootKeyValues = `${rootKeys}`;

export const extractPageName = (path: string): string => {
  const parts = path.split("/").filter(Boolean);
  return parts[1] || "";
};

export enum lastPathSegments {
  SERVICE_CATEGORIES = "service-categories",
  SERVICE_CATEGORY_TYPES = "service-category-types",
  SERVICE_ACTIVITY_TYPES = "service-activity-types",
  SERVICE_INPUT_TYPES = "service-input-types",
  SERVICE_ACTIVITIES = "serviceactivities",
  CROPS = "crops",
  CROP_VARIETIES = "crop-varieties",
  PRODUCT_TYPES = "product-types",
  PRODUCTS = "products",
  LOCATIONS = "locations",
  SEASONS = "seasons",
  PRICES = "prices",
  IMPORT_DATA = "upload-file",
  ORGANISATIONS = "organisations",
  USERS = "users",
  LOTS = "lots",
  PAYMENT_TRANSACTION = "payment-transactions",
  FACILITIES = "facilities",
  PLOT = "plots",
  PERSON = "persons",
  FARM = "farms",
  WORKSPACE = "workspaces",
  LOCATION_FILTER = "locations-filter",
}

export enum tablePathSegments {
  LOTS = "/lots/",
  PAYMENT_TRANSACTION = "/payment-transactions/",
  FARM = "/farms/",
  ORGANISATIONS_CONFIG = `/organisation-config`,
  CATEGORIES = "/configurations/service-categories",
  CATEGORY_TYPES = "/configurations/service-category-types",
  SERVICES = "/supporting-services/",
  ACTIVITY_TYPES = "/configurations/service-activity-types",
  INPUT_TYPES = "/configurations/service-input-types",
}
