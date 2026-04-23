/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_PRODUCTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}