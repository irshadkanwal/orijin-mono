import { Type } from 'class-transformer';

export class ObjectId {
  id: string;
  externalId: string;
  refcollection: string;
  label?: string;
  labelShort?: string;
  authTag?: string;
  authRoles?: string[];
  qrCode?: string;
  shortCode?: string;
  parentId?: string;
  parentCollection?: string;
  chainId?: string;
  chainLabel?: string;
  chainLabelKey?: string;
  email?: string;
  type?: string;
  documentUrl?: string;

  version?: number;
  isPreviousVersion?: boolean = false;

  @Type(() => ObjectId)
  workflowId?: ObjectId;

  @Type(() => ObjectId)
  previousVersionObjectId?: ObjectId;

  constructor(id: string, refcollection: string, labelShort?: string) {
    this.id = id;
    this.refcollection = refcollection;
    this.labelShort = labelShort;
  }

  get idString(): string {
    return this.refcollection + '/' + this.id;
  }

  equals(id: ObjectId) {
    return this.id == id.id && this.refcollection == id.refcollection;
  }

  static of(id: any, refcollection: any) {
    return new ObjectId(id, refcollection);
  }
}
