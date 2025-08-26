import { Tag } from 'antd';

interface ScoreTagProps {
  score: number;
}

const ScoreTag: React.FC<ScoreTagProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  return <Tag color={getScoreColor(score)}>{score}/100</Tag>;
};

export default ScoreTag;
