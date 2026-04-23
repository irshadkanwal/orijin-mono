
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Form } from "@/components/forms/form";
import { PlatformUser } from "@/types/users";
import { useState } from "react";
import {
  FieldProperty,
  FieldType,
  FormError,
  FormFields,
} from "@/types/custom-form";
import { postUser, updateUser } from "@/services/user-service";
import { toast } from "@/components/ui/use-toast";
import { CustomOrgRoleForm } from "@/components/forms/custom-org-role-form";
import { useRouteContext } from "@tanstack/react-router";
import { Organisation } from "@/types/organisation";

export enum UserRoles {
  ADMIN = "Admin",
  FIELD_MANAGER = "FieldManager",
  FIELD_OFFICER_KSE = "FieldOfficerKSE",
  BUYING_OFFICER_BDG = "BuyingOfficerBDG",
}
export interface IManageUserDialogProps {
  organizations: Organisation[];
  isDialogOpen: boolean;
  setDialogClose: (isClosed: boolean) => void;
  user?: PlatformUser;
  onReload: () => void;
}
export function ManageUserDialog({
  organizations,
  isDialogOpen,
  setDialogClose,
  user,
  onReload,
}: IManageUserDialogProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    auth: { currentUser },
  } = useRouteContext({ from: "/_loggedin/users/" });
  const submit = async (data: {
    name: string;
    email: string;
    password: string;
    fields: { organisation: string; role: string }[];
  }) => {
    setIsLoading(true);
    try {
      let query;
      const organisations = [];
      const workspaces = [];
      let workspaceRole: {
        [key: string]: string;
      } = {};
      for (let formField of data.fields) {
        if (formField.organisation) {
          organisations.push({
            id: formField.organisation,
            isPreviousVersion: false,
            refCollection: "organisations",
          });
          if (formField.role) {
            workspaces.push({
              id: formField.organisation + "_master",
              isPreviousVersion: false,
              refCollection: "workspaceRoles",
            });
            workspaceRole = {
              ...workspaceRole,
              [formField.organisation + "_master"]: formField.role,
            };
          }
        }
      }

      const payload: PlatformUser = {
        name: data.name,
        organisations,
        workspaces,
        workspaceRole,
      };
      if (user) {
        query = await updateUser(user.id.id, payload, currentUser?.accessToken);
      } else {
        payload.email = data.email;
        payload.password = data.password;
        query = await postUser(payload, currentUser?.accessToken);
      }
      if (query) {
        setDialogClose(false);
        onReload();
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const roles = Object.values(UserRoles).map((role) => ({
    id: role,
    name: role,
  }));

  const organizationList = organizations.map((organization: Organisation) => ({
    id: organization.id.id,
    name: organization.name,
  }));

  const generateFormFields = (): FormFields[] => {
    return [
      {
        id: "name",
        label: "Name",
        placeholder: "Please provide the name",
        property: FieldProperty.INPUT,
        type: FieldType.TEXT,
        errors: [FormError.REQUIRED],
      },
      {
        id: "email",
        label: "Email",
        placeholder: "Please provide the email",
        property: FieldProperty.INPUT,
        type: FieldType.EMAIL,
        errors: [FormError.REQUIRED, FormError.EMAIL],
        isDisabled: !!user,
      },
      ...(!user
        ? [
            {
              id: "password",
              label: "Password",
              placeholder: "Please provide the password",
              property: FieldProperty.INPUT,
              type: FieldType.PASSWORD,
              errors: [FormError.REQUIRED, FormError.PASSWORD],
            },
          ]
        : []),
    ];
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogClose}>
      <DialogContent className="min-w-[40vw] sm:max-w-[425px] overflow-y-auto max-h-[70vh]">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {user ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form
          formFields={generateFormFields()}
          isLoading={isLoading}
          onSubmit={submit}
          data={user}
          customForm={
            <CustomOrgRoleForm
              organizations={organizationList}
              roles={roles}
              user={user}
            ></CustomOrgRoleForm>
          }
        ></Form>
      </DialogContent>
    </Dialog>
  );
}
