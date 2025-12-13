import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Field,
} from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: Field[];
  onPreview: (data: Field) => void;
  onEdit: (data: Field) => void;
  onDelete: (fieldId: number) => void;
}

const FieldTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onEdit,
  onDelete,
}) => {

  const columns = [
    {
      title: 'Lĩnh vực',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Field) => (
        <div style={{ maxWidth: '150px' }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            #{record.id}: {record.name}
          </div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {description}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Field) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa chủ đề">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDelete(record.id)}
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
          `${range[0]}-${range[1]} của ${total} lĩnh vực`,
      }}
    />
  );
};

export default FieldTable;
