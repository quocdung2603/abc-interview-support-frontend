import { useState } from 'react';
import { AuthUser } from '@abc-interview-support-frontend/types';
import { SSOTokenManager } from '@abc-interview-support-frontend/sso-utils';

interface DashboardLinksProps {
  readonly user: AuthUser;
  readonly ssoAuth: string;
}

interface AppLink {
  name: string;
  description: string;
  url: string;
  icon: string;
  roles: string[];
}

export function DashboardLinks({ user, ssoAuth }: DashboardLinksProps) {
  const [launchingApp, setLaunchingApp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:4500';
  const studentUrl =
    import.meta.env.VITE_STUDENT_URL || 'http://localhost:4300';
  const recruiterUrl =
    import.meta.env.VITE_RECRUITER_URL || 'http://localhost:4400';

  const apps: AppLink[] = [
    {
      name: 'Admin Dashboard',
      description: 'Manage users, content, and system settings',
      url: adminUrl,
      icon: '⚙️',
      roles: ['Admin'],
    },
    {
      name: 'Student Portal',
      description: 'Practice interviews, view questions, and track progress',
      url: studentUrl,
      icon: '📚',
      roles: ['User', 'Admin'],
    },
    {
      name: 'Recruiter Portal',
      description: 'Post jobs, review candidates, and conduct interviews',
      url: recruiterUrl,
      icon: '💼',
      roles: ['Recruiter', 'Admin'],
    },
  ];

  const userRole = user.roleName;

  // Define role-based access rules
  const getAvailableApps = (role: string) => {
    switch (role) {
      case 'User':
        return apps.filter((app) => app.name === 'Student Portal');
      case 'Recruiter':
        return apps.filter(
          (app) =>
            app.name === 'Student Portal' || app.name === 'Recruiter Portal'
        );
      case 'Admin':
        return apps; // Admin can access all apps
      default:
        return [];
    }
  };

  const availableApps = getAvailableApps(userRole);

  const handleAppClick = async (app: AppLink) => {
    try {
      setLaunchingApp(app.name);
      setError(null);

      console.log('Launching app:', app.name);

      // Extract origin from URL
      const targetUrl = new URL(app.url);
      const targetOrigin = targetUrl.origin;

      // Use SSOTokenManager to send token via postMessage with fallback
      await SSOTokenManager.sendAuthToken(
        targetOrigin,
        app.url,
        ssoAuth,
        true // Open in new window
      );

      console.log('App launched successfully:', app.name);
    } catch (err) {
      console.error('Failed to launch app:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to launch app. Please try again.'
      );
    } finally {
      setLaunchingApp(null);
    }
  };

  if (availableApps.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="text-gray-500">
          <p className="text-xl font-semibold mb-2">
            No applications available
          </p>
          <p className="text-lg">
            Your role ({userRole}) doesn't have access to any applications.
          </p>
          <p className="text-sm mt-2">
            Please contact your administrator for access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableApps.map((app, index) => (
          <button
            key={app.name}
            type="button"
            className="group relative w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            onClick={() => handleAppClick(app)}
            disabled={launchingApp === app.name}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Loading overlay */}
            {launchingApp === app.name && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-600 font-medium">
                    Launching...
                  </p>
                </div>
              </div>
            )}
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-600/0 group-hover:from-blue-500/10 group-hover:to-indigo-600/10 transition-all duration-300"></div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px]">
              <div className="w-full h-full bg-white rounded-2xl"></div>
            </div>

            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {app.icon}
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {userRole} Access
                </div>
                <div className="text-blue-600 text-sm font-semibold group-hover:text-blue-700 transition-colors duration-300 flex items-center">
                  Launch
                  <svg
                    className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
