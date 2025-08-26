import { Row, Col, Card, Statistic } from 'antd';
import { TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { StatisticsData } from './types';

interface StatisticsCardsProps {
  data: StatisticsData;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ data }) => {
  return (
    <Row gutter={16} style={{ marginBottom: '24px' }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng thí sinh"
            value={data.totalCandidates}
            prefix={<TrophyOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Đã qua"
            value={data.passedCandidates}
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Điểm trung bình"
            value={data.averageScore}
            suffix="/100"
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tỷ lệ đậu"
            value={data.passRate}
            suffix="%"
            valueStyle={{ color: data.passRate >= 60 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCards;
