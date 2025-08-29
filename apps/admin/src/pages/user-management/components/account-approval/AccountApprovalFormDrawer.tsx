import React, { useState } from 'react';
import {
  Drawer,
  Tabs,
  Form,
  Select,
  Input,
  Button,
  Space,
  message,
} from 'antd';
import {
  RecruiterVerification,
  CompanyDocument,
} from '@abc-interview-support-frontend/types';
import type { TabsProps } from 'antd';
import CompanyInfo from '../recruiter-m-components/CompanyInfo';

const { Option } = Select;
const { TextArea } = Input;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  verificationData: RecruiterVerification | null;
  documents: CompanyDocument[];
  onApprove: (
    data: RecruiterVerification,
    decision: 'Verified' | 'Rejected',
    rejectedReason?: string
  ) => void;
}

const AccountApprovalFormDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  verificationData,
  documents,
  onApprove,
}) => {
  const [form] = Form.useForm();
  const [decision, setDecision] = useState<'Verified' | 'Rejected'>('Verified');

  const TabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin doanh nghiệp',
      children: (
        <CompanyInfo
          verificationData={verificationData || undefined}
          documents={documents}
        />
      ),
    },
    {
      key: '2',
      label: 'Duyệt yêu cầu',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ decision: 'Verified' }}
          >
            <Form.Item
              label="Quyết định"
              name="decision"
              rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
            >
              <Select
                placeholder="Chọn quyết định"
                onChange={(value) => setDecision(value)}
              >
                <Option value="Verified">Duyệt - Xác minh thành công</Option>
                <Option value="Rejected">
                  Từ chối - Cần bổ sung thông tin
                </Option>
              </Select>
            </Form.Item>

            {decision === 'Rejected' && (
              <Form.Item
                label="Lý do từ chối"
                name="rejectedReason"
                rules={[
                  { required: true, message: 'Vui lòng nhập lý do từ chối' },
                  {
                    min: 10,
                    message: 'Lý do từ chối phải có ít nhất 10 ký tự',
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Vui lòng mô tả chi tiết lý do từ chối để nhà tuyển dụng có thể điều chỉnh..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            )}
          </Form>
        </div>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (verificationData) {
        onApprove(verificationData, values.decision, values.rejectedReason);
        message.success(
          values.decision === 'Verified'
            ? 'Đã duyệt yêu cầu xác minh thành công!'
            : 'Đã từ chối yêu cầu với lý do được cung cấp!'
        );
        form.resetFields();
        setDecision('Verified');
      }
    } catch (error) {
      console.error('Form validation error:', error);
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleClose = () => {
    form.resetFields();
    setDecision('Verified');
    onClose();
  };

  return (
    <Drawer
      title="Duyệt yêu cầu xác minh công ty"
      width={900}
      open={visible}
      onClose={handleClose}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button onClick={handleClose}>Đóng</Button>
          <Space>
            <Button
              danger
              onClick={() => {
                form.setFieldsValue({ decision: 'Rejected' });
                setDecision('Rejected');
              }}
            >
              Từ chối
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Xác nhận quyết định
            </Button>
          </Space>
        </div>
      }
    >
      {verificationData && <Tabs defaultActiveKey="1" items={TabMenu} />}
    </Drawer>
  );
};

export default AccountApprovalFormDrawer;
