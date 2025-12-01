import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Post, Field, Level, Topic, DiscussionAnswer } from '@abc-interview-support-frontend/types';
import { questionService, userService } from '@abc-interview-support-frontend/services';
import DiscussionTimer from './components/discussion-detail/DiscussionTimer';
import DiscussionQuestion from './components/discussion-detail/DiscussionQuestion';
import VoteRemaining from './components/discussion-detail/VoteRemaining';
import AnswerList from './components/discussion-detail/AnswerList';
import AnswerForm from './components/discussion-detail/AnswerForm';
import AnswerFloatButton from './components/discussion-detail/AnswerFloatButton';
import BestAnswerResult from './components/discussion-detail/BestAnswerResult';

// Mock data
const mockPost: Post = {
  id: 1,
  userId: 123,
  fieldId: 1,
  topicId: 1,
  levelId: 2,
  postType: 'DISCUSSION',
  status: 'PUBLISHED',
  title: 'Cách chuẩn bị cho buổi phỏng vấn Frontend Developer?',
  content: 'Tôi sắp có buổi phỏng vấn vị trí Frontend Developer. Các bạn có kinh nghiệm gì để chia sẻ không? Tôi cần chuẩn bị những gì?',
  lockTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

const mockFields: Field[] = [
  { id: 1, name: 'Frontend Development', description: 'Lập trình frontend' },
  { id: 2, name: 'Backend Development', description: 'Lập trình backend' },
  { id: 3, name: 'DevOps', description: 'Vận hành và triển khai' },
];

const mockTopics: Topic[] = [
  { id: 1, fieldId: 1, fieldName: 'Frontend Development', name: 'React', description: 'Framework React' },
  { id: 2, fieldId: 1, fieldName: 'Frontend Development', name: 'Vue.js', description: 'Framework Vue.js' },
  { id: 3, fieldId: 1, fieldName: 'Frontend Development', name: 'Angular', description: 'Framework Angular' },
  { id: 4, fieldId: 2, fieldName: 'Backend Development', name: 'Node.js', description: 'Runtime Node.js' },
];

const mockLevels: Level[] = [
  { id: 1, name: 'Junior', description: 'Mới vào nghề' },
  { id: 2, name: 'Mid-level', description: 'Có kinh nghiệm 2-3 năm' },
  { id: 3, name: 'Senior', description: 'Có kinh nghiệm 5+ năm' },
];

const mockAnswers: DiscussionAnswer[] = [
  {
    id: 1,
    postId: 1,
    userId: 456,
    content: 'Đầu tiên bạn cần nắm vững HTML, CSS, JavaScript. Sau đó học một framework như React, Vue hoặc Angular. Chuẩn bị portfolio và luyện tập các câu hỏi thuật toán.',
    upVotes: 15,
    downVotes: 2,
    createdAt: '2 giờ trước',
    updatedAt: '2 giờ trước',
  },
  {
    id: 2,
    postId: 1,
    userId: 789,
    content: 'Tôi khuyên bạn nên ôn tập các khái niệm cơ bản như closure, prototype, async/await. Ngoài ra, chuẩn bị tâm lý và tìm hiểu về công ty trước khi phỏng vấn.',
    upVotes: 8,
    downVotes: 0,
    createdAt: '5 giờ trước',
    updatedAt: '5 giờ trước',
  },
  {
    id: 3,
    postId: 1,
    userId: 101,
    content: 'Đừng quên luyện tập code trên LeetCode hoặc HackerRank. Các công ty thường có bài test coding trong vòng phỏng vấn đầu tiên.',
    upVotes: 12,
    downVotes: 1,
    createdAt: '1 ngày trước',
    updatedAt: '1 ngày trước',
  },
  {
    id: 4,
    postId: 1,
    userId: 102,
    content: 'Hãy chắc chắn rằng bạn hiểu về responsive design và có thể làm việc với các công cụ như Git, Webpack.',
    upVotes: 5,
    downVotes: 0,
    createdAt: '1 ngày trước',
    updatedAt: '1 ngày trước',
  },  
  {
    id: 5,
    postId: 1,
    userId: 103,
    content: 'Tham gia các dự án mã nguồn mở để có thêm kinh nghiệm thực tế và xây dựng mạng lưới quan hệ trong ngành.',
    upVotes: 7,
    downVotes: 1,   
    createdAt: '2 ngày trước',
    updatedAt: '2 ngày trước',
  },
  {
    id: 6,
    postId: 1,
    userId: 102,
    content: 'Hãy chắc chắn rằng bạn hiểu về responsive design và có thể làm việc với các công cụ như Git, Webpack.',
    upVotes: 5,
    downVotes: 0,
    createdAt: '1 ngày trước',
    updatedAt: '1 ngày trước',
  },  
  {
    id: 7,
    postId: 1,
    userId: 103,
    content: 'Tham gia các dự án mã nguồn mở để có thêm kinh nghiệm thực tế và xây dựng mạng lưới quan hệ trong ngành.',
    upVotes: 7,
    downVotes: 1,   
    createdAt: '2 ngày trước',
    updatedAt: '2 ngày trước',
  },
    {
    id: 8,
    postId: 1,
    userId: 103,
    content: 'Tham gia các dự án mã nguồn mở để có thêm kinh nghiệm thực tế và xây dựng mạng lưới quan hệ trong ngành.',
    upVotes: 7,
    downVotes: 1,   
    createdAt: '2 ngày trước',
    updatedAt: '2 ngày trước',
  },
  {
    id: 9,
    postId: 1,
    userId: 102,
    content: 'Hãy chắc chắn rằng bạn hiểu về responsive design và có thể làm việc với các công cụ như Git, Webpack.',
    upVotes: 5,
    downVotes: 0,
    createdAt: '1 ngày trước',
    updatedAt: '1 ngày trước',
  },  
  {
    id: 10,
    postId: 1,
    userId: 103,
    content: 'Tham gia các dự án mã nguồn mở để có thêm kinh nghiệm thực tế và xây dựng mạng lưới quan hệ trong ngành.',
    upVotes: 7,
    downVotes: 1,   
    createdAt: '2 ngày trước',
    updatedAt: '2 ngày trước',
  },

];

interface DiscusionDetailProps {
  post?: Post;
  fields?: Field[];
  topics?: Topic[];
  levels?: Level[];
}

const DiscussionDetails: React.FC<DiscusionDetailProps> = ({
  post = mockPost,
  fields = mockFields,
  topics = mockTopics,
  levels = mockLevels
}) => {
  const [answers, setAnswers] = useState<DiscussionAnswer[]>(mockAnswers);
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
  const isDiscussionEnded = post ? new Date() > new Date(post.lockTime || '') : false;

  // Find best answer (highest score)
  const getBestAnswer = () => {
    if (!isDiscussionEnded || answers.length === 0) return null;

    return answers.reduce((best, current) => {
      const currentScore = current.upVotes - current.downVotes;
      const bestScore = best.upVotes - best.downVotes;
      return currentScore > bestScore ? current : best;
    }, answers[0]); // Provide initial value
  };

  const bestAnswer = getBestAnswer();

  const updateAnswer = (answer: DiscussionAnswer, voteType: 'up' | 'down') => {
    // Note: DiscussionAnswer doesn't have userVote, so we can't track individual votes
    // This is a simplified version
    let newUpvotes = answer.upVotes;
    let newDownvotes = answer.downVotes;

    if (voteType === 'up') {
      newUpvotes += 1;
    } else {
      newDownvotes += 1;
    }

    return {
      ...answer,
      upVotes: newUpvotes,
      downVotes: newDownvotes,
    };
  };

  const handleVote = (answerId: number, voteType: 'up' | 'down') => {
    if (remainingVotes <= 0) {
      alert('Bạn đã hết lượt đánh giá!');
      return;
    }

    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) {
          return answer;
        }

        const updatedAnswer = updateAnswer(answer, voteType);
        return updatedAnswer;
      })
    );

    // Update remaining votes count
    setRemainingVotes((prev) => prev - 1);
  };

  const handleSubmitAnswer = async (content: string) => {
    if (isDiscussionEnded) {
      throw new Error('Cuộc thảo luận đã kết thúc');
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newAnswer: DiscussionAnswer = {
      id: Date.now(),
      postId: post.id,
      userId: 999, // Current user ID
      content,
      upVotes: 0,
      downVotes: 0,
      createdAt: 'Vừa xong',
      updatedAt: 'Vừa xong',
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

  const handleOnBack = () => {
    globalThis.window.history.back();
  };

  const handleFloatButtonClick = () => {
    setIsOpenFloatButton(!isOpenFloatButton);
  };

  if (!post) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Question and Answers */}
          <div className="lg:col-span-2 space-y-4">
            {/* Question */}
            <DiscussionQuestion post={post} fields={fields} topics={topics} levels={levels} />
          </div>

          <div className="lg:col-span-1 space-y-3">
            <DiscussionTimer post={post} />
            <VoteRemaining remainingVotes={remainingVotes} maxVotes={3} />
          </div>
        </div>

        {/* Answers List */}
        <div id="answers-section">
          {/* Show Best Answer Result if discussion ended */}
          {isDiscussionEnded && bestAnswer && (
            <div className="mb-4">
              <BestAnswerResult
                answer={{
                  ...bestAnswer,
                  score: bestAnswer.upVotes - bestAnswer.downVotes,
                }}
                questionTitle={post.title}
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
            postType={post.postType}
          />
        </div>
      )}
    </div>
  );
};

export default DiscussionDetails;
