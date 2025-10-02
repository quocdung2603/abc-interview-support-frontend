/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_SSO_URL: string;
  readonly VITE_SSO_ORIGIN: string;
  readonly VITE_STUDENT_URL: string;
  readonly VITE_RECRUITER_URL: string;
  readonly VITE_ADMIN_URL: string;
  readonly VITE_ACCESS_TOKEN_EXPIRY: string;
  readonly VITE_REFRESH_TOKEN_EXPIRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
