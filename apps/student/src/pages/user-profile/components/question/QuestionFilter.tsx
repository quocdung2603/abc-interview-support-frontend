import React, { useState } from 'react';
import { Card, Select, Input, Button, Space } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';

const { Option } = Select;

interface QuestionFilterProps {
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  onFilterChange: (filters: QuestionFilters) => void;
}

export interface QuestionFilters {
  fieldId?: number;
  topicId?: number;
  levelId?: number;
  questionTypeId?: number;
  language?: string;
  questionContent?: string;
}

const QuestionFilter: React.FC<QuestionFilterProps> = ({
  fields,
  topics,
  levels,
  questionTypes,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<QuestionFilters>({});

  const handleFilterChange = (key: keyof QuestionFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const languageOptions = [
    { value: 'VIETNAMESE', label: 'Tiếng Việt' },
    { value: 'ENGLISH', label: 'Tiếng Anh' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Lĩnh vực
          </label>
          <Select
            placeholder="Chọn lĩnh vực"
            allowClear
            size="small"
            className="w-full"
            value={filters.fieldId}
            onChange={(value) => handleFilterChange('fieldId', value)}
          >
            {fields.map((field) => (
              <Option key={field.id} value={field.id}>
                {field.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Chủ đề
          </label>
          <Select
            placeholder="Chọn chủ đề"
            allowClear
            size="small"
            className="w-full"
            value={filters.topicId}
            onChange={(value) => handleFilterChange('topicId', value)}
          >
            {topics.map((topic) => (
              <Option key={topic.id} value={topic.id}>
                {topic.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Cấp độ
          </label>
          <Select
            placeholder="Chọn cấp độ"
            allowClear
            size="small"
            className="w-full"
            value={filters.levelId}
            onChange={(value) => handleFilterChange('levelId', value)}
          >
            {levels.map((level) => (
              <Option key={level.id} value={level.id}>
                {level.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Loại câu hỏi
          </label>
          <Select
            placeholder="Chọn loại"
            allowClear
            size="small"
            className="w-full"
            value={filters.questionTypeId}
            onChange={(value) => handleFilterChange('questionTypeId', value)}
          >
            {questionTypes.map((type) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Ngôn ngữ
          </label>
          <Select
            placeholder="Chọn ngôn ngữ"
            allowClear
            size="small"
            className="w-full"
            value={filters.language}
            onChange={(value) => handleFilterChange('language', value)}
          >
            {languageOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Nội dung câu hỏi
          </label>
          <Input
            placeholder="Tìm kiếm..."
            size="small"
            value={filters.questionContent}
            onChange={(e) => handleFilterChange('questionContent', e.target.value)}
            allowClear
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
        <Button
          type="link"
          size="small"
          icon={<ClearOutlined />}
          onClick={handleClearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default QuestionFilter;