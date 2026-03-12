/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_API_TICKETS_PATH?: string;
    readonly VITE_API_KEY?: string;
    readonly VITE_API_TIMEOUT_MS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
