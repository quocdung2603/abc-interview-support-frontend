import React from 'react';
import { Drawer, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

interface ExamFormPreviewProps {
  visible: boolean;
  onClose: () => void;
  exam: any;
}

const ExamFormPreview: React.FC<ExamFormPreviewProps> = ({
  visible,
  onClose,
  exam,
}) => (
  <Drawer
    title="Chi tiết kỳ thi"
    placement="right"
    onClose={onClose}
    open={visible}
    width={900}
  >
    {exam && (
      <div className="exam-detail-content">
        <div className="detail-section">
          <h3>{exam.title}</h3>
          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            <div>
              <strong>Vị trí:</strong> {exam.position}
            </div>
            <div>
              <strong>Thời lượng:</strong> {exam.duration} phút
            </div>
            <div>
              <strong>Số câu hỏi:</strong> {exam.totalQuestions}
            </div>
            <div>
              <strong>Chủ đề:</strong>{' '}
              {exam.topics.map((topic: string) => (
                <Tag key={topic}>{topic}</Tag>
              ))}
            </div>
            <div>
              <strong>Cửa sổ thi:</strong>{' '}
              {new Date(exam.startTime).toLocaleDateString('vi-VN')} -{' '}
              {new Date(exam.endTime).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {exam.status === 'published' && (
          <div
            className="stats-card"
            style={{ background: 'var(--color-success)', color: 'white' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>156</div>
                <div>Thí sinh đã tham gia</div>
              </div>
              <EyeOutlined style={{ fontSize: '24px' }} />
            </div>
          </div>
        )}
      </div>
    )}
  </Drawer>
);

export default ExamFormPreview;
