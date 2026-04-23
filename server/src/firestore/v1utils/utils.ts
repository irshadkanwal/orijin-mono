import { Transform } from 'class-transformer';
import {
  isGlobalCollection,
  WORKSPACES_PARENT_COLLECTION,
} from './dbMappingUtils';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { AbstractEntity } from '../v1entities/utis/AbstractEntity';
import { Meta, V1Id } from '../v1entities/utis/types';
import { mapOneObjectFromPlain, mapPlainToClass } from './mappingUtils';
import {
  expandOneChild,
  expandOneChildFromOtherProperty,
  fixUpFSDates,
} from './ormUtils';
import {
  getChildenToExpand,
  getChildrenToExpandFromOtherProperty,
  getChildrenToProcessFurther,
} from './ormAnnotations';
import UserV1, { Gender } from '../v1entities/org/UserV1';
import { Person } from '../../persons/models/persons.model';
import { Location } from '../../locations/models/locations.model';
import { Farm } from '../../farms/models/farms.model';

export function constructDefaultWorkspaceNameMaster(org: string) {
  return `${org}_master24`;
}
export function constructDefaultWorkspaceNameTest(org: string) {
  return `${org}_test24`;
}

export function setupIdFields<A extends V1Id, B extends AbstractEntity>(
  res: B,
  input: A,
  meta: Meta,
): B {
  res.id = new ObjectId(input.id, res.getCollection());
  res.id.labelShort = input.shortCode;
  res.meta_organisation = meta.organisation;
  res.meta_workspace = meta.workspace;
  res.meta_configkey = meta.configKey;
  res.sourceSystem = 'V2';
  // res.createdBy = input.createdAt;
  // res.createdDate = input.createdAt;
  // res.updatedBy = 'V2';
  // res.updatedDate = 'V2';
  return res;
}
export function transformUserV2(
  mainContactPerson: Person,
  farm: Farm,
  meta: Meta,
) {
  const res = new UserV1();
  setupIdFields(res, mainContactPerson, meta);

  res.type = mainContactPerson.type as any;
  res.phone = mainContactPerson.phone;
  res.phone2 = mainContactPerson.phone2;
  res.name = mainContactPerson.firstName + ' ' + mainContactPerson.lastName;
  res.id.label = res.name;
  res.firstName = mainContactPerson.firstName;
  res.lastName = mainContactPerson.lastName;
  res.gender = mainContactPerson.gender as Gender;
  res.middleName = mainContactPerson.middleName;
  res.nickName = mainContactPerson.nickName;
  res.education = mainContactPerson.education;
  res.maritalStatus = mainContactPerson.maritalStatus;
  res.identificationNumber = mainContactPerson.identificationNumber;
  res.identificationNumberType = mainContactPerson.identificationNumberType;
  res.dobApproximate = mainContactPerson.dateOfBirthApproximate;
  res.dob = mainContactPerson.dateOfBirth
    ? new Date(mainContactPerson.dateOfBirth)
    : null;

  if (
    mainContactPerson.mainContactPersonFor &&
    mainContactPerson?.mainContactPersonFor[0]
  ) {
    res.contactPersonForFacility = new ObjectId(farm.id, 'farms');
    res.contactPersonForFacility.label = farm.facility.name;
    res.contactPersonForFacility.labelShort = farm.facility.shortCode;

    console.log('res.contactPersonForFacility,', res.contactPersonForFacility);

    if (mainContactPerson?.mainContactPersonFor[0].location) {
      const location = mainContactPerson?.mainContactPersonFor[0]?.location;

      parseLocationHierarchyStart(res, location);

      const myLocation = location;
      const parentLocationId = new ObjectId(myLocation.id, 'locations');
      parentLocationId.labelShort = myLocation.shortCode;
      parentLocationId.label = myLocation.name;
      //VILLAGE
      res.parentLocation = parentLocationId;

      if (myLocation.parent) {
        const parentLocationParentId = new ObjectId(
          myLocation.parent.id,
          'locations',
        );
        parentLocationParentId.labelShort = myLocation.parent.shortCode;
        parentLocationParentId.label = myLocation.parent.name;
        //PARISH
        res.parentLocationParent = parentLocationParentId;

        if (myLocation.parent.parent) {
          const parentLOcationParentParentId = new ObjectId(
            myLocation.parent.parent.id,
            'locations',
          );
          parentLOcationParentParentId.labelShort =
            myLocation.parent.parent.shortCode;
          parentLOcationParentParentId.label = myLocation.parent.parent.name;
          //SUB COUNTY
          res.parentLocationParentParent = parentLOcationParentParentId;

          if (myLocation.parent.parent.parent) {
            const parentLocationParentParentParentId = new ObjectId(
              myLocation.parent.parent.parent.id,
              'locations',
            );
            parentLocationParentParentParentId.labelShort =
              myLocation.parent.parent.parent.shortCode;
            parentLocationParentParentParentId.label =
              myLocation.parent.parent.parent.name;
            //DISTRCIT
            res.parentLocationParentParentParent =
              parentLocationParentParentParentId;
          }
        }
      }
    } else {
      console.log('Location or facility not available');
    }
  }

  return res;
}

export function parseLocationHierarchyStart(
  result: LocationSearchHolder,
  location: Location | null,
) {
  if (!location) {
    return;
  }
  if (location.type === 'SubCounty') {
    result.parentLocationParentParentCode = location.shortCode;
    result.parentLocationParentParentName = location.name;
  } else if (location.type === 'District') {
    result.parentLocationParentParentParentCode = location.shortCode;
    result.parentLocationParentParentParentName = location.name;
  } else if (location.type === 'Village') {
    result.parentLocationCode = location.shortCode;
    result.parentLocationName = location.name;
  } else if (location.type === 'Parish') {
    result.parentLocationParentCode = location?.shortCode;
    result.parentLocationParentName = location?.name;
  } else if (location.type === 'CollectionPoint') {
  } else if (location.type === 'Farmergroups') {
  } else if (location.type === 'Zone') {
  } else if (location.type === 'Region') {
  } else {
    throw Error('unknonwn location type ' + location.type);
  }
  parseLocationHierarchyStart(result, location.parent);
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

export class DateWrapper {
  @Transform(({ value }) => formatDatesForFS(value))
  date: Date;
}

export interface HasId {
  id: ObjectId;
}

export function fixUpTheRefCollectionForCollectionString(
  baseCollection: string,
) {
  const suffix = '_wip';

  if (
    baseCollection.indexOf('formsubmissions') < 0 &&
    baseCollection.indexOf('documents') < 0 &&
    // baseCollection.indexOf("pendingtasks") < 0&&
    baseCollection.indexOf(suffix) < 0
  ) {
    const s = baseCollection + '_wip';
    return s;
  }
  return baseCollection;
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

export function fixUpTheRefCollection(entity: AbstractEntity) {
  const baseCollection = entity.getCollection();
  entity.getCollection = function () {
    return fixUpTheRefCollectionForCollectionString(baseCollection);
  };

  const baseCollection2 = entity.id.refcollection;
  entity.id.refcollection =
    fixUpTheRefCollectionForCollectionString(baseCollection2);
}

export interface OrmOptions {
  tx?: DBTransaction;
  applyAC?: boolean;
  targetEntityTag?: string;
  primaryActivityName?: string;
  primaryActivityLabel?: string;
  targetEntityTagJsonata?: string;
  targetRoles?: string[];
  fetchTotal?: boolean;
  noObjectHydration?: boolean;
  expandChildren?: boolean;
  isTest?: boolean;
  expandChildrenIncludeKeys?: string[];
  expandChildrenExcludeKeys?: string[];
  includeDeleted?: boolean;
  includeArchived?: boolean;
  isOfflineFirstDbOperations?: boolean;
  doCache?: boolean;
  cacheKey?: string;
  authToken?: string;
  workspace?: string;
  organisation?: string;
  configKey?: string;
  createdBy?: ObjectId;
  currentUser: ObjectId;
}

export interface DBTransaction {
  transaction: Tx;
  dataHolder?: any;
}

export interface Tx {
  set(ref: any, value: any): Promise<any>;
  update(ref: any, value: any): Promise<any>;
  delete(ref: any): Promise<any>;
  commit(): Promise<any>;
}

export interface IDefaultObject {
  isDeleted: boolean;
  isArchived: boolean;
  meta_workspace: string;
  meta_organisation: string;
  meta_configkey: string;
}

export interface SearchDbOptions {
  filters?: IFilter[];
  limit?: number;
  lastItem?: any;
  ordering?: OrderOption[];
  localOrdering?: OrderOption[];
  ops?: OrmOptions;
  localFilters?: string;
  oldQuery?: any;
}

export type ACSettings = {
  applyAC?: boolean;
  limitToMineOnly?: boolean;
};

export interface IWorkspaceDisplayDataDbSourceTransformationEntry {
  jsonata?: string;
  jstransform?: string;
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

export interface IDBFilterCondition {
  key: string;
  value: any;
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
}

export function getFullCollection(
  path: string,
  ops: OrmOptions,
  delimeter = '.',
  ws: string,
): string {
  if (isGlobalCollection(path)) {
    return path;
  } else {
    if (!ws) {
      ws = ops?.workspace;
    }

    if (!ws) {
      console.log('ops', ops);
      throw Error("ws can't be null");
    }

    return WORKSPACES_PARENT_COLLECTION + delimeter + ws + delimeter + path;
  }
}

export interface LocationSearchHolder {
  parentLocationCode: string;
  parentLocationName: string;

  parentLocationParentCode: string;
  parentLocationParentName: string;

  parentLocationParentParentCode: string;
  parentLocationParentParentName: string;

  parentLocationParentParentParentCode: string;
  parentLocationParentParentParentName: string;
}

export function setUpdatedFields(object: AbstractEntity, ops?: OrmOptions) {
  object.updatedBy = new ObjectId('importscript', 'importscript');
  object.updatedDate = new Date();
}

export function setCreatedFields(object: AbstractEntity, ops?: OrmOptions) {
  object.createdBy = new ObjectId('importscript', 'importscript');
  object.createdDate = new Date();
}

export function shouldDeletedBeIncluded(
  newVar: DbObject,
  ops?: OrmOptions,
): boolean {
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
export const filterCondition = (
  object: any,
  filters: Array<IDBFilterCondition>,
): boolean => {
  throw Error('not implemented');
  // try {
  //   const conditions = (filters || []).map((filter) => {
  //     const objectValue = jmespath.search(object, filter.key);
  //     if (filter.operation === 'undefinedOrNull') {
  //       return objectValue ? false : true;
  //     } else if (filter.operation === 'notUndefinedOrNull') {
  //       return objectValue ? true : false;
  //     } else if (filter.operation === 'in') {
  //       return (filter.value as string[]).includes(objectValue as string);
  //     } else if (filter.operation === 'array-contains') {
  //       const filterValue = filter.value as any;
  //       const targetValue = objectValue as [];
  //       // @ts-ignore
  //       return targetValue.indexOf(filterValue) >= 0;
  //       // return filterStringArray.some(totest=> targetValue.indexOf(totest)>=0)
  //     } else {
  //       const stringExpression = `"${String(filter.value)}" ${
  //         filter.operation
  //       } "${String(objectValue)}"`;
  //       return eval(stringExpression);
  //     }
  //   });
  //
  //   return conditions.includes(false) ? false : true;
  // } catch (error) {
  //   throw error;
  // }
};

export function applyDeleted(newVar: DbObject, ops?: OrmOptions): DbObject {
  return shouldDeletedBeIncluded(newVar, ops) ? newVar : null;
}

export function applyDeletedArray(
  newVar: DbObject[],
  ops?: OrmOptions,
): DbObject[] {
  return newVar.filter((v) => shouldDeletedBeIncluded(v, ops));
}

export interface DbObject {
  isDeleted: boolean;
  isArchived: boolean;
}

export interface PagedResult {
  values: any[];
  // query?: any;
  lastItem?: any;
  totalCount?: number;
}

export async function objectToClass(
  object: any,
  collection: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  getObjectByReferenceFromDb: Function,
  ops?: OrmOptions,
): Promise<AbstractEntity | Array<AbstractEntity>> {
  if (object) {
    if (Array.isArray(object)) {
      if (object.length > 0) {
        return mapManyFromPlainAndExpand(
          object.map((o) => {
            return o;
          }),
          collection,
          getObjectByReferenceFromDb,
          ops,
        );
      }
    } else {
      return mapOneObjectFromPlainAndExpand(
        null,
        object,
        collection,
        getObjectByReferenceFromDb,
        ops,
      );
    }
  }

  return null;
}

export async function mapManyFromPlainAndExpand(
  querySnapshot: any[],
  collection: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  getObjectByReferenceFromDb: Function,
  ops?: any,
): Promise<Array<AbstractEntity>> {
  const results = querySnapshot.map((o) => {
    return mapOneObjectFromPlainAndExpand(
      null,
      o,
      collection,
      getObjectByReferenceFromDb,
      ops,
    );
  });

  return Promise.all(results);
}

export async function mapOneObjectFromPlainAndExpand(
  objectRef: ObjectId,
  plainObject: any,
  collection: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  getObjectByReferenceFromDb: Function,
  ops?: OrmOptions,
): Promise<AbstractEntity> {
  const entity = mapOneObjectFromPlain(plainObject, collection);

  //TODO: just in case the ids should be set for the objects!!!???
  if (entity && !entity.id) {
    entity.id = objectRef;
  }

  if (entity && !!ops && !!ops.expandChildren) {
    await expandChildren(entity, getObjectByReferenceFromDb, ops);
  }

  if (entity) {
    fixUpFSDates(entity);
  }
  return entity;
}

export async function expandChildren(
  entity: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  getObjectByReferenceFromDb: Function,
  ops: OrmOptions,
): Promise<any> {
  const keys = Reflect.ownKeys(entity);

  await Promise.all(
    keys.map(async (key) => {
      if (
        !ops.expandChildrenIncludeKeys ||
        (ops.expandChildrenIncludeKeys || []).indexOf(key as string) >= 0
      ) {
        if (
          !ops.expandChildrenExcludeKeys ||
          (ops.expandChildrenExcludeKeys || []).indexOf(key as string) < 0
        ) {
          if (getChildrenToProcessFurther(entity, <string>key)) {
            const val = Reflect.get(entity, key);
            await expandChildren(val, getObjectByReferenceFromDb, ops);
          } else if (
            !!getChildrenToExpandFromOtherProperty(entity, <string>key)
          ) {
            await expandOneChildFromOtherProperty(
              <string>key,
              entity,
              getObjectByReferenceFromDb,
              getChildrenToExpandFromOtherProperty(entity, <string>key),
              ops,
            );
          } else if (getChildenToExpand(entity, <string>key) == true) {
            await expandOneChild(
              <string>key,
              entity,
              getObjectByReferenceFromDb,
              ops,
            );
          }
        }
      }
    }),
  );
  // for (const key of keys) {
  //   if(!ops.expandChildrenIncludeKeys || (ops.expandChildrenIncludeKeys || []).indexOf(key as string)>=0) {
  //
  //     if(!ops.expandChildrenExcludeKeys ||  (ops.expandChildrenExcludeKeys ||[]).indexOf(key as string) < 0 ) {
  //       if (getChildrenToProcessFurther(entity, <string>key)) {
  //         let val = Reflect.get(entity, key);
  //         await expandChildren(val, getObjectByReferenceFromDb, ops);
  //       } else if (!!getChildrenToExpandFromOtherProperty(entity, <string>key)) {
  //         await expandOneChildFromOtherProperty(<string>key, entity, getObjectByReferenceFromDb, getChildrenToExpandFromOtherProperty(entity, <string>key));
  //       } else if (getChildenToExpand(entity, <string>key) == true) {
  //         await expandOneChild(<string>key, entity, getObjectByReferenceFromDb);
  //       }
  //     }
  //   }
  // }
}

export function addIdToArrayIfNotExists(
  array: Array<ObjectId>,
  item: ObjectId,
) {
  if (item) {
    const existing = array.find((m) => m.id == item.id);
    if (!existing) {
      array.push(item);
    }
  }
}

export const REDUNDANT_FIELDS: Set<string> = new Set([
  'meta_workspace',
  'meta_organisation',
  'meta_configkey',
  'isArchived',
  'isDeleted',
  'creationStatus',
  'approvalStatus',
  'v1ToV2Status',
  'v1ToV2StatusOriginal',
  'sourceSystem',
  'systemStatus',
  'statusReason',
  'properties',
  'getCollection',
  'updatedBy',
  'updatedDate',
  'createdDate',
  'createdBy',
  'lastModified',
  'storagePath',
  'enabled',
  'followUpDate',
  'displayColour',
  'parentFacility',
  'parentFacilityParent',
  'parentFacilityParentParent',
  'parentLocationCode',
  'parentLocationName',
  'parentLocationParentCode',
  'parentLocationParentName',
  'parentLocationParentParent',
  'parentLocationParentParentCode',
  'parentLocationParentParentName',
  'parentLocationParentParentParent',
  'parentLocationParentParentParentCode',
  'parentLocationParentParentParentName',
  'correctiveActionType',
  'correctiveActionDescription',
  'correctiveActionResponsiblePerson',
  'correctiveActionDeadlineDate',
]);

export function filterRedundantFields(data: any[]): any[] {
  return data.map((item) => {
    const filteredItem = { ...item };

    Object.keys(filteredItem).forEach((key) => {
      if (REDUNDANT_FIELDS.has(key)) {
        delete filteredItem[key];
      }
    });

    return filteredItem;
  });
}
