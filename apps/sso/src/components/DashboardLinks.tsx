import { AuthUser } from '@abc-interview-support-frontend/types';

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
      roles: ['Student', 'Admin'],
    },
    {
      name: 'Recruiter Portal',
      description: 'Post jobs, review candidates, and conduct interviews',
      url: recruiterUrl,
      icon: '💼',
      roles: ['Recruiter', 'Admin'],
    },
  ];

  const userRole = user.role.roleName;

  // Define role-based access rules
  const getAvailableApps = (role: string) => {
    switch (role) {
      case 'Student':
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
    console.log('Redirecting to app:', app.name, 'with ssoAuth:', ssoAuth);

    // Use URL redirect with sso_auth token
    const url = new URL(app.url);
    url.searchParams.set('sso_auth', ssoAuth);

    console.log('Redirect URL:', url.toString());
    window.location.href = url.toString();
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableApps.map((app, index) => (
        <button
          key={app.name}
          type="button"
          className="group relative w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
          onClick={() => handleAppClick(app)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
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
  );
}
