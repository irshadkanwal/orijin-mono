"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirestoreLocationImporterService", {
    enumerable: true,
    get: function() {
        return FirestoreLocationImporterService;
    }
});
const _common = require("@nestjs/common");
const _locationsservice = require("../locations/locations.service");
const _firestorehelperservice = require("./firestore.helper.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FirestoreLocationImporterService = class FirestoreLocationImporterService {
    groupBy(array, key) {
        return array.reduce((result, currentItem)=>{
            (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
            return result;
        }, {});
    }
    findFarParents(firestoreLocation) {
        const parentParent = firestoreLocation.parentLocationParent?.labelShort;
        const parentFacilityParentParent = firestoreLocation.parentFacilityParentParent?.labelShort;
        const parentFacilityParentParentParent = firestoreLocation.parentFacilityParentParentParent?.labelShort;
        if (parentParent || parentFacilityParentParent || parentFacilityParentParentParent) {
            console.log('Beyond 1st tier parents found!', {
                parentParent,
                parentFacilityParentParent,
                parentFacilityParentParentParent
            });
            return firestoreLocation;
        }
    }
    async importLocations(subCollections, meta) {
        // ltc_master/dashboard/referenceData/section/locations/item/subcounties/feature/table/subcounties
        const locations = await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(subCollections, 'locations');
        const groupedShortcodes = this.groupBy(locations, 'type');
        this.logger.log('Grouped shortcodes', Object.keys(groupedShortcodes));
        const farParents = [];
        locations.forEach((loc)=>{
            const found = this.findFarParents(loc);
            if (found) {
                farParents.push(found);
            }
        });
        // Minor optimization to bring existing Districts first - but lot of districts exist only as Parents of SubCountys too
        const locationsInOrder = [
            ...groupedShortcodes['District'],
            ...groupedShortcodes['SubCounty']
        ];
        const createdLocations = [];
        for (const firestoreLocation of locationsInOrder){
            try {
                const firestoreParent = firestoreLocation.parentLocation; // labelShort: KAA, label: "KAKUMIRO", type: 'District',
                const firestoreShortcode = firestoreLocation.id.labelShort;
                let parent;
                if (firestoreParent) {
                    const parents = await this.locationsService.getMany({
                        shortCode: firestoreParent.labelShort
                    });
                    parent = parents[0] || null;
                    if (!parent) {
                        parent = await this.locationsService.create({
                            organisation: meta.organisation,
                            shortCode: firestoreParent.labelShort,
                            name: firestoreParent.label,
                            type: firestoreParent.type
                        });
                    }
                    createdLocations.push(parent);
                }
                const created = await this.locationsService.create({
                    organisation: meta.organisation,
                    shortCode: firestoreShortcode,
                    name: firestoreLocation.id.label,
                    type: firestoreLocation.type,
                    parent: parent?.id ? {
                        connect: {
                            id: parent.id
                        }
                    } : undefined
                });
                groupedShortcodes[firestoreShortcode] = true;
                createdLocations.push(created);
            } catch (err) {
                this.logger.error(err);
                console.log(err);
            }
        }
        console.log('Far parents', farParents);
        return createdLocations;
    }
    constructor(firestoreUtilsService, locationsService){
        this.firestoreUtilsService = firestoreUtilsService;
        this.locationsService = locationsService;
        this.logger = new _common.Logger(FirestoreLocationImporterService.name);
    }
};
FirestoreLocationImporterService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _firestorehelperservice.FirestoreUtilsService === "undefined" ? Object : _firestorehelperservice.FirestoreUtilsService,
        typeof _locationsservice.LocationsService === "undefined" ? Object : _locationsservice.LocationsService
    ])
], FirestoreLocationImporterService);
