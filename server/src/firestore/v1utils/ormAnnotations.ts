import 'reflect-metadata';
const mapToObjectIdKey = 'childToProcessKey';
const expandOnLoadKey = 'expandOnLoadKey';
const expandFromIdKey = 'expandFromId';
const cascadingDeleteKey = 'cascadingDelete';
const processMyChildrenKey = 'processMyChildrenKey';

export function expandFromId(targetPropertyId: string) {
  return Reflect.metadata(expandFromIdKey, targetPropertyId);
}

export function expandOnLoad() {
  return Reflect.metadata(expandOnLoadKey, true);
}

export function processMyChildren() {
  return Reflect.metadata(processMyChildrenKey, true);
}

export function cascadingDelete() {
  return Reflect.metadata(cascadingDeleteKey, true);
}

export function mapToObjectId(collection: string) {
  return Reflect.metadata(mapToObjectIdKey, collection);
}

export function getChildrenToExpandFromOtherProperty(
  target: any,
  propertyKey: string,
) {
  return Reflect.getMetadata(expandFromIdKey, target, propertyKey);
}

export function getChildenToExpand(target: any, propertyKey: string) {
  return Reflect.getMetadata(expandOnLoadKey, target, propertyKey);
}
export function getChildrenToProcessFurther(target: any, propertyKey: string) {
  return Reflect.getMetadata(processMyChildrenKey, target, propertyKey);
}

export function getChildrenToMapToObjectId(target: any, propertyKey: string) {
  return Reflect.getMetadata(mapToObjectIdKey, target, propertyKey);
}
export function getCascadingDeletes(target: any, propertyKey: string) {
  return Reflect.getMetadata(cascadingDeleteKey, target, propertyKey);
}
