import { OrganisationId } from './organisations.model';
export interface PlatformUserId {
  refcollection: string;
  labelShort: string;
  id: string;
  label: string;
  isPreviousVersion: boolean;
}
export interface DateObject {
  _seconds: number;
  _nanoseconds: number;
}
export interface PlatformUser {
  meta_workspace: string;
  isArchived: boolean;
  updatedDate: DateObject;
  locale: string | null;
  enabled: boolean;
  googleApiCredential: any | null; // Replace 'any' with actual type if known
  uid: string | null;
  photoURL: string | null;
  isDeleted: boolean;
  organisations: OrganisationId[];
  lastActivityDate: {
    _seconds: number;
    _nanoseconds: number;
  } | null;
  id: PlatformUserId;
  workspaces: {
    refcollection: string;
    id: string;
    isPreviousVersion: boolean;
  }[];
  meta_organisation: string;
  email: string;
  approvalStatus: string;
  updatedBy: any;
  currentWorkspace: any | null; // Replace 'any' with actual type if known
  operatedBy: any | null; // Replace 'any' with actual type if known
  createdDate: DateObject;
  createdBy: any;
  meta_configkey: string;
  systemStatus: any | null; // Replace 'any' with actual type if known
  workspaceRole: {
    [key: string]: string; // Assumes key is string (workspace ID), value is string (role)
  } | null;
  currentOrganisation: any | null; // Replace 'any' with actual type if known
  name: string;
  properties: {
    customId: string;
  };
}
