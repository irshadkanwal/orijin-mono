import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.tsx";
import { AppAuth } from "@/types/auth";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AppAuth;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
      {/*<ReactQueryDevtools buttonPosition="top-right" />*/}
      {/*<TanStackRouterDevtools position="bottom-right" />*/}
    </>
  );
}
