import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth as firebaseAuth } from "../config/firebase";
import { useOrganisationStore } from "@/store/organisation";
import { checkIsAdmin, getAllowedOrgs } from "@/services/auth-service.ts";
import { getOrganisationFromLocalStorage } from "@/store/organisation";

export interface UserWithToken extends User {
  accessToken: string;
  allowedOrgs: string[];
}

export interface OrganisationAccess {
  current: string;
  allowed: string[];
}

export type AppAuth = {
  currentUser?: UserWithToken | null;
  organisations: OrganisationAccess;
  isAdmin: boolean;
  setOrganisations: (orgs: OrganisationAccess) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const orgDefault: OrganisationAccess = { allowed: [], current: "" };

const setAuthState = async (user: User, accessToken: string) => {
  try {
    const [allowedOrgs, isAdminResponse] = await Promise.all([
      getAllowedOrgs(accessToken),
      checkIsAdmin(accessToken),
    ]);

    const storedOrgs = getOrganisationFromLocalStorage();
    const finalAllowedOrgs = storedOrgs?.allowed || allowedOrgs;
    const finalCurrentOrg = storedOrgs?.current || allowedOrgs[0];

    auth.isAdmin = !!isAdminResponse;
    const currentOrganisations: OrganisationAccess =
      useOrganisationStore.getState().organisations;
    if (
      currentOrganisations &&
      currentOrganisations.allowed?.length > 0 &&
      currentOrganisations.current
    ) {
      currentOrganisations.allowed = allowedOrgs;
      auth.organisations = currentOrganisations;
    } else {
      auth.organisations = {
        allowed: allowedOrgs,
        current: allowedOrgs[0],
      };
    }

    auth.currentUser = {
      ...user,
      accessToken,
      allowedOrgs: finalAllowedOrgs,
    } as UserWithToken;
  } catch (error) {
    console.error("Error setting auth state", error);
    throw error;
  }
};

const resetAuthState = () => {
  auth.currentUser = undefined;
  auth.isAdmin = false;
  auth.organisations = orgDefault;
};

export const auth: AppAuth = {
  organisations: orgDefault,
  isAdmin: false,
  loading: false,
  currentUser: undefined,
  setOrganisations(orgs: OrganisationAccess) {
    auth.organisations = orgs;
  },
  async login(email: string, password: string) {
    try {
      auth.loading = true;
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const accessToken = await result.user.getIdToken(true);
      await setAuthState(result.user, accessToken);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      auth.loading = false;
    }
  },
  async logout() {
    try {
      auth.loading = true;
      await signOut(firebaseAuth);
      resetAuthState();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      auth.loading = false;
    }
  },
};

// Function to initialize authentication state
export const initAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    auth.loading = true;
    onAuthStateChanged(
      firebaseAuth,
      async (user: User | null) => {
        if (user) {
          try {
            const accessToken = await user.getIdToken(true);
            await setAuthState(user, accessToken);
            auth.setOrganisations(auth.organisations);
          } catch (err) {
            console.error("Error fetching allowed orgs", err);
            resetAuthState();
          }
        } else {
          resetAuthState();
        }
        auth.loading = false;
        resolve(); // Resolve the promise once auth state is initialized
      },
      reject
    );
  });
};
