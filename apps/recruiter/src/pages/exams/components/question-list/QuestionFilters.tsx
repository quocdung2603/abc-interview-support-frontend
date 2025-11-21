import React from 'react';
import { Card, Select, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';

const { Option } = Select;

interface QuestionFiltersProps {
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  selectedField?: number;
  selectedTopic?: number;
  selectedLevel?: number;
  selectedQuestionType?: number;
  searchText: string;
  onFieldChange: (value?: number) => void;
  onTopicChange: (value?: number) => void;
  onLevelChange: (value?: number) => void;
  onQuestionTypeChange: (value?: number) => void;
  onSearchChange: (value: string) => void;
}

const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  fields,
  topics,
  levels,
  questionTypes,
  selectedField,
  selectedTopic,
  selectedLevel,
  selectedQuestionType,
  searchText,
  onFieldChange,
  onTopicChange,
  onLevelChange,
  onQuestionTypeChange,
  onSearchChange,
}) => {
  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>
              Lĩnh vực
            </label>
            <Select
              placeholder="Chọn lĩnh vực"
              style={{ width: '100%' }}
              allowClear
              value={selectedField}
              onChange={onFieldChange}
            >
              {Array.isArray(fields) && fields.map((field) => (
                <Option key={field.id} value={field.id}>
                  {field.description}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>
              Chủ đề
            </label>
            <Select
              placeholder="Chọn chủ đề"
              style={{ width: '100%' }}
              allowClear
              value={selectedTopic}
              onChange={onTopicChange}
            >
              {Array.isArray(topics) && topics.map((topic) => (
                <Option key={topic.id} value={topic.id}>
                  {topic.description}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>
              Độ khó
            </label>
            <Select
              placeholder="Chọn độ khó"
              style={{ width: '100%' }}
              allowClear
              value={selectedLevel}
              onChange={onLevelChange}
            >
              {Array.isArray(levels) && levels.map((level) => (
                <Option key={level.id} value={level.id}>
                  {level.description}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>
              Loại câu hỏi
            </label>
            <Select
              placeholder="Chọn loại câu hỏi"
              style={{ width: '100%' }}
              allowClear
              value={selectedQuestionType}
              onChange={onQuestionTypeChange}
            >
              {Array.isArray(questionTypes) && questionTypes.map((questionType) => (
                <Option key={questionType.id} value={questionType.id}>
                  {questionType.description}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>
              Tìm kiếm
            </label>
            <Input
              placeholder="Tìm theo tên câu hỏi..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default QuestionFilters;