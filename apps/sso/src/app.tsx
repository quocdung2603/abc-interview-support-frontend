import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { DashboardLinks } from './components/DashboardLinks';
import { AuthUser } from '@abc-interview-support-frontend/types';

interface SSOSession {
  user: AuthUser;
  sessionId: string;
  sso_auth: string;
}

export function App() {
  const [session, setSession] = useState<SSOSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have an existing session
    const sessionData = sessionStorage.getItem('sso_session');
    if (sessionData) {
      try {
        const parsedSession = JSON.parse(sessionData);
        setSession(parsedSession);
      } catch (error) {
        console.error('Failed to parse session data:', error);
        sessionStorage.removeItem('sso_session');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (sessionData: SSOSession) => {
    setSession(sessionData);
    sessionStorage.setItem('sso_session', JSON.stringify(sessionData));
  };

  const handleLogout = () => {
    setSession(null);
    sessionStorage.removeItem('sso_session');
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              ABC Interview Support - SSO
            </h1>
            {session && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {session.user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {!session ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
              <div className="mb-6">
                <h2 className="text-center text-2xl font-bold text-gray-900">
                  Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Access all ABC Interview Support applications with one account
                </p>
              </div>
              <LoginForm onLogin={handleLogin} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-600">
                  Welcome back, {session.user.fullName}! Choose an application
                  to continue.
                </p>
              </div>
              <DashboardLinks user={session.user} ssoAuth={session.sso_auth} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
