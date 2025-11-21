import { SSOClient } from '@abc-interview-support-frontend/sso-utils';
import { User } from '@abc-interview-support-frontend/types';
import { useEffect } from 'react';

export function useSSO(
  onAuthReceived: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => void,
  onError?: (error: string) => void
) {
  useEffect(() => {
    const ssoOrigin =
      import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    const cleanup = SSOClient.initializeClient(
      ssoOrigin,
      apiBaseUrl,
      onAuthReceived,
      onError || ((error) => console.error('SSO Error:', error))
    );

    return cleanup;
  }, [onAuthReceived, onError]);
}
