import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Radio, Table, Tag, Tooltip } from 'antd';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { FileTextOutlined, DatabaseOutlined, DeleteOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { Question, Field, Topic, Level, QuestionType, Exam } from '@abc-interview-support-frontend/types';
import QuestionListDrawerForm from './QuestionListDrawerForm';

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

interface ExamConfigStepProps {
  control: Control<CreateFormFields>;
  errors: FieldErrors<CreateFormFields>;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  onQuestionsSelected?: (questions: Question[]) => void;
  setValue?: (name: keyof CreateFormFields, value: any) => void;
}

const ExamConfigStep: React.FC<ExamConfigStepProps> = ({
  control,
  errors,
  fields,
  topics,
  levels,
  questionTypes,
  onQuestionsSelected,
  setValue,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [questionSource, setQuestionSource] = useState<'upload' | 'existing'>('upload');
  const [questionListDrawerVisible, setQuestionListDrawerVisible] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  // Sync selectedQuestions with form value
  useEffect(() => {
    // This would need the form watch, but for now, we'll handle it differently
  }, []);

  const handleFileChange = (info: UploadChangeParam) => {
    let fileList = [...info.fileList];

    // Limit to 1 file
    fileList = fileList.slice(-1);

    // Check file type
    fileList = fileList.filter((file) => {
      const isCsv = file.type === 'text/csv' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name?.toLowerCase().endsWith('.csv');
      if (!isCsv) {
        message.error(`${file.name} không phải file CSV hợp lệ`);
        return false;
      }
      return true;
    });

    setFileList(fileList);
  };

  const handleSelectExistingQuestions = () => {
    setQuestionListDrawerVisible(true);
  };

  const handleQuestionsSelected = (selectedQuestion: Question) => {
    // Check if question is already selected
    const isAlreadySelected = selectedQuestions.some(q => q.id === selectedQuestion.id);

    if (isAlreadySelected) {
      message.warning('Câu hỏi này đã được chọn');
      return;
    }

    const newSelectedQuestions = [...selectedQuestions, selectedQuestion];
    setSelectedQuestions(newSelectedQuestions);

    // Update form value
    if (setValue) {
      setValue('selectedQuestions', newSelectedQuestions.map(q => q.id));
    }

    if (onQuestionsSelected) {
      onQuestionsSelected(newSelectedQuestions);
    }
  };

  const handleRemoveQuestion = (questionId: number) => {
    const newSelectedQuestions = selectedQuestions.filter(q => q.id !== questionId);
    setSelectedQuestions(newSelectedQuestions);

    // Update form value
    if (setValue) {
      setValue('selectedQuestions', newSelectedQuestions.map(q => q.id));
    }

    if (onQuestionsSelected) {
      onQuestionsSelected(newSelectedQuestions);
    }

    message.success('Đã xóa câu hỏi khỏi danh sách');
  };

  const uploadProps = {
    onChange: handleFileChange,
    multiple: false,
    fileList,
    beforeUpload: () => false, // Prevent auto upload
    accept: '.csv',
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-gray-700 mb-4">
          Nguồn câu hỏi
        </div>
        <Radio.Group
          value={questionSource}
          onChange={(e) => setQuestionSource(e.target.value)}
          className="mb-4"
        >
          <Radio value="upload">Tải lên file CSV</Radio>
          <Radio value="existing">Chọn câu hỏi có sẵn</Radio>
        </Radio.Group>

        {questionSource === 'upload' ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Controller
              name="questionBank"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  {...uploadProps}
                  onChange={(info) => {
                    handleFileChange(info);
                    onChange(info.fileList.length > 0 ? info.fileList[0].originFileObj : null);
                  }}
                  fileList={fileList}
                >
                  <div className="space-y-2">
                    <FileTextOutlined className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Kéo thả file CSV hoặc{' '}
                        <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
                          chọn file
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Chỉ chấp nhận file .csv
                      </p>
                    </div>
                  </div>
                </Upload>
              )}
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <div className="space-y-4">
              <DatabaseOutlined className="text-2xl text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Chọn từ ngân hàng câu hỏi có sẵn trong hệ thống
                </p>
                <Button
                  type="primary"
                  icon={<DatabaseOutlined />}
                  onClick={handleSelectExistingQuestions}
                  className="bg-green-600 hover:bg-green-700 border-green-600"
                >
                  Chọn câu hỏi có sẵn
                </Button>
              </div>
            </div>
          </div>
        )}

        {errors.questionBank && (
          <span className="text-red-500 text-sm mt-1 block">
            {typeof errors.questionBank.message === 'string'
              ? errors.questionBank.message
              : 'Lỗi không xác định'}
          </span>
        )}
      </div>

      <QuestionListDrawerForm
        visible={questionListDrawerVisible}
        onClose={() => setQuestionListDrawerVisible(false)}
        onConfirm={handleQuestionsSelected}
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
      />

      {selectedQuestions.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-700 mb-4">
            Danh sách câu hỏi đã chọn ({selectedQuestions.length})
          </div>
          <Table
            dataSource={selectedQuestions}
            rowKey="id"
            size="small"
            pagination={false}
            scroll={{ y: 300 }}
            columns={[
              {
                title: 'Câu hỏi',
                dataIndex: 'questionContent',
                key: 'questionContent',
                ellipsis: true,
                width: 200,
                render: (text: string, record: Question) => (
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      ID: {record.id}
                    </div>
                  </div>
                ),
              },
              {
                title: 'Lĩnh vực',
                key: 'field',
                width: 100,
                render: (_, record: Question) => (
                  <Tag color="blue">{record.fieldName}</Tag>
                ),
              },
              {
                title: 'Chủ đề',
                key: 'topic',
                width: 80,
                render: (_, record: Question) => (
                  <Tag color="green">{record.topicName}</Tag>
                ),
              },
              {
                title: 'Độ khó',
                key: 'level',
                width: 80,
                render: (_, record: Question) => (
                  <Tag color="orange">{record.levelName}</Tag>
                ),
              },
              {
                title: 'Thao tác',
                key: 'actions',
                width: 50,
                render: (_, record: Question) => (
                  <Tooltip title="Xóa câu hỏi">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleRemoveQuestion(record.id)}
                    />
                  </Tooltip>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default ExamConfigStep;