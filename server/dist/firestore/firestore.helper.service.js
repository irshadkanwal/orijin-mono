// Needs to be outside of firestore.service, or otherwise a circular dependency will be created
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreUtilsService", {
    enumerable: true,
    get: function() {
        return FirestoreUtilsService;
    }
});
const _firebaseadmin = require("firebase-admin");
const _common = require("@nestjs/common");
const _firestore = require("firebase-admin/firestore");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const Filter = _firebaseadmin.firestore.Filter;
let FirestoreUtilsService = class FirestoreUtilsService {
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
        const documentRef = db.doc('workspaces/' + workspaceName);
        this.logger.log('Fetching data for worskpace ' + workspaceName);
        const workspace = (await documentRef.get()).data();
        // this.logger.log('Got', workspace);
        if (!workspace) {
            throw new Error('No workspace ' + workspace + 'found from this environment');
        }
        const organisation = workspace.organisation.id;
        return {
            workspace,
            documentRef,
            organisation
        };
    }
    async findFromSubcollectionAndConvertToArray(subCollections, key, limit = null, cutoffDate = '2020-01-01T00:00:00Z') {
        const cutoff = new Date(cutoffDate);
        const ref = subCollections.find((coll)=>coll.id === key)?.where(Filter.where('isDeleted', '==', false)).where('createdDate', '>=', _firestore.Timestamp.fromDate(cutoff));
        const limitedRef = limit ? ref?.limit(limit) : ref;
        const data = await limitedRef?.get();
        if (!data || data.empty) {
            this.logger.warn('No documents in this subcollection.');
            return [];
        }
        const array = [];
        data.forEach((ref)=>{
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
    async listWorkspaces(db) {
        const workspaceSnapshot = await db.collection('workspaces').get();
        const workspaces = [];
        workspaceSnapshot.forEach((doc)=>{
            workspaces.push({
                id: doc.id,
                ...doc.data()
            });
        });
        console.log(workspaces);
    }
    constructor(){
        this.logger = new _common.Logger(FirestoreUtilsService.name);
    }
};
FirestoreUtilsService = _ts_decorate([
    (0, _common.Injectable)()
], FirestoreUtilsService);
