import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { RecruiterVerification } from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: RecruiterVerification[];
  onPreview: (data: RecruiterVerification) => void;
}

const AccountApprovalTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
}) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#faad14';
      case 'Verified':
        return '#52c41a';
      case 'Rejected':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const columns = [
    {
      title: 'Tên công ty',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (name: string) => (
        <div style={{ fontWeight: 'bold' }}>{name}</div>
      ),
    },
    {
      title: 'Email công ty',
      dataIndex: 'companyEmail',
      key: 'companyEmail',
      render: (email: string) => (
        <div className="italic underline">{email}</div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'companyPhone',
      key: 'companyPhone',
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      key: 'taxCode',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      render: (status: string) => (
        <span
          style={{
            color: getStatusColor(status),
            fontWeight: 'bold',
          }}
        >
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: RecruiterVerification) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Duyệt yêu cầu">
            <Button
              type="text"
              style={{ color: '#52c41a' }}
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataList}
      rowKey="recruiterVerificationId"
      pagination={{
        total: dataList.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} yêu cầu`,
      }}
    />
  );
};

export default AccountApprovalTable;
