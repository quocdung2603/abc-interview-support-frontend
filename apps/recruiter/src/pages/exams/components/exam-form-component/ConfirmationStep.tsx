import React from 'react';
import { Card, Descriptions, Tag } from 'antd';
import { UseFormWatch } from 'react-hook-form';
import { Exam, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';

// Extended interface to include UI-specific fields
interface CreateFormFields extends Exam {
  totalQuestions: number;
  candidates: number;
  startTime: string;
  endTime: string;
  examPeriod?: [string, string];
  questionSource?: 'upload' | 'existing';
  questionBank?: any; // File upload for CSV
  selectedQuestions: number[]; // Add selected questions
  // Override to use correct field names
  topics?: number[];
  questionTypes?: number[];
}

interface ConfirmationStepProps {
  watch: UseFormWatch<CreateFormFields>;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ watch, fields, topics, levels, questionTypes }) => {
  const formData = watch();

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      frontend: 'Frontend Developer',
      backend: 'Backend Developer',
      fullstack: 'Fullstack Developer',
      mobile: 'Mobile Developer',
      devops: 'DevOps Engineer',
    };
    return labels[position] || position;
  };

  const getFieldName = (fieldId: number) => {
    if (!fieldId || fieldId === 0) return 'Chưa chọn';
    const field = fields.find(f => f.id === fieldId);
    return field?.name || `Field ${fieldId}`;
  };

  const getLevelName = (levelId: number) => {
    if (!levelId || levelId === 0) return 'Chưa chọn';
    const level = levels.find(l => l.id === levelId);
    return level?.name || `Level ${levelId}`;
  };

  const getTopicNames = (topicIds: number[]) => {
    if (!topicIds || topicIds.length === 0) return ['Chưa chọn'];
    return topicIds.map(id => {
      const topic = topics.find(t => t.id === id);
      return topic?.name || `Topic ${id}`;
    }).filter(Boolean);
  };

  const getQuestionTypeNames = (questionTypeIds: number[]) => {
    if (!questionTypeIds || questionTypeIds.length === 0) return ['Chưa chọn'];
    return questionTypeIds.map(id => {
      const type = questionTypes.find(t => t.id === id);
      return type?.name || `Type ${id}`;
    }).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      <Card title="Thông tin cơ bản" className="shadow-sm">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Tên kỳ thi">
            <strong>{formData.title || 'Chưa nhập'}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Vị trí tuyển dụng">
            <Tag color="blue">{getPositionLabel(formData.position)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Lĩnh vực">
            <Tag color="purple">{getFieldName(formData.fieldId)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trình độ">
            <Tag color="orange">{getLevelName(formData.levelId)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Chủ đề kiến thức">
            <div className="flex flex-wrap gap-1">
              {getTopicNames(formData.topicIds).map((topic) => (
                <Tag key={topic} color="green">{topic}</Tag>
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Loại câu hỏi">
            <div className="flex flex-wrap gap-1">
              {getQuestionTypeNames(formData.questionTypeIds).map((type) => (
                <Tag key={type} color="cyan">{type}</Tag>
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian thi">
            {formData.duration} phút
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Cấu hình bài thi" className="shadow-sm">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Nguồn câu hỏi">
            <Tag color={formData.questionSource === 'upload' ? 'blue' : 'green'}>
              {formData.questionSource === 'upload' ? 'Tải lên file CSV' : 'Chọn câu hỏi có sẵn'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="File CSV ngân hàng câu hỏi">
            {formData.questionBank ? (
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                {formData.questionBank.name}
              </div>
            ) : (
              <span className="text-gray-500">
                {formData.questionSource === 'existing' ? 'Sẽ chọn từ ngân hàng có sẵn' : 'Chưa tải lên'}
              </span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng câu hỏi">
            <strong>{formData.selectedQuestions?.length || 0}</strong> câu
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Tóm tắt" className="shadow-sm bg-blue-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Kỳ thi "{formData.title}"
          </h3>
          <p className="text-blue-700">
            Sẽ được tạo với {formData.selectedQuestions?.length || 0} câu hỏi, thời gian {formData.duration} phút
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {getTopicNames(formData.topicIds).map((topic) => (
              <Tag key={topic} color="blue">{topic}</Tag>
            ))}
          </div>
        </div>
      </Card>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Lưu ý quan trọng:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Vui lòng kiểm tra lại thông tin trước khi tạo kỳ thi</li>
          <li>• Sau khi tạo, bạn không thể chỉnh sửa một số thông tin cơ bản</li>
          <li>• Đảm bảo file CSV ngân hàng câu hỏi có định dạng đúng</li>
        </ul>
      </div>
    </div>
  );
};

export default ConfirmationStep;