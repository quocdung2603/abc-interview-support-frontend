import Dashboard from '../pages/dashboard/Dashboard';
import VerificationPage from '../pages/verification/VerificationPage';
import JobsPage from '../pages/jobs/JobsPage';
import ExamsPage from '../pages/exams/ExamsPage';
import ResultsPage from '../pages/results/ResultsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import { RouterLink } from '../utils/RouterLink';

export const Routing = [
  {
    path: RouterLink.Dashboard,
    element: Dashboard,
  },
  {
    path: RouterLink.Verification,
    element: VerificationPage,
  },
  {
    path: RouterLink.Jobs,
    element: JobsPage,
  },
  {
    path: RouterLink.JobsNew,
    element: JobsPage, // Could be a separate JobForm component
  },
  {
    path: RouterLink.JobsEdit,
    element: JobsPage, // Could be a separate JobForm component
  },
  {
    path: RouterLink.Exams,
    element: ExamsPage,
  },
  {
    path: RouterLink.ExamsNew,
    element: ExamsPage, // Could be a separate ExamForm component
  },
  {
    path: RouterLink.ExamsEdit,
    element: ExamsPage, // Could be a separate ExamForm component
  },
  {
    path: RouterLink.Results,
    element: ResultsPage,
  },
  {
    path: RouterLink.Settings,
    element: SettingsPage,
  },
];
