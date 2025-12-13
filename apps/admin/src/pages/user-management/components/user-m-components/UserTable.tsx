import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, LockOutlined } from '@ant-design/icons';
import { User } from '@abc-interview-support-frontend/types';
import StatusTag from './StatusTag';

interface TableProps {
  dataList: User[];
  onPreview: (data: User) => void;
  onLock: (dataId: string) => void;
}

const UserTable: React.FC<TableProps> = ({ dataList, onPreview, onLock }) => {
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (title: string) => (
        <div style={{ fontWeight: 'bold' }}>{title}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <div className="italic underline">{email}</div>
      ),
    },
    {
      title: 'Bậc xếp hạng',
      dataIndex: 'eloRank',
      key: 'eloRank',
      render: (eloRank: string) => (
        <StatusTag status={eloRank} type={'elo-rank'} />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <StatusTag status={status} type={'status-account'} />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Khóa tài khoản">
            <Button
              danger
              icon={<LockOutlined />}
              size="small"
              onClick={() => onLock(record.id)}
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
      rowKey="id"
      pagination={{
        total: dataList.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} kỳ thi`,
      }}
    />
  );
};

export default UserTable;
