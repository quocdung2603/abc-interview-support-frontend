import React, { useState, useEffect } from 'react';
import { Drawer, Card, Tag, Typography, Spin, message, Tabs, Descriptions } from 'antd';
import { RecruitmentNews, Field, User } from '@abc-interview-support-frontend/types';
import { newsService, userService } from '@abc-interview-support-frontend/services';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  newsId: number | null;
  fields: Field[];
}

const RecruitmentNewsPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  newsId,
  fields,
}) => {
  const [newsData, setNewsData] = useState<RecruitmentNews | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && newsId) {
      fetchNewsDetail(newsId);
    } else {
      setNewsData(null);
      setUserData(null);
    }
  }, [visible, newsId]);

  const fetchNewsDetail = async (id: number) => {
    try {
      setLoading(true);
      const response = await newsService.getNewById(id);
      setNewsData(response);

      // Fetch user data
      if (response.userId) {
        try {
          const userResponse = await userService.getUserById(response.userId.toString());
          setUserData(userResponse.content || userResponse);
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching news detail:', error);
      message.error('Không thể tải chi tiết tin tức');
      setNewsData(null);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
  };

  const getFieldName = (fieldId?: number) => {
    if (!fieldId) return 'N/A';
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  const getRoleName = (roleId?: string | number) => {
    const id = String(roleId);
    switch (id) {
      case '1':
        return 'Admin';
      case '2':
        return 'Recruiter';
      case '3':
        return 'User';
      default:
        return `Unknown (${id})`;
    }
  }

  const TabMenu: TabsProps['items'] = newsData ? [
    {
      key: '1',
      label: 'Thông tin người tạo',
      children: loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : userData ? (
        <Descriptions column={2}>
          <Descriptions.Item label="ID">{userData.id}</Descriptions.Item>
          <Descriptions.Item label="Họ tên">{userData.fullName || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{getRoleName(userData.roleId)}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{userData.status || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="ELO Rank">{userData.eloRank || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Điểm ELO">{userData.eloScore || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Không có dữ liệu người dùng</Text>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Thông tin chung',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Metadata */}
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <Text strong>ID tin tức:</Text> {newsData.id}
            </div>
            {newsData.examId && (
              <div>
                <Text strong>ID bài thi:</Text> {newsData.examId}
              </div>
            )}
            {newsData.companyName && (
              <div>
                <Text strong>Tên công ty:</Text> {newsData.companyName}
              </div>
            )}
            {newsData.location && (
              <div>
                <Text strong>Địa điểm:</Text>{' '}
                <Tag color="orange">{newsData.location}</Tag>
              </div>
            )}
            {newsData.salary && (
              <div>
                <Text strong>Mức lương:</Text> {newsData.salary}
              </div>
            )}
            {newsData.experience && (
              <div>
                <Text strong>Kinh nghiệm:</Text> {newsData.experience}
              </div>
            )}
            {newsData.position && (
              <div>
                <Text strong>Vị trí:</Text> {newsData.position}
              </div>
            )}
            {newsData.workingHours && (
              <div>
                <Text strong>Giờ làm việc:</Text> {newsData.workingHours}
              </div>
            )}
            {newsData.deadline && (
              <div>
                <Text strong>Hạn nộp hồ sơ:</Text> {newsData.deadline}
              </div>
            )}
            {newsData.applicationMethod && (
              <div>
                <Text strong>Cách thức ứng tuyển:</Text> {newsData.applicationMethod}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Chi tiết bài viết',
      children: (
        <div className="space-y-5">
          {/* Header */}
          <div>
            <Title level={3} style={{ marginBottom: '8px' }}>
              {newsData.title}
            </Title>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Tag color="blue">{getFieldName(newsData.fieldId)}</Tag>
              {newsData.location && <Tag color="orange">{newsData.location}</Tag>}
              <Tag color="purple">Tuyển dụng</Tag>
            </div>
          </div>
          {(newsData.usefulVote !== undefined || newsData.interestVote !== undefined) && (
            <div>
              <Text strong>Đánh giá:</Text>{' '}
              {newsData.usefulVote !== undefined && `Hữu ích: ${newsData.usefulVote}`}
              {newsData.usefulVote !== undefined && newsData.interestVote !== undefined && ' | '}
              {newsData.interestVote !== undefined && `Thú vị: ${newsData.interestVote}`}
            </div>
          )}
          <Card title="Nội dung bài viết" size="small">
            <Paragraph
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
              }}
            >
              {newsData.content}
            </Paragraph>
          </Card>
        </div>
      ),
    },
  ] : [];

  return (
    <Drawer
      title="Chi tiết tin tức tuyển dụng"
      width={800}
      open={visible}
      onClose={onClose}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : newsData ? (
        <Tabs defaultActiveKey="1" items={TabMenu} />
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Không có dữ liệu để hiển thị</Text>
        </div>
      )}
    </Drawer>
  );
};

export default RecruitmentNewsPreviewDrawer;
