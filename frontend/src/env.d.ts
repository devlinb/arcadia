/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_SERVER: string;
  readonly VITE_PROMPT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}