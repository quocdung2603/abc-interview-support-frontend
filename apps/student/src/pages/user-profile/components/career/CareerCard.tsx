import React from 'react';
import {
  CareerPreference,
  Field,
  Topic,
} from '@abc-interview-support-frontend/types';

import {
  CalendarOutlined
} from '@ant-design/icons';

interface CareerCardProps {
  career: CareerPreference;
  fields: Field[];
  topics: Topic[];
  onViewDetail: (career: CareerPreference) => void;
  onEdit: (career: CareerPreference) => void;
  onDelete: (careerId: number) => void;
}

const CareerCard: React.FC<CareerCardProps> = ({
  career,
  fields,
  topics,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const getFieldName = (fieldId: string | number | undefined) => {
    if (!fieldId) return 'N/A';
    // Convert to string for comparison since backend might return number
    const fieldIdStr = String(fieldId);
    return fields.find((f) => String(f.id) === fieldIdStr)?.name || 'N/A';
  };

  const getTopicName = (topicId?: string | number) => {
    if (!topicId) return 'Chưa chọn';
    // Convert to string for comparison since backend might return number
    const topicIdStr = String(topicId);
    return topics.find((t) => String(t.id) === topicIdStr)?.name || 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      <div className="mb-4 mt-2">
        <h4 className="text-lg font-semibold text-gray-800 mb-2 m-0">
          {getFieldName(career.fieldId)}
        </h4>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            📚 {getTopicName(career.topicId)}
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
        <CalendarOutlined className="text-green-500" />
        <span>
          Tạo ngày: {new Date(career.createdAt).toLocaleDateString('vi-VN')}
        </span>
      </div>

      <div className="w-full flex flex-row justify-between gap-1">
        <button
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex-1"
          onClick={() => onViewDetail(career)}
        >
          Xem
        </button>
        <button
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex-1"
          onClick={() => onEdit(career)}
        >
          Sửa
        </button>
        <button
          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex-1"
          onClick={() => onDelete(career.id)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CareerCard;
