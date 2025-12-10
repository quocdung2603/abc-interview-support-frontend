import { useState, useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Post, Field, Level, Topic, DiscussionAnswer } from '@abc-interview-support-frontend/types';
import { questionService, communityService, userService } from '@abc-interview-support-frontend/services';
import DiscussionTimer from './components/discussion-detail/DiscussionTimer';
import DiscussionQuestion from './components/discussion-detail/DiscussionQuestion';
import VoteRemaining from './components/discussion-detail/VoteRemaining';
import AnswerList from './components/discussion-detail/AnswerList';
import AnswerForm from './components/discussion-detail/AnswerForm';
import AnswerFloatButton from './components/discussion-detail/AnswerFloatButton';
import BestAnswerResult from './components/discussion-detail/BestAnswerResult';
import { useParams } from 'react-router-dom';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import { message } from 'antd';

const DiscussionDetails = (
) => {
  const { id: postIdParam } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [answers, setAnswers] = useState<DiscussionAnswer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [remainingVotes, setRemainingVotes] = useState(3);
  const [loading, setLoading] = useState(false);
  const [isOpenFloatButton, setIsOpenFloatButton] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Force re-render trigger

  const MAX_COMMENTS = 3;

  // Calculate remaining comments based on post type
  const getMaxCommentsForPostType = (postType: string) => {
    return postType === 'DISCUSSION' ? Infinity : MAX_COMMENTS;
  };

  const getRemainingComments = (postType: string, userCommentsCount: number) => {
    const maxComments = getMaxCommentsForPostType(postType);
    return maxComments === Infinity ? Infinity : Math.max(0, maxComments - userCommentsCount);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!postIdParam) return;

      setLoading(true);
      try {
        const [resPost, resFields, resTopics, resLevels, resComments] = await Promise.all([
          communityService.getPostById(Number(postIdParam)),
          questionService.getAllFields(),
          questionService.getAllTopics(),
          questionService.getAllLevels(),
          communityService.getPostComments(Number(postIdParam)),
        ]);

        setPost(resPost);
        setFields(resFields?.content || []);
        setTopics(resTopics?.content || []);
        setLevels(resLevels?.content || []);
        console.log('resComments:', resComments);
        // Handle both direct array and wrapped response formats
        const commentsArray = Array.isArray(resComments) ? resComments : resComments?.content || [];
        console.log('Raw comments array:', commentsArray);

        // Filter out duplicate answers by id, keeping the most recent one
        const uniqueAnswers = commentsArray.reduce((acc: DiscussionAnswer[], current: any) => {
          const existing = acc.find(a => a.id === current.id);
          if (!existing) {
            acc.push(current);
          } else if (new Date(current.createdAt) > new Date(existing.createdAt)) {
            // Replace with more recent version
            const index = acc.indexOf(existing);
            acc[index] = current;
          }
          return acc;
        }, []);

        console.log('Processed unique answers:', uniqueAnswers);
        setAnswers(uniqueAnswers);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postIdParam]);

  // Calculate remaining comments when answers or user changes
  useEffect(() => {
    if (user?.userId && post?.postType) {
      const userCommentsCount = answers.filter(answer => answer.userId === Number(user.userId)).length;
      const remaining = getRemainingComments(post.postType, userCommentsCount);
      setRemainingVotes(remaining);
    } else if (post?.postType) {
      // For non-logged in users, show max available
      const maxComments = getMaxCommentsForPostType(post.postType);
      setRemainingVotes(maxComments === Infinity ? Infinity : maxComments);
    } else {
      setRemainingVotes(MAX_COMMENTS);
    }
  }, [answers, user?.userId, post?.postType]);

  const answersPerPage = 5;
  const totalPages = Math.ceil(answers.length / answersPerPage);
  const paginatedAnswers = answers.slice(
    (currentPage - 1) * answersPerPage,
    currentPage * answersPerPage
  );

  // Check if discussion has ended
  const isDiscussionEnded = (() => {
    if (!post || !post.lockTime) return false;

    const lockTime = post.lockTime;
    console.log('Checking discussion end - lockTime:', lockTime);

    // Parse lockTime as UTC (same logic as DiscussionTimer)
    let endDate: Date;
    if (typeof lockTime === 'string' && lockTime.includes('T')) {
      const utcString = lockTime + (lockTime.includes('Z') ? '' : 'Z');
      endDate = new Date(utcString);
    } else {
      endDate = new Date(lockTime);
    }

    const now = new Date();
    const hasEnded = now > endDate;

    console.log('Discussion end check:', {
      now: now.toISOString(),
      endDate: endDate.toISOString(),
      hasEnded,
      timeDiff: endDate.getTime() - now.getTime()
    });

    return hasEnded;
  })();

  // Find best answer (highest votePercentage) - only for QUESTION type
  const getBestAnswer = () => {
    if (!isDiscussionEnded || answers.length === 0 || post?.postType !== 'QUESTION') return null;

    return answers.reduce((best, current) => {
      const bestPercentage = best.votePercentage || 0;
      const currentPercentage = current.votePercentage || 0;
      return currentPercentage > bestPercentage ? current : best;
    }, answers[0]); // Provide initial value
  };

  const bestAnswer = getBestAnswer();

  const [questionCreated, setQuestionCreated] = useState(false);

  // Auto-create question when discussion ends and has best answer
  useEffect(() => {
    const createQuestionFromBestAnswer = async () => {
      if (!isDiscussionEnded || !bestAnswer || !post || post.postType !== 'QUESTION' || questionCreated) {
        return;
      }

      // Check if question already exists for this post using sessionStorage
      // This prevents duplicate creation within the same browser session
      const questionCreatedKey = `question_created_${post.id}`;
      if (sessionStorage.getItem(questionCreatedKey)) {
        console.log('Question already created for this discussion in this session');
        setQuestionCreated(true);
        return;
      }

      try {
        console.log('Creating question from best answer:', bestAnswer);

        const questionData = {
          userId: bestAnswer.userId,
          topicId: post.topicId,
          fieldId: post.fieldId,
          levelId: post.levelId,
          questionTypeId: 3, // Default question type
          content: post.title,
          answer: bestAnswer.content,
          language: "Vietnamese"
        };

        console.log('Question data to create:', questionData);

        // Check for duplicate questions before creating
        console.log('Checking for duplicate questions...');
        const allQuestionsResponse = await questionService.getAllQuestions();
        const allQuestions = allQuestionsResponse?.content || [];

        const duplicateQuestion = allQuestions.find((q: any) =>
          q.userId === questionData.userId &&
          q.topicId === questionData.topicId &&
          q.fieldId === questionData.fieldId &&
          q.levelId === questionData.levelId &&
          q.questionTypeId === questionData.questionTypeId &&
          q.content === questionData.content &&
          q.answer === questionData.answer
        );

        if (duplicateQuestion) {
          console.log('Duplicate question found, skipping creation:', duplicateQuestion);
          sessionStorage.setItem(questionCreatedKey, 'true');
          setQuestionCreated(true);
          return;
        }

        console.log('No duplicate found, proceeding with creation...');

        await questionService.createQuestion(questionData);

        // Mark as created to prevent duplicates
        sessionStorage.setItem(questionCreatedKey, 'true');
        setQuestionCreated(true);

        console.log('Question created successfully from best answer');
        message.success('Đã tạo câu hỏi từ bình luận xuất sắc!');

        const eloUpdateData: any = {
          userId: bestAnswer.userId,
          action: 'BEST_ANSWER_SELECTED',
          points: 3 * Number(post.levelId), // ELO points based on level
          description: 'Nhận điểm ELO vì bình luận được chọn làm câu trả lời xuất sắc!',
        }
        await userService.updateElo(eloUpdateData);
        message.success('Đã cập nhật điểm ELO cho tác giả bình luận xuất sắc!');

      } catch (error: any) {
        console.error('Error creating question from best answer:', error);

        // If question already exists (409 Conflict), mark as created
        if (error.response?.status === 409) {
          sessionStorage.setItem(questionCreatedKey, 'true');
          setQuestionCreated(true);
          console.log('Question already exists, marked as created');
        }
        // Don't show error message to user as this is background operation
        // But log it for debugging
      }
    };

    createQuestionFromBestAnswer();
  }, [isDiscussionEnded, bestAnswer, post, questionCreated]);

  const handleVote = async (answerId: number, voteType: 'up' | 'down') => {
    if (!user) {
      message.warning('Bạn cần đăng nhập để vote');
      return;
    }

    // Check if user has already voted for this answer
    const currentAnswer = answers.find(a => a.id === answerId);
    if (currentAnswer?.userVoteStatus) {
      message.warning('Bạn đã vote cho bình luận này rồi!');
      return;
    }

    try {
      // Map frontend vote types to API vote types
      const apiVoteType: 'USEFUL' | 'NOT_USEFUL' = voteType === 'up' ? 'USEFUL' : 'NOT_USEFUL';

      const voteData = {
        userId: Number.parseInt(user.userId),
        voteType: apiVoteType,
      };

      console.log('Voting for answer:', answerId, 'with data:', voteData);

      // Call the vote API
      const updatedComment = await communityService.voteComments(answerId, voteData);

      // Update the local state with the response from API
      setAnswers((prev) =>
        prev.map((answer) => {
          if (answer.id === answerId) {
            console.log('Updating answer:', answer.id, 'with new data:', updatedComment);

            // Always preserve the original answer content and merge with API response
            const currentAnswer = prev.find(a => a.id === answerId);
            if (!currentAnswer) return answer;

            // If API returns full comment data, use it but ensure content is preserved
            if (updatedComment && typeof updatedComment === 'object') {
              return {
                ...currentAnswer, // Preserve all original data including content
                ...updatedComment, // Override with API response (vote stats, etc.)
                userVoteStatus: apiVoteType, // Mark that user has voted
                // Ensure content is never lost
                content: updatedComment.content || currentAnswer.content,
              };
            } else {
              // Fallback: increment vote count locally, preserve all other data
              return {
                ...currentAnswer,
                voteCount: currentAnswer.voteCount + 1,
                userVoteStatus: apiVoteType, // Mark that user has voted
                // Recalculate percentage (this is approximate)
                votePercentage: voteType === 'up' ?
                  Math.min(1, ((currentAnswer.voteCount + 1) / (currentAnswer.voteCount + 1))) :
                  currentAnswer.votePercentage
              };
            }
          }
          return answer;
        })
      );

      // Force re-render to ensure UI updates
      setRefreshTrigger(prev => prev + 1);

      // Show success message
      message.success('Đã vote thành công!');
      const eloUpdateData: any = {
        userId: Number(user.userId),
        action: 'COMMENT_VOTED',
        points: 1,
        description: 'Nhận điểm ELO vì bình luận được vote!',
      }
      await userService.updateElo(eloUpdateData);
      message.success('Đã cập nhật điểm ELO cho bạn! Tích cực vote các bình luận hữu ích nhé!');
    } catch (error: any) {
      console.error('Error voting:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      // Handle specific error cases
      if (error.response?.status === 409) {
        message.warning('Bạn đã vote cho bình luận này rồi!');
        // Update local state to mark as voted
        setAnswers((prev) =>
          prev.map((answer) => {
            if (answer.id === answerId) {
              return {
                ...answer,
                userVoteStatus: voteType === 'up' ? 'USEFUL' : 'NOT_USEFUL'
              };
            }
            return answer;
          })
        );
      } else if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        message.error('Bạn không có quyền vote cho bình luận này.');
      } else {
        message.error('Không thể vote. Vui lòng thử lại.');
      }
    }
  };

  const handleSubmitAnswer = async (content: string) => {
    if (isDiscussionEnded) {
      message.warning('Cuộc thảo luận đã kết thúc, không thể gửi câu trả lời mới.');
      throw new Error('Cuộc thảo luận đã kết thúc');
    }

    // Check comment limit based on post type
    if (post?.postType === 'QUESTION' && remainingVotes <= 0) {
      message.warning('Bạn đã đạt giới hạn số bình luận cho câu hỏi này (tối đa 3 bình luận).');
      throw new Error('Đã đạt giới hạn bình luận');
    }

    if (!post) {
      message.error('Không tìm thấy bài viết để trả lời.');
      throw new Error('Không tìm thấy bài viết');
    }

    if (!user) {
      message.warning('Bạn cần đăng nhập để gửi bình luận.');
      throw new Error('Bạn cần đăng nhập để gửi bình luận');
    }

    // Show loading message
    message.loading('Đang gửi bình luận...', 0);

    try {
      const commentData = {
        postId: post.id,
        userId: Number.parseInt(user.userId),
        content: content.trim(),
      };

      const newComment = await communityService.createPostComment(commentData);

      // Add the new comment to the answers list
      setAnswers((prev) => [newComment, ...prev]);

      // Success message
      message.destroy(); // Remove loading message
      message.success('Bình luận đã được gửi thành công!');
    } catch (error) {
      console.error('Error creating comment:', error);
      message.destroy(); // Remove loading message
      message.error('Không thể gửi bình luận. Vui lòng thử lại.');
      throw new Error('Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of answers
    document
      .getElementById('answers-section')
      ?.scrollIntoView({ behavior: 'smooth' });
    // Show page change message
    message.info(`Chuyển đến trang ${page}`);
  };

  const handleOnBack = () => {
    message.info('Đang quay lại trang trước...');
    globalThis.window.history.back();
  };

  const handleFloatButtonClick = () => {
    setIsOpenFloatButton(!isOpenFloatButton);
    if (!isOpenFloatButton) {
      message.info('Mở form trả lời nhanh');
    } else {
      message.info('Đóng form trả lời');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy bài viết
          </h2>
          <p className="text-gray-500 mb-6">
            Bài viết bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
          </p>
          <button
            onClick={handleOnBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Quay lại danh sách thảo luận
          </button>
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
            <VoteRemaining
              remainingVotes={remainingVotes}
              maxVotes={post?.postType === 'DISCUSSION' ? Infinity : MAX_COMMENTS}
              postType={post?.postType}
            />
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
                  score: bestAnswer.votePercentage || 0,
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
            key={`answer-list-${refreshTrigger}`} // Force re-render when votes change
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
            remainingComments={remainingVotes}
          />
        </div>
      )}
    </div>
  );
};

export default DiscussionDetails;
