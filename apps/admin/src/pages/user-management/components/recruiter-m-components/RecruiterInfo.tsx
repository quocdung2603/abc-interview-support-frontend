import React from 'react';
import {
  Card,
  Avatar,
  Descriptions,
  Row,
  Col,
  Statistic,
  Space,
  Divider,
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

interface InfoProps {
  data: User;
}

const RecruiterInfo: React.FC<InfoProps> = ({ data }) => {
  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
        <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
        <br />
        Không có dữ liệu người dùng
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Personal Information Card */}
      <Card
        title={
          <Space>
            <UserOutlined />
            Thông tin cá nhân
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={24} align="middle">
          <Col>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#1890ff',
                fontSize: '36px'
              }}
            />
          </Col>
          <Col flex="auto">
            <div>
              <h2 style={{ margin: 0, marginBottom: 8, fontSize: '24px' }}>
                {data.fullName}
              </h2>
              <Space direction="vertical" size={4}>
                <Space>
                  <MailOutlined />
                  <span>{data.email}</span>
                </Space>
                <Space>
                  <StatusTag status={data.status} />
                </Space>
              </Space>
            </div>
          </Col>
        </Row>

        <Divider />

        <Descriptions column={2} size="small">
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
            span={1}
          >
            {data.address}
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
          <Descriptions.Item
            label={
              <Space>
                <UserOutlined />
                Trạng thái
              </Space>
            }
          >
            <StatusTag status={data.status} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* ELO Statistics Card */}
      <Card
        title={
          <Space>
            <TrophyOutlined />
            Thống kê ELO
          </Space>
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Điểm ELO"
              value={data.eloScore || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Xếp hạng"
              value={data.eloRank || 'Chưa có'}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default RecruiterInfo;
