import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Level,
} from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: Level[];
  onPreview: (data: Level) => void;
  onEdit: (data: Level) => void;
  onDelete: (levelId: number) => void;
}

const LevelTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onEdit,
  onDelete,
}) => {

  const columns = [
    {
      title: 'Mức độ',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: Level) => (
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
      render: (record: Level) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa mức độ">
            <Button
              type="text"
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
          `${range[0]}-${range[1]} của ${total} mức độ`,
      }}
    />
  );
};

export default LevelTable;