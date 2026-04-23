import { Transform, Type } from 'class-transformer';
import { ObjectId } from './ObjectId';
import { formatDatesForFS } from './utils';
import { ObjectIdUser } from './types';

export interface HasId {
  id: ObjectId;
}
export abstract class AbstractEntity implements HasId {
  isDeleted = false;
  isArchived = false;
  enabled = true;

  @Type(() => ObjectId)
  id: ObjectId;

  @Transform(({ value }) => formatDatesForFS(value))
  createdDate: Date;

  @Transform(({ value }) => formatDatesForFS(value))
  updatedDate: Date;

  @Type(() => ObjectIdUser)
  createdBy: ObjectIdUser;

  @Type(() => ObjectIdUser)
  updatedBy: ObjectIdUser;

  abstract getCollection(): string;

  setId(id: string) {
    this.id = new ObjectId(id, this.getCollection());
  }

  setCustomId(id: string) {
    this.setProperty('customId', id);
  }
  properties: { [key: string]: any } = {};
  public setProperty(key: string, value: any) {
    this.properties[key] = value;
  }
}
