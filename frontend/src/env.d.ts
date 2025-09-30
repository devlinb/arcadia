/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH: string;
  readonly VITE_API_SERVER: string;
  readonly VITE_PROMPT_URL: string;
  readonly VITE_PROMPT_URL_WS: string;
  readonly VITE_PROMPT_URL_STREAMING_WS: string;
  readonly VITE_SAVE_STORY_ENDPOINT: string;
  readonly VITE_GET_STORY_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}