import { Type } from 'class-transformer';
import { collectionKeys } from '../../v1utils/dbMappingUtils';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';

export default class WorkspaceV1 extends AbstractEntity {
  configPrefix: string;
  configType = 'source';
  config: any = null;
  name: string;

  @Type(() => ObjectId)
  // @mapToObjectId(collectionKeys.organisations)
  // @expandOnLoad()
  organisation: ObjectId;

  @Type(() => ObjectId)
  users: Array<ObjectId> = [];

  getCollection(): string {
    return collectionKeys.workspaces;
  }

  addUser(user: ObjectId) {
    this.users.push(user);
  }

  removeUser(userId: ObjectId) {
    this.users = this.users.filter((user) => !user.equals(userId));
  }

  hasUser(id: ObjectId): boolean {
    const item = this.users.find((b) => {
      return b.equals(id);
    });

    return item != undefined;
  }
}
