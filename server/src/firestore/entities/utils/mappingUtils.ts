import {
  ClassConstructor,
  classToPlain,
  plainToClass,
} from 'class-transformer';
import { AbstractEntity } from './AbstractEntity';
import { getClassType } from './DbMappingUtils';

export function mapToPlain<T>(entity: T): any {
  const result = classToPlain(entity);
  return result;
}

export function mapOneObjectFromPlain(
  plainObject: any,
  collection: string,
): any {
  const classType: ClassConstructor<AbstractEntity> = getClassType(collection);

  cleanPlainObjectDates(plainObject);
  if (plainObject instanceof classType) {
    return plainObject;
  } else {
    return plainToClass(classType, plainObject);
  }
}

function cleanPlainObjectDates(obj: any): void {
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (obj[i] === undefined) {
        delete obj[i];
      } else if (obj[i] instanceof Array) {
        const array = obj[i];
        for (const a of array) {
          if (a instanceof Object) {
            cleanPlainObjectDates(a);
          }
        }
      } else if (obj[i] instanceof Object) {
        if (obj[i].toDate) {
          obj[i] = { seconds: obj[i].seconds, nanoseconds: obj[i].nanoseconds };
        } else {
          cleanPlainObjectDates(obj[i]);
        }
      }
    }
  }
}
