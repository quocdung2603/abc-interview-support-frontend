import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QuestionDetailHeader } from './components/interview-question-detail/QuestionDetailHeader';
import { AnswersSection } from './components/interview-question-detail/AnswersSection';
import { QuestionNavigation } from './components/interview-question-detail/QuestionNavigation';
import {
  Answer,
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';
import { RouterLink } from '../../utils/RouterLink';
import { questionService } from '@abc-interview-support-frontend/services';

export const InterviewQuestionDetail: React.FC = () => {
  const { id: questionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Get filtered questions from navigation state
  const filteredQuestions = location.state?.filteredQuestions as Question[] | undefined;

  // State management
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      const mappedFields = (res.content || []).map((item: { id: number, name?: string, description?: string }) => ({
        id: item.id,
        fieldName: item.name || item.description || 'Unknown Field',
        description: item.description || item.name || 'Unknown Field',
      }));
      setFields(mappedFields);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFields([]);
    }
  };

  const getAllTopics = async () => {
    try {
      const res = await questionService.getAllTopics();
      console.log('Topics:', res.content);
      const mappedTopics = (res.content || []).map((item: { id: number, name?: string, description?: string, fieldId: number }) => ({
        id: item.id,
        fieldId: item.fieldId,
        topicName: item.name || item.description || 'Unknown Topic',
        description: item.description || item.name || 'Unknown Topic',
      }));
      setTopics(mappedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopics([]);
    }

  };

  const getAllLevels = async () => {
    try {
      const res = await questionService.getAllLevels();
      console.log('Levels:', res.content);
      const mappedLevels = (res.content || []).map((item: { id: number, name?: string, description?: string }) => ({
        id: item.id,
        levelName: (item.name || item.description || 'Unknown Level') as 'Fresher' | 'Junior' | 'Senior' | 'Middle',
        description: item.description || item.name || 'Unknown Level',
      }));
      setLevels(mappedLevels);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setLevels([]);
    }
  };

  const getQuestionById = async (questionId: number): Promise<Question> => {
    const res = await questionService.getQuestionById(questionId);
    console.log('Question by ID:', res);
    return res;
  }

  const getAllQuestions = async () => {
    try {
      const res = await questionService.getAllQuestions();
      let questions = res.content || [];
      questions = questions.filter((question: any) => question?.status === 'APPROVED');
      console.log('All Questions:', questions);
      setQuestionList(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestionList([]);
    }
  }

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      if (!questionId) {
        setLoading(false);
        setError('No question ID provided');
        return;
      }

      try {
        setLoading(true);

        // Load question details
        const questionData = await getQuestionById(Number(questionId));
        setQuestion(questionData);

        // Create answer from questionAnswer
        if (questionData.questionAnswer) {
          const answer: Answer = {
            answerId: questionData.id, // Use question id as answer id for simplicity
            userId: questionData.userId,
            questionId: questionData.id,
            questionVariantId: 1,
            answerContent: questionData.questionAnswer,
            isSampleAnswer: true,
            usefulVote: 0, // API doesn't provide, set to 0
            unusefulVote: 0,
            createdAt: new Date(questionData.createdAt),
          };
          setAnswers([answer]);
        } else {
          setAnswers([]);
        }

        // Load supporting data
        if (filteredQuestions) {
          // Use filtered questions from navigation state
          setQuestionList(filteredQuestions);
        } else {
          // Load all questions if no filtered list provided
          await getAllQuestions();
        }

        await Promise.all([
          getAllFields(),
          getAllTopics(),
          getAllLevels(),
        ]);

      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load question data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [questionId, filteredQuestions]);

  // Navigation handlers
  const handleBackToList = () => {
    navigate(`/${RouterLink.InterviewRevision}`);
  };

  const handleQuestionClick = (newQuestionId: number) => {
    navigate(`/interview-question-detail/${newQuestionId}`, {
      state: { filteredQuestions }
    });
  };

  const handleVoteQuestion = (
    questionId: number,
    voteType: 'useful' | 'unuseful'
  ) => {
    if (!question) return;

    // Mock vote handling - replace with actual API call
    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        usefulVote:
          voteType === 'useful' ? prev.usefulVote + 1 : prev.usefulVote,
        unusefulVote:
          voteType === 'unuseful' ? prev.unusefulVote + 1 : prev.unusefulVote,
      };
    });
  };

  const handleVoteAnswer = (
    answerId: number,
    voteType: 'useful' | 'unuseful'
  ) => {
    // Mock vote handling - replace with actual API call
    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.answerId === answerId) {
          return {
            ...answer,
            usefulVote:
              voteType === 'useful' ? answer.usefulVote + 1 : answer.usefulVote,
            unusefulVote:
              voteType === 'unuseful'
                ? answer.unusefulVote + 1
                : answer.unusefulVote,
          };
        }
        return answer;
      })
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !question) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-neutral-400">:(</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Không tìm thấy câu hỏi
          </h1>
          <p className="text-neutral-600 mb-6">
            Câu hỏi bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button onClick={handleBackToList} className="btn-primary">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Question Header */}
          <QuestionDetailHeader
            question={question}
            field={fields.find((f) => f.id === question.fieldId)}
            topic={topics.find((t) => t.id === question.topicId)}
            level={levels.find((l) => l.id === question.levelId)}
            onBack={handleBackToList}
            onVote={handleVoteQuestion}
          />

          {/* Answers Section - chỉ hiển thị câu trả lời mẫu */}
          <AnswersSection answers={answers} onAnswerVote={handleVoteAnswer} />

          {/* Question Navigation - điều hướng giữa các câu hỏi */}
          <QuestionNavigation
            currentQuestionId={question.id}
            allQuestions={questionList.map((q) => ({
              id: q.id,
              questionContent: q.questionContent,
            }))}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </div>
  );
};
