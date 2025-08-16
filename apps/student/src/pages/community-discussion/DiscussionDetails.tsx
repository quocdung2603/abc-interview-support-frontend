import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import DiscussionTimer from './components/discussion-detail/DiscussionTimer';
import DiscussionQuestion from './components/discussion-detail/DiscussionQuestion';
import VoteRemaining from './components/discussion-detail/VoteRemaining';
import AnswerList from './components/discussion-detail/AnswerList';
import AnswerForm from './components/discussion-detail/AnswerForm';
import AnswerFloatButton from './components/discussion-detail/AnswerFloatButton';
import BestAnswerResult from './components/discussion-detail/BestAnswerResult';

interface Answer {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

// Mock data for demonstration
const mockDiscussion = {
  id: '1',
  title: 'Làm thế nào để chuẩn bị tốt cho phỏng vấn React Developer?',
  author: 'Admin ABC Interview',
  authorAvatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  createdAt: '2 giờ trước',
  field: 'Frontend',
  level: 'Junior',
  tags: ['React', 'Interview', 'JavaScript', 'Hooks'],
  views: 156,
  replies: 12,
  likes: 24,
  endDate: '2025-08-14T23:59:59', // Discussion ended yesterday (for testing)
};

const mockAnswers: Answer[] = [
  {
    id: '1',
    content: `Dựa trên kinh nghiệm phỏng vấn React Developer, mình chia sẻ một số câu hỏi thường gặp:

**Câu hỏi cơ bản:**
- Sự khác biệt giữa Class component và Functional component
- Lifecycle methods và useEffect
- Virtual DOM là gì và hoạt động như thế nào

**Câu hỏi nâng cao:**
- Khi nào sử dụng useMemo và useCallback
- State management: Redux vs Context API
- Code splitting và lazy loading

**Tips chuẩn bị:**
1. Làm một project nhỏ showcase skills
2. Đọc React docs mới nhất
3. Practice coding interview trên LeetCode

Chúc bạn thành công!`,
    author: 'Trần Thị B',
    authorAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    createdAt: '1 giờ trước',
    upvotes: 15,
    downvotes: 2,
    userVote: null,
  },
  {
    id: '2',
    content: `Bổ sung thêm một số điểm quan trọng:

**Performance Optimization:**
- React.memo cho functional components
- Sử dụng React DevTools Profiler
- Bundle analysis với webpack-bundle-analyzer

**Testing:**
- Unit test với Jest
- Component testing với React Testing Library
- E2E testing với Cypress

**Soft skills cũng quan trọng:**
- Cách communicate technical concepts
- Problem-solving approach
- Teamwork experience

Đừng quên prepare câu hỏi để hỏi interviewer nhé!`,
    author: 'Lê Minh C',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    createdAt: '45 phút trước',
    upvotes: 8,
    downvotes: 0,
    userVote: null,
  },
  {
    id: '3',
    content: `Từ góc độ người phỏng vấn, mình thấy candidates thường yếu ở những điểm sau:

1. **State management**: Không hiểu khi nào dùng Redux vs Context
2. **Performance**: Không biết optimize re-render
3. **Architecture**: Không biết organize code structure
4. **Error handling**: Thiếu Error Boundaries

Suggestion: Focus vào understanding concepts thay vì memorize syntax.`,
    author: 'Phạm Thị D',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b79e217c?w=40&h=40&fit=crop&crop=face',
    createdAt: '30 phút trước',
    upvotes: 12,
    downvotes: 1,
    userVote: null,
  },
];

const DiscussionDetails: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainingVotes, setRemainingVotes] = useState(3);
  const [loading, setLoading] = useState(false);
  const [isOpenFloatButton, setIsOpenFloatButton] = useState<boolean>(false);

  const answersPerPage = 5;
  const totalPages = Math.ceil(answers.length / answersPerPage);
  const paginatedAnswers = answers.slice(
    (currentPage - 1) * answersPerPage,
    currentPage * answersPerPage
  );

  // Check if discussion has ended
  const isDiscussionEnded = new Date() > new Date(mockDiscussion.endDate);

  // Find best answer (highest score)
  const getBestAnswer = () => {
    if (!isDiscussionEnded || answers.length === 0) return null;

    return answers.reduce((best, current) => {
      const currentScore = current.upvotes - current.downvotes;
      const bestScore = best.upvotes - best.downvotes;
      return currentScore > bestScore ? current : best;
    }, answers[0]); // Provide initial value
  };

  const bestAnswer = getBestAnswer();

  const updateAnswer = (answer: Answer, voteType: 'up' | 'down') => {
    const prevVote = answer.userVote;
    let newUpvotes = answer.upvotes;
    let newDownvotes = answer.downvotes;
    let newUserVote: 'up' | 'down' | null = null;

    // Remove previous vote if exists
    if (prevVote === 'up') {
      newUpvotes -= 1;
    } else if (prevVote === 'down') {
      newDownvotes -= 1;
    }

    // Add new vote if different from previous
    if (voteType !== prevVote) {
      if (voteType === 'up') {
        newUpvotes += 1;
        newUserVote = 'up';
      } else {
        newDownvotes += 1;
        newUserVote = 'down';
      }
    }

    return {
      ...answer,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      userVote: newUserVote,
      voteChanged: {
        shouldDecrease: newUserVote && !prevVote,
        shouldIncrease: !newUserVote && prevVote,
      },
    };
  };

  const handleVote = (answerId: string, voteType: 'up' | 'down') => {
    if (remainingVotes <= 0) {
      alert('Bạn đã hết lượt đánh giá!');
      return;
    }

    let voteChange = { shouldDecrease: false, shouldIncrease: false };

    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) {
          return answer;
        }

        const updatedAnswer = updateAnswer(answer, voteType);
        voteChange = updatedAnswer.voteChanged as any;

        // Remove the voteChanged property before returning
        const { voteChanged, ...cleanAnswer } = updatedAnswer;
        return cleanAnswer as Answer;
      })
    );

    // Update remaining votes count
    if (voteChange.shouldDecrease) {
      setRemainingVotes((prev) => prev - 1);
    } else if (voteChange.shouldIncrease) {
      setRemainingVotes((prev) => prev + 1);
    }
  };

  const handleSubmitAnswer = async (content: string) => {
    if (isDiscussionEnded) {
      throw new Error('Cuộc thảo luận đã kết thúc');
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newAnswer: Answer = {
      id: Date.now().toString(),
      content,
      author: 'Bạn',
      authorAvatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
      createdAt: 'Vừa xong',
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    };

    setAnswers((prev) => [newAnswer, ...prev]);
    setLoading(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of answers
    document
      .getElementById('answers-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOnBack = () => {};

  const handleFloatButtonClick = () => {
    setIsOpenFloatButton(!isOpenFloatButton);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            onClick={handleOnBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeftOutlined className="text-sm" />
            <span className="text-sm font-medium">Quay lại thảo luận</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Question and Answers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question */}
            <DiscussionQuestion
              title={mockDiscussion.title}
              author={mockDiscussion.author}
              authorAvatar={mockDiscussion.authorAvatar}
              createdAt={mockDiscussion.createdAt}
              field={mockDiscussion.field}
              level={mockDiscussion.level}
              tags={mockDiscussion.tags}
              views={mockDiscussion.views}
              replies={mockDiscussion.replies}
            />
          </div>

          <div className="lg:col-span-1 space-y-5">
            <DiscussionTimer endDate={mockDiscussion.endDate} />
            <VoteRemaining remainingVotes={remainingVotes} maxVotes={3} />
          </div>
        </div>

        {/* Answers List */}
        <div id="answers-section">
          {/* Show Best Answer Result if discussion ended */}
          {isDiscussionEnded && bestAnswer && (
            <div className="mb-6">
              <BestAnswerResult
                answer={{
                  ...bestAnswer,
                  score: bestAnswer.upvotes - bestAnswer.downvotes,
                }}
                questionTitle={mockDiscussion.title}
              />
            </div>
          )}

          <AnswerList
            answers={paginatedAnswers}
            onVote={handleVote}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </div>
      {!isOpenFloatButton && (
        <AnswerFloatButton handleFloatButtonClick={handleFloatButtonClick} />
      )}
      {isOpenFloatButton && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full md:w-auto">
          <AnswerForm
            onSubmit={handleSubmitAnswer}
            disabled={isDiscussionEnded}
            placeholder={
              isDiscussionEnded
                ? 'Cuộc thảo luận đã kết thúc, không thể gửi câu trả lời mới.'
                : 'Chia sẻ kinh nghiệm, gợi ý hoặc giải pháp của bạn...'
            }
            handleAnswerClick={handleFloatButtonClick}
          />
        </div>
      )}
    </div>
  );
};

export default DiscussionDetails;
