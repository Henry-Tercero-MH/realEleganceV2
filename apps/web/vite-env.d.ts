/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API real, p. ej. `http://localhost:4000/api/v1`. */
  readonly VITE_API_URL: string;
  /** `'true'` mientras el backend no exista: la app usa `src/mocks`. */
  readonly VITE_USE_MOCKS: string;
  /** Latencia artificial (ms) de los mocks, para ver los estados de carga. */
  readonly VITE_MOCK_LATENCY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
