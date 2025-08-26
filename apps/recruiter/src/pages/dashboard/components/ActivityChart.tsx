import React from 'react';
import { Card, Select, Statistic, Row, Col } from 'antd';
import { MinusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';

const { Option } = Select;

type TrendType = 'up' | 'down' | 'stable';
type TimeRangeType = 'week' | 'month' | 'quarter';

interface ActivityData {
  date: string;
  jobPosts: number;
  candidates: number;
  exams: number;
}

interface ActivitySummary {
  jobPosts: { value: number; trend: TrendType; change: number };
  candidates: { value: number; trend: TrendType; change: number };
  exams: { value: number; trend: TrendType; change: number };
}

interface ActivityChartProps {
  data: ActivityData[];
  summary: ActivitySummary;
  timeRange: TimeRangeType;
  onTimeRangeChange: (range: TimeRangeType) => void;
}

const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  summary,
  timeRange,
  onTimeRangeChange,
}) => {
  const getTrendIcon = (trend: TrendType) => {
    switch (trend) {
      case 'up':
        return <UpOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <DownOutlined style={{ color: '#f5222d' }} />;
      default:
        return <MinusOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getTrendColor = (trend: TrendType) => {
    switch (trend) {
      case 'up':
        return '#52c41a';
      case 'down':
        return '#f5222d';
      default:
        return '#8c8c8c';
    }
  };

  const getTimeRangeText = (range: TimeRangeType) => {
    switch (range) {
      case 'week':
        return '7 ngày qua';
      case 'month':
        return '30 ngày qua';
      default:
        return '90 ngày qua';
    }
  };

  return (
    <Card
      title="Thống kê hoạt động"
      className="card-elevated"
      extra={
        <Select
          value={timeRange}
          onChange={onTimeRangeChange}
          style={{ width: 120 }}
        >
          <Option value="week">7 ngày</Option>
          <Option value="month">30 ngày</Option>
          <Option value="quarter">90 ngày</Option>
        </Select>
      }
    >
      <div style={{ marginBottom: '16px' }}>
        <span
          style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}
        >
          Dữ liệu trong {getTimeRangeText(timeRange)}
        </span>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #e6f7ff, #f0f8ff)',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Statistic
                title="Tin tuyển dụng"
                value={summary.jobPosts.value}
                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
              />
              <div style={{ textAlign: 'right' }}>
                {getTrendIcon(summary.jobPosts.trend)}
                <div
                  style={{
                    fontSize: '12px',
                    color: getTrendColor(summary.jobPosts.trend),
                    marginTop: '4px',
                  }}
                >
                  {summary.jobPosts.change > 0 ? '+' : ''}
                  {summary.jobPosts.change}%
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={8}>
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #f6ffed, #f0fff0)',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Statistic
                title="Ứng viên"
                value={summary.candidates.value}
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
              />
              <div style={{ textAlign: 'right' }}>
                {getTrendIcon(summary.candidates.trend)}
                <div
                  style={{
                    fontSize: '12px',
                    color: getTrendColor(summary.candidates.trend),
                    marginTop: '4px',
                  }}
                >
                  {summary.candidates.change > 0 ? '+' : ''}
                  {summary.candidates.change}%
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={8}>
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #f9f0ff, #faf5ff)',
              borderRadius: '8px',
              border: '1px solid #d9d9d9',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Statistic
                title="Kỳ thi"
                value={summary.exams.value}
                valueStyle={{ color: '#722ed1', fontSize: '20px' }}
              />
              <div style={{ textAlign: 'right' }}>
                {getTrendIcon(summary.exams.trend)}
                <div
                  style={{
                    fontSize: '12px',
                    color: getTrendColor(summary.exams.trend),
                    marginTop: '4px',
                  }}
                >
                  {summary.exams.change > 0 ? '+' : ''}
                  {summary.exams.change}%
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Simple data visualization */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '12px', fontWeight: 'bold' }}>
          Xu hướng gần đây
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            height: '60px',
            alignItems: 'end',
          }}
        >
          {data.slice(-7).map((item, index) => (
            <div
              key={item.date}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', gap: '2px', alignItems: 'end' }}>
                <div
                  style={{
                    width: '6px',
                    height: `${Math.max(item.jobPosts * 2, 4)}px`,
                    backgroundColor: '#1890ff',
                    borderRadius: '2px',
                  }}
                />
                <div
                  style={{
                    width: '6px',
                    height: `${Math.max(item.candidates * 1.5, 4)}px`,
                    backgroundColor: '#52c41a',
                    borderRadius: '2px',
                  }}
                />
                <div
                  style={{
                    width: '6px',
                    height: `${Math.max(item.exams * 3, 4)}px`,
                    backgroundColor: '#722ed1',
                    borderRadius: '2px',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {new Date(item.date).getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ActivityChart;
