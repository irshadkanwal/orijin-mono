import { Prisma } from '@prisma/client';
import { isArray } from 'class-validator';

const isObject = (obj) => {
  return obj !== null && typeof obj === 'object';
};

type FieldDifference = {
  oldValue: unknown;
  newValue: unknown;
};

const difference = <T extends string>(
  oldObject: Record<T, unknown>,
  newObject: Record<T, unknown>,
) => {
  const diff: {
    [key in T]?: FieldDifference | Record<string, FieldDifference>;
  } = {};

  // Get all keys from the first object
  const keys = new Set([...Object.keys(oldObject), ...Object.keys(newObject)]);

  for (const key of keys) {
    if (key in newObject) {
      let o = oldObject[key];
      let n = newObject[key];
      if (o instanceof Prisma.Decimal || n instanceof Prisma.Decimal) {
        o = o?.toString();
        n = n?.toString();
      }

      if (o instanceof Date || n instanceof Date) {
        o = o?.toISOString();
        n = n?.toISOString();
      }

      if (isArray(o) || isArray(n)) {
        if (o !== n) {
          diff[key] = {
            oldValue: o,
            newValue: n,
          };
        }
      } else if (isObject(o) && isObject(n)) {
        // Recursively get the differences of nested objects
        const nestedDiff = difference(o, n);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else if (o === undefined && isObject(n)) {
        const nestedDiff = difference({}, n);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else if (n === undefined && isObject(o)) {
        const nestedDiff = difference(o, {});
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
      } else if (n !== o) {
        // If the values are different, add them to the diff
        diff[key] = {
          oldValue: o,
          newValue: n,
        };
      }
    } else {
      // Removed keys
      diff[key] = {
        oldValue: oldObject[key],
        newValue: undefined,
      };
    }
  }

  return diff;
};

export const getObjectDifferences = (
  oldObject,
  newObject,
  skipDatesAndSuch = false,
) => {
  if (skipDatesAndSuch) {
    const {
      createdAt: createdAtOld,
      updatedAt: updatedAtOld,
      ...restOfOldObject
    } = oldObject;
    const {
      createdAt: createdAtNew,
      updatedAt: updatedAtNew,
      ...restOfNewObject
    } = newObject;

    return difference(restOfOldObject, restOfNewObject);
  } else {
    return difference(oldObject, newObject);
  }
};
