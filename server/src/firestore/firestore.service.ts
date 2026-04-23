import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firestore, ServiceAccount } from 'firebase-admin';
import { FirestoreFarmImporterService } from './firestoreFarmImporter.service';
import { FirestoreLocationImporterService } from './firestoreLocationImport.service';
import { FirestoreSeasonImporterService } from './firestoreSeasonImporter.service';
import { FirestoreUtilsService } from './firestore.helper.service';
import { PolygonUtilService } from '../polygonUtil/polygonUtil.service';
import * as turf from '@turf/turf';
import * as Papa from 'papaparse';
import * as fs from 'fs';
import { DISPLAY_DEF } from '../common/displaydef';
import {
  convertProperties,
  convertToCsvOurGeoData,
  convertToPreGeodataFormat,
  isVAlid,
  OurGeoData,
  REQUIRED_POLYGON_LENGTH,
  V1GeoData,
} from './types';
import { FirestoreDBProvider } from './v1services/FirestoreDBProvider';
import { SQUARE_METER_TO_ACRES_MULTIPLIER } from '../common/constants';
import { FirestoreDBService } from './services/firestoreDb.service';
import CollectionReference = firestore.CollectionReference;
import DocumentData = firestore.DocumentData;
import DocumentReference = firestore.DocumentReference;
import { FieldTaskQuery } from './dto/firebase.query.dto';
import { filterRedundantFields } from './v1utils/utils';
import {
  applyFiltersToQuery,
  applyPaginationToQuery,
  applySortingToQuery,
} from './utils';

export const WORKSPACES_PARENT_COLLECTION = 'workspaces';
@Injectable()
export class FirestoreService {
  private logger = new Logger(FirestoreService.name);

  private firestore: admin.firestore.Firestore;

  constructor(
    private firestoreUtilsService: FirestoreUtilsService,
    private firestoreFarmImporterService: FirestoreFarmImporterService,
    private firestoreLocationImporterService: FirestoreLocationImporterService,
    private firestoreSeasonImporterService: FirestoreSeasonImporterService,
    private polygonUtilService: PolygonUtilService,
    private dbProviderV1: FirestoreDBProvider,
    private dbProviderV2: FirestoreDBService,
  ) {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (serviceAccount.projectId) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }

      this.firestore = admin.firestore();

      this.dbProviderV1.setDb(this.firestore);
      this.dbProviderV2.setDb(this.firestore);
    } else {
      this.logger.warn('FIREBASE_PROJECT_ID missing, firestore disabled!');
    }
  }

  private firebaseNotConfiguredForEnvironment(
    environment: 'development' | 'production' | 'uat',
  ): boolean {
    return (
      process.env.NODE_ENV === environment &&
      (!process.env.FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID === '')
    );
  }

  getDb() {
    return this.firestore;
  }
  getCollectionPath(workspace: string, collection: string) {
    return `${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collection}`;
  }

  async getAllowedOrganizations(uid) {
    const documentRef: DocumentReference = this.getDb().doc(
      'platformusers/' + uid,
    );
    const platformuser: DocumentData = (await documentRef.get()).data();
    const organisations = platformuser.organisations;
    return organisations.map((org) => org.id);
  }

  async verifyTokenAndOrganisations(token: string): Promise<string[]> {
    if (this.firebaseNotConfiguredForEnvironment('development')) {
      return ['seed', 'ltc', 'mh', 'kamili', 'lyonagro', 'cm_nahua'];
    }
    const decodedIdToken = await admin.auth().verifyIdToken(token);
    return await this.getAllowedOrganizations(decodedIdToken.uid);
  }

  async importFromFirestore(workspaceName: string) {
    const {
      workspace,
      documentRef,
      organisation,
    }: {
      workspace: DocumentData;
      documentRef: DocumentReference;
      organisation: string;
    } = await this.firestoreUtilsService.getDataFromFirestore(
      this.getDb(),
      workspaceName,
    );

    // Users
    const users = workspace.users.map((user) => ({
      label: user.label,
      firestoreId: user.id,
    }));
    // console.log(users);

    // Sub-collections
    const subCollections: CollectionReference[] =
      await documentRef.listCollections();
    // const subCollectionNames = subCollections.map((coll) => coll.id);
    // 'activitylogs', 'activitylogs_wip', 'animalcounts', 'auditactivities_wip', 'certifications',
    //   'certificationtypes', 'noncompliances', 'contacts', 'contracts',
    //   'facilities', 'farms', 'farms_wip', 'geodatas',
    //   'locations', 'pendingtasks_wip', 'plots', 'processing_data',
    //   'processing_data_drying', 'seasons', 'serviceactivities', 'servicecategories',
    //   'services', 'trainings', 'users', 'varieties', 'workflowscopes_wip',

    const meta = {
      organisation: organisation,
    };

    const importedSeasons =
      await this.firestoreSeasonImporterService.importSeason(
        subCollections,
        meta,
      );

    const importedLocations =
      await this.firestoreLocationImporterService.importLocations(
        subCollections,
        meta,
      );

    const importedFarms = await this.firestoreFarmImporterService.importFarms(
      subCollections,
      meta,
    );

    return { importedSeasons, importedLocations, importedFarms };
  }

  async checkIsAdmin(email) {
    if (!email) {
      return false;
    }
    if (this.firebaseNotConfiguredForEnvironment('development')) {
      return true;
    }
    const snapshot = await this.getDb()
      .collection('superusers')
      .where('email', '==', email)
      .get();
    return snapshot.docs.map((doc) => doc.data()).length > 0;
  }

  async isAdminAndVerifyToken(token: string): Promise<boolean> {
    if (this.firebaseNotConfiguredForEnvironment('development')) {
      return true;
    }
    const decodedIdToken = await admin.auth().verifyIdToken(token);
    return await this.checkIsAdmin(decodedIdToken.email);
  }

  async getDocument<T>(
    workspace: string,
    collectionName: string,
    documentId: string,
  ): Promise<T | null> {
    try {
      const docRef = this.firestore
        .collection(
          `${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collectionName}`,
        )
        .doc(documentId);
      const doc = await docRef.get();
      if (doc.exists) {
        return doc.data() as T;
      } else {
        this.logger.warn(
          `Document with ID ${documentId} not found in ${collectionName}`,
        );
        return null;
      }
    } catch (error) {
      this.logger.error(
        `Error fetching document ${documentId} from ${collectionName}`,
        error,
      );
      throw error;
    }
  }

  async getPaginatedDocuments<T>(
    filters: FieldTaskQuery,
  ): Promise<{ data: T[]; count: number }> {
    const {
      workspace,
      collection,
      tab,
      limit,
      page,
      sort,
      sortOrder,
      order,
      ...filterParams
    } = filters;

    const pageSize = limit ? parseInt(limit, 10) : 10;
    const pageNumber = page ? parseInt(page, 10) : 1;

    try {
      const collectionPath = this.getCollectionPath(workspace, collection);
      const collectionRef = this.firestore.collection(collectionPath);
      console.log(collection, filterParams);
      let query = applyFiltersToQuery(collectionRef, collection, filterParams);

      query = applySortingToQuery(query, sort, sortOrder);

      // Fetch total count of documents
      const totalSnapshot = await collectionRef.get();
      const totalCount = totalSnapshot.size;

      query = applyPaginationToQuery(query, pageNumber, pageSize);

      const snapshot = await query.get();

      const data = snapshot.docs.map((doc) => doc.data() as T);

      return { data: filterRedundantFields(data), count: totalCount };
    } catch (error) {
      this.logger.error(
        `Error fetching paginated documents from ${collection}`,
        error,
      );
      throw error;
    }
  }

  async createDocument<T>(
    workspace: string,
    collectionName: string,
    payload: T,
    id?: string,
  ): Promise<string> {
    try {
      const collectionPath = `${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collectionName}`;
      const collectionRef = this.firestore.collection(collectionPath);

      const documentRef = id ? collectionRef.doc(id) : collectionRef.doc();
      await documentRef.set(payload);
      this.logger.log(`Document created with ID: ${documentRef.id}`);
      return documentRef.id;
    } catch (error) {
      this.logger.error(`Error creating document in ${collectionName}`, error);
      throw error;
    }
  }

  async updateDocument<T>(
    workspace: string,
    collectionName: string,
    documentId: string,
    payload: Partial<T>,
  ): Promise<void> {
    try {
      const docRef = this.firestore
        .collection(
          `${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collectionName}`,
        )
        .doc(documentId);
      await docRef.set(payload, { merge: true });
      this.logger.log(`Document with ID: ${documentId} updated successfully`);
    } catch (error) {
      this.logger.error(
        `Error updating document ${documentId} in ${collectionName}`,
        error,
      );
      throw error;
    }
  }

  async deleteDocument(
    workspace: string,
    collectionName: string,
    documentId: string,
  ): Promise<void> {
    try {
      const docRef = this.firestore
        .collection(
          `${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collectionName}`,
        )
        .doc(documentId);
      await docRef.delete();
      this.logger.log(`Document with ID: ${documentId} deleted successfully`);
    } catch (error) {
      this.logger.error(
        `Error deleting document ${documentId} from ${collectionName}`,
        error,
      );
      throw error;
    }
  }

  async fetchDataFromCollection(
    workspace: string,
    collection: string,
    filters?: Record<string, any>,
  ): Promise<any[]> {
    try {
      const path = `/workspaces/${workspace}/${collection}`;

      let collectionRef: firestore.Query<firestore.DocumentData> =
        this.firestore.collection(path);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            collectionRef = collectionRef.where(key, 'in', value);
          } else {
            collectionRef = collectionRef.where(key, '==', value);
          }
        });
      }

      const snapshot = await collectionRef.get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      this.logger.log(`Fetched data from ${path}:`);
      return data;
    } catch (error) {
      this.logger.error(
        `Error fetching data from ${collection} in ${workspace}:`,
        error,
      );
      throw error;
    }
  }

  async getWorkspacesAndCollectionsForOrg(
    organisationId: string,
  ): Promise<{ workspaceName: string; collections: string[] }[]> {
    try {
      const workspaces = await this.firestore
        .collection(WORKSPACES_PARENT_COLLECTION)
        .listDocuments();

      const workspaceData = await Promise.all(
        workspaces.map(async (workspaceDoc) => {
          const workspaceName = workspaceDoc.id;

          if (
            workspaceName === `${organisationId}_master` ||
            workspaceName === `${organisationId}_test`
          ) {
            const collections = await workspaceDoc.listCollections();

            return {
              workspaceName,
              collections: collections.map((collection) => collection.id),
            };
          }

          // Return null for non-matching workspaces
          return null;
        }),
      );
      return workspaceData.filter((workspace) => workspace !== null);
    } catch (error) {
      this.logger.error(
        `Error fetching workspaces and collections for organization ${organisationId}:`,
        error,
      );
      throw error;
    }
  }

  getColumnsAndFiltersForCollection(collectionName: string) {
    const collection = Object.keys(DISPLAY_DEF.displayDefs).find(
      (key) => DISPLAY_DEF.displayDefs[key].source === collectionName,
    );
    if (!collection) {
      return { columns: [], filters: [] };
    }
    const collectionDef = DISPLAY_DEF.displayDefs[collection];

    // Extract columns and filters
    const columns = collectionDef.columns || [];
    const filters = collectionDef.filters || [];

    return { columns, filters };
  }

  async getCompletedAndWipFromFirestore(
    workspaceName: string,
    collectionName: string,
    cutoffDate = null,
    limit = 10,
    alsoWip,
  ) {
    const {
      workspace,
      documentRef,
      organisation,
    }: {
      workspace: DocumentData;
      documentRef: DocumentReference;
      organisation: string;
    } = await this.firestoreUtilsService.getDataFromFirestore(
      this.getDb(),
      workspaceName,
    );

    const subCollections: CollectionReference[] =
      await documentRef.listCollections();

    const finished =
      await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(
        subCollections,
        collectionName,
        limit,
        cutoffDate,
      );

    const wip = alsoWip
      ? await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(
          subCollections,
          collectionName + '_wip',
          limit,
          cutoffDate,
        )
      : [];

    return { finished, wip };
  }

  convertToFormat(
    geodata: V1GeoData,
    service: FirestoreService,
    fix = false,
  ): OurGeoData {
    const polygons = geodata.data;
    // TODO: Tästä lähtis geneerinen autofix-metodi

    if (fix) {
      //   if (polygons.length > 7) {
      //     polygons.shift();
      //     polygons.shift();
      //     // polygons.shift();
      //   }
      polygons.push(polygons[0]);
    }

    const coordinates = polygons.map((poly) => [
      poly.lng,
      poly.lat,
      // poly.altitude,
    ]);

    if (fix) {
      const polygon = turf.polygon([coordinates], {});
      const area = turf.area(polygon);
      geodata.areaAc = parseFloat(
        parseFloat(area * SQUARE_METER_TO_ACRES_MULTIPLIER + '').toFixed(2),
      ); //in acres
      geodata.areaHa = parseFloat(parseFloat(area * 0.0001 + '').toFixed(2)); //in hectares
      // geodata.selfIntersects = this.polygonUtilService.
      geodata.selfIntersects =
        service.polygonUtilService.selfIntersects(coordinates);

      // var intersection = turf.intersect(turf.featureCollection([poly1, poly2]));
    }

    return { ...convertProperties(geodata, coordinates), data: coordinates };
  }

  async importPolygonsFromFirestore(workspaceName: string) {
    const { finished, wip } = await this.getCompletedAndWipFromFirestore(
      workspaceName,
      'geodatas',
      null,
      999,
      true,
    );

    let geoDatas: V1GeoData[] = [
      ...finished.map((fin) => ({ ...fin, wip: false })),
      ...wip.map((wip) => ({ ...wip, wip: true })),
    ];

    geoDatas = geoDatas.map((geodata: V1GeoData) => {
      if (geodata.data.length >= REQUIRED_POLYGON_LENGTH) {
        const pol = geodata.data.map((a) => {
          return [a.lng, a.lat, a.altitude];
        });
        pol.push(pol[0]);
        const polygon = turf.polygon([pol], {});
        const area = turf.area(polygon);
        geodata.areaAc = parseFloat(
          parseFloat(area * SQUARE_METER_TO_ACRES_MULTIPLIER + '').toFixed(2),
        ); //in hectares

        geodata.areaHa = parseFloat(parseFloat(area * 0.0001 + '').toFixed(2)); //in hectares
      } else {
        geodata.areaAc = 0;
        geodata.areaHa = 0;
      }

      return geodata as V1GeoData;
    });

    const recentGeodatas = geoDatas
      .sort((a, b) => {
        return a.createdDate.toDate() > b.createdDate.toDate() ? 1 : -1;
      })
      .filter((geodata) => geodata.createdDate.toDate().getDate() >= 2); // <- Date selector
    // .filter((x) => x.entityParent.labelShort === 'BBD-1013'); // <- single

    const index = 0;

    const okPolygons: V1GeoData[] = recentGeodatas.filter((geodata) =>
      isVAlid(geodata),
    );

    const badPolygons: V1GeoData[] = recentGeodatas.filter(
      (geodata) => !isVAlid(geodata),
    );

    const goodPolygonFormatted: OurGeoData[] = okPolygons.map((thisFarm) => {
      return this.convertToFormat(thisFarm, this, true);
    });
    const badPolygonFormatted: OurGeoData[] = badPolygons.map((a) => {
      return this.convertToFormat(a, this);
    });

    const goodjson = this.convertToGeodata(goodPolygonFormatted);

    // await fs.writeFileSync(
    //   'test/out/okPolygons_properties.csv',
    //   Papa.unparse(goodjson.map((a) => a.)),
    //   'utf8',
    // );

    if (!fs.existsSync('test/out')) {
      await fs.mkdirSync('test/out');
    }

    await fs.writeFileSync(
      'test/out/geojson_goodpolygons.json',
      JSON.stringify(goodjson),
    );

    await fs.writeFileSync(
      'test/out/geojson_badpolygons.json',
      JSON.stringify(this.convertToGeodata(badPolygonFormatted)),
    );

    await fs.writeFileSync(
      'test/out/okPolygons.csv',
      Papa.unparse(goodPolygonFormatted.map(convertToCsvOurGeoData)),
      'utf8',
    );

    await fs.writeFileSync(
      'test/out/badPolygons.csv',
      Papa.unparse(badPolygonFormatted.map(convertToCsvOurGeoData)),
      'utf8',
    );
    //
    // console.log(
    //   'Good polygons as JSON\n\n',
    //   JSON.stringify(goodjson, null, 4).replace(
    //     /\s+(?![^"]*":\s*[^",}]*,?)/g,
    //     '',
    //   ),
    // );
    // console.log(
    //   'Good polygons list',
    //   okPolygons.map((data) => {
    //     index++;
    //     return [
    //       index,
    //       data.wip ? 'WIP ' : 'Done',
    //       data.entityParent.labelShort,
    //       data.areaAc,
    //       data.areaHa,
    //       data.data.length + ' points',
    //       data.createdDate.toDate().toISOString(),
    //       data.updatedBy.label,
    //     ].join(' | ');
    //   }),
    // );
    // console.log(
    //   'Bad polygons list',
    //   badPolygons.map((data) => {
    //     index++;
    //     return [
    //       index,
    //       data.wip ? 'WIP ' : 'Done',
    //       data.entityParent.labelShort,
    //       data.areaAc,
    //       data.areaHa,
    //       data.data.length + ' points',
    //       data.createdDate.toDate().toISOString(),
    //       data.updatedBy.label,
    //     ].join(' | ');
    //   }),
    // );
  }

  private convertToGeodata(geodatas: OurGeoData[]) {
    return this.polygonUtilService.convertToGeoJson(
      convertToPreGeodataFormat(geodatas),
    );
  }
}
