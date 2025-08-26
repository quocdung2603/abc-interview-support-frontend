import { Table, Button, Tag, Progress } from 'antd';
import {
  EyeOutlined,
  TrophyOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { ResultsData } from './types';
import ScoreTag from './ScoreTag';

interface ResultsTableProps {
  data: ResultsData[];
  onViewCandidate: (candidate: ResultsData) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  data,
  onViewCandidate,
}) => {
  const columns = [
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => (
        <div style={{ textAlign: 'center' }}>
          {rank === 1 && (
            <TrophyOutlined style={{ color: '#faad14', fontSize: '16px' }} />
          )}
          {rank === 2 && (
            <StarOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
          )}
          {rank === 3 && (
            <CheckCircleOutlined
              style={{ color: '#1890ff', fontSize: '16px' }}
            />
          )}
          {rank > 3 && <span style={{ fontWeight: 'bold' }}>#{rank}</span>}
        </div>
      ),
    },
    {
      title: 'Thí sinh',
      key: 'candidate',
      render: (record: ResultsData) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {record.name}
          </div>
          <div
            style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
          >
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Kỳ thi',
      dataIndex: 'examTitle',
      key: 'examTitle',
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: ResultsData, b: ResultsData) => a.score - b.score,
      render: (score: number) => <ScoreTag score={score} />,
    },
    {
      title: 'Độ chính xác',
      key: 'accuracy',
      render: (record: ResultsData) => (
        <div>
          <div>
            {record.correctAnswers}/{record.totalQuestions}
          </div>
          <Progress percent={record.accuracy} size="small" />
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} phút`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'passed' ? 'green' : 'red'}>
          {status === 'passed' ? 'Đã qua' : 'Chưa đạt'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: ResultsData) => (
        <Button icon={<EyeOutlined />} onClick={() => onViewCandidate(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        total: data.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} thí sinh`,
      }}
    />
  );
};

export default ResultsTable;
