import { Button, Space, Typography } from 'antd';
import React from 'react';
import { ArrowLeftOutlined, ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Exam, QuestionInExam } from '@abc-interview-support-frontend/types';

interface ExamDetailHeaderProps {
  onBack?: () => void;
  exam: Exam;
  questions: QuestionInExam[];
}

const ExamDetailHeader: React.FC<ExamDetailHeaderProps> = ({ onBack, exam, questions }) => {
  return (
    <div className=" sticky flex items-center space-x-6">
      {onBack && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          title="Quay lại danh sách bài kiểm tra"
        >
          Quay lại
        </Button>
      )}
      <div>
        <Typography.Title level={4} className="mb-1 text-gray-800 !m-0">
          {exam.title}
        </Typography.Title>
        <Space size="small" className="text-sm text-gray-600">
          <span>{exam.position}</span>
          <span>•</span>
          <span><QuestionCircleOutlined /> {questions.length} câu hỏi</span>
          <span>•</span>
          <span><ClockCircleOutlined /> {exam.duration} phút</span>
        </Space>
      </div>
    </div>
  );
};

export default ExamDetailHeader;