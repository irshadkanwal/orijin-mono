// TypeScript IntelliSense for VITE_ .env variables.
// VITE_ prefixed variables are exposed to the client while non-VITE_ variables aren't
// https://vitejs.dev/guide/env-and-mode.html

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_API_URL: string;
	readonly VITE_APP_MAP_BOX_TOKEN: string;
  readonly VITE_APP_API_ENDPOINT: string;
	readonly VITE_FIREBASE_API_KEY: string;
	readonly VITE_FIREBASE_AUTH_DOMAIN: string;
	readonly VITE_FIREBASE_PROJECT_ID: string;
	readonly VITE_FIREBASE_STORAGE_BUCKET: string;
	readonly VITE_APP_FIREBASE_DATABASE_URL: string;
	readonly VITE_APP_GOOGLE_AUTH_CLIENT_ID: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
