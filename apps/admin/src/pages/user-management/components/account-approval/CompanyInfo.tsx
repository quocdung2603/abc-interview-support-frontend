import React from 'react';
import { Card, Descriptions, Tag, Button, List, Typography } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'success';
      case 'Pending':
        return 'processing';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'Đã xác minh';
      case 'Pending':
        return 'Đang chờ duyệt';
      case 'Rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  if (!verificationData) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Text type="secondary">Chưa có thông tin công ty</Text>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Thông tin xác minh công ty */}
      <Card title="Thông tin xác minh công ty" size="small">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Tên công ty">
            {verificationData.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="Mã số thuế">
            {verificationData.taxCode}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ công ty">
            {verificationData.companyAddress}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {verificationData.companyPhone}
          </Descriptions.Item>
          <Descriptions.Item label="Email công ty">
            {verificationData.companyEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(verificationData.verificationStatus)}>
              {getStatusText(verificationData.verificationStatus)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(verificationData.createdAt).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          {verificationData.verifiedAt && (
            <Descriptions.Item label="Ngày xác minh">
              {new Date(verificationData.verifiedAt).toLocaleDateString(
                'vi-VN'
              )}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Tài liệu công ty */}
      <Card title="Tài liệu công ty" size="small">
        {documents.length > 0 ? (
          <List
            size="small"
            dataSource={documents}
            renderItem={(doc) => (
              <List.Item
                actions={[
                  <Button
                    key="download"
                    type="link"
                    icon={<DownloadOutlined />}
                    size="small"
                    onClick={() => {
                      // Handle download document
                      console.log('Download document:', doc.documentFilePath);
                    }}
                  >
                    Tải xuống
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ color: '#1890ff' }} />}
                  title={doc.documentName}
                  description={`Tạo ngày: ${new Date(
                    doc.createdAt
                  ).toLocaleDateString('vi-VN')}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <Text type="secondary">Chưa có tài liệu nào</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CompanyInfo;
