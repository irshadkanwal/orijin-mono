import { Type } from 'class-transformer';
import { ObjectId } from '../utils/ObjectId';
import { collectionKeys } from '../utils/DbMappingUtils';
import { AbstractEntity } from '../utils/AbstractEntity';

export default class Organisation extends AbstractEntity {
  name: string;
  @Type(() => ObjectId)
  admins: Array<ObjectId> = [];
  @Type(() => ObjectId)
  users: Array<ObjectId> = [];
  @Type(() => ObjectId)
  workspaces: Array<ObjectId> = [];

  public constructor() {
    super();
  }

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
