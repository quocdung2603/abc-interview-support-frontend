import React from 'react';
import { Card, Descriptions, Tag } from 'antd';
import { UseFormWatch } from 'react-hook-form';
import { Exam } from '@abc-interview-support-frontend/types';

// Extended interface to include UI-specific fields
interface CreateFormFields extends Exam {
  totalQuestions: number;
  candidates: number;
  startTime: string;
  endTime: string;
  examPeriod?: [string, string];
  questionSource?: 'upload' | 'existing';
  questionBank?: File | null; // File upload for CSV
  selectedQuestions: number[]; // Add selected questions
}

interface ConfirmationStepProps {
  watch: UseFormWatch<CreateFormFields>;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ watch }) => {
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

  const getTopicLabels = (topicIds: number[]) => {
    const topicLabels: Record<number, string> = {
      1: 'JavaScript',
      2: 'React',
      3: 'Node.js',
      4: 'Database',
      5: 'Algorithms',
    };
    return topicIds?.map(id => topicLabels[id]).filter(Boolean) || [];
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
          <Descriptions.Item label="Chủ đề kiến thức">
            <div className="flex flex-wrap gap-1">
              {getTopicLabels(formData.topicIds).map((topic) => (
                <Tag key={topic} color="green">{topic}</Tag>
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
            <strong>{formData.totalQuestions || 0}</strong> câu
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Tóm tắt" className="shadow-sm bg-blue-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Kỳ thi "{formData.title}"
          </h3>
          <p className="text-blue-700">
            Sẽ được tạo với {formData.totalQuestions || 0} câu hỏi, thời gian {formData.duration} phút
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {getTopicLabels(formData.topicIds).map((topic) => (
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