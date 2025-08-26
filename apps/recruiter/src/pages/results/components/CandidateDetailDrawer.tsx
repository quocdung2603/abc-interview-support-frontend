import { Drawer, Avatar, Progress } from 'antd';
import { ResultsData } from './types';
import ScoreTag from './ScoreTag';

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

  return (
    <Drawer
      title="Chi tiết thí sinh"
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
    >
      <div className="candidate-detail-content">
        <div className="candidate-header">
          <Avatar size={64} style={{ backgroundColor: 'var(--color-primary)' }}>
            {candidate.name.charAt(0)}
          </Avatar>
          <div style={{ marginLeft: '16px' }}>
            <h3>{candidate.name}</h3>
            <p>{candidate.email}</p>
            <p>{candidate.phone}</p>
          </div>
        </div>

        <div className="exam-results" style={{ marginTop: '24px' }}>
          <h4>Kết quả thi</h4>
          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            <div>
              <strong>Điểm số:</strong> <ScoreTag score={candidate.score} />
            </div>
            <div>
              <strong>Thời gian làm bài:</strong> {candidate.duration} phút
            </div>
            <div>
              <strong>Số câu đúng:</strong> {candidate.correctAnswers}/
              {candidate.totalQuestions}
            </div>
            <div>
              <strong>Tỷ lệ chính xác:</strong> {candidate.accuracy}%
            </div>
            <div>
              <strong>Thời gian nộp bài:</strong>{' '}
              {new Date(candidate.submittedAt).toLocaleString('vi-VN')}
            </div>
          </div>
        </div>

        <div className="performance-breakdown" style={{ marginTop: '24px' }}>
          <h4>Phân tích kết quả</h4>
          <div className="topic-scores">
            {candidate.topicScores?.map((topic) => (
              <div key={topic.name} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <span>{topic.name}</span>
                  <span>{topic.score}%</span>
                </div>
                <Progress percent={topic.score} size="small" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default CandidateDetailDrawer;
