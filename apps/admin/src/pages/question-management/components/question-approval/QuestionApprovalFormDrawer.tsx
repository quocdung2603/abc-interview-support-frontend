import React, { useState } from 'react';
import {
  Drawer,
  Tabs,
  Input,
  Select,
  Button,
  Typography,
  Divider,
  Space,
  message,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import QuestionApprovalCompareDrawer from './QuestionApprovalCompareDrawer';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  onApprove: (questionId: number, rejectReason?: string) => void;
  onReject: (questionId: number, rejectReason: string) => void;
}

const QuestionApprovalFormDrawer: React.FC<FormDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
  levels,
  questionTypes,
  onApprove,
  onReject,
}) => {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [compareDrawerVisible, setCompareDrawerVisible] = useState(false);

  const getFieldName = (fieldId: number) => {
    const field = fields.find((f) => f.id === fieldId);
    return field?.fieldName || 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.topicName || 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    return level?.levelName || 'N/A';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const handleDecisionChange = (value: 'approve' | 'reject') => {
    setDecision(value);
    if (value === 'approve') {
      setRejectReason('');
    }
  };

  const handleSubmit = () => {
    if (!data) return;

    if (decision === 'approve') {
      onApprove(data.id);
      message.success('Đã duyệt câu hỏi thành công!');
    } else if (decision === 'reject') {
      if (!rejectReason.trim()) {
        message.error('Vui lòng nhập lý do từ chối!');
        return;
      }
      onReject(data.id, rejectReason);
      message.success('Đã từ chối câu hỏi!');
    } else {
      message.error('Vui lòng chọn quyết định duyệt!');
      return;
    }

    onClose();
    setDecision(null);
    setRejectReason('');
  };

  const handleClose = () => {
    onClose();
    setDecision(null);
    setRejectReason('');
    setCompareDrawerVisible(false);
  };

  const TabMenu = [
    {
      key: '1',
      label: 'Thông tin người gửi',
      children: data ? (
        <div style={{ padding: '16px 0' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5}>Thông tin cơ bản</Title>
              <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                <div>
                  <Text strong>ID Người dùng:</Text> {data.userId}
                </div>
                <div>
                  <Text strong>Ngày gửi:</Text>{' '}
                  {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <Title level={5}>Thống kê đóng góp</Title>
              <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                <div>
                  <Text strong>Lượt vote hữu ích:</Text> {data.usefulVote}
                </div>
                <div>
                  <Text strong>Lượt vote không hữu ích:</Text>{' '}
                  {data.unusefulVote}
                </div>
                <div>
                  <Text strong>Điểm tương đồng:</Text>{' '}
                  {data.similarityScore
                    ? `${data.similarityScore.toFixed(1)}%`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </Space>
        </div>
      ) : null,
    },
    {
      key: '2',
      label: 'Thông tin câu hỏi',
      children: data ? (
        <div style={{ padding: '16px 0' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5}>Nội dung câu hỏi</Title>
              <div style={{ marginTop: '16px' }}>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  {data.questionContent}
                </Paragraph>
              </div>
            </div>

            <Divider />

            <div>
              <Title level={5}>Thông tin phân loại</Title>
              <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                <div>
                  <Text strong>Lĩnh vực:</Text>{' '}
                  <span style={{ color: '#1890ff' }}>
                    {getFieldName(data.fieldId)}
                  </span>
                </div>
                <div>
                  <Text strong>Chủ đề:</Text>{' '}
                  <span style={{ color: '#52c41a' }}>
                    {getTopicName(data.topicId)}
                  </span>
                </div>
                <div>
                  <Text strong>Mức độ:</Text>{' '}
                  <span style={{ color: '#faad14' }}>
                    {getLevelName(data.levelId)}
                  </span>
                </div>
                <div>
                  <Text strong>Trạng thái:</Text>{' '}
                  <span style={{ color: '#722ed1' }}>
                    {getStatusText(data.status)}
                  </span>
                </div>
              </div>
            </div>

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                onClick={() => setCompareDrawerVisible(true)}
                style={{ minWidth: '200px' }}
              >
                Kiểm tra câu hỏi trùng khớp
              </Button>
            </div>
          </Space>
        </div>
      ) : null,
    },
    {
      key: '3',
      label: 'Xác nhận kiểm duyệt',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5}>Quyết định kiểm duyệt</Title>
              <div style={{ marginTop: '16px' }}>
                <Select
                  placeholder="Chọn quyết định"
                  style={{ width: '100%' }}
                  value={decision}
                  onChange={handleDecisionChange}
                >
                  <Option value="approve">
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      Duyệt câu hỏi
                    </Space>
                  </Option>
                  <Option value="reject">
                    <Space>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      Từ chối câu hỏi
                    </Space>
                  </Option>
                </Select>
              </div>
            </div>

            {decision === 'reject' && (
              <div>
                <Title level={5}>Lý do từ chối</Title>
                <TextArea
                  rows={4}
                  placeholder="Vui lòng nhập lý do từ chối câu hỏi..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{ marginTop: '16px' }}
                />
              </div>
            )}

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <Space>
                <Button size="large" onClick={handleClose}>
                  Hủy
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  disabled={
                    !decision || (decision === 'reject' && !rejectReason.trim())
                  }
                >
                  Xác nhận
                </Button>
              </Space>
            </div>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title="Kiểm duyệt câu hỏi"
        width={850}
        open={visible}
        onClose={handleClose}
        footer={null}
        zIndex={1000}
      >
        {data && <Tabs defaultActiveKey="1" items={TabMenu} />}
      </Drawer>

      <QuestionApprovalCompareDrawer
        visible={compareDrawerVisible}
        onClose={() => setCompareDrawerVisible(false)}
        currentQuestion={data}
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
      />
    </>
  );
};

export default QuestionApprovalFormDrawer;
