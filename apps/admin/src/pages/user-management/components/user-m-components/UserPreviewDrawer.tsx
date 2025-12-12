import React from 'react';
import {
  Drawer,
  Card,
  Avatar,
  Descriptions,
  Statistic,
  Row,
  Col,
  Divider,
  Tag,
  Space,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { User } from '@abc-interview-support-frontend/types';
import StatusTag from './StatusTag';
interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: User | null;
}

const UserPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
}) => {
  if (!data) return null;

  return (
    <Drawer
      title={
        <Space>
          <UserOutlined />
          Chi tiết người dùng
        </Space>
      }
      width={800}
      open={visible}
      onClose={onClose}
      destroyOnClose
    >
      <div style={{ padding: '16px 0' }}>
        {/* User Header Card */}
        <Card style={{ marginBottom: 16 }}>
          <Row align="middle" gutter={16}>
            <Col>
              <Avatar
                size={64}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#1890ff',
                  fontSize: '32px'
                }}
              />
            </Col>
            <Col flex="auto">
              <div>
                <h2 style={{ margin: 0, marginBottom: 4, fontSize: '20px' }}>
                  {data.fullName}
                </h2>
                <Space>
                  <StatusTag status={data.status} type="status-account" />
                  <StatusTag status={data.eloRank} type="elo-rank" />
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Basic Information */}
        <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
          <Descriptions column={2} size="small">
            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined />
                  Email
                </Space>
              }
            >
              {data.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <CalendarOutlined />
                  Ngày sinh
                </Space>
              }
            >
              {new Date(data.dateOfBirth).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <EnvironmentOutlined />
                  Địa chỉ
                </Space>
              }
              span={2}
            >
              {data.address}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined />
                  Tình trạng học tập
                </Space>
              }
            >
              <StatusTag
                status={data.isStudying ? 'false' : 'true'}
                type="is-studying"
              />
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <ClockCircleOutlined />
                  Ngày tạo tài khoản
                </Space>
              }
            >
              {new Date(data.createdAt).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* ELO Statistics */}
        <Card title="Thống kê ELO" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Điểm ELO"
                value={data.eloScore}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Xếp hạng"
                value={data.eloRank}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Account Status */}
        <Card title="Trạng thái tài khoản">
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <strong>Trạng thái:</strong>
                <div style={{ marginTop: 8 }}>
                  <StatusTag status={data.status} type="status-account" />
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <strong>Bậc xếp hạng:</strong>
                <div style={{ marginTop: 8 }}>
                  <StatusTag status={data.eloRank} type="elo-rank" />
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </Drawer>
  );
};

export default UserPreviewDrawer;
