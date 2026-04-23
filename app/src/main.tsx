import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { routeTree } from "./routeTree.gen.ts";
import "./styles/tailwind.css";
import { QueryClient } from "@tanstack/react-query";
import { auth } from "./types/auth.ts";

/** NOTE: never use directly, use via useQueryClient() hook */
export const queryClient = new QueryClient();

// TODO: Pitäiskö tehdä niinkun https://tanstack.com/router/latest/docs/framework/react/examples/basic-react-query-file-based ja luoda QueryClient tässä samassa?
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: auth, // pass the auth object to the router context
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App router={router} queryClient={queryClient} />
    </React.StrictMode>
  );
}
