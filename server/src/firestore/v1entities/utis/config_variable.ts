import { IFilter, OrderOption, OrmOptions } from '../../v1utils/utils';

type YupTest = {
  name?: string;
  test: string;
  message?: string;
  params?: object;
};

type YupWhen = {
  when: string;
  then: string;
  target: string;
};

type ValidationModel = {
  xlsConstraint?: string;
  xlsConstraintMessage?: string;
  xlsConstraintUnit?: string;
  xlsConstraintReplaceValues?: any[];
  xlsConstraintUnitType?: string;

  path?: string;
  yup?: string;
  // yupRaw?: Schema<any>;
  // yupRawExtension?: WhenOptions<Schema<any>>;
  yupArray?: string;
  required?: boolean | string;
  requiredFn?: (values: any) => boolean;
  // yuptest?: string | YupTest;
  visible?: string;
  visibleXls?: string;
  ignoreValue?: boolean;

  // yupwhens?: Array<YupWhen>;
};

type OptionsVariableModel = {
  method?: 'DB' | 'list' | 'path' | string;
  useOfflineWipCollectionsIfNeeded?: boolean;
  cacheLocally?: boolean;
  cacheLocallyKeyJs?: (entity: any) => string;
  // method?: string;
  key?: '<object>' | 'id' | string;
  listReference?: string;
  path?: string;
  dontTranslateOptions?: boolean;
  remote?: boolean;
  remoteAndCache?: boolean;
  label?: string;
  labelJsonata?: string;
  labelJs?: (entity: any) => string;
  usePicture?: string;
  type?: string;
  filters?: string;
  localFilterJsonata?: string;
  filters2?: IFilter[];
  ordering?: OrderOption[];

  dataFetchOptions?: OrmOptions;
};

type SliderProps = {
  endColour: string;
  endValue: number;
  startValue: number;
  middleColour: string;
  startColour: string;
  valueStep: 0.25 | 0.5 | 0.75 | 1;
};

type OnChangeProps = {
  jsonata?: string;
  targetProperty?: string;
  fn?: string;
  fnName?: string;
  systemFn?: string;
  fnParams?: any[];
};

type OnChangePropsHolder = string | OnChangeProps | OnChangeProps[];

export type IFieldType = Exclude<IVariable, 'type'> & {
  name: string;
  parent?: string;
};

export type IVariableProperties = {
  acceptFileTypes?: string;
  multipleFileUpload?: boolean;
  disableAdd?: boolean;
  hasOther?: boolean;
  hasOtherLabel?: string;
  hasOtherPlaceHolder?: string;
  separateLabel?: boolean;
  allowAddingToExisting?: boolean;
  selectTargetVessel?: boolean;
  allowPast?: boolean;
  dateViews?: string[];
  dateOpenTo?: string;
  staticLabel?: string;
  unit?: string;
  label?: string;
  labelJsonata?: string;
  format?: string;
  defaultUnit?: string;
  intensity?: SliderProps;
  quality?: SliderProps;
  descriptors?: any;
  typeahead?: boolean;
  endColour?: string;
  endValue?: number;
  startValue?: number;
  middleColour?: string;
  suffix?: string;
  prefix?: string;
  startColour?: string;
  valueStep?: 0.25 | 0.5 | 0.75 | 1;
  accept?: string;
  targetProperty?: string;
};
export type IVariable = {
  type?: string;
  dependsOn?: string;
  dependsOnForVisibility?: string;
  visible?: string;
  isOperatorField?: boolean;
  visibleFn?: (values: any) => boolean;
  group?: string;
  optionMatchExpression?: string;
  system_givenValue?: string | boolean | number;
  targetEntity?: string;
  targetType?: string;
  targetMethod?: string;
  valuePath?: string;
  dontAccumulate?: boolean;
  isSurveyField?: boolean;
  surveySection?: string;
  surveyQuestionIndex?: number;
  addToActivityLogSecondarySource?: boolean;
  ignoreUpdateValue?: boolean;
  onChange?: OnChangePropsHolder;
  dontPassToChildrenBatches?: boolean;
  hidden?: boolean;
  multi?: boolean;

  inputFieldType?:
    | 'config'
    | 'text'
    | 'hidden'
    | 'displayObject'
    | 'radioGroup'
    | 'system'
    | 'select'
    | 'qrScan'
    | 'qrCode'
    | 'lotSearch'
    | 'lotSearchWithBatch'
    | string;
  inputFieldSubType?: 'password' | 'number' | string;
  name: string;
  updateOriginalValueKey?: string;
  disable?: boolean;
  noDisplay?: boolean;
  weightVariable?: boolean;
  moneyVariable?: boolean;
  temperatureVariable?: boolean;
  hint?: string;
  transform?: string;
  formula?: string;
  transform_post_submit?: string;
  post_submit_function?: string;
  reverse_transform_at_update?: string;
  label?: string;
  basetype?: any;
  basetype_post_submit?: string;
  // basetype_post_submit_Raw?: Schema<any>;
  // basetypeRaw?: Schema<any>;
  defaultValue?: any;
  options?: OptionsVariableModel;
  options2?: OptionsVariableModel;
  options3?: OptionsVariableModel;
  validation?: ValidationModel;
  calculation?: string;
  calculationFn?: (formValues: any) => any;
  calculationFnDependencies?: string[];
  widget?: any;
  isRowId?: boolean;
  dontApplyAcFiltering?: boolean;
  isUpdateSelectionField?: boolean;
  rowIdProperty?: string;

  submitReview?: {
    noDisplay?: boolean;
    transformExpression?: string;
    expression?: string;
    expressionJsonata?: string;
    displayWidgetType?: string;
    displayWidgetTypeJsonata?: string;
    expressionParams?: any[];
  };

  multiple?: boolean;
  dontCast?: boolean;
  copyToParent?: boolean;
  copyToOriginProperties?: boolean;
  addToOriginProperties?: boolean;
  overrideVariablePropsFn?: (prodlot: any) => any;
  overrideInOriginProperties?: boolean;
  copyAsPrimary?: boolean;
  ignoreValue?: boolean;
  multiGroupField?: string;

  properties?: ITemplateRenderingProps & IVariableProperties;
  variables?: IVariable[];
};

export type ITemplateRenderingProps = {
  objectAsTemplateContext?: boolean;
  wipCollection?: boolean;
  noPrintButton?: boolean;
  noTitle?: boolean;
  templateId?: string;
  largePopup?: boolean;
  templateSelection?: string;
  templateSubId?: string;
  entityExpression?: string;
  dataSelectorId?: string;
};
// export type IVariableColumnCombined = IVariable &
//   IWorkspaceDisplayDataColumn & {
//     properties?: ITemplateRenderingProps &
//       IWorkspaceDisplayDataColumnProperties &
//       IVariableProperties;
//
//     dontDisplay?: boolean;
//     dontIncludeInActivity?: boolean;
//   };
