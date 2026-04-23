import { ClassConstructor, plainToClass } from 'class-transformer';
import { ObjectId } from './ObjectId';
import { AbstractEntity } from './AbstractEntity';
import { mapOneObjectFromPlain } from './mappingUtils';
import { fixUpFSDates } from './ormUtils';

export interface DbObject {
  isDeleted: boolean;
  isArchived: boolean;
}

export interface IDefaultObject {
  isDeleted: boolean;
  isArchived: boolean;
  meta_configkey: string;
}

export interface Tx {
  set(ref: any, value: any): Promise<any>;
  update(ref: any, value: any): Promise<any>;
  delete(ref: any): Promise<any>;
  commit(): Promise<any>;
}

export interface DBTransaction {
  transaction: Tx;
  dataHolder?: any;
}
export interface OrmOptions {
  tx?: DBTransaction;
  configKey: string;
  createdBy?: ObjectId;
  currentUser: ObjectId;
  includeArchived?: boolean;
  includeDeleted?: boolean;
  fetchTotal?: boolean;
  configPrefix?:string
  organisation?:ObjectId
}

export interface PagedResult {
  values: any[];
  // query?: any;
  lastItem?: any;
  totalCount?: number;
}

export interface SearchDbOptions {
  filters?: IFilter[];
  limit?: number;
  offset?: number;
  lastItem?: any;
  ordering?: OrderOption[];
  localOrdering?: OrderOption[];
  ops?: OrmOptions;
  localFilters?: string;
  oldQuery?: any;
}

export type IFilter = {
  key: string;
  operation:
    | '!='
    | '=='
    | '>'
    | '<'
    | '<=='
    | '>=='
    | 'array-contains'
    | 'array-contains-any'
    | 'in'
    | 'notUndefinedOrNull'
    | 'undefinedOrNull'
    | string;
  // operation: any
  value: any;
};

export interface OrderOption {
  key: string;
  direction: 'desc' | 'asc' | string;
  // direction: string;
}

export function constructDefaultWorkspaceNameMaster(org: string) {
  return `${org}_master`;
}
export function constructDefaultWorkspaceNameTest(org: string) {
  return `${org}_test`;
}

export function formatDatesForFS(date) {
  if (date == null) {
    return null;
  }

  // console.log("formatDatesForFS", date)

  if (date.getTime) {
    const newVar = {
      type: 'customDate',
      ms: date.getTime(),
    };
    // console.log("formatDatesForFS: to FS", newVar)
    return newVar;
  }

  if (date.toDate) {
    // console.log("formatDatesForFS: from FS", date)
    return date.toDate();
  }

  if (date.nanoseconds != undefined && date.seconds != undefined) {
    // console.log('formatDatesForFS: from FS raw', date);
    //firebase date that is a plain object
    //{ _seconds: 1692524417, _nanoseconds: 7000000 }
    return new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
  }

  // Timestamp { _seconds: 1692524417, _nanoseconds: 7000000 }

  //this is returning a firestore date into normal in case we never went to firestore (unit test)
  if (date.type === 'customDate') {
    // console.log('formatDatesForFS: from FS customDate ', date);
    if (!date.ms) {
      return null;
    }
    return new Date(date.ms);
  }

  try {
    console.log('formatDatesForFS: to fs:  NOT SURE WHY HERE', date);
    const d = new Date(date);
    if (d.getTime) {
      return {
        type: 'customDate',
        ms: d.getTime(),
      };
    }
  } catch (e) {
    console.log('should not be here either', date);
  }

  console.log('should not be here', date);
  throw Error('should not be here');
}

export function isObjectId(input: any): input is ObjectId {
  const input1 = <ObjectId>input;
  return input1?.id !== undefined && input1?.refcollection !== undefined;
}

export function getObjectId(input: any): ObjectId {
  if (isObjectId(input)) {
    const instance = JSON.parse(JSON.stringify(input));
    return mapPlainToClass(ObjectId, instance);
  } else {
    console.log('Needs to be a raw or typed objectId ', JSON.stringify(input));
    console.log('Needs to be a raw or typed objectId ', input);
    throw Error('Needs to be a raw or typed objectId ' + JSON.stringify(input));
  }
}

export function mapPlainToClass<T>(
  cls: ClassConstructor<T>,
  plainObject: any,
): T {
  // let plain = addUnderscore(plainObject, null);
  const result = plainToClass(cls, plainObject);
  return result;
}

export function applyDeleted(newVar: DbObject, ops?: any): DbObject {
  return shouldDeletedBeIncluded(newVar, ops) ? newVar : null;
}

export function shouldDeletedBeIncluded(newVar: DbObject, ops?: any): boolean {
  if (!newVar) {
    return false;
  }

  if (!ops && (newVar.isDeleted || newVar.isArchived)) {
    return false;
  }

  if (!newVar.isDeleted && !newVar.isArchived) {
    return true;
  }
  let res = true;

  if (newVar.isArchived) {
    res = ops.includeArchived;
  }

  if (newVar.isDeleted) {
    res = ops.includeDeleted;
  }
  return res;
}

function replaceAll(me, str1, str2, ignore?) {
  return me.replace(
    new RegExp(
      str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'),
      ignore ? 'gi' : 'g',
    ),
    typeof str2 == 'string' ? str2.replace(/\$/g, '$$$$') : str2,
  );
}

export function createUniqueIdOfName(name: string): string {
  name = replaceAll(name, ' ', '_');
  return name;
}

export function applyDeletedArray(
  newVar: DbObject[],
  ops?: OrmOptions,
): DbObject[] {
  return newVar.filter((v) => shouldDeletedBeIncluded(v, ops));
}

export async function objectToClass(
  object: any,
  collection: string,
): Promise<AbstractEntity | Array<AbstractEntity>> {
  if (object) {
    if (Array.isArray(object)) {
      if (object.length > 0) {
        return mapManyFromPlainAndExpand(
          object.map((o) => {
            return o;
          }),
          collection,
        );
      }
    } else {
      return mapOneObjectFromPlainAndExpand(null, object, collection);
    }
  }

  return null;
}

export async function mapManyFromPlainAndExpand(
  querySnapshot: any[],
  collection: string,
): Promise<Array<AbstractEntity>> {
  const results = querySnapshot.map((o) => {
    return mapOneObjectFromPlainAndExpand(null, o, collection);
  });

  return Promise.all(results);
}

export async function mapOneObjectFromPlainAndExpand(
  objectRef: ObjectId,
  plainObject: any,
  collection: string,
): Promise<AbstractEntity> {
  const entity = mapOneObjectFromPlain(plainObject, collection);

  if (entity && !entity.id) {
    entity.id = objectRef;
  }

  if (entity) {
    fixUpFSDates(entity);
  }
  return entity;
}
