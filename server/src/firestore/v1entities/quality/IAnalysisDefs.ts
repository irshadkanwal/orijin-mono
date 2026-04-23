import { IVariable } from '../utis/config_variable';

export interface IScoreVariableScaleProperties {
  startValue?: number;
  endValue?: number;
  valueStep?: number;
  startColour?: string;
  middleColour?: string;
  endColour?: string;
}
export interface IScoreVariable {
  name: string;
  type: string;
  isDefect?: boolean;
  noScore?: boolean;
  formula?: string;
  group?: string;
  properties: {
    intensity?: IScoreVariableScaleProperties;
    quality?: IScoreVariableScaleProperties;
    descriptors?: any;
    descriptorRefs?: any;
  };
}

export interface IAnalysisPanelSheet {
  scoreMax?: number;
  scoreMin?: number;
  id: string;
  scoreVariables?: IScoreVariable[];
  otherVariables?: IVariable[];
  properties?: {
    calculateDynamicScore?: boolean;
    totalScoreVariableName?: string;
  };
}

export interface IFlavorResultNode {
  id: string;
  name: string;
  color: string;
  parent?: string;
  type?: string;
}

export interface IFlavorGroup {
  name: string;
  flavors?: string[];
  groups?: string[];
  parent: string;
  color: string;
}

export interface IFlavor {
  color: string;
  name: string;
  positive?: boolean;
}

export interface IAllAnalysisDefs {
  flavorGroups?: IFlavorGroup[];
  flavors?: IFlavor[];
  analysisPanelSheets?: IAnalysisPanelSheet[];
}
