import log from 'loglevel';
import {
  DBTransaction,
  getObjectId,
  isObjectId,
  OrmOptions,
  SearchDbOptions,
} from './utils';
import {
  getCascadingDeletes,
  getChildenToExpand,
  getChildrenToExpandFromOtherProperty,
  getChildrenToMapToObjectId,
  getChildrenToProcessFurther,
} from './ormAnnotations';
import { AbstractEntity } from '../v1entities/utis/AbstractEntity';
import { mapOneObjectFromPlain } from './mappingUtils';
import { ObjectId } from '../v1entities/utis/ObjectId';

export function createCacheKeyForSearch(
  prefix: string,
  collection: string,
  options?: SearchDbOptions,
) {
  let key = collection;

  if (options.ordering) {
    key =
      key +
      '_' +
      options.ordering.map((o) => {
        return o.key + '_' + o.direction;
      });
  }

  if (options.filters) {
    key =
      key +
      '_' +
      options.filters.map((o) => {
        return o.key + '_' + o.operation + '_' + o.value;
      });
  }

  return (prefix ? prefix + '_' : '') + key;
}

export function createCacheKeyForget(
  prefix: string,
  collection: string,
  id: string,
) {
  return (prefix ? prefix + '_' : '') + collection + '_' + id;
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

export function fixUpTheRefCollection(entity: AbstractEntity) {
  const baseCollection = entity.getCollection();
  entity.getCollection = function () {
    return fixUpTheRefCollectionForCollectionString(baseCollection);
  };

  const baseCollection2 = entity.id.refcollection;
  entity.id.refcollection =
    fixUpTheRefCollectionForCollectionString(baseCollection2);
}

export async function processUpdateAndCreateChildrenWithKey(
  key: any,
  results: any,
  entity: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  updateCallBack: Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  createCallBack: Function,
  tx: DBTransaction,
): Promise<any> {
  const collection = getChildrenToMapToObjectId(entity, <string>key);

  const val = Reflect.get(entity, key);
  console.log('processUpdateAndCreateChildrenWithKey', collection, val);
  if (Array.isArray(val)) {
    const resultArray = [];
    for (const item of val) {
      let child: AbstractEntity = <AbstractEntity>item;
      if (!child.getCollection) {
        child = mapOneObjectFromPlain(child, collection);
      }
      if (child.id && child.id.id) {
        await updateCallBack(child, { tx });
      } else {
        child = await createCallBack(child, { tx });
      }
      results[child.id.id] = child;
      resultArray.push(child.id);
    }
    Reflect.set(entity, key, resultArray);
  } else {
    let child: AbstractEntity = <AbstractEntity>val;
    if (child != null) {
      if (!child.getCollection) {
        child = mapOneObjectFromPlain(child, collection);
      }

      if (child.id && child.id.id) {
        await updateCallBack(child, { tx });
        Reflect.set(entity, key, child.id);
        results[child.id.id] = child;
      } else {
        const returnedChild = await createCallBack(child, { tx });
        Reflect.set(entity, key, returnedChild.id);
        results[returnedChild.id.id] = returnedChild;
      }
    }
  }
}

export function fixUpFSDates(obj: any): void {
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] === undefined) {
        delete obj[i];
      } else if (obj[i] instanceof Array) {
        const array = obj[i];
        for (const a of array) {
          if (a instanceof Object) {
            fixUpFSDates(a);
          }
        }
      } else if (obj[i] instanceof Object) {
        const oo = obj[i];
        if (oo.nanoseconds != undefined && oo.seconds != undefined) {
          obj[i] = new Date(oo.seconds * 1000 + oo.nanoseconds / 1000000);
        } else {
          fixUpFSDates(oo);
        }
      }
    }
  }
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

export async function processUpdateAndCreateChildren(
  entity: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  updateCallBack: Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  createCallBack: Function,
  results: any,
  tx: DBTransaction,
): Promise<any> {
  for (const key of Reflect.ownKeys(entity)) {
    if (getChildrenToProcessFurther(entity, <string>key)) {
      const val = Reflect.get(entity, key);
      await processUpdateAndCreateChildren(
        val,
        updateCallBack,
        createCallBack,
        results,
        tx,
      );
    } else if (getChildrenToMapToObjectId(entity, <string>key)) {
      await processUpdateAndCreateChildrenWithKey(
        <string>key,
        results,
        entity,
        updateCallBack,
        createCallBack,
        tx,
      );
    }
  }
}

export async function expandOneChild(
  key: any,
  entity: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  getObjectByReferenceFromDb: Function,
  ops: any,
): Promise<any> {
  const val = Reflect.get(entity, key);
  if (Array.isArray(val)) {
    const resultArray = [];
    for (const item of val) {
      console.log('FS CACHE fetching children in array');
      try {
        if (!getObjectId(item)) {
          log.error(
            'children marked with expand annotation have to be of type ObjectId ' +
              key.toString(),
            item,
          );
          log.error('array', val);
          log.error('Check your entity', entity);
          throw Error(
            'children marked with expand annotation have to be of type ObjectId ',
          );
        }
      } catch (e) {
        log.debug('Errror in object', e);
        throw e;
      }
      const child = await getObjectByReferenceFromDb(item, {
        ...ops,
        expandChildren: true,
      });
      resultArray.push(child);
    }
    Reflect.set(entity, key, resultArray);
  } else {
    if (val) {
      try {
        if (!getObjectId(val)) {
          log.error('Check your entity', entity);
          log.error(
            'children marked with expand annotation have to be of type ObjectId ' +
              key.toString(),
            val,
          );
          throw Error(
            'children marked with expand annotation have to be of type ObjectId ',
          );
        }
      } catch (e) {
        log.debug('aa', e);
        throw e;
      }
      const child = await getObjectByReferenceFromDb(val, ops);

      Reflect.set(entity, key, child);
    }
  }
}

export async function expandOneChildFromOtherProperty(
  key: any,
  entity: any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  getObjectByReferenceFromDb: Function,
  targetKey: string,
  ops: any,
): Promise<any> {
  const val = Reflect.get(entity, key);
  const IdValueObject = Reflect.get(entity, targetKey);
  if (IdValueObject) {
    if (Array.isArray(IdValueObject)) {
      // let resultArray = [];

      const resultArray = await Promise.all(
        IdValueObject.filter((item) => (item ? true : false)).map((item) => {
          if (!getObjectId(item)) {
            log.error(
              'children marked with expand annotation have to be of type ObjectId ' +
                key.toString(),
              item,
            );
            log.error('array', val);
            log.error('Check your entity', entity);
            throw Error(
              'children marked with expand annotation have to be of type ObjectId ',
            );
          }
          return getObjectByReferenceFromDb(item, {
            ...ops,
            expandChildren: false,
          });
        }),
      );
      // for (let item of val) {
      //   try {
      //
      //   } catch (e) {
      //     log.debug("Errror in object", e);
      //     throw e;
      //   }
      //   let child = await getObjectByReferenceFromDb(item);
      //   resultArray.push(child);
      // }
      Reflect.set(entity, key, resultArray);
    } else {
      if (IdValueObject) {
        try {
          if (!getObjectId(IdValueObject)) {
            log.error('Check your entity', entity);
            log.error(
              'children marked with expand annotation have to be of type ObjectId ' +
                key.toString(),
              val,
            );
            throw Error(
              'children marked with expand annotation have to be of type ObjectId ',
            );
          }
        } catch (e) {
          log.debug('aa', e);
          throw e;
        }
        const child = await getObjectByReferenceFromDb(IdValueObject, ops);

        Reflect.set(entity, key, child);
      }
    }
  }
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

export async function handleCascadingDeleteForChildren(
  entity: AbstractEntity,
  // eslint-disable-next-line @typescript-eslint/ban-types
  deleteObject: Function,
  tx: DBTransaction,
) {
  for (const key of Reflect.ownKeys(entity)) {
    if (getCascadingDeletes(entity, <string>key) == true) {
      const val = Reflect.get(entity, key);
      if (Array.isArray(val)) {
        for (const item of val) {
          try {
            if (isObjectId(item)) {
              await deleteObject(item, { tx });
            } else {
              await deleteObject((<AbstractEntity>item).id, { tx });
            }
          } catch (e) {
            console.warn('Problem with casdading delete, can be ignored ', e);
          }
        }
      } else {
        try {
          if (isObjectId(val)) {
            await deleteObject(val, { tx });
          } else {
            const v: AbstractEntity = <AbstractEntity>val;
            await deleteObject(v.id, { tx });
          }
        } catch (e) {
          console.warn('Problem with casdading delete, can be ignored ', e);
        }
      }
    }
  }
}

export async function mergeChildrenBackToParent(
  entity: AbstractEntity,
  entityValues: any,
) {
  for (const key of Reflect.ownKeys(entity)) {
    if (getChildrenToProcessFurther(entity, <string>key)) {
      const val = Reflect.get(entity, key);
      await mergeChildrenBackToParent(val, entityValues);
    } else if (getChildrenToMapToObjectId(entity, <string>key)) {
      const collection = getChildrenToMapToObjectId(entity, <string>key);
      const val = Reflect.get(entity, key);
      if (Array.isArray(val)) {
        const resultArray = [];
        for (const item of val) {
          const child: ObjectId = <ObjectId>item;
          resultArray.push(entityValues[child.id]);
        }
        Reflect.set(entity, key, resultArray);
      } else {
        const child: ObjectId = <ObjectId>val;
        if (child) {
          Reflect.set(entity, key, entityValues[child.id]);
        }
      }
    }
  }
}
