import React, { useState, useEffect } from 'react';
import { Drawer, Card, Tag, Typography, Tabs, Table, Spin } from 'antd';
import { Exam, Field, Level, Question, Topic } from '@abc-interview-support-frontend/types';
import { userService, examService } from '@abc-interview-support-frontend/services';

const { Text } = Typography;

interface BaseExamPreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Exam | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const BaseExamPreviewDrawer: React.FC<BaseExamPreviewDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
  levels,
}) => {

  const [questions, setQuestions] = useState<Question[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [userCache, setUserCache] = useState<Map<number, any>>(new Map());

  // Load user data and exam details when drawer opens
  useEffect(() => {
    const loadData = async () => {
      if (data && visible) {
        // Load user data
        setLoadingUser(true);
        try {
          const userResponse = await userService.getUserById(data.createdBy.toString());
          setUserData(userResponse);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoadingUser(false);
        }

        // Load exam details
        setLoadingExam(true);
        try {
          const examResponse = await examService.getExamById(data.id.toString());
          setExamDetails(examResponse);
        } catch (error) {
          console.error('Error loading exam details:', error);
        } finally {
          setLoadingExam(false);
        }

        // Load participant data
        setLoadingParticipants(true);
        try {
          const [resultsResponse, registrationsResponse] = await Promise.all([
            examService.getAllExamResults(data.id.toString()),
            examService.getRegistrationByExam(data.id.toString())
          ]);
          const results = resultsResponse.content || resultsResponse || [];
          const regs = registrationsResponse.content || registrationsResponse || [];

          setExamResults(results);
          setRegistrations(regs);

          // Load user data for all participants
          const userIds = [...new Set([...regs.map((r: any) => r.userId), ...results.map((r: any) => r.userId)])];
          const userPromises = userIds.map(userId => getUserData(userId));
          await Promise.all(userPromises);
        } catch (error) {
          console.error('Error loading participant data:', error);
        } finally {
          setLoadingParticipants(false);
        }

        // Mock questions data
        const mockQuestions: Question[] = Array.from(
          { length: data.questionCount },
          (_, i) => ({
            id: i + 1,
            userId: 1,
            topicId: 1,
            fieldId: 1,
            levelId: 1,
            questionTypeId: 1,
            status: 'APPROVED' as const,
            questionContent: `Câu hỏi ${i + 1}: ${[
              'React Hook useEffect được sử dụng để làm gì?',
              'RESTful API là gì?',
              'Docker container khác gì với Docker image?',
              'Algorithm nào có độ phức tạp O(n log n)?',
            ][i % 4]
              }`,
            questionAnswer: 'Đáp án mẫu',
            language: 'vi',
            similarityScore: 0,
            usefulVote: Math.floor(Math.random() * 20),
            unusefulVote: Math.floor(Math.random() * 5),
            createdAt: new Date().toISOString(),
            fieldName: 'Frontend',
            levelName: 'Junior',
            topicName: 'React',
            questionTypeName: 'Multiple Choice',
          })
        );
        setQuestions(mockQuestions);
      }
    };

    loadData();
  }, [data, visible]);

  const getFieldName = (fieldId: number) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'N/A';
  };

  const getUserData = async (userId: number) => {
    if (userCache.has(userId)) {
      return userCache.get(userId);
    }
    try {
      const userData = await userService.getUserById(userId.toString());
      setUserCache(prev => new Map(prev.set(userId, userData)));
      return userData;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'orange';
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'COMPLETED':
        return 'blue';
      default:
        return 'default';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

  const questionColumns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: string, record: Question, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionContent',
      key: 'questionContent',
      render: (content: string) => (
        <div
          style={{
            maxWidth: '400px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {content}
        </div>
      ),
    },
    {
      title: 'Lượt vote',
      key: 'votes',
      render: (record: Question) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
            +{record.usefulVote}
          </div>
          <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
            -{record.unusefulVote}
          </div>
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <Drawer
      title="Chi tiết bài kiểm tra cơ bản"
      width={900}
      open={visible}
      onClose={onClose}
      style={{ zIndex: 1000 }}
    >
      {data ? (
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Thông tin bài kiểm tra',
              children: (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {/* Creator Information */}
                  <Card title="Thông tin người tạo" size="small">
                    {loadingUser ? (
                      <Spin size="small" />
                    ) : userData ? (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div>
                          <Text strong>Họ tên:</Text> {userData.fullName || 'N/A'}
                        </div>
                        <div>
                          <Text strong>Email:</Text> {userData.email || 'N/A'}
                        </div>
                        <div>
                          <Text strong>Vai trò:</Text> {userData.roleName || 'N/A'}
                        </div>
                        <div>
                          <Text strong>Trạng thái:</Text> {userData.status || 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <Text type="secondary">Không thể tải thông tin người tạo</Text>
                    )}
                  </Card>

                  {/* Exam Information */}
                  <Card title="Thông tin bài kiểm tra" size="small">
                    {loadingExam ? (
                      <Spin size="small" />
                    ) : examDetails ? (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div>
                          <Text strong>ID:</Text> {examDetails.id}
                        </div>
                        <div>
                          <Text strong>Tiêu đề:</Text> {examDetails.title}
                        </div>
                        <div>
                          <Text strong>Vị trí:</Text> {examDetails.position || 'N/A'}
                        </div>
                        <div>
                          <Text strong>Lĩnh vực:</Text> {getFieldName(examDetails.fieldId)}
                        </div>
                        <div>
                          <Text strong>Chủ đề:</Text>{' '}
                          {examDetails.topicIds && examDetails.topicIds.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                              {examDetails.topicIds.map(topicId => (
                                <Tag key={topicId} color="blue">
                                  {getTopicName(topicId)}
                                </Tag>
                              ))}
                            </div>
                          ) : 'N/A'}
                        </div>
                        <div>
                          <Text strong>Cấp độ:</Text> {getLevelName(examDetails.levelId)}
                        </div>
                        <div>
                          <Text strong>Số câu hỏi:</Text> {examDetails.questionCount}
                        </div>
                        <div>
                          <Text strong>Thời gian:</Text> {formatDuration(examDetails.duration)}
                        </div>
                        <div>
                          <Text strong>Trạng thái:</Text>{' '}
                          <Tag color={getStatusColor(examDetails.status)}>
                            {examDetails.status}
                          </Tag>
                        </div>
                        <div>
                          <Text strong>Ngày tạo:</Text>{' '}
                          {examDetails.createdAt
                            ? new Date(examDetails.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                            : 'N/A'}
                        </div>
                      </div>
                    ) : (
                      <Text type="secondary">Không thể tải thông tin bài kiểm tra</Text>
                    )}
                  </Card>
                </div>
              ),
            },
            {
              key: '2',
              label: `Danh sách câu hỏi (${questions.length})`,
              children: (
                <Card title="Danh sách câu hỏi trong bài kiểm tra" size="small">
                  <Table
                    columns={questionColumns}
                    dataSource={questions}
                    rowKey="id"
                    pagination={{
                      total: questions.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} câu hỏi`,
                    }}
                    size="small"
                  />
                </Card>
              ),
            },
            {
              key: '3',
              label: `Danh sách người tham gia (${registrations.length})`,
              children: (
                <Card title="Danh sách người tham gia" size="small">
                  {loadingParticipants ? (
                    <Spin size="small" />
                  ) : registrations.length > 0 ? (
                    <Table
                      columns={[
                        {
                          title: 'STT',
                          key: 'index',
                          render: (_: string, record: any, index: number) => index + 1,
                          width: 60,
                        },
                        {
                          title: 'Họ tên',
                          key: 'fullName',
                          render: (record: any) => {
                            const userData = userCache.get(record.userId);
                            return userData?.fullName || 'N/A';
                          },
                        },
                        {
                          title: 'Email',
                          key: 'email',
                          render: (record: any) => {
                            const userData = userCache.get(record.userId);
                            return userData?.email || 'N/A';
                          },
                        },
                        {
                          title: 'Trạng thái đăng ký',
                          dataIndex: 'registrationStatus',
                          key: 'registrationStatus',
                          render: (status: string) => (
                            <Tag color={status === 'REGISTERED' ? 'green' : 'orange'}>
                              {status === 'REGISTERED' ? 'Đã đăng ký' : status}
                            </Tag>
                          ),
                        },
                        {
                          title: 'Ngày đăng ký',
                          dataIndex: 'registeredAt',
                          key: 'registeredAt',
                          render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
                        },
                        {
                          title: 'Điểm số',
                          key: 'score',
                          render: (record: any) => {
                            const result = examResults.find(r => r.userId === record.userId);
                            return result ? `${result.score}/100` : 'Chưa làm';
                          },
                        },
                        {
                          title: 'Kết quả',
                          key: 'passStatus',
                          render: (record: any) => {
                            const result = examResults.find(r => r.userId === record.userId);
                            if (!result) return 'Chưa làm';
                            return (
                              <Tag color={result.passStatus ? 'green' : 'red'}>
                                {result.passStatus ? 'Đạt' : 'Không đạt'}
                              </Tag>
                            );
                          },
                        },
                        {
                          title: 'Ngày hoàn thành',
                          key: 'completedAt',
                          render: (record: any) => {
                            const result = examResults.find(r => r.userId === record.userId);
                            return result?.completedAt ? new Date(result.completedAt).toLocaleDateString('vi-VN') : 'N/A';
                          },
                        },
                      ]}
                      dataSource={registrations}
                      rowKey="id"
                      pagination={{
                        total: registrations.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} của ${total} người tham gia`,
                      }}
                      size="small"
                    />
                  ) : (
                    <Text type="secondary">Chưa có ai đăng ký tham gia bài kiểm tra này</Text>
                  )}
                </Card>
              ),
            },
          ]}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">Không có dữ liệu bài kiểm tra</Text>
        </div>
      )}
    </Drawer>
  );
};

export default BaseExamPreviewDrawer;
