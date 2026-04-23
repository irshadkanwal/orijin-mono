import { Type } from 'class-transformer';
import { AbstractEntity } from '../utils/AbstractEntity';
import { ObjectId } from '../utils/ObjectId';
import { collectionKeys } from '../utils/DbMappingUtils';

export default class Workspace extends AbstractEntity {
  configPrefix?: string;
  configType?:string;
  config?: any;
  name?: string;
  isDeleted: boolean;
  isArchived: boolean;
  enabled: boolean;
  meta_configkey: string;
  
  @Type(() => ObjectId)
  createdBy: ObjectId;

  createdDate: Date;
  
  @Type(() => ObjectId)
  updatedBy: ObjectId;

  updatedDate: Date;

  @Type(() => ObjectId)
  organisation: ObjectId;

  @Type(() => ObjectId)
  users: Array<ObjectId> = [];

  properties: {
    customId: string;
  };

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

    return item !== undefined;
  }
}
