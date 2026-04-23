
const cascadingDeleteKey = 'cascadingDelete';

export function getCascadingDeletes(target: any, propertyKey: string) {
  return Reflect.getMetadata(cascadingDeleteKey, target, propertyKey);
}
