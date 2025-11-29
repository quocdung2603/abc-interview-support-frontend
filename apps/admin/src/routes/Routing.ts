import Dashboard from '../pages/dashboard/Dashboard';
import TrendNewsManagement from '../pages/news-management/TrendNewsManagement';
import RecruitmentNewsManagement from '../pages/news-management/RecruitmentNewsManagement';
import AccountApproval from '../pages/user-management/AccountApproval';
import RecruiterManagement from '../pages/user-management/RecruiterManagement';
import UserManagement from '../pages/user-management/UserManagement';
import { RouterLink } from '../utils/RouterLink';
import NewsApproval from '../pages/news-management/NewsApproval';
import QuestionBank from '../pages/question-management/QuestionBank';
import QuestionApproval from '../pages/question-management/QuestionApproval';
import MockExamManagement from '../pages/exam-management/MockExamManagement';
import BaseExamManagement from '../pages/exam-management/BaseExamManagement';
import ExamApproval from '../pages/exam-management/ExamApproval';
import FieldManagement from '../pages/question-management/FieldManagement';
import TopicManagement from '../pages/question-management/TopicManagement';
import LevelManagement from '../pages/question-management/LevelManagement';
import QuestionTypeManagement from '../pages/question-management/QuestionTypeManagement';
import CommunityManagement from '../pages/community-management/CommunityManagement';

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
  {
    path: RouterLink.FieldManagement,
    element: FieldManagement,
  },
  {
    path: RouterLink.TopicManagement,
    element: TopicManagement,
  },
  {
    path: RouterLink.LevelManagement,
    element: LevelManagement,
  },
  {
    path: RouterLink.QuestionTypeManagement,
    element: QuestionTypeManagement,
  },
  {
    path: RouterLink.QuestionBank,
    element: QuestionBank,
  },
  {
    path: RouterLink.QuestionApproval,
    element: QuestionApproval,
  },
  {
    path: RouterLink.MockExam,
    element: MockExamManagement,
  },
  {
    path: RouterLink.BaseExam,
    element: BaseExamManagement,
  },
  {
    path: RouterLink.ExamApproval,
    element: ExamApproval,
  },
  {
    path: RouterLink.CommunityManagement,
    element: CommunityManagement,
  },
];
