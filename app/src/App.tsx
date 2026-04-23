import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, type createRouter } from "@tanstack/react-router";
import type { FunctionComponent } from "./common/types";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import { Loader } from "./components/Loader";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";

type AppProps = {
  router: ReturnType<typeof createRouter>;
  queryClient: QueryClient;
};

const InnerApp = ({ router }: { router: ReturnType<typeof createRouter> }) => {
  const { loading } = useAuth();
  if (loading) {
    return <Loader />;
  }

  return (
    <RouterProvider
      router={router}
      //lets leave this like this for now
      //we already have the auth context in the router
      // context={{ auth: auth }}
      defaultPreload="intent"
    />
  );
};

const App = ({ router, queryClient }: AppProps): FunctionComponent => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <InnerApp router={router} />
        {/*<TanStackRouterDevelopmentTools*/}
        {/*	router={router}*/}
        {/*	initialIsOpen={false}*/}
        {/*	position="bottom-right"*/}
        {/*/>*/}
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
