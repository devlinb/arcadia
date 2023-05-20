/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_SERVER: string;
  readonly VITE_PROMPT_URL: string;
  readonly VITE_PROMPT_URL_WS: string;
  readonly VITE_PROMPT_URL_STREAMING_WS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}