import { useState } from "react";

export enum DialogType {
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
  UPDATE_PASSWORD = "update password",
  UPDATE_USERNAME = "update user name",
  RESET_PASSWORD = "reset password",
  EDIT_SELECTED = "edit selected",
  DELETE_SELECTED = "delete selected",
  ADD_USER_TO_ORGANISATION = "add user to organisation",
  ADD_WORKSPACES_TO_ORGANISATION = "add workspaces to organisation",
  MANAGE_BENEFICIARIES = "manage beneficiaries",
}

export function useDialog(
  initialState: boolean = false,
  initialType: DialogType = DialogType.CREATE
) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [dialogType, setDialogType] = useState<DialogType>(initialType);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  const toggleDialog = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
    dialogType,
    selectedItem,
    setSelectedItem,
    setDialogType,
  };
}
