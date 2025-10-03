import { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
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
  const [currentPage, setCurrentPage] = useState<
    'login' | 'register' | 'forgot-password'
  >('login');

  useEffect(() => {
    // Check if we have an existing session in sessionStorage
    const sessionDataStr = sessionStorage.getItem('sso_session');
    if (sessionDataStr) {
      try {
        const sessionData: SSOSession = JSON.parse(sessionDataStr);
        setSession(sessionData);
      } catch (error) {
        console.error('Failed to parse session data:', error);
        sessionStorage.removeItem('sso_session');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (sessionData: SSOSession) => {
    setSession(sessionData);
    // Save session to sessionStorage
    sessionStorage.setItem('sso_session', JSON.stringify(sessionData));
  };

  const handleRegister = (userData: any) => {
    // After successful registration, redirect to login
    setCurrentPage('login');
  };

  const handleLogout = () => {
    setSession(null);
    // Clear session storage
    sessionStorage.removeItem('sso_session');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    setCurrentPage('login');
  };

  const switchToLogin = () => setCurrentPage('login');
  const switchToRegister = () => setCurrentPage('register');
  const switchToForgotPassword = () => setCurrentPage('forgot-password');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center animate-slide-in-up">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-in">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded w-48 mx-auto mb-2"></div>
            <div className="h-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded w-32 mx-auto"></div>
          </div>
          <div className="mt-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading your experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ABC Interview Support
                </h1>
                <p className="text-xs text-gray-500">Single Sign-On Portal</p>
              </div>
            </div>
            {session && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {session.user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user.roleName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
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
            <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentPage === 'login' && 'Welcome Back'}
                    {currentPage === 'register' && 'Create Account'}
                    {currentPage === 'forgot-password' && 'Reset Password'}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {currentPage === 'login' &&
                      'Sign in to access all ABC Interview Support applications'}
                    {currentPage === 'register' &&
                      'Join us to start your interview preparation journey'}
                    {currentPage === 'forgot-password' &&
                      "We'll help you get back into your account"}
                  </p>
                </div>
              </div>
              <div className="px-8 py-8">
                {currentPage === 'login' && (
                  <LoginForm
                    onLogin={handleLogin}
                    onSwitchToRegister={switchToRegister}
                    onSwitchToForgotPassword={switchToForgotPassword}
                  />
                )}
                {currentPage === 'register' && (
                  <RegisterForm
                    onRegister={handleRegister}
                    onSwitchToLogin={switchToLogin}
                  />
                )}
                {currentPage === 'forgot-password' && (
                  <ForgotPasswordForm onSwitchToLogin={switchToLogin} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Application Dashboard
                    </h2>
                    <p className="text-blue-100">
                      Choose an application to continue your journey
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <DashboardLinks
                  user={session.user}
                  ssoAuth={session.sso_auth}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
