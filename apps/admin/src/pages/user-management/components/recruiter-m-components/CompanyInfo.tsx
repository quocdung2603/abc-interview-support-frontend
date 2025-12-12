import React from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  List,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
  Timeline,
} from 'antd';
import {
  DownloadOutlined,
  FileTextOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import {
  RecruiterVerification,
  CompanyDocument,
} from '@abc-interview-support-frontend/types';

const { Text } = Typography;

interface CompanyInfoProps {
  verificationData?: RecruiterVerification;
  documents?: CompanyDocument[];
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({
  verificationData,
  documents = [],
}) => {
  // Mock data for demonstration
  const mockVerificationData: RecruiterVerification = {
    recruiterVerificationId: 1,
    userId: 1,
    companyName: 'Công ty TNHH Công nghệ ABC Việt Nam',
    taxCode: '0312345678',
    companyAddress: 'Số 123 Đường Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM',
    companyPhone: '+84 28 1234 5678',
    companyEmail: 'recruitment@abc-tech.vn',
    companyLicense: '1,2,3,4',
    verificationStatus: 'Pending',
    rejectReason: '',
    createdAt: new Date('2024-12-01T09:00:00.000Z'),
    verifiedAt: undefined,
  };

  const mockDocuments: CompanyDocument[] = [
    {
      id: 1,
      documentName: 'Giấy chứng nhận đăng ký kinh doanh',
      documentFilePath: '/documents/business_registration.pdf',
      createdAt: new Date('2024-12-01T09:00:00.000Z'),
    },
    {
      id: 2,
      documentName: 'Giấy chứng nhận mã số thuế',
      documentFilePath: '/documents/tax_code_certificate.pdf',
      createdAt: new Date('2024-12-01T09:15:00.000Z'),
    },
    {
      id: 3,
      documentName: 'Giấy phép hoạt động',
      documentFilePath: '/documents/operation_license.pdf',
      createdAt: new Date('2024-12-01T09:30:00.000Z'),
    },
    {
      id: 4,
      documentName: 'Chứng chỉ ISO 9001:2015',
      documentFilePath: '/documents/iso_certificate.pdf',
      createdAt: new Date('2024-12-01T09:45:00.000Z'),
    },
  ];

  // Use mock data if no real data provided
  const displayVerificationData = verificationData || mockVerificationData;
  const displayDocuments = documents.length > 0 ? documents : mockDocuments;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Verified':
        return {
          color: 'success',
          text: 'Đã xác minh',
          icon: <CheckCircleOutlined />,
          bgColor: '#f6ffed',
          borderColor: '#b7eb8f'
        };
      case 'Pending':
        return {
          color: 'processing',
          text: 'Đang chờ duyệt',
          icon: <ClockCircleOutlined />,
          bgColor: '#fffbe6',
          borderColor: '#ffe58f'
        };
      case 'Rejected':
        return {
          color: 'error',
          text: 'Đã từ chối',
          icon: <CloseCircleOutlined />,
          bgColor: '#fff2f0',
          borderColor: '#ffccc7'
        };
      default:
        return {
          color: 'default',
          text: status,
          icon: <ClockCircleOutlined />,
          bgColor: '#fafafa',
          borderColor: '#d9d9d9'
        };
    }
  };

  if (!displayVerificationData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
        <ShopOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
        <br />
        <Typography.Text type="secondary">
          Chưa có thông tin công ty
        </Typography.Text>
      </div>
    );
  }

  const statusConfig = getStatusConfig(displayVerificationData.verificationStatus);

  return (
    <div style={{ padding: '24px' }}>
      {/* Company Verification Status */}
      <Card
        style={{
          marginBottom: '24px',
          backgroundColor: statusConfig.bgColor,
          borderColor: statusConfig.borderColor
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Space align="center">
          {statusConfig.icon}
          <div>
            <Typography.Title level={4} style={{ margin: 0, marginBottom: 4 }}>
              Trạng thái xác minh: {statusConfig.text}
            </Typography.Title>
          </div>
        </Space>
      </Card>

      {/* Company Information */}
      <Card
        title={
          <Space>
            <ShopOutlined />
            Thông tin công ty
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item
            label={
              <Space>
                <ShopOutlined />
                Tên công ty
              </Space>
            }
          >
            <strong>{displayVerificationData.companyName}</strong>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <IdcardOutlined />
                Mã số thuế
              </Space>
            }
          >
            {displayVerificationData.taxCode}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <EnvironmentOutlined />
                Địa chỉ công ty
              </Space>
            }
            span={2}
          >
            {displayVerificationData.companyAddress}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <PhoneOutlined />
                Số điện thoại
              </Space>
            }
          >
            {displayVerificationData.companyPhone}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Space>
                <MailOutlined />
                Email công ty
              </Space>
            }
          >
            {displayVerificationData.companyEmail}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Verification Timeline */}
      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            Lịch sử xác minh
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Timeline
          items={[
            {
              children: `Đăng ký xác minh - ${new Date(displayVerificationData.createdAt).toLocaleDateString('vi-VN')}`,
              color: 'blue',
            },
            ...(displayVerificationData.verifiedAt ? [{
              children: `Xác minh thành công - ${new Date(displayVerificationData.verifiedAt).toLocaleDateString('vi-VN')}`,
              color: 'green',
            }] : []),
            {
              children: `Trạng thái hiện tại: ${statusConfig.text}`,
              color: statusConfig.color === 'success' ? 'green' :
                statusConfig.color === 'error' ? 'red' :
                  statusConfig.color === 'processing' ? 'orange' : 'gray',
            },
          ]}
        />
      </Card>

      {/* Company Documents */}
      <Card
        title={
          <Space>
            <FileDoneOutlined />
            Tài liệu công ty
            <Tag color="blue">{displayDocuments.length} tài liệu</Tag>
          </Space>
        }
      >
        {displayDocuments.length > 0 ? (
          <List
            size="small"
            dataSource={displayDocuments}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="download"
                    type="link"
                    icon={<DownloadOutlined />}
                    size="small"
                  >
                    Tải xuống
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                  title={item.documentName}
                  description={`Cập nhật: ${new Date().toLocaleDateString('vi-VN')}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <br />
            <Typography.Text type="secondary">
              Chưa có tài liệu nào được tải lên
            </Typography.Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CompanyInfo;
