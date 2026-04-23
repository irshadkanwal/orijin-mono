/**
 * Await whole object for all properties of object to execute, returns new object with all properties
 *
 * Usage: (await promiseObject({ property: Promise.resolve(value) })).property === value
 **/
export const promiseObject = async <T extends Record<string, Promise<unknown>>>(
  obj: T,
): Promise<{
  [K in keyof T]: T[K] extends Promise<infer U> ? U : never;
}> => {
  const keys = Object.keys(obj) as (keyof T)[];
  const values = await Promise.all(Object.values(obj));
  const newObj = {} as {
    [K in keyof T]: T[K] extends Promise<infer U> ? U : never;
  };
  return keys.reduce((obj, key, index) => {
    (obj[key] as unknown) = values[index];
    return obj;
  }, newObj);
};
