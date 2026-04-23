const items_ltc = [
  'locations',
  'facilities',
  'crops',
  'seasons',
  'serviceactivitytypes',
  'producttypes',
  'varieties',
  'products',
  'prices',
  // 'farms',
  // 'persons',
  'certificationtypes',
  'serviceactivitytypes',
  'vessels'
];

const items_mh = [
  'locations',
  'facilities',
  'crops',
  'seasons',
  'producttypes',
  'varieties',
  'products',
  'prices',
  'farms',
  // 'farms_min',
  'persons',
  'certificationtypes',
  'serviceactivitytypes',
  'vessels'
];

const items_seed = [
  'locations',
  'facilities',
  'crops',
  'seasons',
  'producttypes',
  'varieties',
  'products',
  'prices',
  'farms',
  'persons',
  'certificationtypes',
  'serviceactivitytypes',
  'vessels'
];

const items = {
  mh: items_mh,
  ltc: items_ltc,
  seed: items_seed,
  latitude: items_ltc,
};

export function getFirestoreExportItems(orgId: string) {
  return items[orgId] ?? items['seed'];
}



