import React from 'react';
import { Card, Statistic, Progress } from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { StatsData } from './types';

interface StatsCardsProps {
  data: StatsData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const statsConfig = [
    {
      title: 'Tin tuyển dụng',
      value: data.totalJobs,
      icon: <FileTextOutlined />,
      color: '#1890ff',
      suffix: 'bài đăng',
      extra: `${data.activeJobs} đang hoạt động`,
    },
    {
      title: 'Ứng viên',
      value: data.totalCandidates,
      icon: <UserOutlined />,
      color: '#52c41a',
      suffix: 'người',
      extra: 'Tổng số ứng viên',
    },
    {
      title: 'Kỳ thi',
      value: data.totalExams,
      icon: <TrophyOutlined />,
      color: '#722ed1',
      suffix: 'kỳ thi',
      extra: `${data.activeExams} đang diễn ra`,
    },
    {
      title: 'Tỷ lệ hoàn thành',
      value:
        data.totalExams > 0
          ? Math.round((data.completedExams / data.totalExams) * 100)
          : 0,
      icon: <ClockCircleOutlined />,
      color: '#fa8c16',
      suffix: '%',
      extra: 'Tỷ lệ hoàn thành thi',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)',
      }}
    >
      {statsConfig.map((stat) => (
        <Card
          key={stat.title}
          className="card-elevated"
          style={{
            borderLeft: `4px solid ${stat.color}`,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color, fontSize: '24px' }}
              />
              <div
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                {stat.extra}
              </div>
            </div>
            <div
              style={{
                fontSize: '32px',
                color: stat.color,
                opacity: 0.8,
              }}
            >
              {stat.icon}
            </div>
          </div>

          {/* Progress bar cho stats có thể có progress */}
          {stat.title === 'Tin tuyển dụng' && (
            <Progress
              percent={
                data.totalJobs > 0
                  ? Math.round((data.activeJobs / data.totalJobs) * 100)
                  : 0
              }
              strokeColor={stat.color}
              showInfo={false}
              style={{ marginTop: '12px' }}
            />
          )}
          {stat.title === 'Kỳ thi' && (
            <Progress
              percent={
                data.totalExams > 0
                  ? Math.round((data.activeExams / data.totalExams) * 100)
                  : 0
              }
              strokeColor={stat.color}
              showInfo={false}
              style={{ marginTop: '12px' }}
            />
          )}
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
