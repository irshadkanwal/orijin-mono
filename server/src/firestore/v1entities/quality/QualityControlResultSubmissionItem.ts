import SensorialDescriptor from './SensorialDescriptor';

export default class QualityControlResultSubmissionItem {
  name: string = null;
  note?: string = null;
  quality?: number = null;
  intensity?: number = null;
  noScore?: boolean = false;
  formula?: string = null;
  score?: number = null;
  descriptors?: SensorialDescriptor[] = [];
}
