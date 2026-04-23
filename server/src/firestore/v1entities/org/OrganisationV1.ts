import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
export default class OrganisationV1 extends AbstractEntity {
  name: string;
  @Type(() => ObjectId)
  admins: Array<ObjectId> = [];
  @Type(() => ObjectId)
  users: Array<ObjectId> = [];
  @Type(() => ObjectId)
  workspaces: Array<ObjectId> = [];

  // divisions: string[];
  // accessControlRules: ACRule[] = [];

  addons: Array<{
    name: string;
    config: any;
  }>;


  getCollection(): string {
    return collectionKeys.organisations;
  }

  addWorkspace(workspace: ObjectId) {
    this.workspaces.push(workspace);
  }

  removeWorkspace(id: ObjectId) {
    this.workspaces = this.workspaces.filter(
      (workspace) => !workspace.equals(id),
    );
  }

  addUser(userId: ObjectId) {
    this.users.push(userId);
  }

  removeUser(userId: ObjectId) {
    this.users = this.users.filter((user) => !user.equals(userId));
  }

  addAdmin(user: ObjectId) {
    this.admins.push(user);
  }

  removeAdmin(userId: ObjectId) {
    this.admins = this.admins.filter((admin) => !admin.equals(userId));
  }

  hasAdmin(id: ObjectId) {
    const item = this.admins.find((b) => {
      return b.equals(id);
    });

    return item != undefined;
  }

  hasUser(id: ObjectId) {
    const item = this.users.find((b) => {
      return b.equals(id);
    });

    return item != undefined;
  }

  hasWorkspace(id: ObjectId) {
    const item = this.workspaces.find((b) => {
      return b.equals(id);
    });

    return item != undefined;
  }
}
