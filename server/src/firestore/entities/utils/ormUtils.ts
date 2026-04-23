import { AbstractEntity } from './AbstractEntity';
import { mapOneObjectFromPlain } from './mappingUtils';
import { ObjectId } from './ObjectId';
import { getCascadingDeletes } from './ormAnnotations';
import { DBTransaction, isObjectId, OrmOptions } from './utils';

export async function mapOneObjectFromPlainAndExpand(
  objectRef: ObjectId,
  plainObject: any,
  collection: string,
): Promise<AbstractEntity> {
  const entity = mapOneObjectFromPlain(plainObject, collection);

  //TODO: just in case the ids should be set for the objects!!!???
  if (entity && !entity.id) {
    entity.id = objectRef;
  }

  return entity;
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
