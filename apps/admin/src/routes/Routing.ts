import Dashboard from '../pages/dashboard/Dashboard';
import AccountApproval from '../pages/user-management/AccountApproval';
import RecruiterManagement from '../pages/user-management/RecruiterManagement';
import UserManagement from '../pages/user-management/UserManagement';
import { RouterLink } from '../utils/RouterLink';

export const Routing = [
  {
    path: RouterLink.Dashboard,
    element: Dashboard,
  },
  {
    path: RouterLink.User,
    element: UserManagement,
  },
  {
    path: RouterLink.Recruiter,
    element: RecruiterManagement,
  },
  {
    path: RouterLink.AccountApproval,
    element: AccountApproval,
  },
];
