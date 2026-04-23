import { Type } from 'class-transformer';
import { ObjectId } from '../utils/ObjectId';
import { collectionKeys } from '../utils/DbMappingUtils';
import { AbstractEntity } from '../utils/AbstractEntity';

export default class Account extends AbstractEntity {
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
