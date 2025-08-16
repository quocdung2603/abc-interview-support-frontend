import About from '../pages/about/About';
import CommunityDiscussion from '../pages/community-discussion/CommunityDiscussion';
import DiscussionDetails from '../pages/community-discussion/DiscussionDetails';
import InterviewRevision from '../pages/interview-revision/InterviewRevision';
import { InterviewQuestionDetail } from '../pages/interview-revision/InterviewQuestionDetail';
import Landing from '../pages/landing/Landing';
import MockInterview from '../pages/mock-interview/MockInterview';
import RecruitmentNews from '../pages/news/RecruitmentNews';
import RecruitmentNewsDetail from '../pages/news/RecruitmentNewsDetail';
import { TrendNews } from '../pages/news/TrendNews';
import TrendNewsDetail from '../pages/news/TrendNewsDetail';
import { RouterLink } from '../utils/RouterLink';

export const Routing = [
  {
    path: RouterLink.Landing,
    element: Landing,
  },
  {
    path: RouterLink.InterviewRevision,
    element: InterviewRevision,
  },
  {
    path: RouterLink.InterviewQuestionDetail,
    element: InterviewQuestionDetail,
  },
  {
    path: RouterLink.About,
    element: About,
  },
  {
    path: RouterLink.MockInterview,
    element: MockInterview,
  },
  {
    path: RouterLink.TrendNews,
    element: TrendNews,
  },
  {
    path: RouterLink.TrendNewsDetail,
    element: TrendNewsDetail,
  },
  {
    path: RouterLink.RecruitmentNews,
    element: RecruitmentNews,
  },
  {
    path: RouterLink.RecruitmentNewsDetail,
    element: RecruitmentNewsDetail,
  },
  {
    path: RouterLink.CommunityDiscussion,
    element: CommunityDiscussion,
  },
  {
    path: RouterLink.CommunityDiscussionDetail,
    element: DiscussionDetails,
  },
];
