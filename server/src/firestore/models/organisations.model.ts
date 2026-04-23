import { DateObject } from './platformUsers.model';

export interface OrganisationId {
  refcollection: string;
  id: string;
  isPreviousVersion: boolean;
}

export interface IOrganisation {
  needsReview: boolean;
  charts: any[];
  updatedBy: any;
  documents: any[];
  isArchived: boolean;
  users: any[];
  enabled: boolean;
  accessControlTag: any;
  reportsInCache: any[];
  createdDate: DateObject;
  isDeleted: boolean;
  lastActivityDate: any;
  createdBy: any;
  name: string;
  id: OrganisationId;
  accessControlDivision: any;
  admins: any[];
  properties: {
    customId: string;
  };
  meta_workspace: string;
  updatedDate: DateObject;
  workspaces: {
    refcollection: string;
    id: string;
    isPreviousVersion: boolean;
  }[];
  meta_organisation: string;
}
