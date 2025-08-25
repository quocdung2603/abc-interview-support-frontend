import {
  ApiClient,
  ApiClientConfig,
} from '@abc-interview-support-frontend/sso-utils';

export function createApiClient(): ApiClient {
  const config: ApiClientConfig = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    getAccessToken: () => sessionStorage.getItem('student_accessToken'),
    getRefreshToken: () => sessionStorage.getItem('student_refreshToken'),
    setTokens: (accessToken: string, refreshToken: string) => {
      sessionStorage.setItem('student_accessToken', accessToken);
      sessionStorage.setItem('student_refreshToken', refreshToken);
    },
    onUnauthorized: () => {
      // Clear tokens and redirect to SSO
      sessionStorage.removeItem('student_accessToken');
      sessionStorage.removeItem('student_refreshToken');
      sessionStorage.removeItem('student_user');

      const ssoOrigin =
        import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `${ssoOrigin}?returnUrl=${returnUrl}`;
    },
  };

  return new ApiClient(config);
}
