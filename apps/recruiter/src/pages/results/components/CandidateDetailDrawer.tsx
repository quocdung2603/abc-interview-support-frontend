import React from 'react';
import {
  Drawer,
  Avatar,
  Progress,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Divider,
  Statistic,
  Descriptions,
  Badge,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { ResultsData } from './types';
import ScoreTag from './ScoreTag';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

interface CandidateDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  candidate: ResultsData | null;
}

const CandidateDetailDrawer: React.FC<CandidateDetailDrawerProps> = ({
  visible,
  onClose,
  candidate,
}) => {
  if (!candidate) return null;

  const getStatusIcon = (status: string) => {
    return status === 'passed' ? (
      <CheckCircleOutlined style={{ color: '#52c41a' }} />
    ) : (
      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'passed' ? 'success' : 'error';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <Drawer
      title={
        <Space>
          <IdcardOutlined />
          Chi tiết thí sinh
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={800}
      bodyStyle={{ padding: '24px' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Candidate Profile Card */}
        <Card>
          <Meta
            avatar={
              <Avatar
                size={80}
                style={{
                  backgroundColor: candidate.status === 'passed' ? '#52c41a' : '#1890ff',
                  fontSize: '32px',
                  fontWeight: 'bold'
                }}
                icon={<UserOutlined />}
              >
                {candidate.name.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  {candidate.name}
                </Title>
                <Badge
                  status={getStatusColor(candidate.status)}
                  text={
                    <Text strong style={{ color: candidate.status === 'passed' ? '#52c41a' : '#ff4d4f' }}>
                      {candidate.status === 'passed' ? 'Đã qua' : 'Chưa đạt'}
                    </Text>
                  }
                />
              </Space>
            }
            description={
              <Space direction="vertical" size="small">
                <Space>
                  <MailOutlined />
                  <Text>{candidate.email}</Text>
                </Space>
                <Space>
                  <PhoneOutlined />
                  <Text>{candidate.phone || 'Chưa cập nhật'}</Text>
                </Space>
                <Space>
                  <TrophyOutlined />
                  <Text>Xếp hạng: #{candidate.rank}</Text>
                </Space>
              </Space>
            }
          />
        </Card>

        {/* Exam Results Card */}
        <Card
          title={
            <Space>
              <BarChartOutlined />
              Kết quả thi
            </Space>
          }
          extra={
            <Tag color={candidate.status === 'passed' ? 'green' : 'red'}>
              {candidate.status === 'passed' ? 'ĐẠT' : 'CHƯA ĐẠT'}
            </Tag>
          }
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <Statistic
                title="Điểm số"
                value={candidate.score}
                suffix="/100"
                valueStyle={{ color: getScoreColor(candidate.score) }}
                prefix={<TrophyOutlined />}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Tỷ lệ chính xác"
                value={candidate.accuracy}
                suffix="%"
                valueStyle={{ color: getScoreColor(candidate.accuracy) }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Thời gian làm bài"
                value={candidate.duration}
                suffix="phút"
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic
                title="Số câu đúng"
                value={`${candidate.correctAnswers}/${candidate.totalQuestions}`}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
          </Row>

          <Divider />

          <Descriptions
            title="Thông tin bổ sung"
            column={1}
            size="small"
            items={[
              {
                key: 'exam',
                label: 'Kỳ thi',
                children: candidate.examTitle,
              },
              {
                key: 'submitted',
                label: 'Thời gian nộp bài',
                children: (
                  <Space>
                    <CalendarOutlined />
                    {new Date(candidate.submittedAt).toLocaleString('vi-VN')}
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        {/* Performance Breakdown Card */}
        {candidate.topicScores && candidate.topicScores.length > 0 && (
          <Card
            title={
              <Space>
                <BarChartOutlined />
                Phân tích theo chủ đề
              </Space>
            }
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {candidate.topicScores.map((topic, index) => (
                <div key={topic.name}>
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Text strong>{topic.name}</Text>
                    </Col>
                    <Col>
                      <Text
                        strong
                        style={{
                          color: topic.score >= 70 ? '#52c41a' :
                            topic.score >= 50 ? '#faad14' : '#ff4d4f'
                        }}
                      >
                        {topic.score}%
                      </Text>
                    </Col>
                  </Row>
                  <Progress
                    percent={topic.score}
                    size="small"
                    status={topic.score >= 70 ? 'success' :
                      topic.score >= 50 ? 'normal' : 'exception'}
                    strokeColor={topic.score >= 70 ? '#52c41a' :
                      topic.score >= 50 ? '#faad14' : '#ff4d4f'}
                  />
                  {index < candidate.topicScores!.length - 1 && <Divider style={{ margin: '12px 0' }} />}
                </div>
              ))}
            </Space>
          </Card>
        )}
      </Space>
    </Drawer>
  );
};

export default CandidateDetailDrawer;
