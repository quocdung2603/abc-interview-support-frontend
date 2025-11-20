import { Outlet } from 'react-router-dom';
import {
  AuthProvider,
  useAuth,
} from '@abc-interview-support-frontend/sso-utils';
import Header from './components/Header';
import Footer from './components/Footer';
import { useSSO } from '../utils/useSSO';

function AuthenticatedLayout() {
  const { user, isAuthenticated, isLoading, login } = useAuth();

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
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Welcome to Student Portal
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your learning dashboard.
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

  return (
    <div className="font-sans bg-white min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

const Layout = () => {
  const ssoOrigin = import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  return (
    <AuthProvider
      appName="student"
      ssoOrigin={ssoOrigin}
      apiBaseUrl={apiBaseUrl}
      onUnauthorized={() => {
        window.location.href = ssoOrigin;
      }}
    >
      <AuthenticatedLayout />
    </AuthProvider>
  );
};

export default Layout;
