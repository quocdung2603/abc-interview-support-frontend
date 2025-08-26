import React from 'react';
import { Card, List, Tag, Button, Progress, Tooltip } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Exam } from './types';

interface RecentExamsProps {
  exams: Exam[];
  onViewExam: (examId: string) => void;
  onEditExam: (examId: string) => void;
}

const RecentExams: React.FC<RecentExamsProps> = ({
  exams,
  onViewExam,
  onEditExam,
}) => {
  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'published':
        return 'blue';
      case 'closed':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Exam['status']) => {
    switch (status) {
      case 'published':
        return 'Đã công bố';
      case 'closed':
        return 'Đã kết thúc';
      default:
        return 'Bản nháp';
    }
  };

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <Card
      title="Kỳ thi gần đây"
      className="card-elevated"
      extra={
        <Button type="link" onClick={() => console.log('View all exams')}>
          Xem tất cả
        </Button>
      }
    >
      <List
        dataSource={exams.slice(0, 5)}
        renderItem={(exam) => (
          <List.Item
            key={exam.id}
            actions={[
              <Tooltip title="Xem chi tiết" key="view">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onViewExam(exam.id)}
                />
              </Tooltip>,
              <Tooltip title="Chỉnh sửa" key="edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEditExam(exam.id)}
                />
              </Tooltip>,
            ]}
          >
            <List.Item.Meta
              title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {exam.title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <Tag color={getStatusColor(exam.status)}>
                      {getStatusText(exam.status)}
                    </Tag>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {exam.position}
                    </span>
                  </div>
                </div>
              }
              description={
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <TeamOutlined
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                      <span style={{ fontSize: '12px' }}>
                        {exam.candidates} thí sinh
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ClockCircleOutlined
                        style={{ color: 'var(--color-text-secondary)' }}
                      />
                      <span style={{ fontSize: '12px' }}>
                        {exam.duration} phút
                      </span>
                    </div>
                  </div>

                  {exam.status === 'published' && exam.candidates > 0 && (
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span style={{ fontSize: '12px' }}>
                          Tỷ lệ hoàn thành
                        </span>
                        <span style={{ fontSize: '12px' }}>
                          {getCompletionRate(
                            exam.completedCandidates,
                            exam.candidates
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={getCompletionRate(
                          exam.completedCandidates,
                          exam.candidates
                        )}
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentExams;
