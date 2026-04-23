import { Type } from 'class-transformer';
import ProcessingProperties from './ProcessingProperties';
import { HasProcessingProperties } from '../utis/types';
import SourceRelationshipWeightArrayObject from '../utis/SourceRelationshipWeightArrayObject';

export default class LotUsageSection implements HasProcessingProperties {
  @Type(() => SourceRelationshipWeightArrayObject)
  source: SourceRelationshipWeightArrayObject;

  @Type(() => ProcessingProperties)
  processingProperties: ProcessingProperties = new ProcessingProperties();
}
