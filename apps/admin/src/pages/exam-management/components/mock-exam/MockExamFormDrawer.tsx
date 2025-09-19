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
  Tabs,
  Typography,
  DatePicker,
  InputNumber,
  List,
  Avatar,
  Tag,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  Exam,
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import { QuestionListDrawer } from '../question-list';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Exam | null;
  onSubmit: (exam: Partial<Exam>) => void;
}

const MockExamFormDrawer: React.FC<FormDrawerProps> = ({
  visible,
  onClose,
  data,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questionListVisible, setQuestionListVisible] = useState(false);

  // Mock data for QuestionListDrawer
  const mockFields: Field[] = [
    { fieldId: '1', fieldName: 'Frontend' },
    { fieldId: '2', fieldName: 'Backend' },
    { fieldId: '3', fieldName: 'DevOps' },
  ];

  const mockTopics: Topic[] = [
    { topicId: '1', topicName: 'React', fieldId: '1' },
    { topicId: '2', topicName: 'JavaScript', fieldId: '1' },
    { topicId: '3', topicName: 'Node.js', fieldId: '2' },
    { topicId: '4', topicName: 'Docker', fieldId: '3' },
    { topicId: '5', topicName: 'Algorithms', fieldId: '1' },
  ];

  const mockLevels: Level[] = [
    { levelId: '1', levelName: 'Cơ bản' },
    { levelId: '2', levelName: 'Trung cấp' },
    { levelId: '3', levelName: 'Nâng cao' },
  ];

  const mockQuestionTypes: QuestionType[] = [
    { questionTypeId: '1', questionTypeName: 'Trắc nghiệm' },
    { questionTypeId: '2', questionTypeName: 'Tự luận' },
  ];

  // Reset/initialize form when data changes
  useEffect(() => {
    if (visible) {
      if (data) {
        // Editing existing exam
        form.setFieldsValue({
          title: data.title,
          examType: data.examType,
          position: data.position,
          duration: data.duration,
          language: data.language,
          topics: data.topics,
          questionTypes: data.questionTypes,
          startTime: data.startTime ? new Date(data.startTime) : null,
          endTime: data.endTime ? new Date(data.endTime) : null,
        });

        // Mock selected questions based on questionCount
        const mockQuestions: Question[] = Array.from(
          { length: data.questionCount },
          (_, i) => ({
            questionId: `q${i + 1}`,
            userId: '1',
            topicId: '1',
            fieldId: '1',
            levelId: '1',
            status: 'Approved',
            questionTitle: `Câu hỏi ${i + 1}: ${
              [
                'React Hook useEffect được sử dụng để làm gì?',
                'RESTful API là gì?',
                'Docker container khác gì với Docker image?',
                'Algorithm nào có độ phức tạp O(n log n)?',
              ][i % 4]
            }`,
            questionVariant: '1',
            similarityScore: 0,
            usefulVote: Math.floor(Math.random() * 20),
            unusefulVote: Math.floor(Math.random() * 5),
            createdAt: new Date(),
          })
        );
        setSelectedQuestions(mockQuestions);
      } else {
        // Creating new exam
        form.resetFields();
        setSelectedQuestions([]);
      }
    }
  }, [data, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const examData: Partial<Exam> = {
        ...values,
        questionCount: selectedQuestions.length,
        status: data?.status || 'Active',
        createdBy: data?.createdBy || 'Admin',
        createdAt: data?.createdAt || new Date(),
      };

      onSubmit(examData);
      message.success(
        data
          ? 'Cập nhật bài kiểm tra thành công!'
          : 'Tạo bài kiểm tra thành công!'
      );
      onClose();
    } catch (error) {
      console.error('Form validation error:', error);
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedQuestions([]);
    onClose();
  };

  const handleAddQuestion = (question: Question) => {
    if (selectedQuestions.some((sq) => sq.questionId === question.questionId)) {
      message.warning('Câu hỏi này đã được thêm vào bài kiểm tra!');
      return;
    }
    setSelectedQuestions((prev) => [...prev, question]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.questionId !== questionId)
    );
  };

  const FormTabMenu = [
    {
      key: '1',
      label: 'Thông tin cơ bản',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              title: data?.title,
              examType: data?.examType,
              position: data?.position,
              duration: data?.duration,
              language: data?.language || 'Vietnamese',
              topics: data?.topics,
              questionTypes: data?.questionTypes,
            }}
          >
            <Form.Item
              label="Tiêu đề bài kiểm tra"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tiêu đề bài kiểm tra',
                },
                { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
              ]}
            >
              <Input placeholder="Nhập tiêu đề bài kiểm tra..." />
            </Form.Item>

            <Form.Item
              label="Loại bài kiểm tra"
              name="examType"
              rules={[
                { required: true, message: 'Vui lòng chọn loại bài kiểm tra' },
              ]}
            >
              <Select placeholder="Chọn loại bài kiểm tra">
                <Option value="Virtual">Bài kiểm tra ảo</Option>
                <Option value="Recruiter">Bài kiểm tra nhà tuyển dụng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Vị trí ứng tuyển"
              name="position"
              rules={[
                { required: true, message: 'Vui lòng nhập vị trí ứng tuyển' },
              ]}
            >
              <Input placeholder="Ví dụ: Frontend Developer, Backend Developer..." />
            </Form.Item>

            <Form.Item
              label="Thời gian làm bài (phút)"
              name="duration"
              rules={[
                { required: true, message: 'Vui lòng nhập thời gian làm bài' },
                { type: 'number', min: 1, message: 'Thời gian phải lớn hơn 0' },
              ]}
            >
              <InputNumber
                min={1}
                max={300}
                placeholder="Nhập thời gian (phút)"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              label="Ngôn ngữ"
              name="language"
              rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ' }]}
            >
              <Select placeholder="Chọn ngôn ngữ">
                <Option value="Vietnamese">Tiếng Việt</Option>
                <Option value="English">Tiếng Anh</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Chủ đề chính" name="topics">
              <TextArea
                placeholder="Mô tả các chủ đề chính của bài kiểm tra..."
                rows={3}
              />
            </Form.Item>

            <Form.Item label="Loại câu hỏi" name="questionTypes">
              <TextArea
                placeholder="Mô tả các loại câu hỏi trong bài kiểm tra..."
                rows={2}
              />
            </Form.Item>

            <Form.Item label="Thời gian tổ chức">
              <RangePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: `Danh sách câu hỏi (${selectedQuestions.length})`,
      children: (
        <div style={{ padding: '16px 0' }}>
          <div
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              Câu hỏi đã chọn ({selectedQuestions.length})
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setQuestionListVisible(true)}
            >
              Thêm câu hỏi
            </Button>
          </div>

          {selectedQuestions.length > 0 ? (
            <List
              dataSource={selectedQuestions}
              renderItem={(question, index) => (
                <List.Item
                  actions={[
                    <Button
                      key="remove"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveQuestion(question.questionId)}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar>{index + 1}</Avatar>}
                    title={
                      <div>
                        <Text strong>{question.questionTitle}</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Tag color="blue">+{question.usefulVote}</Tag>
                          <Tag color="red">-{question.unusefulVote}</Tag>
                          <Tag color="green">{question.status}</Tag>
                        </div>
                      </div>
                    }
                    description={
                      <Text type="secondary">
                        ID: {question.questionId} | Tạo:{' '}
                        {question.createdAt.toLocaleDateString('vi-VN')}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Card style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">
                Chưa có câu hỏi nào được chọn. Nhấn "Thêm câu hỏi" để chọn từ
                ngân hàng câu hỏi.
              </Text>
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={data ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra mới'}
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
        mask={false}
        zIndex={1000}
      >
        <Tabs defaultActiveKey="1" items={FormTabMenu} />
      </Drawer>

      <QuestionListDrawer
        visible={questionListVisible}
        onClose={() => setQuestionListVisible(false)}
        onAddQuestion={handleAddQuestion}
        selectedQuestionIds={selectedQuestions.map((q) => q.questionId)}
        fields={mockFields}
        topics={mockTopics}
        levels={mockLevels}
        questionTypes={mockQuestionTypes}
      />
    </>
  );
};

export default MockExamFormDrawer;
