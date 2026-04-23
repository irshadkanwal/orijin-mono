import { Exclude, Type } from 'class-transformer';
import { expandFromId } from '../../v1utils/ormAnnotations';
import { ObjectId } from '../utis/ObjectId';
import { ACType, HasNotes, HasProcessingProperties } from '../utis/types';
import AbstractLot from './AbstractLot';
import OriginProperties from './OriginProperties';
import { collectionKeys } from '../../v1utils/dbMappingUtils';

export default class ActivityCompletion
  extends AbstractLot
  implements HasProcessingProperties, HasNotes
{
  @Type(() => ObjectId)
  parentId: ObjectId;
  activityName: string = null;
  endState: string = null;

  @Type(() => ObjectId)
  originPropertiesId: ObjectId;

  @expandFromId('originPropertiesId')
  @Exclude()
  originProperties: OriginProperties;

  aCType: ACType;
  activityType: string = null;

  // constructor() {
  //   super();
  // }

  getCollection(): string {
    return collectionKeys.activitycompletions;
  }
}
