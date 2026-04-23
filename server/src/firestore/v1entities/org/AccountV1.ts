import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import GoogleApiCredential from '../utis/GoogleApiCredential';
export default class AccountV1 extends AbstractEntity {
  @Type(() => ObjectId)
  organisations: Array<ObjectId> = [];

  @Type(() => ObjectId)
  workspaces: Array<ObjectId> = [];

  @Type(() => Object)
  workspaceRole: Record<string, string> = {};

  @Type(() => ObjectId)
  currentWorkspace: ObjectId = null;

  @Type(() => ObjectId)
  currentOrganisation: ObjectId = null;

  locale: string = null;
  email: string = null;
  uid: string = null;
  name: string = null;
  photoURL: string = null;

  @Type(() => GoogleApiCredential)
  googleApiCredential: GoogleApiCredential | null = null;

  get isGoogleConnected(): boolean {
    // if (this.googleApiCredential) {
    //   if (
    //     moment(moment()).isSameOrBefore(
    //       new Date((this.googleApiCredential as any).expiryDate),
    //     )
    //   ) {
    //     return true;
    //   }
    // }
    // return false;
    throw Error('todo');
  }

  getCollection(): string {
    return collectionKeys.platformusers;
  }

  addWorkspace(workspace: ObjectId) {
    this.workspaces.push(workspace);
  }

  setWorkspaceRole(workspaceId: ObjectId, role: string) {
    this.workspaceRole[workspaceId.id] = role;
  }

  removeWorkspace(workspaceId: ObjectId) {
    this.workspaces = this.workspaces.filter(
      (workspace) => !workspace.equals(workspaceId),
    );
  }

  hasWorkSpace(workspaceId: ObjectId) {
    const item = this.workspaces.find((b) => {
      return b.equals(workspaceId);
    });

    return item != undefined;
  }

  addOrganisation(organisation: ObjectId) {
    this.organisations.push(organisation);
  }

  removeOrganisation(organisationId: ObjectId) {
    this.organisations = this.organisations.filter(
      (organisation) => !organisation.equals(organisationId),
    );
  }

  hasOrganisation(organisationId: ObjectId) {
    const item = this.organisations.find((b) => {
      return b.equals(organisationId);
    });

    return item != undefined;
  }
}
