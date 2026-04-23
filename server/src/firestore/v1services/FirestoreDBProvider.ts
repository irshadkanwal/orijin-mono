import { firestore } from 'firebase-admin';
import objectPath from 'object-path';
import { Timestamp } from 'firebase-admin/firestore';
import {
  applyDeleted,
  applyDeletedArray,
  DbObject,
  IDefaultObject,
  OrmOptions,
  PagedResult,
  SearchDbOptions,
  Tx,
} from '../v1utils/utils';
import { Injectable } from '@nestjs/common';

function getLocation(key: string, id?: string | null): string {
  let r = key;
  if (id) {
    r = r + '.' + id;
  }
  return r;
}
@Injectable()
export class FirestoreDBProvider {
  private _localPreCommitCache: any = {};
  private _offline = false;
  private dbProvider: firestore.Firestore;

  setDb(firestore: FirebaseFirestore.Firestore) {
    this.dbProvider = firestore;
  }

  // setOffline = async (state: boolean) => {};

  private removeUndefineds(obj: any): void {
    for (const i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (obj[i] === undefined) {
          delete obj[i];
        } else if (obj[i] instanceof Array) {
          const array = obj[i];
          for (const a of array) {
            if (a instanceof Object) {
              this.removeUndefineds(a);
            }
          }
        } else if (obj[i] instanceof Object) {
          if (obj[i].type && obj[i].type === 'customDate') {
            const milliseconds = obj[i].ms;
            obj[i] = Timestamp.fromMillis(milliseconds);
          } else {
            this.removeUndefineds(obj[i]);
          }
        }
      }
    }
  }

  filter = async (
    path: string,
    options: SearchDbOptions,
  ): Promise<PagedResult> => {
    try {
      console.log('Filter ' + path, options);
      let collection = this.getPathByType(path);
      const nonRemoteFilters = [];
      let querySnapshot = null;
      let query = null;
      if (!!options && !!options.oldQuery) {
        query = options.oldQuery;
      } else {
        if (options && options.filters) {
          if (options && options.ordering) {
            for (const filter of options.filters) {
              if (options.ordering.map((f) => f.key).includes(filter.key)) {
                throw Error(
                  'Order by clause cannot contain a field with an equality filter name',
                );
              }
            }
          }

          for (const filter of options.filters) {
            if (
              [
                '==',
                '>',
                '<',
                '<=',
                '>=',
                'array-contains',
                'array-contains-any',
                'in',
                'not-in',
                '!=',
              ].includes(filter.operation)
            ) {
              collection = collection.where(
                filter.key,
                filter.operation,
                filter.value,
              );
            } else {
              //TODO:  "!=", "undefinedOrNull"]
              nonRemoteFilters.push(filter);
            }
          }

          if (options.ops && options.ops.includeArchived) {
            collection = collection.where('isArchived', '==', true);
          } else {
            collection = collection.where('isArchived', '==', false);
          }

          if (options.ops && options.ops.includeDeleted) {
            collection = collection.where('isDeleted', '==', true);
          } else {
            collection = collection.where('isDeleted', '==', false);
          }
        }
        if (options && options.ordering) {
          for (const order of options.ordering) {
            collection = collection.orderBy(order.key, order.direction);
          }
        }
        query = collection;
      }
      let totalCount = undefined;
      if (options.ops?.fetchTotal && !options.lastItem) {
        const totalSnap = await query.get();
        totalCount = totalSnap.size;
      }

      if (!!options.limit) {
        query = query.limit(options.limit);
      }

      if (!!options.lastItem) {
        query = query.startAfter(options.lastItem);
      }
      querySnapshot = query.get();

      let elements = [];
      const snapshot = await querySnapshot;
      snapshot.forEach((doc) => {
        // console.log('found item ', doc);
        elements = [...elements, doc.data()];
      });

      const last = snapshot.docs[snapshot.docs.length - 1];

      console.log('Filter done', elements);

      // elements = elements.filter((object: any) =>
      //   filterCondition(object, nonRemoteFilters),
      // );

      if (options.localOrdering) {
      }

      elements = applyDeletedArray(elements, options.ops);

      const result: PagedResult = {
        values: elements,
        lastItem: last,
        // query: query,
        totalCount,
      };
      return result;
    } catch (error) {
      console.error('Error with search options', options);
      console.error('Error with search ', error);
      throw error;
    }
  };

  async set(
    path: string,
    value: IDefaultObject,
    id: string,
    tx: Tx,
    ops?: OrmOptions,
  ): Promise<string> {
    console.log(`set ${path}.${id}`);
    // console.log(`set ${path} ${tx ? ' (with tx)' : ' (no tx)'}`);
    // console.log(`setting ${path}`);
    // console.log('set ' + path, JSON.stringify(value, null, 2))

    if (!value.meta_workspace || !value.meta_organisation) {
      // throw Error("workspace and organisation have to be defined")
    }
    const docRef = null;
    try {
      this.removeUndefineds(value);
      if (path.indexOf('.') >= 0) {
        const collection = this.getPathByType(path);
        let document;
        if (!!id) {
          document = collection.doc(id);

          if (!!tx) {
            await tx.set(document, value);
            // objectPath.set(
            //   this._localPreCommitCache,
            //   getLocation(path, id),
            //   value,
            // );
          } else {
            if (this._offline) {
              document.set(value);
            } else {
              await document.set(value);
            }
          }
          // console.timeEnd(`set ${path}`);
          return id;
        } else {
          throw Error('not supported atm');
          // document = await collection.add(value);
          // return document.id;
        }
      } else {
        const collection = this.getPathByType(path);
        let document;
        if (id) {
          document = collection.doc(id);
        } else {
          document = collection.doc();
        }

        if (!!tx) {
          await tx.set(document, value);
          // objectPath.set(
          //   this._localPreCommitCache,
          //   getLocation(path, id),
          //   value,
          // );
        } else {
          if (this._offline) {
            document.set(value);
          } else {
            await document.set(value);
          }
        }
        // await document.set(value);
        // console.timeEnd(`set ${path}`);
        return document.id;
      }
    } catch (error) {
      console.log(`Firestore - set ` + path, error);
      throw error;
    }
  }

  async onlyCreate(
    path: string,
    value: IDefaultObject,
    id: string,
    tx?: Tx,
    ops?: OrmOptions,
  ): Promise<string> {
    try {
      if (!value.meta_workspace || !value.meta_organisation) {
        // throw Error("workspace and organisation have to be defined")
      }
      this.removeUndefineds(value);
      if (!id) {
        throw Error('id has to be defined for upsert ');
      }

      // document.
      const existing = await this.get(path, id);

      if (existing) {
        console.log(`Exist already do nothing ${path}.${id}`);
        return id;
      }

      if (!!tx) {
        // objectPath.set(this._localPreCommitCache, getLocation(path, id), value);
        return this.set(path, value, id, tx, ops);
      } else {
        return this.set(path, value, id, tx, ops);
      }
    } catch (error) {
      throw error;
    }
  }

  async upsert(
    path: string,
    value: IDefaultObject,
    id: string,
    tx?: Tx,
    ops?: OrmOptions,
  ): Promise<string> {
    // console.log(`FS upsert ${path} ${id}`);
    try {
      if (!value.meta_workspace || !value.meta_organisation) {
        // throw Error("workspace and organisation have to be defined")
      }
      this.removeUndefineds(value);
      if (!id) {
        throw Error('id has to be defined for upsert ');
      }

      const collection = this.getPathByType(path);
      const document = await collection.doc(id);

      if (!!tx) {
        const snapshot = await document.get();
        // objectPath.set(this._localPreCommitCache, getLocation(path, id), value);
        if (snapshot.exists()) {
          await this.update(path, value, id, tx, ops);
          return id;
        } else {
          return this.set(path, value, id, tx, ops);
        }
      } else {
        return this.set(path, value, id, tx, ops);
      }
    } catch (error) {
      throw error;
    }
  }

  async update(
    path: string,
    value: IDefaultObject,
    id: string,
    tx: Tx | null = null,
    _ops?: OrmOptions,
  ) {
    try {
      if (!value.meta_workspace || !value.meta_organisation) {
        // throw Error("workspace and organisation have to be defined")
      }
      this.removeUndefineds(value);
      if (!id) {
        throw Error('id has to be defined for update ');
      }

      const collection = this.getPathByType(path);
      const document = await collection.doc(id);

      if (!!tx) {
        // objectPath.set(this._localPreCommitCache, getLocation(path, id), value);
        await tx.update(document, value);
      } else {
        await document.update(value);
      }
    } catch (error) {
      console.error(`Firestore - set ${path} ${id}`);
      throw error;
    }
  }

  async get(path: string, id: string, ops?: OrmOptions): Promise<any> {
    try {
      // console.log(`get ${path}.${id}`);
      // console.time(`get ${path}.${id}`);
      if (!id) {
        throw Error("Id has to be defined, use 'all' to get all items");
      }
      // const newVar = objectPath.get(
      //   this._localPreCommitCache,
      //   getLocation(path, id),
      // );
      // if (newVar) {
      //   return applyDeleted(newVar, ops);
      // }

      const collection = this.getPathByType(path);
      const document = collection.doc(id);
      // console.time(`getbefore ${path}.${id}`);
      const snapshot = await document.get();
      // console.timeEnd(`getbefore ${path}.${id}`);

      const data = snapshot.data();
      // console.timeEnd(`get ${path}.${id}`);
      return applyDeleted(data as DbObject, ops);
    } catch (error) {
      console.log(`Firestore - get ${path}/${id}`, error);
      throw error;
    }
  }

  async all(path: string, ops?: OrmOptions): Promise<Array<any>> {
    const collection = this.getPathByType(path);
    const querySnapshot = collection.get();
    let elements = [];
    (await querySnapshot).forEach((doc) => {
      elements = [...elements, doc.data()];
    });
    return applyDeletedArray(elements, ops);
  }

  private getPathByType(path: string) {
    const dbProvider = this.dbProvider;

    const v = path.split('.');

    let next = null;
    for (let i = 0; i < v.length; i++) {
      const item = v[i];
      if (i == 0) {
        next = dbProvider.collection(item);
      } else if (i % 2 > 0) {
        next = next.doc(item);
      } else {
        next = next.collection(item);
      }
    }
    return next;
  }

  delete = async (path: string, id?: string, tx?: Tx, _ops?: OrmOptions) => {
    if (!id) {
      const collection = this.getPathByType(path);
      const promise = await collection.get();
      const docs = promise.docs;

      const batch = this.dbProvider.batch();
      for (const doc of docs) {
        batch.delete(doc.ref);
      }
      return batch.commit();
    } else {
      // objectPath.del(this._localPreCommitCache, getLocation(path, id));

      const collection = this.getPathByType(path);
      const documentReference = collection.doc(id);
      if (!!tx) {
        tx.delete(documentReference);
      } else {
        documentReference.delete();
      }
    }
  };

  // clean = async () => {};

  getTransaction() {
    const batch = this.dbProvider.batch();

    return {
      commit: async (): Promise<void> => {
        console.log('FS commit batch ');
        return new Promise(async (resolve, reject) => {
          if (this._offline) {
            batch.commit();
          } else {
            try {
              await batch.commit();
            } catch (error) {
              reject(error);
            }
          }
          resolve();
        });
      },
      delete: async (ref: any): Promise<void> => {
        return new Promise(async (resolve, _reject) => {
          batch.delete(ref);
          resolve();
        });
      },
      update: async (ref: any, value: any): Promise<void> => {
        return new Promise(async (resolve, _reject) => {
          batch.update(ref, value);
          resolve();
        });
      },

      set: async (ref: any, value: any): Promise<void> => {
        return new Promise(async (resolve, _reject) => {
          batch.set(ref, value);
          resolve();
        });
      },
    };
  }

  async commit(transaction: Tx): Promise<any> {
    console.log('FS commit batch2 ');
    try {
      this._localPreCommitCache = {};
      await transaction.commit();
    } catch (e) {
      console.error('Tx commit failed with ', e);
      throw e;
    }
  }

  async getAllById(
    path: string,
    ids: string[],
    ops?: OrmOptions,
  ): Promise<any> {
    try {
      if (!ids || ids.length == 0) {
        throw Error("Id has to be defined, use 'all' to get all items");
      }

      const promises = ids.map((id) => {
        const docRef = this.dbProvider.doc(this.getPathByType(path + '.' + id));
        return docRef.get();
      });
      const snapshots = await Promise.all(promises);
      let elements: any[] = [];
      snapshots.forEach((snapshot) => {
        if (snapshot.exists) {
          elements = [...elements, snapshot.data() as DbObject];
        }
      });
      return applyDeletedArray(elements, ops);
    } catch (error) {
      console.log(`Firestore - getAllById ${path}`, error);
      throw error;
    }
  }
}
