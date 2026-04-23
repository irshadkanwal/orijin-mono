const items_mh = [
  ['seasons.csv', 'seasons'],
  ['crops.csv', 'crops'],
  ['varieties.csv', 'varieties'],
  ['producttypes.csv', 'producttypes'],
  ['certificationtypes.csv', 'certificationtypes'],

  ['servicecategorytypes.csv', 'servicecategorytypes'],
  ['servicecategories.csv', 'servicecategories'],
  ['serviceactivitytypes.csv', 'serviceactivitytypes'],
  ['serviceinputtypes.csv', 'serviceinputtypes'],

  ['locations+districts.csv', 'locations'],
  ['locations+subcounties.csv', 'locations'],
  ['locations+parishes.csv', 'locations'],
  ['locations+villages.csv', 'locations'],

  ['locations+regions.csv', 'locations'],
  ['locations+zones.csv', 'locations'],
  ['locations+farmergroups.csv', 'locations'],

  ['locations-subcounty-parish-stubs.csv', 'locations'],
  ['locations-subcounty-village-stubs.csv', 'locations'],
  ['locations-zone-parish-stubs.csv', 'locations'],
  ['locations-zone-village-stubs.csv', 'locations'],

  ['facilities.csv', 'facilities'],
  ['facilities+processingFacilities.csv', 'facilities'],
  ['facilities+farmergroups.csv', 'facilities'],
  ['products.csv', 'products'],
  ['prices.csv', 'prices'],

  ['persons.csv', 'persons'],
  ['farms.csv', 'farms'],

  ['serviceceactivities.csv', 'serviceceactivities'],
  ['serviceactivitybeneficiary.csv', 'serviceactivitybeneficiary'],
];

const items_seed = [
  ['seasons.csv', 'seasons'],
  ['crops.csv', 'crops'],
  ['varieties.csv', 'varieties'],

  ['producttypes.csv', 'producttypes'],
  ['servicecategorytypes.csv', 'servicecategorytypes'],
  ['servicecategories.csv', 'servicecategories'],
  ['serviceactivitytypes.csv', 'serviceactivitytypes'],
  ['serviceinputtypes.csv', 'serviceinputtypes'],
  ['certificationtypes.csv', 'certificationtypes'],

  ['locations+districts.csv', 'locations'],
  ['locations+subcounties.csv', 'locations'],
  ['locations+subcounties+parish-stubs.csv', 'locations'],
  ['locations+subcounties+village-stubs.csv', 'locations'],
  ['locations+regions.csv', 'locations'],
  ['locations+zones.csv', 'locations'],
  ['locations+farmergroups.csv', 'locations'],
  ['facilities.csv', 'facilities'],
  ['facilities+processingFacilities.csv', 'facilities'],

  ['locations-zone-parish-stubs.csv', 'locations'],
  ['locations-zone-village-stubs.csv', 'locations'],
  ['facilities+farmergroups.csv', 'facilities'],

  ['products.csv', 'products'],
  ['prices.csv', 'prices'],

  ['persons_coffee.csv', 'persons'],
  ['farms_coffee.csv', 'farms'],
  ['serviceceactivities.csv', 'serviceceactivities'],
  ['serviceactivitybeneficiary.csv', 'serviceactivitybeneficiary'],

  ['facilities+collectionpoints.csv', 'facilities'],
  ['persons-cocoa.csv', 'persons'],
  ['farms-cocoa.csv', 'farms'],

  ['vessels.csv', 'vessels'],
  ['contacts.csv', 'contacts'],
  ['wallets.csv', 'wallets'],
  ['plots.csv', 'plots'],
  ['certifications.csv', 'certifications'],
  ['sacks.csv', 'vessels'],
  // ['polygons.csv', 'polygons'],
];

const items_ltc = [
  ['certificationtypes.csv', 'certificationtypes'],
  ['crops.csv', 'crops'],
  ['seasons.csv', 'seasons'],
  ['varieties.csv', 'varieties'],
  ['producttypes.csv', 'producttypes'],

  ['servicecategorytypes.csv', 'servicecategorytypes'],
  ['servicecategories.csv', 'servicecategories'],
  ['serviceactivitytypes.csv', 'serviceactivitytypes'],
  ['locations+districts.csv', 'locations'],
  ['locations+subcounties.csv', 'locations'],
  ['locations+subcounties+parish-stubs.csv', 'locations'],
  ['locations+subcounties+village-stubs.csv', 'locations'],
  ['facilities.csv', 'facilities'],
  ['facilities+processingFacilities.csv', 'facilities'],
  ['facilities+collectionpoints.csv', 'facilities'],
  ['products.csv', 'products'],
  ['prices.csv', 'prices'],

  ['persons.csv', 'persons'],
  ['farms.csv', 'farms'],
  ['vessels.csv', 'vessels'],
  // ['polygons.csv', 'polygons'],
];

const items = {
  mh: items_mh,
  ltc: items_ltc,
  seed: items_seed,
  latitude: items_ltc,
};

const folders = {
  mh: 'mh',
  seed: 'seed',
  ltc: 'ltc',
  latitude: 'ltc',
};

export function getCsvImportFolder(orgId: string) {
  return folders[orgId] ?? folders['seed'];
}
export function getCsvImportItems(orgId: string) {
  return items[orgId] ?? items['seed'];
}
