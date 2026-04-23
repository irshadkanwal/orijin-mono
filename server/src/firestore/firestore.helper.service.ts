// Needs to be outside of firestore.service, or otherwise a circular dependency will be created
import { firestore } from 'firebase-admin';
import CollectionReference = firestore.CollectionReference;
import Filter = firestore.Filter;
import { Injectable, Logger } from '@nestjs/common';
import QuerySnapshot = firestore.QuerySnapshot;
import QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
import Firestore = firestore.Firestore;
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;
import { Timestamp } from 'firebase-admin/firestore';

@Injectable()
export class FirestoreUtilsService {
  private logger = new Logger(FirestoreUtilsService.name);

  async getDataFromFirestore(db, workspaceName) {
    // +   "coffee_processing",
    //   +   "configurations",
    //   +   "organisations",
    //   +   "platformusers",
    //   +   "superusers",
    //   +   "workspaces",
    // const collections = await db.listCollections();
    // expect(collections.map((coll) => coll.id)).toEqual([]);

    // Process one workspace via direct access
    const documentRef: DocumentReference = db.doc(
      'workspaces/' + workspaceName,
    );
    this.logger.log('Fetching data for worskpace ' + workspaceName);
    const workspace: DocumentData = (await documentRef.get()).data();
    // this.logger.log('Got', workspace);
    if (!workspace) {
      throw new Error(
        'No workspace ' + workspace + 'found from this environment',
      );
    }
    const organisation = workspace.organisation.id;
    return { workspace, documentRef, organisation };
  }

  async findFromSubcollectionAndConvertToArray(
    subCollections,
    key,
    limit = null,
    cutoffDate = '2020-01-01T00:00:00Z',
  ) {
    const cutoff = new Date(cutoffDate);
    const ref: CollectionReference = subCollections
      .find((coll: CollectionReference) => coll.id === key)
      ?.where(Filter.where('isDeleted', '==', false))
      .where('createdDate', '>=', Timestamp.fromDate(cutoff));

    const limitedRef = limit ? ref?.limit(limit) : ref;

    const data: QuerySnapshot = await limitedRef?.get();
    if (!data || data.empty) {
      this.logger.warn('No documents in this subcollection.');
      return [];
    }

    const array = [];
    data.forEach((ref) => {
      const data = ref.data();
      if (!data.isDeleted) {
        array.push(data);
      } else {
        this.logger.warn('Deleted lol');
      }
    });
    this.logger.log('Going to process ' + array.length + ' x ' + key);
    return array;
  }

  async listWorkspaces(db: Firestore) {
    const workspaceSnapshot: QuerySnapshot = await db
      .collection('workspaces')
      .get();
    const workspaces = [];
    workspaceSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      workspaces.push({ id: doc.id, ...doc.data() });
    });
    console.log(workspaces);
  }
}
