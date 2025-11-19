import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewRevisionFilter } from './components/InterviewRevisionFilter';
import { QuestionsList } from './components/QuestionsList';
import {
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

/**
 * TRANG ÔN TẬP PHỎNG VẤN
 *
 * Features:
 * - Ngân hàng câu hỏi phỏng vấn theo lĩnh vực
 * - Lọc theo Field (Frontend, Backend, BA, Tester)
 * - Lọc theo Topic (React, Angular, Node.js, etc.)
 * - Lọc theo Level (Fresher, Junior, Middle, Senior)
 * - Hiển thị câu hỏi và câu trả lời mẫu
 * - Vote system cho câu hỏi và câu trả lời
 * - Pagination
 */

// Mock data cho demo - tạm thời bỏ answers vì API trả về questionAnswer trực tiếp
// const mockAnswers: Answer[] = [
//   // ... bỏ mock answers
// ];

const InterviewRevision: React.FC = () => {
  const navigate = useNavigate();
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [levelData, setLevelData] = useState<Level[]>([]);
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [selectedField, setSelectedField] = useState<number>(0);
  const [selectedTopic, setSelectedTopic] = useState<number>(0);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [loading] = useState(false);



  // Reset topic khi field thay đổi
  useEffect(() => {
    if (selectedField && selectedTopic) {
      const topicExists = topicData.some(
        (topic) =>
          topic.id === selectedTopic && topic.fieldId === selectedField
      );
      if (!topicExists) {
        setSelectedTopic(0);
      }
    }
  }, [selectedField, selectedTopic, topicData]);

  // Filter questions dựa trên selection
  const filteredQuestions = useMemo(() => {
    return questionList
      .filter((question) => {
        const matchesField =
          !selectedField || question.fieldId === selectedField;
        const matchesTopic =
          !selectedTopic || question.topicId === selectedTopic;
        const matchesLevel =
          !selectedLevel || question.levelId === selectedLevel;

        return (
          matchesField &&
          matchesTopic &&
          matchesLevel &&
          question.status === 'APPROVED' &&
          question.questionTypeId === 1 // Chỉ lấy câu hỏi tham khảo
        );
      })
      .sort((a, b) => b.usefulVote - a.usefulVote); // Sort by usefulness
  }, [questionList, selectedField, selectedTopic, selectedLevel]);

  const handleFieldChange = (fieldId: number) => {
    setSelectedField(fieldId);
    if (fieldId !== selectedField) {
      setSelectedTopic(0); // Reset topic khi đổi field
    }
  };

  const handleVote = (questionId: number, vote: 'useful' | 'unuseful') => {
    // Trong thực tế sẽ call API để vote
    console.log(`Vote ${vote} for question ${questionId}`);
  };

  const handleQuestionClick = (questionId: number) => {
    // Navigate to question detail page with filtered questions
    navigate(`/interview-question-detail/${questionId}`, {
      state: { filteredQuestions }
    });
  };

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      const mappedFields = (res.content || []).map((item: { id: number, name?: string, description?: string }) => ({
        id: item.id,
        fieldName: item.name || item.description || 'Unknown Field',
        description: item.description || item.name || 'Unknown Field',
      }));
      setFieldData(mappedFields);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldData([]);
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
      setTopicData(mappedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicData([]);
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
      setLevelData(mappedLevels);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setLevelData([]);
    }
  };

  const getAllQuestions = async () => {
    try {
      const res = await questionService.getAllQuestions();
      let questions = res.content || [];
      questions = questions.filter((question: Question) => question?.status === 'APPROVED');
      console.log('All Questions:', questions);
      setQuestionList(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestionList([]);
    }
  }

  useEffect(() => {
    getAllFields();
    getAllTopics();
    getAllLevels();
    getAllQuestions();
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-center section-padding">
        {/* Filter Section */}
        <InterviewRevisionFilter
          selectedField={selectedField}
          onFieldChange={handleFieldChange}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
          questionsCount={filteredQuestions.length}
        />

        {/* Questions List - Chỉ hiển thị sau khi đã lọc */}
        {selectedField || selectedTopic || selectedLevel ? (
          <QuestionsList
            questions={filteredQuestions}
            fields={fieldData}
            topics={topicData}
            levels={levelData}
            loading={loading}
            onVote={handleVote}
            onQuestionClick={handleQuestionClick}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-500 text-lg mb-2">
              Chọn lĩnh vực, chủ đề hoặc cấp độ để xem câu hỏi ôn tập
            </div>
            <div className="text-neutral-400">
              Hệ thống sẽ hiển thị câu hỏi phỏng vấn tham khảo phù hợp với lựa
              chọn của bạn
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRevision;
