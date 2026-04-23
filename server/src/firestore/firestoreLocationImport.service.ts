import { Injectable, Logger } from '@nestjs/common';
import { LocationsService } from '../locations/locations.service';
import { FirestoreUtilsService } from './firestore.helper.service';

@Injectable()
export class FirestoreLocationImporterService {
  private logger = new Logger(FirestoreLocationImporterService.name);

  constructor(
    private firestoreUtilsService: FirestoreUtilsService,
    private locationsService: LocationsService,
  ) {}

  groupBy(array, key) {
    return array.reduce((result, currentItem) => {
      (result[currentItem[key]] = result[currentItem[key]] || []).push(
        currentItem,
      );
      return result;
    }, {});
  }

  findFarParents(firestoreLocation) {
    const parentParent = firestoreLocation.parentLocationParent?.labelShort;
    const parentFacilityParentParent =
      firestoreLocation.parentFacilityParentParent?.labelShort;
    const parentFacilityParentParentParent =
      firestoreLocation.parentFacilityParentParentParent?.labelShort;
    if (
      parentParent ||
      parentFacilityParentParent ||
      parentFacilityParentParentParent
    ) {
      console.log('Beyond 1st tier parents found!', {
        parentParent,
        parentFacilityParentParent,
        parentFacilityParentParentParent,
      });
      return firestoreLocation;
    }
  }

  async importLocations(subCollections, meta) {
    // ltc_master/dashboard/referenceData/section/locations/item/subcounties/feature/table/subcounties
    const locations =
      await this.firestoreUtilsService.findFromSubcollectionAndConvertToArray(
        subCollections,
        'locations',
      );

    const groupedShortcodes = this.groupBy(locations, 'type');
    this.logger.log('Grouped shortcodes', Object.keys(groupedShortcodes));

    const farParents = [];
    locations.forEach((loc) => {
      const found = this.findFarParents(loc);
      if (found) {
        farParents.push(found);
      }
    });

    // Minor optimization to bring existing Districts first - but lot of districts exist only as Parents of SubCountys too
    const locationsInOrder = [
      ...groupedShortcodes['District'],
      ...groupedShortcodes['SubCounty'],
    ];

    const createdLocations = [];
    for (const firestoreLocation of locationsInOrder) {
      try {
        const firestoreParent = firestoreLocation.parentLocation; // labelShort: KAA, label: "KAKUMIRO", type: 'District',
        const firestoreShortcode = firestoreLocation.id.labelShort;

        let parent;
        if (firestoreParent) {
          const parents = await this.locationsService.getMany({
            shortCode: firestoreParent.labelShort,
          });
          parent = parents[0] || null;
          if (!parent) {
            parent = await this.locationsService.create({
              organisation: meta.organisation,
              shortCode: firestoreParent.labelShort,
              name: firestoreParent.label,
              type: firestoreParent.type,
            });
          }
          createdLocations.push(parent);
        }

        const created = await this.locationsService.create({
          organisation: meta.organisation,
          shortCode: firestoreShortcode,
          name: firestoreLocation.id.label,
          type: firestoreLocation.type,
          parent: parent?.id ? { connect: { id: parent.id } } : undefined,
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
}
