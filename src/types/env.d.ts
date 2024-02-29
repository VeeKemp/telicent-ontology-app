/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ONTOLOGY_URL: string;
  readonly VITE_SEARCH_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
