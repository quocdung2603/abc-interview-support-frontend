import React, { useState, useEffect } from 'react';
import { Drawer, Tag, Tabs, Table, message, Modal, Button, Descriptions } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Exam, QuestionType, User } from '@abc-interview-support-frontend/types';
import { examService, userService } from '@abc-interview-support-frontend/services';

interface ExamFormPreviewProps {
  visible: boolean;
  onClose: () => void;
  exam: Exam | null;
  questionTypes: QuestionType[];
}

interface Registration {
  id: number;
  examId: number;
  userId: number;
  registrationStatus: string;
  registeredAt: string;
  userName?: string; // Thêm field để lưu tên user
}

const ExamFormPreview: React.FC<ExamFormPreviewProps> = ({
  visible,
  onClose,
  exam,
  questionTypes,
}) => {
  const [examDetail, setExamDetail] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchExamDetail = async () => {
      if (exam && visible) {
        setLoading(true);
        try {
          const response = await examService.getExamById(exam.id.toString());
          console.log('API Response:', response);
          console.log('Questions in response:', response.questions);
          setExamDetail(response);
        } catch (error) {
          console.error('Error fetching exam detail:', error);
          message.error('Không thể tải chi tiết bài kiểm tra');
          setExamDetail(null);
        } finally {
          setLoading(false);
        }
      } else if (!visible) {
        // Reset exam detail when drawer is closed
        setExamDetail(null);
      }
    };

    fetchExamDetail();
  }, [exam, visible]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (exam && visible) {
        setLoadingRegistrations(true);
        try {
          const response = await examService.getRegistrationByExam(exam.id.toString());
          console.log('Registrations API Response:', response);

          // Fetch user details for each registration
          const registrationsWithNames = await Promise.all(
            (response.content || []).map(async (registration: Registration) => {
              try {
                const userResponse = await userService.getUserById(registration.userId.toString());
                return {
                  ...registration,
                  userName: userResponse.fullName || `User ${registration.userId}`,
                };
              } catch (error) {
                console.error(`Error fetching user ${registration.userId}:`, error);
                return {
                  ...registration,
                  userName: `User ${registration.userId}`,
                };
              }
            })
          );

          setRegistrations(registrationsWithNames);
        } catch (error) {
          console.error('Error fetching registrations:', error);
          message.error('Không thể tải danh sách thí sinh');
          setRegistrations([]);
        } finally {
          setLoadingRegistrations(false);
        }
      } else if (!visible) {
        setRegistrations([]);
      }
    };

    fetchRegistrations();
  }, [exam, visible]);

  const handleViewUser = async (userId: number) => {
    try {
      const userResponse = await userService.getUserById(userId.toString());
      setSelectedUser(userResponse);
      setUserDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching user detail:', error);
      message.error('Không thể tải thông tin người dùng');
    }
  };

  const questionColumns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'questionText',
      key: 'questionText',
      render: (text: string) => (
        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'fieldId',
      key: 'fieldId',
      render: (fieldId: number) => {
        const fieldMap: Record<number, string> = {
          1: 'Frontend',
          2: 'Backend',
          3: 'DevOps',
          4: 'Mobile',
          5: 'Data Science',
        };
        return <Tag color="blue">{fieldMap[fieldId] || `Field ${fieldId}`}</Tag>;
      },
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicId',
      key: 'topicId',
      render: (topicId: number) => {
        const topicMap: Record<number, string> = {
          1: 'JavaScript',
          2: 'React',
          3: 'Node.js',
          4: 'Database',
          5: 'Algorithms',
        };
        return <Tag color="green">{topicMap[topicId] || `Topic ${topicId}`}</Tag>;
      },
    },
    {
      title: 'Mức độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId: number) => {
        const levelMap: Record<number, string> = {
          1: 'Beginner',
          2: 'Intermediate',
          3: 'Advanced',
        };
        return <Tag color="orange">{levelMap[levelId] || `Level ${levelId}`}</Tag>;
      },
    },
    {
      title: 'Loại',
      dataIndex: 'questionTypeId',
      key: 'questionTypeId',
      render: (questionTypeId: number) => {
        const questionType = questionTypes.find(qt => qt.id === questionTypeId);
        return questionType ? questionType.name : `Type ${questionTypeId}`;
      },
    },
  ];

  const candidateColumns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tên thí sinh',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái đăng ký',
      dataIndex: 'registrationStatus',
      key: 'registrationStatus',
      render: (status: string) => {
        const statusColors: Record<string, string> = {
          'REGISTERED': 'green',
          'CANCELLED': 'red',
          'COMPLETED': 'blue',
        };
        return <Tag color={statusColors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Thời gian đăng ký',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_:any, record: Registration) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewUser(record.userId)}
          className="text-blue-600 hover:text-blue-800"
        >
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'info',
      label: 'Thông tin bài kiểm tra',
      children: examDetail ? (
        <div className="exam-detail-content">
          <div className="detail-section">
            <h3>{examDetail.title}</h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              <div>
                <strong>Vị trí:</strong> {examDetail.position}
              </div>
              <div>
                <strong>Lĩnh vực:</strong>{' '}
                {(() => {
                  const fieldMap: Record<number, string> = {
                    1: 'Frontend',
                    2: 'Backend',
                    3: 'DevOps',
                    4: 'Mobile',
                    5: 'Data Science',
                  };
                  return <Tag color="purple">{fieldMap[examDetail.fieldId] || `Field ${examDetail.fieldId}`}</Tag>;
                })()}
              </div>
              <div>
                <strong>Mức độ:</strong>{' '}
                {(() => {
                  const levelMap: Record<number, string> = {
                    1: 'Beginner',
                    2: 'Intermediate',
                    3: 'Advanced',
                  };
                  return <Tag color="orange">{levelMap[examDetail.levelId] || `Level ${examDetail.levelId}`}</Tag>;
                })()}
              </div>
              <div>
                <strong>Thời lượng:</strong> {examDetail.duration} phút
              </div>
              <div>
                <strong>Số câu hỏi:</strong> {examDetail.questionCount}
              </div>
              <div>
                <strong>Chủ đề:</strong>{' '}
                {examDetail.topicIds && examDetail.topicIds.length > 0 ? (
                  <div>
                    {examDetail.topicIds.map((topicId) => {
                      const topicMap: Record<number, string> = {
                        1: 'JavaScript',
                        2: 'React',
                        3: 'Node.js',
                        4: 'Database',
                        5: 'Algorithms',
                      };
                      return (
                        <Tag key={topicId} color="blue">
                          {topicMap[topicId] || `Topic ${topicId}`}
                        </Tag>
                      );
                    })}
                  </div>
                ) : (
                  'Chưa có chủ đề'
                )}
              </div>
              <div>
                <strong>Loại câu hỏi:</strong>{' '}
                {examDetail.questionTypeIds && examDetail.questionTypeIds.length > 0 ? (
                  <div>
                    {examDetail.questionTypeIds.map((typeId) => {
                      const questionType = questionTypes.find(qt => qt.id === typeId);
                      return (
                        <Tag key={typeId} color="green">
                          {questionType ? questionType.name : `Type ${typeId}`}
                        </Tag>
                      );
                    })}
                  </div>
                ) : (
                  'Chưa có loại câu hỏi'
                )}
              </div>
              <div>
                <strong>Ngày tạo:</strong>{' '}
                {new Date(examDetail.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          {examDetail.status === 'PUBLISHED' && (
            <div
              className="stats-card"
              style={{ background: 'var(--color-success)', color: 'white', padding: '16px', borderRadius: '8px', marginTop: '16px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {examDetail.questions ? examDetail.questions.length : 0}
                  </div>
                  <div>Câu hỏi trong bài thi</div>
                </div>
                <EyeOutlined style={{ fontSize: '24px' }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>Không có dữ liệu</div>
      ),
    },
    {
      key: 'questions',
      label: 'Danh sách câu hỏi',
      children: (
        <div>
          <Table
            columns={questionColumns}
            dataSource={examDetail?.questions || []}
            rowKey={(record, index) => `${record.id}-${index}`}
            pagination={false}
            size="small"
            loading={loading}
          />
        </div>
      ),
    },
    {
      key: 'candidates',
      label: 'Danh sách thí sinh',
      children: (
        <div>
          <Table
            columns={candidateColumns}
            dataSource={registrations}
            rowKey="id"
            pagination={false}
            size="small"
            loading={loadingRegistrations}
          />
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title="Chi tiết kỳ thi"
      placement="right"
      onClose={onClose}
      open={visible}
      width={900}
    >
      {exam && <Tabs defaultActiveKey="info" items={tabItems} />}

      {/* User Detail Modal */}
      <Modal
        title="Chi tiết thí sinh"
        open={userDetailModalVisible}
        onCancel={() => setUserDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedUser && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ và tên">{selectedUser.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{selectedUser.address || 'Chưa cập nhật'}</Descriptions.Item>
            <Descriptions.Item label="Điểm Elo">{selectedUser.eloScore || 'Chưa cập nhật'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Drawer>
  );
};

export default ExamFormPreview;
