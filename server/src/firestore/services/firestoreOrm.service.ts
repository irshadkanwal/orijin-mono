import { Injectable } from '@nestjs/common';
import { AbstractEntity } from '../entities/utils/AbstractEntity';
import { ClassConstructor } from 'class-transformer';
import { getCollectionKeyByClass } from '../entities/utils/DbMappingUtils';
import { ObjectId } from '../entities/utils/ObjectId';
import {
  DBTransaction,
  getObjectId,
  IDefaultObject,
  IFilter,
  objectToClass,
  OrmOptions,
  PagedResult,
  SearchDbOptions,
} from '../entities/utils/utils';
import { FirestoreDBService } from './firestoreDb.service';
import { v4 as uuidv4 } from 'uuid';
import { mapToPlain } from '../entities/utils/mappingUtils';
import {
  handleCascadingDeleteForChildren,
  mapOneObjectFromPlainAndExpand,
} from '../entities/utils/ormUtils';

@Injectable()
export class FirestoreOrmService {
  private firestoreDBService: FirestoreDBService;

  constructor(firestoreDBService: FirestoreDBService) {
    this.firestoreDBService = firestoreDBService;
  }

  private async setCreatedFields(object: AbstractEntity, ops: OrmOptions) {
    object.createdBy = ops.currentUser;
    object.createdDate = this.getCurrentDate();
  }

  private async setUpdatedFields(object: AbstractEntity, ops: OrmOptions) {
    object.updatedBy = ops.currentUser;
    object.updatedDate = this.getCurrentDate();
  }

  private getCurrentDate(): Date {
    return new Date();
  }

  async getBy<T extends AbstractEntity>(
    id: ObjectId,
    cls: ClassConstructor<T>,
    ops?: OrmOptions,
  ): Promise<T> {
    return <Promise<T>>this.getObjectByReferenceFromDb(id, ops);
  }

  getAllBy = async <T extends AbstractEntity>(
    cls: ClassConstructor<T>,
    ops?: OrmOptions,
  ): Promise<Array<T>> => {
    return this.getAll(getCollectionKeyByClass(cls), ops);
  };

  getAll = async <T extends AbstractEntity>(
    collection: string,
    ops?: OrmOptions,
  ): Promise<Array<T>> => {
    const res = this.getAllItemsForCollection(collection, ops);
    return <Promise<Array<T>>>res;
  };

  private getAllItemsForCollection = async (
    collection: string,
    ops?: OrmOptions,
  ): Promise<Array<AbstractEntity>> => {
    try {
      const res = await this.search(collection, { ops });
      return res.values;
    } catch (error) {
      throw error;
    }
  };

  searchBy = async <T extends AbstractEntity>(
    cls: ClassConstructor<T>,
    options?: SearchDbOptions,
  ): Promise<PagedResult> => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.search(getCollectionKeyByClass(cls), options);
  };

  async replaceOneFilterValue(
    changedFilters: any,
    filter: IFilter,
    key: string,
    initializationScope: any = {},
  ) {
    let noFetch = false;
    const value = filter[key];

    if (value && String(value).includes('#')) {
      if (
        Object.entries(initializationScope).length === 0 &&
        initializationScope.constructor === Object
      ) {
        noFetch = true;
      }
      const newValue = null;
      if (value.startsWith('#JSONATA#')) {
        throw Error('not supported, if needed copy from V1');
      } else if (String(newValue).includes('#')) {
        console.log('Replace didnt work ' + value, initializationScope);
      } else {
        throw Error('not supported, if needed copy from V1');
      }

      if (String(newValue).includes('#')) {
        console.log('REplace didnt work ' + value, initializationScope);
      }

      if (newValue == null) {
        throw Error('FILTER_VALUE_EMPTY');
      }

      changedFilters[filter.key] = { oldValue: value, newValue };
      const newVar = { ...filter, [key]: newValue };
      return newVar;
    }
    return filter;
  }

  preProcessFilters = async (
    options: SearchDbOptions = {},
    initializationScope: any = {},
  ): Promise<SearchDbOptions> => {
    const noFetch = false;

    initializationScope = {
      ...initializationScope,
    };

    if (!options.filters && !options.filters) {
      options.filters = [];
    }

    if (options.filters) {
      const changedFilters = {};
      let filters = await Promise.all(
        options.filters.map(async (filter) => {
          filter = await this.replaceOneFilterValue(
            changedFilters,
            filter,
            'value',
            initializationScope,
          );
          filter = await this.replaceOneFilterValue(
            changedFilters,
            filter,
            'key',
            initializationScope,
          );

          return filter;
        }),
      );
      filters = filters.filter((filter) => {
        const changedFilter = changedFilters[filter.key];
        if (changedFilter) {
          if (
            changedFilter.oldValue != null &&
            changedFilter.newValue == null
          ) {
            return false;
          }
        }
        return true;
      });
      return {
        ...options,
        filters: filters,
      };
    }
    return options;
  };

  search = async (
    collection: string,
    options: SearchDbOptions = {},
    entityScope: any = {},
  ): Promise<PagedResult> => {
    try {
      options = await this.preProcessFilters(options, entityScope);
    } catch (e) {
      if (e.msg === 'FILTER_VALUE_EMPTY')
        return {
          values: [],
        };
    }

    let ops = options;
    if (!ops) {
      ops = {};
    }

    return this.executeSearch(collection, options);
  };

  private async executeSearch<T extends AbstractEntity>(
    collection: string,
    options?: SearchDbOptions,
  ): Promise<PagedResult> {
    let fullCollection = collection;
    let result: PagedResult = null;

    if (!result) {
      result = await this.firestoreDBService.filter(fullCollection, options);
    }

    return result;
  }

  async findSingle<T extends AbstractEntity>(
    collection: string,
    property: string,
    propertyValue: string,
    ops?: OrmOptions,
  ): Promise<T> {
    return <Promise<T>>(
      this.findObjectsByProperty(collection, property, propertyValue, true, ops)
    );
  }

  async findBy<T extends AbstractEntity>(
    property: string,
    propertyvalue: string,
    cls: ClassConstructor<T>,
    ops?: OrmOptions,
  ): Promise<T> {
    return <Promise<T>>(
      this.findObjectsByProperty(
        getCollectionKeyByClass(cls),
        property,
        propertyvalue,
        true,
        ops,
      )
    );
  }

  private findObjectsByProperty = async (
    collection: string,
    property: string,
    propertyValue: any,
    single?: boolean,
    ops?: OrmOptions,
  ): Promise<AbstractEntity | Array<AbstractEntity>> => {
    try {
      if (!propertyValue) {
        return null;
      }

      const res: PagedResult = await this.firestoreDBService.filter(
        collection,
        {
          filters: [
            {
              key: property,
              operation: '==',
              value: propertyValue,
            },
          ],
        },
      );
      const objects = res.values;

      if (objects && objects.length > 0) {
        const returnObject = objectToClass(
          single ? objects[0] : objects,
          collection,
        );

        return returnObject;
      }

      return null;
    } catch (error) {
      throw error;
    }
  };

  async getById<T extends AbstractEntity>(
    id: string,
    cls: ClassConstructor<T>,
    ops?: OrmOptions,
  ) {
    let collectionKeyByClass = getCollectionKeyByClass(cls);
    const objectId = new ObjectId(id, collectionKeyByClass);

    return <Promise<T>>this.getObjectByReferenceFromDb(objectId, ops);
  }

  getObjectByReferenceFromDb = async (
    objectId: ObjectId,
    ops?: OrmOptions,
  ): Promise<AbstractEntity> => {
    try {
      const objectRef = getObjectId(objectId);
      if (!objectRef) {
        throw Error('object ref not defined');
      }

      const collection = objectRef.refcollection;
      const fromDB = await this.firestoreDBService.get(
        objectRef.refcollection,
        objectRef.id,
        ops,
      );

      const entity: AbstractEntity = await mapOneObjectFromPlainAndExpand(
        objectRef,
        fromDB,
        collection,
      );

      return entity;
    } catch (error) {
      throw error;
    }
  };

  getTransaction = (): DBTransaction => {
    return {
      transaction: this.firestoreDBService.getTransaction(),
      dataHolder: {},
    };
  };

  commit = async (transaction: DBTransaction): Promise<any> => {
    return this.firestoreDBService.commit(transaction.transaction);
  };

  create = async <T extends AbstractEntity>(
    entity: T,
    ops: OrmOptions,
  ): Promise<T> => {
    return <Promise<T>>this.createObjectInDb(entity, ops);
  };

  private createObjectInDb = async (
    entity: AbstractEntity,
    ops: OrmOptions,
  ): Promise<AbstractEntity> => {
    try {
      if (!this.firestoreDBService) {
        throw new Error('DB not defined.');
      }

      const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
      await this.setCreatedFields(entity, ops);

      entity.updatedBy = entity.createdBy;
      entity.updatedDate = entity.createdDate;

      let id = entity.properties ? entity.properties['customId'] : null;

      if (!id) {
        id = uuidv4();
      }
      if (!entity.id) {
        entity.setId(id);
      }

      const data: any = mapToPlain(entity);
      const type = entity.getCollection();

      const responseOfSet = await this.firestoreDBService.set(
        type,
        this.wrapDataWithOrgDetails(data, ops),
        id,
        tx,
      );
      return entity;
    } catch (error) {
      throw error;
    }
  };

  private wrapDataWithOrgDetails(data: any, ops: OrmOptions) {
    const workspaceData = data as IDefaultObject;

    workspaceData.meta_configkey = ops.configKey;

    return workspaceData;
  }

  update = async <T extends AbstractEntity>(
    entity: T,
    ops?: OrmOptions,
  ): Promise<T> => {
    return <Promise<T>>this.updateObjectInDb(entity, ops);
  };

  updateObjectInDb = async (
    entity: AbstractEntity,
    ops: OrmOptions,
  ): Promise<AbstractEntity> => {
    try {
      if (!this.firestoreDBService) {
        throw new Error('DB not defined.');
      }

      const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
      await this.setUpdatedFields(entity, ops);
      const id = entity.id.id;

      if (!id) {
        throw Error('id has to be defined for update');
      }
      let entityValues = null;

      const toUpdate: any = mapToPlain(entity);

      await this.firestoreDBService.update(
        entity.id.refcollection,
        this.wrapDataWithOrgDetails(toUpdate, ops),
        id,
        tx,
      );
      return entity;
    } catch (error) {
      throw error;
    }
  };

  async all(collection: string) {
    return this.firestoreDBService.all(collection);
  }

  deleteById = async <T extends AbstractEntity>(
    id: string,
    cls: ClassConstructor<T>,
    ops: OrmOptions,
  ): Promise<void> => {
    const objectId = new ObjectId(id, getCollectionKeyByClass(cls));
    await this.deleteObject(objectId, ops);
  };

  delete = async (objectRef: ObjectId, ops: OrmOptions): Promise<void> => {
    return this.deleteObject(objectRef, ops);
  };

  deleteObject = async (
    objectRef: ObjectId,
    ops: OrmOptions,
  ): Promise<void> => {
    const entity = await this.getObjectByReferenceFromDb(objectRef, ops);

    if (!entity) {
      throw Error('entity doesnt exist with ' + objectRef.idString);
    }

    const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
    const txFull = !!ops && !!ops.tx ? ops.tx : null;

    await handleCascadingDeleteForChildren(entity, this.deleteObject, txFull);

    const promise = await this.firestoreDBService.delete(
      objectRef.refcollection,
      objectRef.id,
      tx,
    );
  };
}
