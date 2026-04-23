import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AppAuth, OrganisationAccess } from "@/types/auth";
import { QueryClient } from "@tanstack/react-query";

type OrganisationStore = {
  organisations: OrganisationAccess;
  setOrganisations: (orgs: OrganisationAccess) => void;
};

export type LocalStorageOrganisation = {
  state: {
    organisations: OrganisationAccess;
  };
};

const ORGANISATION_STORAGE_KEY = "user-organisation";
const initialOrganisations: OrganisationAccess = { allowed: [], current: "" };

export const useOrganisationStore = create(
  persist<OrganisationStore>(
    (set) => ({
      organisations: initialOrganisations,
      setOrganisations: (orgs: OrganisationAccess) =>
        set({ organisations: orgs }),
    }),
    {
      name: ORGANISATION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const resetOrganisationsInLocalStorage = () => {
  localStorage.removeItem(ORGANISATION_STORAGE_KEY);
};

export const getOrganisationFromLocalStorage = () => {
  const organisationDataFromLocalStorage = localStorage.getItem(
    ORGANISATION_STORAGE_KEY
  );

  if (!organisationDataFromLocalStorage) {
    return;
  }

  try {
    const parsedData = JSON.parse(
      organisationDataFromLocalStorage
    ) as LocalStorageOrganisation;

    return parsedData.state.organisations;
  } catch (error) {
    console.error(
      "Failed to parse organisations data from local storage:",
      error
    );
    return undefined;
  }
};

export const updateOrganisationsFromLocalStorage = (context: {
  queryClient: QueryClient;
  auth: AppAuth;
}) => {
  const organisationDataFromLocalStorage = localStorage.getItem(
    ORGANISATION_STORAGE_KEY
  );

  if (!organisationDataFromLocalStorage) {
    return;
  }

  try {
    const parsedData = JSON.parse(
      organisationDataFromLocalStorage
    ) as LocalStorageOrganisation;

    const { organisations } = parsedData.state;
    if (organisations) {
      context.auth.organisations = {
        current: organisations.current,
        allowed: organisations.allowed,
      };
    }
  } catch (error) {
    console.error(
      "Failed to parse organisations data from local storage:",
      error
    );
  }
};
