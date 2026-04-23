import { FirestoreDBProvider } from './FirestoreDBProvider';
import { AbstractEntity } from '../v1entities/utis/AbstractEntity';
import {
  DBTransaction,
  fixUpTheRefCollection,
  fixUpTheRefCollectionForCollectionString,
  getFullCollection,
  getObjectId,
  IDefaultObject,
  IFilter, IWorkspaceDisplayDataDbSourceTransformationEntry,
  objectToClass, OrderOption,
  OrmOptions,
  PagedResult,
  SearchDbOptions,
  setCreatedFields,
  setUpdatedFields,
} from '../v1utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from '../v1entities/utis/ObjectId';
import { ClassConstructor } from 'class-transformer';
import { getCollectionKeyByClass, mapToPlain } from '../v1utils/mappingUtils';
import {
  handleCascadingDeleteForChildren,
  mapManyFromPlainAndExpand,
  mapOneObjectFromPlainAndExpand,
  mergeChildrenBackToParent,
  processUpdateAndCreateChildren,
} from '../v1utils/ormUtils';
import {
  isGlobalCollection,
  WORKSPACES_PARENT_COLLECTION,
} from '../v1utils/dbMappingUtils';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class OrmProvider {
  private _dbProvider: FirestoreDBProvider;

  constructor(dbProvider: FirestoreDBProvider) {
    this._dbProvider = dbProvider;
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

  private processChildrenCreateAndUpdateForEntity = async (
    entity: AbstractEntity,
    tx: any,
  ): Promise<any> => {
    const results = {};
    await processUpdateAndCreateChildren(
      entity,
      this.updateObjectInDb,
      this.createObjectInDb,
      results,
      tx,
    );
    return results;
  };

  getOneByDefinition = async (
    dataSourceSchema: {
      source?: string;
      sourceJsonata?: string;
      filters?: IFilter[];
      transformations?: Array<IWorkspaceDisplayDataDbSourceTransformationEntry>;
      ordering?: OrderOption[];
      // sourceOptions?: {
      //   expandChildren?: boolean
      // },
    },
    options?: SearchDbOptions,
    entityScope: any = {},
  ): Promise<PagedResult> => {
    try {
      const filters =
        typeof dataSourceSchema.filters != 'undefined' &&
        dataSourceSchema.filters.length > 0
          ? dataSourceSchema.filters
          : [];

      const ordering =
        typeof dataSourceSchema.ordering != 'undefined' &&
        dataSourceSchema.ordering.length > 0
          ? dataSourceSchema.ordering
          : [];

      // if (dataSourceSchema.sourceJsonata) {
      //   const val = this._jsonServices.execJsonata(
      //     entityScope,
      //     dataSourceSchema.sourceJsonata,
      //   );
      //   return {
      //     values: val,
      //   };
      // }

      const pagedResult = await this.search(
        dataSourceSchema.source,
        {
          filters,
          ordering,
          ...options,
        },
        entityScope,
      );
      let { values: entities } = pagedResult;

      // dont think we need these transformations!!
      // if (dataSourceSchema.transformations && entities.length) {
      //   for (const [
      //     transformIndex,
      //     transform,
      //   ] of dataSourceSchema.transformations.entries()) {
      //     const label = `getOneByDefinition.transform ${transformIndex} ${dataSourceSchema.source}`;
      //     try {
      //       entities = await this._jsonServices.transformJSON(
      //         transform,
      //         entities,
      //         this,
      //         this._configProvider.originalConfig.settings,
      //       );
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }
      // }

      pagedResult.values = entities;

      return pagedResult;
    } catch (e) {
      console.error('Error with transformation probably', dataSourceSchema, e);
      throw e;
    }
  };

  async getBy<T extends AbstractEntity>(
    id: ObjectId,
    cls: ClassConstructor<T>,
    ops?: OrmOptions,
  ): Promise<T> {
    return <Promise<T>>this.getObjectByReferenceFromDb(id, ops);
  }

  private sliceIntoChunks(arr: any[], chunkSize: number): any[][] {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  }

  getAllById = async <T extends AbstractEntity>(
    ids: ObjectId[],
    cls: ClassConstructor<T>,
    ops?: OrmOptions,
  ): Promise<Array<T>> => {
    if (ids && ids.length > 0) {
      const collection = ids[0].refcollection;
      const type = this.getFullCollection(collection, ops);

      const chunkedIds = this.sliceIntoChunks(
        ids.map((m) => m.id),
        10,
      );

      const resultChunks = await Promise.all(
        chunkedIds.map(async (chunk) => {
          const collectionObjects = await this._dbProvider.getAllById(
            type,
            chunk,
          );

          if (collectionObjects && collectionObjects.length > 0) {
            const oObjects = await mapManyFromPlainAndExpand(
              collectionObjects,
              collection,
              this.getObjectByReferenceFromDb,
              ops,
            );
            return <T[]>oObjects;
          }
          return [];
        }),
      );

      return resultChunks.flat();
    }

    return [];
  };

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
      // this._authProvider.user
      const res = await this.search(collection, { ops });
      return res.values;
      // const collectionObjects = await this._dbProvider.all(this.getFullCollection(collection));
      // if (collectionObjects && collectionObjects.length > 0) {
      //   const oObjects = mapManyFromPlainAndExpand(collectionObjects, collection, this.getObjectByReferenceFromDb, ops);
      //   return oObjects;
      // }
      // return [];
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

  // private parseAcRules(collection: string): IFilter[] {
  //   const platformUser: AccountV1 = this.getCurrentUserAccount();
  //
  //   if (!platformUser) {
  //     throw Error('platformUser has to be available');
  //   }
  //
  //   const rules: ACRule[] =
  //     this._configProvider.originalConfig.settings?.authSettings?.rolesOther ??
  //     [];
  //
  //   const myRoles: ACRule[] = this.getCurrentRulesRoles();
  //
  //   const result = [];
  //
  //   const tags = myRoles.map((r) => r.tag);
  //   if ((tags || []).length == 0) {
  //     throw Error('no tags found for user');
  //   }
  //   if ((tags || []).includes('ALL')) {
  //     return [];
  //   }
  //   const string = tags[0];
  //   if (!string) {
  //     throw Error('no tags found for user');
  //   }
  //   result.push({ key: 'id.authTag', operation: 'in', value: [string] });
  //
  //   // result.push({ key: "id.authTag", operation: "==", value: value });
  //
  //   return result;
  // }

  async replaceOneFilterValue(
    changedFilters: any,
    filter: IFilter,
    key: string,
    initializationScope: any = {},
  ) {
    let noFetch = false;
    const value = filter[key];

    // console.log('callApiDb ',value);

    if (value && String(value).includes('#')) {
      if (
        Object.entries(initializationScope).length === 0 &&
        initializationScope.constructor === Object
      ) {
        // console.log('callApiDb.nofetch');
        noFetch = true;
      }
      const newValue = null;
      if (value.startsWith('#JSONATA#')) {
        const exp = value.replace('#JSONATA#', '');
        // console.log('callApiDb..OPTIONS.JSONATA.initializationScope:' + exp, initializationScope );
        // newValue = this._jsonServices.execJsonata(initializationScope, exp);
        // console.log('callApiDb.OPTIONS.JSONATA.initializationScope.value ' , newValue );
        throw Error('not supported, if needed copy from V1');
      } else {
        const exp1 = value.replace('#', '');
        // console.log('callApiDb..evaluateJmesPath.initializationScope:' + exp1 , initializationScope );
        // newValue = await this._jsonServices.execJmesPath(
        //   initializationScope,
        //   exp1,
        // );
        throw Error('not supported, if needed copy from V1');
        // console.log('callApiDb..evaluateJmesPath.initializationScope ', newValue );
      }

      if (String(newValue).includes('#')) {
        console.log('REplace didnt work ' + value, initializationScope);
      }

      if (newValue == null) {
        console.log(
          'Replace for the filter value is empty ' + value,
          initializationScope,
        );
        throw Error('FILTERVALUEEMPTY');
      }

      changedFilters[filter.key] = { oldValue: value, newValue };
      // console.log("callApiDb.changedFilters", changedFilters, initializationScope);

      // console.log("callApiDb.filterDb", filter);
      const newVar = { ...filter, [key]: newValue };
      // console.log("callApiDb.filterDb", newVar);
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
      // workspace: this._configProvider.currentWorkSpace.id,
    };

    if (!options.filters && !options.filters) {
      options.filters = [];
    }

    if (options.filters) {
      // console.log('callApiDb0', options.filters);
      // console.log('callApiDb.initializationScope', initializationScope);
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
      // console.log('callApiDb.filters1', filters);
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
      // console.log('FS callApiDb.filters2 after', filters);
      return {
        ...options,
        filters: filters,
      };
    }
    return options;
  };

  searchOne = async (
    collection: string,
    options: SearchDbOptions = {},
    entityScope: any = {},
  ): Promise<any> => {
    const values = (await this.search(collection, options, entityScope)).values;

    if (values.length === 0) {
      return null;
    }

    if (values.length > 1) {
      throw Error(
        `should only return one ${collection} ${JSON.stringify(options)}`,
      );
    }

    return values[0];
  };

  search = async (
    collection: string,
    options: SearchDbOptions = {},
    entityScope: any = {},
  ): Promise<PagedResult> => {
    const timeKey = this.getSearchTimerKey(collection, options);

    try {
      options = await this.preProcessFilters(options, entityScope);
    } catch (e) {
      if (e.msg === 'FILTERVALUEEMPTY')
        return {
          values: [],
        };
    }

    let ops = options;
    if (!ops) {
      ops = {};
    }

    if (ops.ops && options.ops.applyAC) {
      throw Error('not implemented, copy from V1 if needed');
      // if (ops.ops && options.ops.applyAC && !this._userAuthState.su) {
      // const rules = this.parseAcRules(collection);
      // if (!options.filters) {
      //   options.filters = [];
      // }
      // options.filters.push(...rules);
      // const pagedResultPromise = await this.executeSearch(collection, options);
      // const pagedResult = this.applyRolesForResult(pagedResultPromise, ops.ops);
      // console.log(
      //   'FS executeSearch result after roles filter' + collection,
      //   pagedResult.values,
      //   options.filters,
      // );
      // return pagedResult;
    } else {
      return this.executeSearch(collection, options);
    }
  };

  // private applyAuthRoleForOneEntity(
  //   entity: AbstractEntity,
  //   myRoles: string[],
  // ): boolean {
  //   const me = this._userAuthState.currentUser;
  //
  //   if (myRoles && myRoles.length > 0) {
  //     const entityRolesNeeded = entity.id.authRoles;
  //
  //     // console.log(`applyAuthRoleForOneEntity: ${entity.id.label} ${entity.createdBy.email}`,myRoles, entityRolesNeeded, me.email);
  //
  //     if (entityRolesNeeded && entityRolesNeeded.length > 0) {
  //       const firstRes = entityRolesNeeded.some((r) => myRoles.includes(r));
  //       if (firstRes) {
  //         return true;
  //       }
  //       if (entityRolesNeeded.indexOf('OWN') >= 0) {
  //         const b = entity.createdBy.labelShort === me.email;
  //         if (b) {
  //           return true;
  //         }
  //       }
  //       if (entityRolesNeeded.indexOf('OWN_AS_OPERATOR') >= 0) {
  //         const b = entity?.operatedBy?.id === me.id.id;
  //         if (b) {
  //           return true;
  //         }
  //         return false;
  //       }
  //     } else {
  //       return true;
  //     }
  //   } else {
  //     return false;
  //   }
  // }
  //
  // private getCurrentRulesRoles(): ACRule[] {
  //   const currentUser = this.getCurrentUserAccount();
  //   const myRoles =
  //     this._configProvider.originalConfig.settings?.authSettings?.rolesOther.filter(
  //       (r) =>
  //         r.name ===
  //         currentUser.workspaceRole[this._configProvider.currentWorkSpace.id],
  //     );
  //   return myRoles;
  // }

  // private getCurrentRulesRoleNames(): string[] {
  //   const myRoles = (this.getCurrentRulesRoles() || []).map((r) => r.role);
  //   return myRoles;
  // }
  //
  // private applyRolesForResult(
  //   results: PagedResult,
  //   ops?: OrmOptions,
  // ): PagedResult {
  //   if (ops && ops?.applyAC && !this._userAuthState.su) {
  //     const myRoles = this.getCurrentRulesRoleNames();
  //     const values = results.values.filter((e) =>
  //       this.applyAuthRoleForOneEntity(e, myRoles),
  //     );
  //     results.values = values;
  //   }
  //
  //   return results;
  // }

  private getSearchTimerKey(collection: string, options?: SearchDbOptions) {
    if (options && options.filters && options.filters.length > 0) {
      if (options.filters.length > 1) {
        return `filterfromdb: ${options.filters[0].key}=${options.filters[0].value} : ${options.filters[1].key}=${options.filters[1].value}`;
      } else {
        return `filterfromdb: ${options.filters[0].key}=${options.filters[0].value}`;
      }
    }
    return `filterfromdb: ${collection}`;
  }

  //  search = async (collection: string, options?: SearchDbOptions): Promise<PagedResult> => {
  private async executeSearch<T extends AbstractEntity>(
    collection: string,
    options?: SearchDbOptions,
  ): Promise<PagedResult> {
    let fullCollection = this.getFullCollection(collection, options.ops);

    if (options.ops?.isOfflineFirstDbOperations) {
      fullCollection = fixUpTheRefCollectionForCollectionString(fullCollection);
    }

    let result: PagedResult = null;

    if (!result) {
      result = await this._dbProvider.filter(fullCollection, options);

      // if(options.ops?.doCache){
      //   this.cache.set(key, result)
      // }
    }

    console.log(
      'FS executeSearch result ' + collection,
      result.values,
      options.filters,
    );

    const timerEnd = this.getSearchTimerKey(collection, options);

    const collectionObjects = result.values;
    if (collectionObjects && collectionObjects.length > 0) {
      if (options?.ops?.noObjectHydration) {
        result.values = collectionObjects;
      } else {
        const ops = options ? options.ops : null;

        const oObjects = await mapManyFromPlainAndExpand(
          collectionObjects,
          collection,
          this.getObjectByReferenceFromDb,
          ops,
        );
        result.values = oObjects;
      }
    }

    return result;
  }

  async findOneBy<T extends AbstractEntity>(
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

  async findSingle<T extends AbstractEntity>(
    collection: string,
    property: string,
    propertyvalue: string,
    ops?: OrmOptions,
  ): Promise<T> {
    return <Promise<T>>(
      this.findObjectsByProperty(collection, property, propertyvalue, true, ops)
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

  async findAll<T extends AbstractEntity>(
    collection: string,
    property: string,
    propertyvalue: string,
    ops?: OrmOptions,
  ): Promise<Array<T>> {
    return <Promise<Array<T>>>(
      this.findObjectsByProperty(
        collection,
        property,
        propertyvalue,
        false,
        ops,
      )
    );
  }

  async findAllBy<T extends AbstractEntity>(
    property: string,
    propertyvalue: string,
    cls: ClassConstructor<T>,
    ops?: OrmOptions,
  ): Promise<Array<T>> {
    return <Promise<Array<T>>>(
      this.findObjectsByProperty(
        getCollectionKeyByClass(cls),
        property,
        propertyvalue,
        false,
        ops,
      )
    );
  }
  private findObjectsByProperty = async (
    collection: string,
    property: string,
    propertyvalue: any,
    single?: boolean,
    ops?: OrmOptions,
  ): Promise<AbstractEntity | Array<AbstractEntity>> => {
    try {
      if (!propertyvalue) {
        return null;
      }
      console.log('FS findObjectsByProperty ' + collection);

      const res: PagedResult = await this._dbProvider.filter(
        this.getFullCollection(collection, ops),
        {
          filters: [
            {
              key: property,
              operation: '==',
              value: propertyvalue,
            },
            // {
            //   key: "id.refcollection",
            //   operation: "==",
            //   value: collection
            // }
          ],
        },
      );
      const objects = res.values;

      if (objects && objects.length > 0) {
        const returnObject = objectToClass(
          single ? objects[0] : objects,
          collection,
          this.getObjectByReferenceFromDb,
          ops,
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
  ): Promise<T> {
    let collectionKeyByClass = getCollectionKeyByClass(cls);

    if (ops?.isOfflineFirstDbOperations) {
      collectionKeyByClass =
        fixUpTheRefCollectionForCollectionString(collectionKeyByClass);
    }

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

      const fromdb = await this._dbProvider.get(
        this.getFullCollection(objectRef.refcollection, ops),
        objectRef.id,
        ops,
      );

      const entity: AbstractEntity = await mapOneObjectFromPlainAndExpand(
        objectRef,
        fromdb,
        collection,
        this.getObjectByReferenceFromDb,
        ops,
      );

      return entity;
    } catch (error) {
      throw error;
    }
  };

  getTransaction = (): DBTransaction => {
    return { transaction: this._dbProvider.getTransaction(), dataHolder: {} };
  };

  commit = async (transaction: DBTransaction): Promise<any> => {
    return this._dbProvider.commit(transaction.transaction);
  };

  create = async <T extends AbstractEntity>(
    entity: T,
    ops: OrmOptions,
  ): Promise<T> => {
    return <Promise<T>>this.createObjectInDb(entity, ops);
  };

  private getFullCollection(
    path: string,
    ops: OrmOptions,
    delimeter = '.',
    ws: string = ops?.workspace,
  ): string {
    if (isGlobalCollection(path)) {
      return path;
    } else {
      if (!ops?.workspace) {
        throw Error(
          'workspace has to be provide in the ops when finding collection ' +
            path,
        );
      }
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

  setAuthTagWhenNeeded = async (entity: AbstractEntity, ops?: OrmOptions) => {
    if (ops?.targetEntityTag === '<FROMUSER>') {
      // const user = this.getCurrentUserAccount();
      throw Error('not implemented, copy from V1 if needed');
      //
      // let items =
      //   this._configProvider.originalConfig.settings.authSettings.rolesOther.filter(
      //     (r) => r.name === user.workspaceRole[this._configProvider.currentWorkSpace.id]
      //   );

      // const items = this.getCurrentRulesRoles();

      // if (!items[0]) {
      //   throw Error(
      //     'user has to have a role if entity needs to be saved with tag',
      //   );
      // }
      //
      // entity.id.authTag = items[0].tag;
    } else if (
      ops?.targetEntityTag &&
      ops?.targetEntityTag.startsWith('<FROM_TARGET_OPERATOR>')
    ) {
      // const operator = ops.executionScope['TARGET_OPERATOR'];
      // if (!operator) {
      //   throw Error(
      //     'if using <FROM_TARGET_OPERATOR>. operator has to be in scope',
      //   );
      // }
      throw Error('not supported, if needed copy from V1');

      // let user = await this.getBy(operator, Account);

      // if (!user.workspaceRole) {
      //   throw Error(`user has to have a role if entity needs to be saved with tag  ${JSON.stringify(user)}`);
      // }
      // const items = this.getCurrentRulesRoles();
      //
      // if (!items[0]) {
      //   throw Error(
      //     'user has to have a role if entity needs to be saved with tag',
      //   );
      // }
      // throw Error("not implemented, copy from V1 if needed")
      //
      // entity.id.authTag = items[0].tag;
    } else if (
      ops?.targetEntityTag &&
      ops?.targetEntityTag.startsWith('#JSONATA#')
    ) {
      const exp = ops.targetEntityTag.replace('#JSONATA#', '');
      // const result = this._jsonServices.execJsonata({ entity: entity }, exp);
      throw Error('not implemented');
      // entity.id.authTag = result;
    } else if (ops?.targetEntityTag) {
      entity.id.authTag = ops.targetEntityTag;
    }
    entity.id.authRoles = ops?.targetRoles;
  };

  private createObjectInDb = async (
    entity: AbstractEntity,
    ops: OrmOptions,
  ): Promise<AbstractEntity> => {
    try {
      if (!this._dbProvider) {
        throw new Error('DB not defined.');
      }

      const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;

      let entityValues = null;
      if (!!ops && !!ops.expandChildren) {
        entityValues = await this.processChildrenCreateAndUpdateForEntity(
          entity,
          tx,
        );
      }
      await this.setCreatedFields(entity, ops);

      entity.updatedBy = entity.createdBy;
      entity.updatedDate = entity.createdDate;
      entity.updatedLocation = entity.createdLocation;

      let id = entity.properties ? entity.properties['customId'] : null;

      if (!id) {
        id = uuidv4();
      }
      if (!entity.id) {
        entity.setId(id);
      }

      await this.setAuthTagWhenNeeded(entity, ops);
      const tag = entity.id.authTag;
      if (ops?.isOfflineFirstDbOperations) {
        fixUpTheRefCollection(entity);
      }

      const data: any = mapToPlain(entity);
      const type = this.getFullCollection(entity.getCollection(), ops);

      await this._dbProvider.set(
        type,
        this.wrapDataWithOrgDetails(data, ops),
        id,
        tx,
      );

      if (!!ops && !!ops.expandChildren) {
        await mergeChildrenBackToParent(entity, entityValues);
      }

      return entity;
    } catch (error) {
      throw error;
    }
  };

  private wrapDataWithOrgDetails(data: any, ops: OrmOptions) {
    const workspaceData = data as IDefaultObject;
    workspaceData.meta_workspace = ops.workspace;
    workspaceData.meta_organisation = ops.organisation;

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
      if (!this._dbProvider) {
        throw new Error('DB not defined.');
      }

      const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
      await this.setUpdatedFields(entity, ops);
      const id = entity.id.id;

      if (!id) {
        throw Error('id has to be defined for update');
      }
      let entityValues = null;
      if (!!ops && !!ops.expandChildren) {
        entityValues = await this.processChildrenCreateAndUpdateForEntity(
          entity,
          tx,
        );
      }
      if (ops?.isOfflineFirstDbOperations) {
        fixUpTheRefCollection(entity);
      }

      const toUpdate: any = mapToPlain(entity);

      await this._dbProvider.update(
        this.getFullCollection(entity.id.refcollection, ops),
        this.wrapDataWithOrgDetails(toUpdate, ops),
        id,
        tx,
      );

      if (!!ops && !!ops.expandChildren) {
        await mergeChildrenBackToParent(entity, entityValues);
      }
      return entity;
    } catch (error) {
      throw error;
    }
  };

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

  unDelete = async (objectRef: ObjectId, ops?: OrmOptions): Promise<void> => {
    return this.undoSoftDeleteObject(objectRef, ops);
  };

  softDelete = async (objectRef: ObjectId, ops?: OrmOptions): Promise<void> => {
    return this.softDeleteObject(objectRef, ops);
  };

  undoSoftDeleteObject = async (
    objectRef: ObjectId,
    ops: OrmOptions,
  ): Promise<void> => {
    const entity = await this.getObjectByReferenceFromDb(objectRef, {
      ...ops,
      includeDeleted: true,
    });

    entity.isDeleted = false;

    if (!entity) {
      throw Error('entity doesnt exist with ' + objectRef.idString);
    }

    const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
    const txFull = !!ops && !!ops.tx ? ops.tx : null;

    await handleCascadingDeleteForChildren(
      entity,
      this.undoSoftDeleteObject,
      txFull,
    );

    await this.update(entity, ops);
  };

  softDeleteObject = async (
    objectRef: ObjectId,
    ops: OrmOptions,
  ): Promise<void> => {
    const entity = await this.getObjectByReferenceFromDb(objectRef);

    if (entity) {
      entity.isDeleted = true;

      if (!entity) {
        throw Error('entity doesnt exist with ' + objectRef.idString);
      }

      const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
      const txFull = !!ops && !!ops.tx ? ops.tx : null;

      await handleCascadingDeleteForChildren(
        entity,
        this.softDeleteObject,
        txFull,
      );

      await this.update(entity, ops);
    }
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

    const promise = await this._dbProvider.delete(
      this.getFullCollection(objectRef.refcollection, ops),
      objectRef.id,
      tx,
    );
  };

  // applyAcForEntityByRolesAndConditions(
  //   a: {
  //     name?: string;
  //     rowCondition?: string;
  //     roles?: string[];
  //     rowConditionsForRoles?: RowConditionForRole[];
  //   },
  //   item: AbstractEntity,
  // ): boolean {
  //   let allow = true;
  //
  //   // let currentPlatformUser = this.getCurrentUserAccount()
  //
  //   // const myRoles = this.getCurrentRulesRoleNames();
  //
  //   if (a.rowConditionsForRoles && a.rowConditionsForRoles.length > 0) {
  //     // let originalConfig = this._configProvider.originalConfig;
  //
  //     // let currentUserRoles =
  //     //   currentPlatformUser.accessControlRoles[0];
  //
  //     // if (currentPlatformUser.workspaceRole) {
  //     //   const workspaceRole =
  //     //     currentPlatformUser.workspaceRole[this._configProvider.currentWorkSpace.id];
  //     //   if (workspaceRole) {
  //     //     return r.name === workspaceRole;
  //     //   }
  //     // }
  //
  //     // let myRoles = originalConfig.settings.authSettings.rolesOther
  //     //   .filter((r) => r.name === currentUserRoles)
  //     //   .map((r) => r.role);
  //
  //     // console.log('myRoles', myRoles);
  //
  //     const applicableCOnditions = a.rowConditionsForRoles.filter((r) =>
  //       r.roles.includes(myRoles[0]),
  //     );
  //
  //     if (
  //       applicableCOnditions.length === 0 ||
  //       applicableCOnditions.length > 1
  //     ) {
  //       console.log(
  //         'Disallowed by rowConditionsForRoles',
  //         a.rowConditionsForRoles,
  //         applicableCOnditions,
  //       );
  //       console.log('applicableCOnditions', applicableCOnditions);
  //       allow = false;
  //     } else {
  //       allow = this._jsonServices.execJsonata(
  //         { entity: item },
  //         applicableCOnditions[0].rowCondition,
  //       );
  //     }
  //
  //     if (!allow) {
  //     }
  //   } else {
  //     if (a.roles && a.roles.length > 0) {
  //       const originalConfig = this._configProvider.originalConfig;
  //
  //       // let currentUserRoles =
  //       //   currentPlatformUser.accessControlRoles[0];
  //       //
  //       // let myRoles = originalConfig.settings.authSettings.rolesOther
  //       //   .filter((r) => r.name === currentUserRoles)
  //       //   .map((r) => r.role);
  //       allow = myRoles.some((r) => a.roles.includes(r));
  //       if (!allow) {
  //       }
  //     }
  //
  //     if (allow) {
  //       allow = a.rowCondition
  //         ? this._jsonServices.execJsonata({ entity: item }, a.rowCondition)
  //         : true;
  //       if (!allow) {
  //         console.log('Disallowed by rowCondition', a.rowCondition);
  //       }
  //     }
  //   }
  //   return allow;
  // }

  async onlyCreate(entity: AbstractEntity, ops?: OrmOptions) {
    const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
    setUpdatedFields(entity, ops);
    const id = entity.id.id;

    if (!id) {
      const id = entity.properties ? entity.properties['customId'] : null;

      if (!id) {
        throw Error('It has to be provided');
      }
      if (!entity.id) {
        entity.setId(id);
      }

      setCreatedFields(entity, ops);
      // await this.setAuthTagWhenNeeded(entity, ops);
    }

    if (!entity.meta_workspace) {
      throw Error('meta_workspace');
    }
    if (!entity.meta_organisation) {
      throw Error('meta_organisation');
    }

    if (!entity.meta_configkey) {
      throw Error('meta_configkey');
    }

    // let entityValues = null;
    // if (!!ops && !!ops.expandChildren) {
    //   entityValues = await this.processChildrenCreateAndUpdateForEntity(
    //     entity,
    //     tx,
    //   );
    // }
    if (ops?.isOfflineFirstDbOperations) {
      fixUpTheRefCollection(entity);
    }

    const toUpdate: any = mapToPlain(entity);

    await this._dbProvider.onlyCreate(
      getFullCollection(
        entity.id.refcollection,
        ops,
        '.',
        entity.meta_workspace,
      ),
      toUpdate,
      id,
      tx,
    );
  }

  async upsert(entity: AbstractEntity, ops?: OrmOptions) {
    const tx = !!ops && !!ops.tx ? ops.tx.transaction : null;
    setUpdatedFields(entity, ops);
    const id = entity.id.id;

    if (!id) {
      const id = entity.properties ? entity.properties['customId'] : null;

      if (!id) {
        throw Error('It has to be provided');
      }
      if (!entity.id) {
        entity.setId(id);
      }

      setCreatedFields(entity, ops);
      // await this.setAuthTagWhenNeeded(entity, ops);
    }

    if (!entity.meta_workspace) {
      throw Error('meta_workspace');
    }
    if (!entity.meta_organisation) {
      throw Error('meta_organisation');
    }

    if (!entity.meta_configkey) {
      throw Error('meta_configkey');
    }

    // let entityValues = null;
    // if (!!ops && !!ops.expandChildren) {
    //   entityValues = await this.processChildrenCreateAndUpdateForEntity(
    //     entity,
    //     tx,
    //   );
    // }
    if (ops?.isOfflineFirstDbOperations) {
      fixUpTheRefCollection(entity);
    }

    const toUpdate: any = mapToPlain(entity);

    await this._dbProvider.upsert(
      getFullCollection(
        entity.id.refcollection,
        ops,
        '.',
        entity.meta_workspace,
      ),
      toUpdate,
      id,
      tx,
    );
  }

  async all(collection: string) {
    return this._dbProvider.all(collection);
  }
}
