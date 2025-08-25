import {
  ApiClient,
  ApiClientConfig,
} from '@abc-interview-support-frontend/sso-utils';

export function createApiClient(): ApiClient {
  const config: ApiClientConfig = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    getAccessToken: () => sessionStorage.getItem('admin_accessToken'),
    getRefreshToken: () => sessionStorage.getItem('admin_refreshToken'),
    setTokens: (accessToken: string, refreshToken: string) => {
      sessionStorage.setItem('admin_accessToken', accessToken);
      sessionStorage.setItem('admin_refreshToken', refreshToken);
    },
    onUnauthorized: () => {
      // Clear tokens and redirect to SSO
      sessionStorage.removeItem('admin_accessToken');
      sessionStorage.removeItem('admin_refreshToken');
      sessionStorage.removeItem('admin_user');

      const ssoOrigin =
        import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `${ssoOrigin}?returnUrl=${returnUrl}`;
    },
  };

  return new ApiClient(config);
}
