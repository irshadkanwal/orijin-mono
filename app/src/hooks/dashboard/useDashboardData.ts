import { QueryClient } from "@tanstack/react-query";
import { AppAuth } from "@/types/auth";

type DashboardDataProps = {
  queryClient: QueryClient;
  auth: AppAuth;
};
export const fetchDashboardData = async ({
  auth,
  queryClient,
}: DashboardDataProps) => {
  // TODO: the loader part of the dashboard route may be moved here
  console.log(auth);
  console.log(queryClient);
};
