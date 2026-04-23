import { collectionKeys } from '../../v1utils/dbMappingUtils';

import { Exclude, Type } from 'class-transformer';
import { ObjectId } from '../utis/ObjectId';
import { AbstractEntity } from '../utis/AbstractEntity';
import { cascadingDelete, expandFromId } from '../../v1utils/ormAnnotations';
import {
  CanHaveWorkflow,
  HasProcessingProperties,
  LotState,
} from '../utis/types';
import ProcessingProperties from '../production/ProcessingProperties';
import AuditEntryV1 from './AuditEntryV1';

export default class AuditActivityV1
  extends AbstractEntity
  implements HasProcessingProperties, CanHaveWorkflow
{
  currentState: string;

  workFlowName: string = null;
  hasMovedToNext = false;
  workflowFinished = false;
  endState?: string;
  systemState: LotState = null;
  auditDefinitionId: string;
  activityName: string;
  lastActivityName: string = null;
  @Type(() => ProcessingProperties)
  processingProperties: ProcessingProperties = new ProcessingProperties();

  @Type(() => ObjectId)
  targetEntity: ObjectId = null;

  @Type(() => ObjectId)
  targetEntityParent: ObjectId = null;

  @Exclude()
  @expandFromId('targetEntity')
  targetEntityFull?: AbstractEntity = null;

  @Type(() => ObjectId)
  targetSubEntities: ObjectId[] = null;

  @Exclude()
  @expandFromId('targetSubEntities')
  targetSubEntitiesFull: AbstractEntity[] = [];

  @Type(() => ObjectId)
  @cascadingDelete()
  auditEntries: Array<ObjectId> = <Array<ObjectId>>[];

  @Exclude()
  @expandFromId('auditEntries')
  auditEntriesFull: Array<AuditEntryV1> = <Array<AuditEntryV1>>[];

  getCollection(): string {
    return collectionKeys.auditactivities;
  }

  setWorkFlowId(id: ObjectId) {
    this.id.workflowId = id;
  }

  setChainId(id: string) {
    this.id.chainId = id;
  }
}
