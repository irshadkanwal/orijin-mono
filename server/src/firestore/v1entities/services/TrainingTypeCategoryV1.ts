import { AbstractEntity } from '../utis/AbstractEntity';

export default class TrainingTypeCategoryV1 extends AbstractEntity {
  name: string = null;

  getCollection(): string {
    return 'trainingtypecategories';
  }
}
