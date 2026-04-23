import type { MainNavItem } from "@/types";
import { Link, useRouteContext, useRouter } from "@tanstack/react-router";
import { Bell, CircleUser, Edit, Lock, Settings, User } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { toast } from "@/components/ui/use-toast.ts";
import React, { useEffect, useState } from "react";
import { rootKeys, tablePathSegments } from "@/config/rootKeys";
import { useOrganisationStore } from "@/store/organisation";
import { auth } from "@/config/firebase";
import { ActionDialog } from "../table/actions-dialog";
import { DialogType, useDialog } from "@/hooks/use-dialog";
import { changePassword, updateNewUserName } from "@/services/auth-service";
import {
  formPasswordFields,
  formUsernameFields,
} from "../utils/customize-form-fields";
import { FormFields } from "@/types/custom-form";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

enum FieldFor {
  CHANGE_PASSWORD = "Update Password",
  CHANGE_USERNAME = "Change Username",
}

// Full screen sidebar - hidden by default, in md becomes "block" */}
export function Header() {
  const { openDialog, isOpen, toggleDialog, dialogType, setDialogType } =
    useDialog();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<FormFields[]>();
  const openProfileDialog = (data: string) => {
    if (FieldFor.CHANGE_PASSWORD === data) {
      setFormFields(formPasswordFields);
      setDialogType(DialogType.UPDATE_PASSWORD);
      openDialog();
    } else {
      setFormFields(formUsernameFields);
      setDialogType(DialogType.UPDATE_USERNAME);
      openDialog();
    }
  };

  const {
    auth: {
      organisations: contextOrganisations,
      setOrganisations: setContextOrganisations,
      logout,
      currentUser,
    },
  } = useRouteContext({ from: rootKeys.loggedIn });

  const {
    organisations: storeOrganisations,
    setOrganisations: setStoreOrganisations,
  } = useOrganisationStore();
  const router = useRouter();

  // Initialize Zustand store from context on mount
  useEffect(() => {
    if (
      storeOrganisations?.allowed?.length === 0 &&
      contextOrganisations?.allowed?.length > 0
    ) {
      setStoreOrganisations(contextOrganisations);
    }
  }, [
    contextOrganisations,
    storeOrganisations.allowed?.length || 0,
    setStoreOrganisations,
  ]);

  // Update context whenever the Zustand store changes
  useEffect(() => {
    if (storeOrganisations?.allowed?.length > 0) {
      setContextOrganisations(storeOrganisations);
    }
  }, [storeOrganisations, setContextOrganisations]);
  const changeOrganisation = (org: string) => {
    const updatedOrganisations = { ...contextOrganisations, current: org };
    setContextOrganisations(updatedOrganisations);
    setStoreOrganisations(updatedOrganisations);
    router.invalidate();
  };

  const signOut = async () => {
    try {
      await logout();
      router.invalidate();
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description:
          error.message ?? "Your sign out request failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const submitFunction = async (data: {
    name?: string | undefined;
    password?: string;
    oldPassword?: string;
    confirmPassword?: string;
  }) => {
    setIsLoading(true);
    if (
      auth.currentUser &&
      data.name &&
      dialogType === DialogType.UPDATE_USERNAME &&
      currentUser?.accessToken
    ) {
      const name = data.name.toLowerCase();
      try {
        await updateNewUserName(name, currentUser?.accessToken);
        toggleUserSettingsDialog();
      } catch (error: any) {
        toast({
          title: "Something went wrong.",
          description:
            error.message ?? "Your sign in request failed. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      if (data.password === data.confirmPassword) {
        try {
          await changePassword(data.password, data.oldPassword).then((res) => {
            if (res === false) {
              toast({
                title: "Your password change request declined.",
                description: "Your old password is wrong. Please try again.",
                variant: "destructive",
              });
            } else {
              toggleUserSettingsDialog();
            }
          });
        } catch (error: any) {
          toast({
            title: "Your Password didn't Match.",
            description: error.message ?? "Please make sure password matches.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Your Password didn't Match.",
          description: "Please make sure password matches.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  };

  const toggleUserSettingsDialog = () => {
    toggleDialog();
  };
  return (
    <>
      <div className="w-full flex-1">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem className="bg-primary pl-[10px] pr-[10px] rounded-full overflow-hidden">
              <BreadcrumbLink asChild>
                {storeOrganisations?.allowed?.length > 1 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="capitalize rounded-full">
                        {storeOrganisations.current}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {storeOrganisations.allowed.map((org) => {
                        return (
                          <DropdownMenuItem
                            key={org}
                            onClick={() => {
                              changeOrganisation(org);
                            }}
                          >
                            {org}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="#">{storeOrganisations?.current || null}</Link>
                )}
              </BreadcrumbLink>
              <Link to={tablePathSegments.ORGANISATIONS_CONFIG}>
                  <Settings className="h-5 w-5 mr-2 text-white" />
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/*My account*/}
      <Button variant="outline" size="icon" className="rounded-full ml-auto">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => openProfileDialog(FieldFor.CHANGE_USERNAME)}
          >
            <Edit className="h-5 w-5 pr-1" />
            Update Username{" "}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openProfileDialog(FieldFor.CHANGE_PASSWORD)}
          >
            <Lock className="h-5 w-5 pr-1" />
            Update Password{" "}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={signOut}>
            <User className="h-5 w-5 pr-1" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ActionDialog
        isOpen={isOpen}
        isLoading={isLoading}
        title={dialogType}
        setDialogClose={() => toggleUserSettingsDialog()}
        formFields={formFields}
        onSubmit={submitFunction}
      />
    </>
  );
}
