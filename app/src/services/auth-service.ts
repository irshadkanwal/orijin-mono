import { toast } from "@/components/ui/use-toast";
import { auth } from "@/config/firebase";
import {
  changesUserName,
  genericPostPutPatchWithOutOrganization,
  genericSingleFetchWithoutOrganistaion,
} from "@/services/service-util.ts";
import {
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export const getAllowedOrgs = async (token: string): Promise<any> => {
  return genericSingleFetchWithoutOrganistaion<number>(
    "/myAllowedOrgs",
    "",
    token
  );
};

export const checkIsAdmin = async (token: string): Promise<boolean | null> => {
  return genericSingleFetchWithoutOrganistaion<boolean | null>(
    "/isAdmin",
    "",
    token
  );
};

export const resetPasswordRequest = async (
  payload: { email: string },
  token?: string
): Promise<any> => {
  return genericPostPutPatchWithOutOrganization<any>(
    "/reset-password",
    "POST",
    payload,
    token
  );
};

// Example usage

const reauthenticate = (currentPassword: string | null | undefined) => {
  const user = auth.currentUser;
  if (user && user.email && currentPassword) {
    const cred = EmailAuthProvider.credential(user?.email, currentPassword);
    return reauthenticateWithCredential(user, cred);
  }
  return null;
};

export const changePassword = async (
  password: string | null | undefined,
  oldPassword: string | null | undefined
) => {
  if (auth.currentUser && password) {
    try {
      // reauthenticating
      await reauthenticate(oldPassword);
      // updating password
      await updatePassword(auth.currentUser, password);
      return true;
    } catch (err: any) {
      return false;
    }
  }
  return false;
};

export const updateNewUserName = async (
  newName: string | null | undefined,
  token: string
) => {
  if (auth.currentUser && newName && auth.currentUser) {
    if (auth.currentUser) {
      console.log(auth.currentUser.tenantId);

      await updateProfile(auth.currentUser, {
        displayName: newName,
      }).then(async () => {
        changesUserName(auth.currentUser?.uid, newName, token);
      });
    } else {
      console.log("Nothing to Update");
    }
  } else {
    console.log("No such document!");
  }
};
