import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { AbstractEntity } from '../utis/AbstractEntity';

export default class PlantType extends AbstractEntity {
    name: string = null;
    scientificName: string = null;
    translations: { [languageCode: string]: string } = null;
    commonNames: { [languageCode: string]: string } = null;
    tags: string[] = null;
    minHeight: number = null;
    maxHeight: number = null;
    standardHeight: number = null;
    isTree = false;
    isNative = false;
    isPioneer = false;
    isCommon = false;
    isTimber = false;
    isPalm = false;
    isExotic = false;
    isShortLived = false;
    isFruit = false;

    getCollection(): string {
        return collectionKeys.planttypes;
    }
}
