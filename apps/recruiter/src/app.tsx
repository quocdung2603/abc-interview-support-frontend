import { useState } from 'react';
import {
  AuthProvider,
  useAuth,
} from '@abc-interview-support-frontend/sso-utils';
import { useSSO } from './utils/useSSO';
import { createApiClient } from './utils/apiClient';

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Recruiter Portal
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your recruitment dashboard.
          </p>
          <button
            onClick={() => {
              const ssoOrigin =
                import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
              window.location.href = ssoOrigin;
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user?.role.roleName !== 'Recruiter' && user?.role.roleName !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the Recruiter Portal.
          </p>
          <p className="text-sm text-gray-500">
            Your role: {user?.role.roleName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Recruiter Portal
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.fullName}</span>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  const ssoOrigin =
                    import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
                  window.location.href = ssoOrigin;
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recruitment Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">
                Job Postings
              </h3>
              <p className="text-blue-700 mt-2">
                Create and manage job opportunities
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">
                Candidates
              </h3>
              <p className="text-green-700 mt-2">
                Review and evaluate candidates
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">
                Interviews
              </h3>
              <p className="text-purple-700 mt-2">
                Schedule and conduct interviews
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
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
