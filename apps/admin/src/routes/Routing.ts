import Dashboard from '../pages/dashboard/Dashboard';
import TrendNewsManagement from '../pages/news-management/TrendNewsManagement';
import RecruitmentNewsManagement from '../pages/news-management/RecruitmentNewsManagement';
import AccountApproval from '../pages/user-management/AccountApproval';
import RecruiterManagement from '../pages/user-management/RecruiterManagement';
import UserManagement from '../pages/user-management/UserManagement';
import { RouterLink } from '../utils/RouterLink';
import NewsApproval from '../pages/news-management/NewsApproval';

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
  {
    path: RouterLink.TrendNews,
    element: TrendNewsManagement,
  },
  {
    path: RouterLink.RecruitmentNews,
    element: RecruitmentNewsManagement,
  },
  {
    path: RouterLink.NewsApproval,
    element: NewsApproval,
  },
];
