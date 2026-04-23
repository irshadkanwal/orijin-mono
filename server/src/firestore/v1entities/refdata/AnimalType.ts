import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';

export default class AnimalType extends AbstractEntity {
    name: string = null;
    scientificName: string = null;
    translations: { [languageCode: string]: string } = null;
    commonNames: { [languageCode: string]: string } = null;

    getCollection(): string {
        return collectionKeys.animaltypes;
    }
}
