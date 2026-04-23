import { DialogType } from "../use-dialog";
export interface IDefaultActions {
  action: string;
  label: string;
  dialogType: DialogType;
  condition?: string;
}

export const defaultActions: IDefaultActions[] = [
  { action: "edit", label: "Edit", dialogType: DialogType.EDIT },
  { action: "delete", label: "Delete", dialogType: DialogType.DELETE },
];

export const generateActions = (
  actions: IDefaultActions[],
  lastPathSegment: string
) => {
  return actions.filter((action) => action.condition !== lastPathSegment);
};
