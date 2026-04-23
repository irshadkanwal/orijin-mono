import Account from '../org/Accounts';
import Organisation from '../org/Organisation';
import OrganisationConfig from '../org/OrganisationConfiguration';
import Workspace from '../org/Workspace';

export enum collectionKeys {
  organisations = 'organisations',
  platformusers = 'platformusers',
  workspaces = 'workspaces',
  superusers = 'superusers',
  organisation_config = 'orgconfigurations'
}

export const globalCollections = [
  collectionKeys.organisations,
  collectionKeys.platformusers,
];

export function getClassType(refcollection: string): any {
  if (refcollection.indexOf('_wip') >= 0) {
    refcollection = refcollection.substring(0, refcollection.indexOf('_wip'));
  }
  switch (refcollection) {
    case collectionKeys.organisations:
      return Organisation;
    case collectionKeys.platformusers:
      return Account;
    case collectionKeys.workspaces:
      return Workspace;
      case collectionKeys.organisation_config:
        return OrganisationConfig;
    default:
      throw Error('not supported getClassType:' + refcollection + '.');
  }
}

export function getCollectionKeyByClass(cls: any): string {
  switch (cls) {
    case Organisation: {
      return collectionKeys.organisations;
    }
    case Account: {
      return collectionKeys.platformusers;
    }
    case Workspace: {
      return collectionKeys.workspaces;
    }
    case OrganisationConfig: {
      return collectionKeys.organisation_config;
    }
    default:
      throw Error('not supported getCollectionKeyByClass ' + cls);
  }
}
