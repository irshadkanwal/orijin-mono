import type { Organisation } from "@orijin-server/firestore/models/organisations.model.ts";
export type Organisation = Organisation;

export type OrganisationRequest = {
  id: any;
  isToAddWorkspaces?: boolean;
  userId?: string;
};
