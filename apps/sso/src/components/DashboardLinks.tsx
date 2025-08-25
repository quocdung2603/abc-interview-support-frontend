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
  const availableApps = apps.filter((app) => app.roles.includes(userRole));

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
      <div className="text-center py-12">
        <div className="text-gray-500">
          <p className="text-lg">
            No applications available for your role: {userRole}
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
      {availableApps.map((app) => (
        <button
          key={app.name}
          type="button"
          className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group text-left"
          onClick={() => handleAppClick(app)}
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{app.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{app.description}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Access level: {userRole}
              </div>
              <div className="text-blue-600 text-sm font-medium group-hover:text-blue-800">
                Launch →
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
