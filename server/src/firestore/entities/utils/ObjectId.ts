export class ObjectId {
  id: string;
  externalId?: string;
  refcollection: string;
  email?: string;
  labelShort?: string;
  label?: string;
  name:string

  constructor(id: string, refcollection: string, labelShort?: string, name?:string) {
    this.id = id;
    this.refcollection = refcollection;
    this.labelShort = labelShort;
    this.name = name;
  }

  get idString(): string {
    return this.refcollection + '/' + this.id;
  }

  equals(id: ObjectId) {
    return this.id == id.id && this.refcollection == id.refcollection;
  }
}
