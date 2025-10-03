import { useState, useEffect } from 'react';
import {
  AuthProvider,
  useAuth,
} from '@abc-interview-support-frontend/sso-utils';
import { useSSO } from './utils/useSSO';
import { createApiClient } from './utils/apiClient';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import { Routing } from './routes/Routing';

function RecruiterDashboard() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const [apiClient] = useState(() => createApiClient());

  useSSO(
    (accessToken: string, refreshToken: string, userData: any) => {
      login(accessToken, refreshToken, userData);
    },
    (error: string) => {
      console.error('SSO Authentication failed:', error);
    }
  );

  // Auto redirect to SSO if not authenticated
  useEffect(() => {
    // If we're still loading, don't redirect yet
    if (isLoading) {
      return;
    }

    // If we're authenticated, don't redirect
    if (isAuthenticated) {
      return;
    }

    // Check if we have SSO auth token in URL - if so, authentication is in progress
    const url = new URL(window.location.href);
    const hasSsoAuth = url.searchParams.has('sso_auth');

    if (hasSsoAuth) {
      // Wait longer for authentication to complete
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          const ssoOrigin =
            import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
          window.location.href = ssoOrigin;
        }
      }, 3000); // 3 second delay for SSO auth

      return () => clearTimeout(timer);
    } else {
      // No SSO auth token, redirect immediately if not authenticated
      const timer = setTimeout(() => {
        const ssoOrigin =
          import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
        window.location.href = ssoOrigin;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (user?.roleName !== 'Recruiter' && user?.roleName !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the Recruiter Portal.
          </p>
          <p className="text-sm text-gray-500">Your role: {user?.roleName}</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/*" element={<Layout />}>
        {Routing.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          );
        })}
      </Route>
    </Routes>
  );
}

export function App() {
  const ssoOrigin = import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  return (
    <AuthProvider
      appName="recruiter"
      ssoOrigin={ssoOrigin}
      apiBaseUrl={apiBaseUrl}
      onUnauthorized={() => {
        window.location.href = ssoOrigin;
      }}
    >
      <RecruiterDashboard />
    </AuthProvider>
  );
}

export default App;
