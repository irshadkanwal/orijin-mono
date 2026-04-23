import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import {
  applyDeleted,
  applyDeletedArray,
  DbObject,
  IDefaultObject,
  OrmOptions,
  PagedResult,
  SearchDbOptions,
  Tx,
} from '../entities/utils/utils';
import { Timestamp } from 'firebase-admin/firestore';

@Injectable()
export class FirestoreDBService {
  private dbProvider: firestore.Firestore;

  private _offline = false;

  setDb(firestore: FirebaseFirestore.Firestore) {
    this.dbProvider = firestore;
  }

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

  async set(
    path: string,
    value: IDefaultObject,
    id: string,
    tx: Tx,
    ops?: OrmOptions,
  ): Promise<string> {
    try {
      this.removeUndefineds(value);

      const collection = this.getPathByType(path);
      let document;
      if (id) {
        document = collection.doc(id);
      } else {
        document = collection.doc();
      }

      if (!!tx) {
        await tx.set(document, value);
      } else {
        if (this._offline) {
          document.set(value);
        } else {
          await document.set(value);
        }
      }
      return document.id;
    } catch (error) {
      console.log(`Firestore - set ` + path, error);
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
      this.removeUndefineds(value);
      if (!id) {
        throw Error('id has to be defined for update ');
      }
      const collection = this.getPathByType(path);
      const document = await collection.doc(id);
      let response;
      if (!!tx) {
        response = await tx.update(document, value);
      } else {
        response = await document.update(value);
      }
    } catch (error) {
      console.error(`Firestore - set ${path} ${id}`);
      throw error;
    }
  }

  async get(path: string, id: string, ops?: OrmOptions): Promise<any> {
    try {
      if (!id) {
        throw Error("Id has to be defined, use 'all' to get all items");
      }

      const collection = this.getPathByType(path);
      const document = collection.doc(id);
      const snapshot = await document.get();

      const data = snapshot.data();
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

  filter = async (
    path: string,
    options: SearchDbOptions,
  ): Promise<PagedResult> => {
    try {
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

      if (!!options.offset) {
        query = query.offset((options.offset - 1) * options.limit);
      }

      if (!!options.lastItem) {
        query = query.startAfter(options.lastItem);
      }
      querySnapshot = query.get();

      let elements = [];
      const snapshot = await querySnapshot;
      snapshot.forEach((doc) => {
        elements = [...elements, doc.data()];
      });

      const last = snapshot.docs[snapshot.docs.length - 1];

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
      const collection = this.getPathByType(path);
      const documentReference = collection.doc(id);
      if (!!tx) {
        tx.delete(documentReference);
      } else {
        documentReference.delete();
      }
    }
  };

  getTransaction() {
    const batch = this.dbProvider.batch();

    return {
      commit: async (): Promise<void> => {
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
    try {
      await transaction.commit();
    } catch (e) {
      console.error('Tx commit failed with ', e);
      throw e;
    }
  }
}
