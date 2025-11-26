import React, { useState, useEffect } from 'react';
import { Drawer, Card, Tag, Typography, Tabs, Table, Spin } from 'antd';
import { Exam, Field, Level, Topic } from '@abc-interview-support-frontend/types';
import { userService, examService } from '@abc-interview-support-frontend/services';

const { Text } = Typography;
const { TabPane } = Tabs;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Exam | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const MockExamPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
  levels,
}) => {
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load exam details and creator info when drawer opens
  useEffect(() => {
    const loadExamDetails = async () => {
      if (data && visible) {
        setLoading(true);
        try {
          // Load exam details
          const examRes = await examService.getExamById(data.id.toString());
          setExamDetails(examRes);

          // Load creator info
          const creatorRes = await userService.getUserById(data.createdBy.toString());
          setCreator(creatorRes);
        } catch (error) {
          console.error('Error loading exam details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadExamDetails();
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

  const questionColumns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: string, record: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionText',
      key: 'questionText',
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
      title: 'Lĩnh vực',
      dataIndex: 'fieldId',
      key: 'fieldId',
      render: (fieldId: number) => getFieldName(fieldId),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicId',
      key: 'topicId',
      render: (topicId: number) => getTopicName(topicId),
    },
    {
      title: 'Cấp độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId: number) => getLevelName(levelId),
    },
  ];

  return (
    <Drawer
      title="Chi tiết bài kiểm tra ảo"
      width={900}
      open={visible}
      onClose={onClose}
      style={{ zIndex: 1000 }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Đang tải...</div>
        </div>
      ) : examDetails ? (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin bài kiểm tra" key="1">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Creator Info */}
              <Card title="Thông tin người tạo" size="small">
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <Text strong>Tên:</Text> {creator?.fullName || 'N/A'}
                  </div>
                  <div>
                    <Text strong>Email:</Text> {creator?.email || 'N/A'}
                  </div>
                  <div>
                    <Text strong>Vai trò:</Text> {creator?.role || 'N/A'}
                  </div>
                </div>
              </Card>

              {/* Exam Info */}
              <Card title="Thông tin bài kiểm tra" size="small">
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <Text strong>Tiêu đề:</Text> {examDetails.title}
                  </div>
                  <div>
                    <Text strong>Vị trí:</Text> {examDetails.position}
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
                    <Text strong>Thời gian:</Text> {examDetails.duration} phút
                  </div>
                  <div>
                    <Text strong>Số câu hỏi:</Text> {examDetails.questionCount}
                  </div>
                  <div>
                    <Text strong>Trạng thái:</Text> {examDetails.status}
                  </div>
                  <div>
                    <Text strong>Ngày tạo:</Text> {new Date(examDetails.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </Card>
            </div>
          </TabPane>

          <TabPane tab={`Danh sách câu hỏi (${examDetails.questions?.length || 0})`} key="2">
            <Card title="Danh sách câu hỏi trong bài kiểm tra" size="small">
              <Table
                columns={questionColumns}
                dataSource={examDetails.questions || []}
                rowKey="id"
                pagination={{
                  total: examDetails.questions?.length || 0,
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} câu hỏi`,
                }}
                size="small"
              />
            </Card>
          </TabPane>

          <TabPane tab="Danh sách người tham gia" key="3">
            <Card title="Danh sách người tham gia" size="small">
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">Chức năng đang được phát triển</Text>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">Không có dữ liệu bài kiểm tra</Text>
        </div>
      )}
    </Drawer>
  );
};

export default MockExamPreviewDrawer;
