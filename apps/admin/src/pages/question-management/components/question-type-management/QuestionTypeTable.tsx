import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  QuestionType,
} from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: QuestionType[];
  onPreview: (data: QuestionType) => void;
  onEdit: (data: QuestionType) => void;
  onDelete: (questionTypeId: number) => void;
}

const QuestionTypeTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onEdit,
  onDelete,
}) => {

  const columns = [
    {
      title: 'Loại câu hỏi',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: QuestionType) => (
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
      render: (record: QuestionType) => (
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
          <Tooltip title="Xóa loại câu hỏi">
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
          `${range[0]}-${range[1]} của ${total} loại câu hỏi`,
      }}
    />
  );
};

export default QuestionTypeTable;