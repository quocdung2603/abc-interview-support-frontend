import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Tabs,
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
import { userService, questionService } from '@abc-interview-support-frontend/services';
import QuestionApprovalCompareDrawer from './QuestionApprovalCompareDrawer';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionApprovalFormDrawer: React.FC<FormDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (data?.userId) {
        try {
          const res = await userService.getUserById(data.userId.toString());
          setUserInfo(res.content || res);
        } catch (error) {
          console.error('Error fetching user info:', error);
          setUserInfo(null);
        }
      }
    };

    if (visible && data) {
      fetchUserInfo();
    }
  }, [visible, data]);
  const [compareDrawerVisible, setCompareDrawerVisible] = useState(false);

  const getFieldName = (fieldId: number) => {
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.name || 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    return level?.name || 'N/A';
  };

  const getQuestionTypeName = (questionTypeId: number) => {
    const questionType = questionTypes.find((qt) => qt.id === questionTypeId);
    return questionType?.name || 'N/A';
  };

  const handleDecisionChange = (value: 'approve' | 'reject') => {
    setDecision(value);
  };

  const handleSubmit = async () => {
    if (!data) return;

    try {
      if (decision === 'approve') {
        await questionService.approveQuestion(data.id);
        message.success('Đã duyệt câu hỏi thành công!');
        const eloUpdateData: any = {
          userId: data.userId,
          points: 50,
          action: 'QUESTION_APPROVED',
          description: 'Câu hỏi được duyệt thành công! Cảm ơn bạn đã đóng góp.',
        }
        await userService.updateElo(eloUpdateData);
        message.success('Đã cập nhật ELO cho người dùng!');
      } else if (decision === 'reject') {
        await questionService.rejectQuestion(data.id);
        message.success('Đã từ chối câu hỏi!');
      } else {
        message.error('Vui lòng chọn quyết định duyệt!');
        return;
      }

      onClose();
      setDecision(null);
    } catch (error) {
      console.error('Error submitting decision:', error);
      message.error('Có lỗi xảy ra khi xử lý quyết định!');
    }
  };

  const handleClose = () => {
    onClose();
    setDecision(null);
    setCompareDrawerVisible(false);
  };

  const TabMenu = [
    {
      key: '1',
      label: 'Thông tin người tạo',
      children: userInfo ? (
        <div style={{ padding: '16px 0' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={5}>Thông tin cá nhân</Title>
              <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                <div>
                  <Text strong>Họ tên:</Text> {userInfo.fullName}
                </div>
                <div>
                  <Text strong>Email:</Text> {userInfo.email}
                </div>
                <div>
                  <Text strong>Ngày sinh:</Text>{' '}
                  {new Date(userInfo.dateOfBirth).toLocaleDateString('vi-VN')}
                </div>
                <div>
                  <Text strong>Địa chỉ:</Text> {userInfo.address}
                </div>
                <div>
                  <Text strong>Vai trò:</Text> {userInfo.roleName}
                </div>
                <div>
                  <Text strong>Trạng thái:</Text> {userInfo.status}
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <Title level={5}>Thống kê</Title>
              <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
                <div>
                  <Text strong>ELO Score:</Text> {userInfo.eloScore}
                </div>
                <div>
                  <Text strong>ELO Rank:</Text> {userInfo.eloRank}
                </div>
                <div>
                  <Text strong>Đang học:</Text> {userInfo.isStudying ? 'Có' : 'Không'}
                </div>
              </div>
            </div>
          </Space>
        </div>
      ) : (
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <Text>Đang tải thông tin người tạo...</Text>
        </div>
      ),
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

            {data.questionAnswer && (
              <>
                <Divider />
                <div>
                  <Title level={5}>Đáp án</Title>
                  <div style={{ marginTop: '16px' }}>
                    <Paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
                      {data.questionAnswer}
                    </Paragraph>
                  </div>
                </div>
              </>
            )}

            <Divider />
            <div className='flex flex-row'>
              <div className='w-1/2'>
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
                    <Text strong>Loại câu hỏi:</Text>{' '}
                    <span style={{ color: '#722ed1' }}>
                      {getQuestionTypeName(data.questionTypeId)}
                    </span>
                  </div>
                  <div>
                    <Text strong>Ngôn ngữ:</Text>{' '}
                    <span style={{ color: '#eb2f96' }}>
                      {data.language || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <Divider type="vertical" style={{ height: '200px', margin: '0 24px' }} />
              <div className='w-1/2'>
                <Title level={5}>Thống kê</Title>
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
                    !decision
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
        mask={false}
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
