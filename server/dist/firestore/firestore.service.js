"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    FirestoreService: function() {
        return FirestoreService;
    },
    WORKSPACES_PARENT_COLLECTION: function() {
        return WORKSPACES_PARENT_COLLECTION;
    }
});
const _common = require("@nestjs/common");
const _firebaseadmin = /*#__PURE__*/ _interop_require_wildcard(require("firebase-admin"));
const _firestoreFarmImporterservice = require("./firestoreFarmImporter.service");
const _firestoreLocationImportservice = require("./firestoreLocationImport.service");
const _firestoreSeasonImporterservice = require("./firestoreSeasonImporter.service");
const _firestorehelperservice = require("./firestore.helper.service");
const _polygonUtilservice = require("../polygonUtil/polygonUtil.service");
const _turf = /*#__PURE__*/ _interop_require_wildcard(require("@turf/turf"));
const _papaparse = /*#__PURE__*/ _interop_require_wildcard(require("papaparse"));
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _displaydef = require("../common/displaydef");
const _types = require("./types");
const _FirestoreDBProvider = require("./v1services/FirestoreDBProvider");
const _constants = require("../common/constants");
const _firestoreDbservice = require("./services/firestoreDb.service");
const _utils = require("./v1utils/utils");
const _utils1 = require("./utils");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const WORKSPACES_PARENT_COLLECTION = 'workspaces';
let FirestoreService = class FirestoreService {
    firebaseNotConfiguredForEnvironment(environment) {
        return process.env.NODE_ENV === environment && (!process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID === '');
    }
    getDb() {
        return this.firestore;
    }
    getCollectionPath(workspace, collection) {
        return `${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collection}`;
    }
    async getAllowedOrganizations(uid) {
        const documentRef = this.getDb().doc('platformusers/' + uid);
        const platformuser = (await documentRef.get()).data();
        const organisations = platformuser.organisations;
        return organisations.map((org)=>org.id);
    }
    async verifyTokenAndOrganisations(token) {
        if (this.firebaseNotConfiguredForEnvironment('development')) {
            return [
                'seed',
                'ltc',
                'mh',
                'kamili',
                'lyonagro',
                'cm_nahua'
            ];
        }
        const decodedIdToken = await _firebaseadmin.auth().verifyIdToken(token);
        return await this.getAllowedOrganizations(decodedIdToken.uid);
    }
    async importFromFirestore(workspaceName) {
        const { workspace, documentRef, organisation } = await this.firestoreUtilsService.getDataFromFirestore(this.getDb(), workspaceName);
        // Users
        const users = workspace.users.map((user)=>({
                label: user.label,
                firestoreId: user.id
            }));
        // console.log(users);
        // Sub-collections
        const subCollections = await documentRef.listCollections();
        // const subCollectionNames = subCollections.map((coll) => coll.id);
        // 'activitylogs', 'activitylogs_wip', 'animalcounts', 'auditactivities_wip', 'certifications',
        //   'certificationtypes', 'noncompliances', 'contacts', 'contracts',
        //   'facilities', 'farms', 'farms_wip', 'geodatas',
        //   'locations', 'pendingtasks_wip', 'plots', 'processing_data',
        //   'processing_data_drying', 'seasons', 'serviceactivities', 'servicecategories',
        //   'services', 'trainings', 'users', 'varieties', 'workflowscopes_wip',
        const meta = {
            organisation: organisation
        };
        const importedSeasons = await this.firestoreSeasonImporterService.importSeason(subCollections, meta);
        const importedLocations = await this.firestoreLocationImporterService.importLocations(subCollections, meta);
        const importedFarms = await this.firestoreFarmImporterService.importFarms(subCollections, meta);
        return {
            importedSeasons,
            importedLocations,
            importedFarms
        };
    }
    async checkIsAdmin(email) {
        if (!email) {
            return false;
        }
        if (this.firebaseNotConfiguredForEnvironment('development')) {
            return true;
        }
        const snapshot = await this.getDb().collection('superusers').where('email', '==', email).get();
        return snapshot.docs.map((doc)=>doc.data()).length > 0;
    }
    async isAdminAndVerifyToken(token) {
        if (this.firebaseNotConfiguredForEnvironment('development')) {
            return true;
        }
        const decodedIdToken = await _firebaseadmin.auth().verifyIdToken(token);
        return await this.checkIsAdmin(decodedIdToken.email);
    }
    async getDocument(workspace, collectionName, documentId) {
        try {
            const docRef = this.firestore.collection(`${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collectionName}`).doc(documentId);
            const doc = await docRef.get();
            if (doc.exists) {
                return doc.data();
            } else {
                this.logger.warn(`Document with ID ${documentId} not found in ${collectionName}`);
                return null;
            }
        } catch (error) {
            this.logger.error(`Error fetching document ${documentId} from ${collectionName}`, error);
            throw error;
        }
    }
    async getPaginatedDocuments(filters) {
        const { workspace, collection, tab, limit, page, sort, sortOrder, order, ...filterParams } = filters;
        const pageSize = limit ? parseInt(limit, 10) : 10;
        const pageNumber = page ? parseInt(page, 10) : 1;
        try {
            const collectionPath = this.getCollectionPath(workspace, collection);
            const collectionRef = this.firestore.collection(collectionPath);
            console.log(collection, filterParams);
            let query = (0, _utils1.applyFiltersToQuery)(collectionRef, collection, filterParams);
            query = (0, _utils1.applySortingToQuery)(query, sort, sortOrder);
            // Fetch total count of documents
            const totalSnapshot = await collectionRef.get();
            const totalCount = totalSnapshot.size;
            query = (0, _utils1.applyPaginationToQuery)(query, pageNumber, pageSize);
            const snapshot = await query.get();
            const data = snapshot.docs.map((doc)=>doc.data());
            return {
                data: (0, _utils.filterRedundantFields)(data),
                count: totalCount
            };
        } catch (error) {
            this.logger.error(`Error fetching paginated documents from ${collection}`, error);
            throw error;
        }
    }
    async createDocument(workspace, collectionName, payload, id) {
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
    async updateDocument(workspace, collectionName, documentId, payload) {
        try {
            const docRef = this.firestore.collection(`${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collectionName}`).doc(documentId);
            await docRef.set(payload, {
                merge: true
            });
            this.logger.log(`Document with ID: ${documentId} updated successfully`);
        } catch (error) {
            this.logger.error(`Error updating document ${documentId} in ${collectionName}`, error);
            throw error;
        }
    }
    async deleteDocument(workspace, collectionName, documentId) {
        try {
            const docRef = this.firestore.collection(`${WORKSPACES_PARENT_COLLECTION}/${workspace}/${collectionName}`).doc(documentId);
            await docRef.delete();
            this.logger.log(`Document with ID: ${documentId} deleted successfully`);
        } catch (error) {
            this.logger.error(`Error deleting document ${documentId} from ${collectionName}`, error);
            throw error;
        }
    }
    async fetchDataFromCollection(workspace, collection, filters) {
        try {
            const path = `/workspaces/${workspace}/${collection}`;
            let collectionRef = this.firestore.collection(path);
            if (filters) {
                Object.entries(filters).forEach(([key, value])=>{
                    if (Array.isArray(value)) {
                        collectionRef = collectionRef.where(key, 'in', value);
                    } else {
                        collectionRef = collectionRef.where(key, '==', value);
                    }
                });
            }
            const snapshot = await collectionRef.get();
            const data = snapshot.docs.map((doc)=>({
                    id: doc.id,
                    ...doc.data()
                }));
            this.logger.log(`Fetched data from ${path}:`);
            return data;
        } catch (error) {
            this.logger.error(`Error fetching data from ${collection} in ${workspace}:`, error);
            throw error;
        }
    }
    async getWorkspacesAndCollectionsForOrg(organisationId) {
        try {
            const workspaces = await this.firestore.collection(WORKSPACES_PARENT_COLLECTION).listDocuments();
            const workspaceData = await Promise.all(workspaces.map(async (workspaceDoc)=>{
                const workspaceName = workspaceDoc.id;
                if (workspaceName === `${organisationId}_master` || workspaceName === `${organisationId}_test`) {
                    const collections = await workspaceDoc.listCollections();
                    return {
                        workspaceName,
                        collections: collections.map((collection)=>collection.id)
                    };
                }
                // Return null for non-matching workspaces
                return null;
            }));
            return workspaceData.filter((workspace)=>workspace !== null);
        } catch (error) {
            this.logger.error(`Error fetching workspaces and collections for organization ${organisationId}:`, error);
            throw error;
        }
    }
    getColumnsAndFiltersForCollection(collectionName) {
        const collection = Object.keys(_displaydef.DISPLAY_DEF.displayDefs).find((key)=>_displaydef.DISPLAY_DEF.displayDefs[key].source === collectionName);
        if (!collection) {
            return {
                columns: [],
                filters: []
            };
        }
        const collectionDef = _displaydef.DISPLAY_DEF.displayDefs[collection];
        // Extract columns and filters
        const columns = collectionDef.columns || [];
        const filters = collectionDef.filters || [];
        return {
            columns,
            filters
        };
    }
    async getCompletedAndWipFromFirestore(workspaceName, collectionName, cutoffDate = null, limit = 10, alsoWip) {
        const { workspace, documentRef, organisation } = await this.firestoreUtilsService.getDataFromFirestore(this.getDb(), workspaceName);
        const subCollections = await documentRef.listCollections();
        const finished = await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(subCollections, collectionName, limit, cutoffDate);
        const wip = alsoWip ? await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(subCollections, collectionName + '_wip', limit, cutoffDate) : [];
        return {
            finished,
            wip
        };
    }
    convertToFormat(geodata, service, fix = false) {
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
        const coordinates = polygons.map((poly)=>[
                poly.lng,
                poly.lat
            ]);
        if (fix) {
            const polygon = _turf.polygon([
                coordinates
            ], {});
            const area = _turf.area(polygon);
            geodata.areaAc = parseFloat(parseFloat(area * _constants.SQUARE_METER_TO_ACRES_MULTIPLIER + '').toFixed(2)); //in acres
            geodata.areaHa = parseFloat(parseFloat(area * 0.0001 + '').toFixed(2)); //in hectares
            // geodata.selfIntersects = this.polygonUtilService.
            geodata.selfIntersects = service.polygonUtilService.selfIntersects(coordinates);
        // var intersection = turf.intersect(turf.featureCollection([poly1, poly2]));
        }
        return {
            ...(0, _types.convertProperties)(geodata, coordinates),
            data: coordinates
        };
    }
    async importPolygonsFromFirestore(workspaceName) {
        const { finished, wip } = await this.getCompletedAndWipFromFirestore(workspaceName, 'geodatas', null, 999, true);
        let geoDatas = [
            ...finished.map((fin)=>({
                    ...fin,
                    wip: false
                })),
            ...wip.map((wip)=>({
                    ...wip,
                    wip: true
                }))
        ];
        geoDatas = geoDatas.map((geodata)=>{
            if (geodata.data.length >= _types.REQUIRED_POLYGON_LENGTH) {
                const pol = geodata.data.map((a)=>{
                    return [
                        a.lng,
                        a.lat,
                        a.altitude
                    ];
                });
                pol.push(pol[0]);
                const polygon = _turf.polygon([
                    pol
                ], {});
                const area = _turf.area(polygon);
                geodata.areaAc = parseFloat(parseFloat(area * _constants.SQUARE_METER_TO_ACRES_MULTIPLIER + '').toFixed(2)); //in hectares
                geodata.areaHa = parseFloat(parseFloat(area * 0.0001 + '').toFixed(2)); //in hectares
            } else {
                geodata.areaAc = 0;
                geodata.areaHa = 0;
            }
            return geodata;
        });
        const recentGeodatas = geoDatas.sort((a, b)=>{
            return a.createdDate.toDate() > b.createdDate.toDate() ? 1 : -1;
        }).filter((geodata)=>geodata.createdDate.toDate().getDate() >= 2); // <- Date selector
        // .filter((x) => x.entityParent.labelShort === 'BBD-1013'); // <- single
        const index = 0;
        const okPolygons = recentGeodatas.filter((geodata)=>(0, _types.isVAlid)(geodata));
        const badPolygons = recentGeodatas.filter((geodata)=>!(0, _types.isVAlid)(geodata));
        const goodPolygonFormatted = okPolygons.map((thisFarm)=>{
            return this.convertToFormat(thisFarm, this, true);
        });
        const badPolygonFormatted = badPolygons.map((a)=>{
            return this.convertToFormat(a, this);
        });
        const goodjson = this.convertToGeodata(goodPolygonFormatted);
        // await fs.writeFileSync(
        //   'test/out/okPolygons_properties.csv',
        //   Papa.unparse(goodjson.map((a) => a.)),
        //   'utf8',
        // );
        if (!_fs.existsSync('test/out')) {
            await _fs.mkdirSync('test/out');
        }
        await _fs.writeFileSync('test/out/geojson_goodpolygons.json', JSON.stringify(goodjson));
        await _fs.writeFileSync('test/out/geojson_badpolygons.json', JSON.stringify(this.convertToGeodata(badPolygonFormatted)));
        await _fs.writeFileSync('test/out/okPolygons.csv', _papaparse.unparse(goodPolygonFormatted.map(_types.convertToCsvOurGeoData)), 'utf8');
        await _fs.writeFileSync('test/out/badPolygons.csv', _papaparse.unparse(badPolygonFormatted.map(_types.convertToCsvOurGeoData)), 'utf8');
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
    convertToGeodata(geodatas) {
        return this.polygonUtilService.convertToGeoJson((0, _types.convertToPreGeodataFormat)(geodatas));
    }
    constructor(firestoreUtilsService, firestoreFarmImporterService, firestoreLocationImporterService, firestoreSeasonImporterService, polygonUtilService, dbProviderV1, dbProviderV2){
        this.firestoreUtilsService = firestoreUtilsService;
        this.firestoreFarmImporterService = firestoreFarmImporterService;
        this.firestoreLocationImporterService = firestoreLocationImporterService;
        this.firestoreSeasonImporterService = firestoreSeasonImporterService;
        this.polygonUtilService = polygonUtilService;
        this.dbProviderV1 = dbProviderV1;
        this.dbProviderV2 = dbProviderV2;
        this.logger = new _common.Logger(FirestoreService.name);
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        };
        if (serviceAccount.projectId) {
            if (!_firebaseadmin.apps.length) {
                _firebaseadmin.initializeApp({
                    credential: _firebaseadmin.credential.cert(serviceAccount)
                });
            }
            this.firestore = _firebaseadmin.firestore();
            this.dbProviderV1.setDb(this.firestore);
            this.dbProviderV2.setDb(this.firestore);
        } else {
            this.logger.warn('FIREBASE_PROJECT_ID missing, firestore disabled!');
        }
    }
};
FirestoreService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestorehelperservice.FirestoreUtilsService === "undefined" ? Object : _firestorehelperservice.FirestoreUtilsService,
        typeof _firestoreFarmImporterservice.FirestoreFarmImporterService === "undefined" ? Object : _firestoreFarmImporterservice.FirestoreFarmImporterService,
        typeof _firestoreLocationImportservice.FirestoreLocationImporterService === "undefined" ? Object : _firestoreLocationImportservice.FirestoreLocationImporterService,
        typeof _firestoreSeasonImporterservice.FirestoreSeasonImporterService === "undefined" ? Object : _firestoreSeasonImporterservice.FirestoreSeasonImporterService,
        typeof _polygonUtilservice.PolygonUtilService === "undefined" ? Object : _polygonUtilservice.PolygonUtilService,
        typeof _FirestoreDBProvider.FirestoreDBProvider === "undefined" ? Object : _FirestoreDBProvider.FirestoreDBProvider,
        typeof _firestoreDbservice.FirestoreDBService === "undefined" ? Object : _firestoreDbservice.FirestoreDBService
    ])
], FirestoreService);
