export enum collectionKeys {
  wallets = 'wallets',
  trainings = 'trainings',
  trainingsessions = 'trainingsessions',
  trainingtypes = 'trainingtypes',
  contacts = 'contacts',
  paymenttransactions = 'paymenttransactions',
  workflowscopes = 'workflowscopes',
  geodatas = 'geodatas',
  pendingtasks = 'pendingtasks',
  globalQrCodeLinks = 'globalQrCodeLinks',
  batches = 'batches',
  users = 'users',
  platformusers = 'platformusers',
  vessels = 'vessels',
  trees = 'trees',
  events = 'events',
  events_error = 'events_error',
  formsubmissions = 'formsubmissions',
  formsubmissions_completed = 'formsubmissions_completed',
  formsubmissions_error = 'formsubmissions_error',
  plots = 'plots',
  persons = 'persons',
  planttypes = 'planttypes',
  animaltypes = 'animaltypes',
  organisations = 'organisations',
  facilities = 'facilities',
  farms = 'farms',
  farms_min = 'farms_min',
  producers = 'producers',
  vesselTypes = 'vesselTypes',
  varietyprices = 'varietyprices',
  prodlots = 'prodlots',
  originproperties = 'originproperties',
  qualitycontrolsessions = 'qualitycontrolsessions',
  qualitycontrolresults = 'qualitycontrolresults',
  qualitycontrolresultsubmissions = 'qualitycontrolresultsubmissions',
  varieties = 'varieties',
  crops = 'crops',
  contracts = 'contracts',
  certifications = 'certifications',
  animalcounts = 'animalcounts',
  surveys = 'surveys',
  seasons = 'seasons',
  noncompliances = 'noncompliances',
  seeds = 'seeds',
  contactdetails = 'contactdetails',
  serviceactivityoutputs = 'serviceactivityoutputs',
  serviceactivities = 'serviceactivities',
  servicecategories = 'servicecategories',
  serviceactivitybeneficiaries = 'serviceactivitybeneficiaries',
  services = 'services',
  notes = 'notes',
  approvals = 'approvals',
  documents = 'documents',
  documents_wip = 'documents_wip',
  documentchunks = 'documentchunks',
  certificationtypes = 'certificationtypes',
  inspectionrecords = 'inspectionrecords',
  contracttemplates = 'contracttemplates',
  tags = 'tags',
  products = 'products',
  locations = 'locations',
  activities = 'activities',
  labelqueue = 'labelqueue',
  storyQrCodeLinks = 'storyQrCodeLinks',
  stories = 'stories',
  farmDetails = 'farmDetails',
  price = 'price',
  address = 'address',
  coordinates = 'coordinates',
  activitycompletions = 'activitycompletions',
  lotsections = 'lotsections',
  auditentries = 'auditentries',
  analyses = 'analyses',
  auditactivities = 'auditactivities',
  activitylogs = 'activitylogs',
  testchildren = 'testchildren',
  testobjects = 'testobjects',
  workspaces = 'workspaces',
  configurations = 'configurations',
  exports = 'exports',
}

export const AllCollections = Object.keys(collectionKeys);

export const globalCollections = [
  collectionKeys.workspaces,
  collectionKeys.stories,
  collectionKeys.organisations,
  collectionKeys.platformusers,
  collectionKeys.storyQrCodeLinks,
  collectionKeys.globalQrCodeLinks,
  collectionKeys.configurations,
];

export const staticWorkspaceCollections = [
  collectionKeys.planttypes,
  collectionKeys.facilities,
  collectionKeys.tags,
  collectionKeys.products,
  collectionKeys.varieties,
  collectionKeys.certificationtypes,
  collectionKeys.services,
  collectionKeys.servicecategories,
  collectionKeys.animaltypes,
  collectionKeys.trainingtypes,
  collectionKeys.seasons,
  collectionKeys.varietyprices,
  collectionKeys.vessels,
  collectionKeys.locations,
];

export const farmDataWorkspaceCollections = [
  collectionKeys.persons,
  collectionKeys.farms,
  collectionKeys.users,
  collectionKeys.plots,
  collectionKeys.contacts,
  collectionKeys.contracts,
  collectionKeys.trainings,
  collectionKeys.trainingsessions,
  collectionKeys.geodatas,
  collectionKeys.certifications,
  collectionKeys.animalcounts,
  collectionKeys.surveys,
  collectionKeys.noncompliances,
  collectionKeys.serviceactivityoutputs,
  collectionKeys.serviceactivitybeneficiaries,
  collectionKeys.serviceactivities,
];

export const paymentCollections = [
  // collectionKeys.wallets,
];

export function farmDataWorkspaceCollectionsWip() {
  const farmDataWorkspaceCollectionsWip = farmDataWorkspaceCollections.map(
    (r) => r + '_wip',
  );
  farmDataWorkspaceCollectionsWip.push('auditentries_wip');
  farmDataWorkspaceCollectionsWip.push('activitylogs_wip');
  farmDataWorkspaceCollectionsWip.push('auditactivities_wip');
  farmDataWorkspaceCollectionsWip.push('pendingtasks_wip');
  farmDataWorkspaceCollectionsWip.push('workflowscopes_wip');
  farmDataWorkspaceCollectionsWip.push('events_wip');

  return farmDataWorkspaceCollectionsWip;
}

export const offlineAppCacheableCollections = [
  collectionKeys.formsubmissions,
  'documents_wip',
  'documentchunks',
  'documentchunks_wip',
  ...farmDataWorkspaceCollectionsWip(),
  ...staticWorkspaceCollections,
];

export const dynamicWorkspaceCollections = [
  collectionKeys.formsubmissions_completed,
  'formsubmissions_error',
  'events_completed',
  'activitylogs_wip',
  'workflowscopes_wip',
  'pendingtasks_wip',
  'documents_error',
  'documents_wip',
  'surveys_wip',
  'events_wip',
  'documents_completed',
  collectionKeys.events,
  collectionKeys.workflowscopes,
  collectionKeys.prodlots,
  collectionKeys.documents,
  collectionKeys.documentchunks,
  collectionKeys.batches,
  collectionKeys.lotsections,
  collectionKeys.paymenttransactions,
  collectionKeys.pendingtasks,
  collectionKeys.auditentries,
  collectionKeys.auditactivities,
  collectionKeys.activitylogs,
  collectionKeys.analyses,
  collectionKeys.originproperties,
  collectionKeys.formsubmissions,
  collectionKeys.activitycompletions,
  collectionKeys.qualitycontrolsessions,
  collectionKeys.qualitycontrolresults,
  collectionKeys.qualitycontrolresultsubmissions,
  collectionKeys.exports,
];

export const workspaceCollectionsForTraceOffline = [
  ...staticWorkspaceCollections,
  ...dynamicWorkspaceCollections,
];

export const workspaceCollections = [
  ...staticWorkspaceCollections,
  ...dynamicWorkspaceCollections,
];

export function getDomainCollections(): string[] {
  const strings = AllCollections.map((m) => m + '').filter(
    (m) => !isGlobalCollection(m),
  );
  return strings;
}

export function isGlobalCollection(collection: string): boolean {
  const strings = Object.values(globalCollections).map((m) => m + '');
  const b = strings.indexOf(collection) >= 0;
  return b;
}

export const WORKSPACES_PARENT_COLLECTION = 'workspaces';
