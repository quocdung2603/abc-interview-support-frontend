import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Tabs, Card, Descriptions, Spin, Alert, Tag } from 'antd';
import { LockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { userService } from '@abc-interview-support-frontend/services';
import { User, Post, Field, Topic, Level } from '@abc-interview-support-frontend/types';
import dayjs from 'dayjs';

interface CommunityPreviewDrawerProps {
  open: boolean;
  onClose: () => void;
  post: Post | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const CommunityPreviewDrawer: React.FC<CommunityPreviewDrawerProps> = ({
  open,
  onClose,
  post,
  fields,
  topics,
  levels,
}) => {
  const [activeTab, setActiveTab] = useState<'creator' | 'discussion'>('creator');
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!post?.userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await userService.getUserById(post.userId.toString());
      setUserData(response);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  }, [post?.userId]);

  useEffect(() => {
    if (open && post?.userId) {
      fetchUserData();
    }
  }, [open, post?.userId, fetchUserData]);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
  };

  const getFieldName = (fieldId: number | undefined) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'N/A';
  }

  const getTopicName = (topicId: number | undefined) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : 'N/A';
  }

  const getLevelName = (levelId: number | undefined) => {
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'N/A';
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
        return 'green';
      case 'pending':
        return 'orange';
      case 'locked':
        return 'red';
      default:
        return 'default';
    }
  };

  const getEloRankColor = (rank: string) => {
    switch (rank?.toLowerCase()) {
      case 'newbie':
        return 'gray';
      case 'learner':
        return 'blue';
      case 'intermediate':
        return 'orange';
      case 'advanced':
        return 'purple';
      case 'expert':
        return 'red';
      default:
        return 'default';
    }
  };

  const tabItems = [
    {
      key: 'creator',
      label: 'Thông tin người tạo',
      children: (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert message={error} type="error" showIcon />
          ) : userData ? (
            <Card>
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{userData.fullName}</h3>
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Tag color={getStatusColor(userData.status)}>
                        {userData.status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò">{userData.roleName}</Descriptions.Item>
                    <Descriptions.Item label="ELO Score">
                      <Tag color={getEloRankColor(userData.eloRank)}>
                        {userData.eloScore} ({userData.eloRank})
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">
                      {formatDate(userData.dateOfBirth)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Đang học">
                      <Tag color={userData.isStudying ? 'green' : 'red'}>
                        {userData.isStudying ? 'Có' : 'Không'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ" span={2}>
                      {userData.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {formatDate(userData.createdAt)}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            </Card>
          ) : (
            <Alert message="Không có dữ liệu người dùng" type="warning" showIcon />
          )}
        </div>
      ),
    },
    {
      key: 'discussion',
      label: 'Thông tin cuộc thảo luận',
      children: (
        <div className="space-y-4">
          {post ? (
            <Card>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="ID bài viết">
                  <Tag color="blue">#{post.id}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Lĩnh vực">
                  <Tag color="cyan"> {getFieldName(post.fieldId)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Chủ đề">
                  <Tag color="geekblue"> {getTopicName(post.topicId)}</Tag>
                </Descriptions.Item>
                {post.levelId && (
                  <Descriptions.Item label="Cấp độ">
                    <Tag color="purple"> {getLevelName(post.levelId)}</Tag>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Loại bài viết">
                  <Tag color={post.postType === 'DISCUSSION' ? 'green' : 'orange'}>
                    {post.postType === 'DISCUSSION' ? 'Thảo luận' : 'Câu hỏi'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={
                    post.status === 'PUBLISHED' ? 'green' :
                      post.status === 'DRAFT' ? 'orange' : 'red'
                  }>
                    {post.status === 'PUBLISHED' ? 'Đã xuất bản' :
                      post.status === 'DRAFT' ? 'Nháp' : 'Đã khóa'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tiêu đề">
                  <strong>{post.title}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian tạo">
                  <div className="flex items-center space-x-2">
                    <ClockCircleOutlined />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian cập nhật">
                  <div className="flex items-center space-x-2">
                    <ClockCircleOutlined />
                    <span>{formatDate(post.updatedAt)}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Nội dung">
                  <div className="bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                    {post.content}
                  </div>
                </Descriptions.Item>
                {post.lockTime && (
                  <Descriptions.Item label="Thời gian khóa">
                    <div className="flex items-center space-x-2">
                      <LockOutlined style={{ color: 'red' }} />
                      <span style={{ color: 'red' }}>{formatDate(post.lockTime)}</span>
                      <Tag color="red">Đã khóa</Tag>
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          ) : (
            <Alert message="Không có dữ liệu bài viết" type="warning" showIcon />
          )}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title="Xem chi tiết bài viết"
      placement="right"
      onClose={onClose}
      open={open}
      width={900}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'creator' | 'discussion')}
        items={tabItems}
      />
    </Drawer>
  );
};

export default CommunityPreviewDrawer;