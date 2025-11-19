import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Card,
  Radio,
  Checkbox,
  Tabs,
  Typography,
  Dropdown,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
  QuestionVariant,
} from '@abc-interview-support-frontend/types';
import type { TabsProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionBankFormDrawer: React.FC<FormDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [form] = Form.useForm();
  const [selectedField, setSelectedField] = useState<number | undefined>(
    data?.fieldId
  );
  const [newVariants, setNewVariants] = useState<QuestionVariant[]>([]);

  // Reset/initialize form when data changes
  useEffect(() => {
    if (visible) {
      if (data) {
        // Editing existing question
        form.setFieldsValue({
          fieldId: data.fieldId,
          topicId: data.topicId,
          levelId: data.levelId,
          questionTitle: data.questionContent,
          questionVariant: '', // API doesn't have this
        });
        setSelectedField(data.fieldId);
      } else {
        // Creating new question
        form.resetFields();
        setSelectedField('');
      }
      // Reset new variants when opening drawer
      setNewVariants([]);
    }
  }, [data, visible, form]);

  // Add new variant for a question type
  const addNewVariant = (questionTypeId: number) => {
    const questionType = questionTypes.find(
      (qt) => qt.id === questionTypeId
    );
    if (!questionType) return;

    // Check if this question type already has a variant (existing or new)
    const existingVariants = data ? getQuestionVariants(data) : [];
    const hasExistingVariant = existingVariants.some(
      (v) => v.questionTypeId === questionTypeId
    );
    const hasNewVariant = newVariants.some(
      (v) => v.questionTypeId === questionTypeId
    );

    if (hasExistingVariant || hasNewVariant) {
      message.warning(
        `Đã có biến thể cho loại câu hỏi ${questionType.questionTypeName}`
      );
      return;
    }

    // Generate new variant ID
    const allVariantIds = [
      ...(data?.questionVariant?.split(',') || []),
      ...newVariants.map((v) => v.questionVariantId),
    ];
    const maxId =
      allVariantIds.length > 0
        ? Math.max(...allVariantIds.map((id) => Number.parseInt(id)))
        : 0;
    const newVariantId = String(maxId + 1);

    // Create mock content based on question type
    const mockContents = [
      'React Hook useEffect được sử dụng để thực hiện side effects trong functional components.',
      'Trong JavaScript, phương thức push() được sử dụng để thêm phần tử vào cuối mảng.',
      'RESTful API là kiến trúc API dựa trên các nguyên tắc REST.',
      'Trong CSS, thuộc tính margin được sử dụng để tạo khoảng cách giữa các phần tử.',
      'Git command "git commit -m \'message\'" được sử dụng để tạo một commit mới.',
    ];

    const mockAnswers = [
      'Thực hiện side effects trong functional components',
      'push()',
      'Kiến trúc API dựa trên REST principles',
      'margin',
      'git commit -m "message"',
    ];

    const mockChoices = [
      'Thực hiện side effects trong functional components|Render JSX elements|Tạo state trong class components|Xử lý events',
      'push()|pop()|shift()|unshift()',
      'Kiến trúc API dựa trên REST principles|Kiến trúc API dựa trên SOAP|Kiến trúc API dựa trên GraphQL|Kiến trúc API dựa trên RPC',
      'margin|padding|border|width',
      'git commit -m "message"|git add .|git push origin main|git pull origin main',
    ];

    const newVariant: QuestionVariant = {
      questionVariantId: newVariantId,
      questionTypeId: String(questionTypeId),
      questionContent:
        mockContents[Number.parseInt(String(questionTypeId)) - 1] || mockContents[0],
      questionChoose:
        mockChoices[Number.parseInt(String(questionTypeId)) - 1] || mockChoices[0],
      questionAnswer:
        mockAnswers[Number.parseInt(String(questionTypeId)) - 1] || mockAnswers[0],
    };

    setNewVariants((prev) => [...prev, newVariant]);
    message.success(
      `Đã thêm biến thể mới cho ${questionType.questionTypeName}`
    );
  };

  const filteredTopics = topics.filter(
    (topic) => !selectedField || topic.fieldId === selectedField
  );

  // Generate QuestionVariant data from existing question
  const getQuestionVariants = (question: Question): QuestionVariant[] => {
    if (!question.questionVariant) return [];

    const variantIds = question.questionVariant.split(',');
    return variantIds.map((id, index) => {
      const mockContents = [
        'React Hook useEffect được sử dụng để thực hiện side effects trong functional components.',
        'Trong JavaScript, phương thức push() được sử dụng để thêm phần tử vào cuối mảng.',
        'RESTful API là kiến trúc API dựa trên các nguyên tắc REST.',
        'Trong CSS, thuộc tính margin được sử dụng để tạo khoảng cách giữa các phần tử.',
        'Git command "git commit -m \'message\'" được sử dụng để tạo một commit mới.',
      ];

      const mockAnswers = [
        'Thực hiện side effects trong functional components',
        'push()',
        'Kiến trúc API dựa trên REST principles',
        'margin',
        'git commit -m "message"',
      ];

      const mockChoices = [
        'Thực hiện side effects trong functional components|Render JSX elements|Tạo state trong class components|Xử lý events',
        'push()|pop()|shift()|unshift()',
        'Kiến trúc API dựa trên REST principles|Kiến trúc API dựa trên SOAP|Kiến trúc API dựa trên GraphQL|Kiến trúc API dựa trên RPC',
        'margin|padding|border|width',
        'git commit -m "message"|git add .|git push origin main|git pull origin main',
      ];

      return {
        questionVariantId: id.trim(),
        questionTypeId: String((Number.parseInt(id.trim()) % 5) + 1), // Cycle through question types
        questionContent: mockContents[index % mockContents.length],
        questionChoose: mockChoices[index % mockChoices.length],
        questionAnswer: mockAnswers[index % mockAnswers.length],
      };
    });
  };

  // Mock answers for different question types
  const mockSingleChoiceAnswers = [
    'Thực hiện side effects trong functional components',
    'Tạo state trong class components',
    'Render JSX elements',
    'Xử lý events',
  ];

  const mockMultipleChoiceAnswers = [
    'Thực hiện side effects trong functional components',
    'Tạo state trong functional components',
    'Render JSX elements',
    'Xử lý events',
  ];

  const handleFieldChange = (value: number) => {
    setSelectedField(value);
    form.setFieldsValue({ topicId: undefined }); // Reset topic when field changes
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);
      message.success(
        data ? 'Cập nhật câu hỏi thành công!' : 'Tạo câu hỏi thành công!'
      );
      onClose();
    } catch (error) {
      console.error('Form validation error:', error);
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedField(undefined);
    setNewVariants([]);
    onClose();
  };

  // Render question variant based on type
  const renderQuestionVariant = (
    variant: QuestionVariant,
    questionTitle: string
  ) => {
    const questionType = questionTypes.find(
      (qt) => qt.id === variant.questionTypeId
    );
    const typeName = questionType?.questionTypeName || 'Unknown';

    switch (typeName) {
      case 'SingleChoice':
        return (
          <Card
            title={`Câu hỏi dạng Trắc nghiệm 1 lựa chọn (Variant ${variant.questionVariantId})`}
            size="small"
          >
            <div style={{ marginBottom: '16px' }}>
              <Text strong>{questionTitle}</Text>
            </div>
            <div
              style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}
            >
              {variant.questionContent}
            </div>
            <Radio.Group disabled>
              <Space direction="vertical">
                {variant.questionChoose?.split('|').map((choice, index) => (
                  <Radio key={choice} value={index}>
                    {choice}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            <div
              style={{
                marginTop: '16px',
                padding: '8px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
              }}
            >
              <Text strong style={{ color: '#52c41a' }}>
                Đáp án đúng: {variant.questionAnswer}
              </Text>
            </div>
          </Card>
        );

      case 'MultipleChoice':
        return (
          <Card
            title={`Câu hỏi dạng Trắc nghiệm nhiều lựa chọn (Variant ${variant.questionVariantId})`}
            size="small"
          >
            <div style={{ marginBottom: '16px' }}>
              <Text strong>{questionTitle}</Text>
            </div>
            <div
              style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}
            >
              {variant.questionContent}
            </div>
            <Checkbox.Group disabled style={{ width: '100%' }}>
              <Space direction="vertical">
                {variant.questionChoose?.split('|').map((choice, index) => (
                  <Checkbox key={choice} value={index}>
                    {choice}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
            <div
              style={{
                marginTop: '16px',
                padding: '8px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
              }}
            >
              <Text strong style={{ color: '#52c41a' }}>
                Đáp án đúng: {variant.questionAnswer}
              </Text>
            </div>
          </Card>
        );

      case 'FillInTheBlank':
        return (
          <Card
            title={`Câu hỏi dạng Điền khuyết (Variant ${variant.questionVariantId})`}
            size="small"
          >
            <div style={{ marginBottom: '16px' }}>
              <Text strong>{questionTitle}</Text>
            </div>
            <div
              style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}
            >
              {variant.questionContent}
            </div>
            <Input placeholder="Nhập đáp án của bạn..." disabled />
            <div
              style={{
                marginTop: '16px',
                padding: '8px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
              }}
            >
              <Text strong style={{ color: '#52c41a' }}>
                Đáp án đúng: {variant.questionAnswer}
              </Text>
            </div>
          </Card>
        );

      case 'OpenEnded':
        return (
          <Card
            title={`Câu hỏi dạng Tự luận (Variant ${variant.questionVariantId})`}
            size="small"
          >
            <div style={{ marginBottom: '16px' }}>
              <Text strong>{questionTitle}</Text>
            </div>
            <div
              style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}
            >
              {variant.questionContent}
            </div>
            <TextArea
              rows={4}
              placeholder="Viết câu trả lời của bạn..."
              disabled
            />
            <div
              style={{
                marginTop: '16px',
                padding: '8px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
              }}
            >
              <Text strong style={{ color: '#52c41a' }}>
                Đáp án mẫu: {variant.questionAnswer}
              </Text>
            </div>
          </Card>
        );

      case 'Reference':
        return (
          <Card
            title={`Câu hỏi dạng Tham khảo (Variant ${variant.questionVariantId})`}
            size="small"
          >
            <div style={{ marginBottom: '16px' }}>
              <Text strong>{questionTitle}</Text>
            </div>
            <div
              style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}
            >
              {variant.questionContent}
            </div>
            <div
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
              }}
            >
              <Text type="secondary">
                Đây là câu hỏi tham khảo. Vui lòng tìm hiểu thêm về chủ đề này
                trong tài liệu chính thức.
              </Text>
            </div>
          </Card>
        );

      default:
        return (
          <Card
            title={`Câu hỏi (Variant ${variant.questionVariantId})`}
            size="small"
          >
            <Text>{variant.questionContent}</Text>
          </Card>
        );
    }
  };

  const FormTabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin cơ bản',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fieldId: data?.fieldId.toString(),
              topicId: data?.topicId.toString(),
              levelId: data?.levelId.toString(),
              questionTitle: data?.questionContent,
              questionVariant: '',
            }}
          >
            <Form.Item
              label="Lĩnh vực"
              name="fieldId"
              rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực' }]}
            >
              <Select placeholder="Chọn lĩnh vực" onChange={handleFieldChange}>
                {fields.map((field) => (
                  <Option key={field.id} value={field.id}>
                    {field.fieldName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Chủ đề"
              name="topicId"
              rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}
            >
              <Select placeholder="Chọn chủ đề" disabled={!selectedField}>
                {filteredTopics.map((topic) => (
                  <Option key={topic.id} value={topic.id}>
                    {topic.topicName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Mức độ"
              name="levelId"
              rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
            >
              <Select placeholder="Chọn mức độ">
                {levels.map((level) => (
                  <Option key={level.id} value={level.id}>
                    {level.levelName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Tiêu đề câu hỏi"
              name="questionTitle"
              rules={[
                { required: true, message: 'Vui lòng nhập tiêu đề câu hỏi' },
                { min: 5, message: 'Tiêu đề câu hỏi phải có ít nhất 5 ký tự' },
              ]}
            >
              <Input placeholder="Nhập tiêu đề câu hỏi..." />
            </Form.Item>

            <Form.Item
              label="Question Variants"
              name="questionVariant"
              rules={[
                { required: true, message: 'Vui lòng nhập question variants' },
              ]}
            >
              <Input placeholder="Ví dụ: 1,2,3 hoặc 1" />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Xem trước dạng câu hỏi',
      children: (
        <div style={{ padding: '16px 0' }}>
          {/* Add new variant button */}
          <div
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Dropdown
              menu={{
                items: questionTypes.map((qt) => ({
                  key: qt.id,
                  label: qt.questionTypeName,
                  onClick: () => addNewVariant(qt.id),
                })),
              }}
              trigger={['click']}
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Thêm biến thể mới
              </Button>
            </Dropdown>
          </div>

          {data ? (
            // Display existing question variants + new variants
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <Tabs type="card" size="small">
                {questionTypes
                  .map((questionType) => {
                    const existingVariants = getQuestionVariants(data).filter(
                      (variant) =>
                        variant.questionTypeId === questionType.id
                    );
                    const newVariantsOfType = newVariants.filter(
                      (variant) =>
                        variant.questionTypeId === questionType.id
                    );
                    const allVariantsOfType = [
                      ...existingVariants,
                      ...newVariantsOfType,
                    ];

                    if (allVariantsOfType.length === 0) return null;

                    return (
                      <Tabs.TabPane
                        key={questionType.id}
                        tab={`${questionType.questionTypeName} (${allVariantsOfType.length})`}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                          }}
                        >
                          {allVariantsOfType.map((variant) => (
                            <div key={variant.questionVariantId}>
                              {renderQuestionVariant(
                                variant,
                                data.questionContent
                              )}
                            </div>
                          ))}
                        </div>
                      </Tabs.TabPane>
                    );
                  })
                  .filter(Boolean)}
              </Tabs>
            </div>
          ) : (
            // Display mock preview for new question + new variants
            <Tabs type="card" size="small">
              {questionTypes.map((questionType) => {
                const newVariantsOfType = newVariants.filter(
                  (variant) =>
                    variant.questionTypeId === String(questionType.id)
                );

                if (newVariantsOfType.length === 0) {
                  // Show mock preview
                  return (
                    <Tabs.TabPane
                      key={questionType.id}
                      tab={questionType.questionTypeName}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                        }}
                      >
                        {(() => {
                          const questionTitle =
                            form.getFieldValue('questionTitle') ||
                            'Tiêu đề câu hỏi sẽ hiển thị ở đây...';

                          switch (questionType.questionTypeName) {
                            case 'SingleChoice':
                              return (
                                <Card
                                  title="Câu hỏi dạng Trắc nghiệm 1 lựa chọn"
                                  size="small"
                                >
                                  <div style={{ marginBottom: '16px' }}>
                                    <strong>{questionTitle}</strong>
                                  </div>
                                  <Radio.Group disabled>
                                    <Space direction="vertical">
                                      {mockSingleChoiceAnswers.map((answer) => (
                                        <Radio key={answer} value={answer}>
                                          {answer}
                                        </Radio>
                                      ))}
                                    </Space>
                                  </Radio.Group>
                                  <div
                                    style={{
                                      marginTop: '16px',
                                      padding: '8px',
                                      backgroundColor: '#f6ffed',
                                      border: '1px solid #b7eb8f',
                                    }}
                                  >
                                    <Text strong style={{ color: '#52c41a' }}>
                                      Đáp án mẫu: {mockSingleChoiceAnswers[0]}
                                    </Text>
                                  </div>
                                </Card>
                              );

                            case 'MultipleChoice':
                              return (
                                <Card
                                  title="Câu hỏi dạng Trắc nghiệm nhiều lựa chọn"
                                  size="small"
                                >
                                  <div style={{ marginBottom: '16px' }}>
                                    <strong>{questionTitle}</strong>
                                  </div>
                                  <Checkbox.Group
                                    disabled
                                    style={{ width: '100%' }}
                                  >
                                    <Space direction="vertical">
                                      {mockMultipleChoiceAnswers.map(
                                        (answer) => (
                                          <Checkbox key={answer} value={answer}>
                                            {answer}
                                          </Checkbox>
                                        )
                                      )}
                                    </Space>
                                  </Checkbox.Group>
                                  <div
                                    style={{
                                      marginTop: '16px',
                                      padding: '8px',
                                      backgroundColor: '#f6ffed',
                                      border: '1px solid #b7eb8f',
                                    }}
                                  >
                                    <Text strong style={{ color: '#52c41a' }}>
                                      Đáp án mẫu:{' '}
                                      {mockMultipleChoiceAnswers
                                        .slice(0, 2)
                                        .join(', ')}
                                    </Text>
                                  </div>
                                </Card>
                              );

                            case 'FillInTheBlank':
                              return (
                                <Card
                                  title="Câu hỏi dạng Điền khuyết"
                                  size="small"
                                >
                                  <div style={{ marginBottom: '16px' }}>
                                    <strong>{questionTitle}</strong>
                                  </div>
                                  <Input
                                    placeholder="Nhập đáp án của bạn..."
                                    disabled
                                  />
                                  <div
                                    style={{
                                      marginTop: '16px',
                                      padding: '8px',
                                      backgroundColor: '#f6ffed',
                                      border: '1px solid #b7eb8f',
                                    }}
                                  >
                                    <Text strong style={{ color: '#52c41a' }}>
                                      Đáp án mẫu: push()
                                    </Text>
                                  </div>
                                </Card>
                              );

                            case 'OpenEnded':
                              return (
                                <Card title="Câu hỏi dạng Tự luận" size="small">
                                  <div style={{ marginBottom: '16px' }}>
                                    <strong>{questionTitle}</strong>
                                  </div>
                                  <TextArea
                                    rows={4}
                                    placeholder="Viết câu trả lời của bạn..."
                                    disabled
                                  />
                                  <div
                                    style={{
                                      marginTop: '16px',
                                      padding: '8px',
                                      backgroundColor: '#f6ffed',
                                      border: '1px solid #b7eb8f',
                                    }}
                                  >
                                    <Text strong style={{ color: '#52c41a' }}>
                                      Đáp án mẫu: useEffect được sử dụng để thực
                                      hiện side effects trong functional
                                      components như gọi API, cập nhật DOM, hoặc
                                      thiết lập subscriptions.
                                    </Text>
                                  </div>
                                </Card>
                              );

                            case 'Reference':
                              return (
                                <Card
                                  title="Câu hỏi dạng Tham khảo"
                                  size="small"
                                >
                                  <div style={{ marginBottom: '16px' }}>
                                    <strong>{questionTitle}</strong>
                                  </div>
                                  <div
                                    style={{
                                      padding: '16px',
                                      backgroundColor: '#f5f5f5',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    <span style={{ color: '#666' }}>
                                      Đây là câu hỏi tham khảo. Vui lòng tìm
                                      hiểu thêm về chủ đề này trong tài liệu
                                      chính thức.
                                    </span>
                                  </div>
                                </Card>
                              );

                            default:
                              return (
                                <Card
                                  title={`Câu hỏi dạng ${questionType.questionTypeName}`}
                                  size="small"
                                >
                                  <div style={{ marginBottom: '16px' }}>
                                    <strong>{questionTitle}</strong>
                                  </div>
                                  <Text type="secondary">
                                    Preview cho dạng câu hỏi này chưa được hỗ
                                    trợ.
                                  </Text>
                                </Card>
                              );
                          }
                        })()}
                      </div>
                    </Tabs.TabPane>
                  );
                } else {
                  // Show new variants
                  return (
                    <Tabs.TabPane
                      key={questionType.questionTypeId}
                      tab={`${questionType.questionTypeName} (${newVariantsOfType.length})`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                        }}
                      >
                        {newVariantsOfType.map((variant) => (
                          <div key={variant.questionVariantId}>
                            {renderQuestionVariant(
                              variant,
                              form.getFieldValue('questionTitle') ||
                                'Tiêu đề câu hỏi sẽ hiển thị ở đây...'
                            )}
                          </div>
                        ))}
                      </div>
                    </Tabs.TabPane>
                  );
                }
              })}
            </Tabs>
          )}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={data ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
      width={900}
      open={visible}
      onClose={handleClose}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button onClick={handleClose}>Hủy</Button>
          <Space>
            <Button type="primary" onClick={handleSubmit}>
              {data ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        </div>
      }
    >
      <Tabs defaultActiveKey="1" items={FormTabMenu} />
    </Drawer>
  );
};

export default QuestionBankFormDrawer;
