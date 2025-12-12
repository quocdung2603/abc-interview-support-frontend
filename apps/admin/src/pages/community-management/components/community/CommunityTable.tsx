import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Field,
  Level,
  Post,
  Topic,
} from '@abc-interview-support-frontend/types';
import dayjs from 'dayjs';

interface TableProps {
  dataList: Post[];
  onPreview: (data: Post) => void;
  onEdit: (data: Post) => void;
  onDelete: (postId: number) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const FormattedDate = (dateString: string) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
};

const CommunityTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onEdit,
  onDelete,
  fields,
  topics,
  levels,
}) => {

  const getFieldName = (fieldId: number) => {
    const field = fields.find((f: Field) => f.id === fieldId);
    return field ? field.name : 'N/A';
  }

  const getTopicName = (topicId: number) => {
    const topic = topics.find((t: Topic) => t.id === topicId);
    return topic ? topic.name : 'N/A';
  }

  const getLevelName = (levelId?: number) => {
    if (!levelId) return 'N/A';
    const level = levels.find((l: Level) => l.id === levelId);
    return level ? level.name : 'N/A';
  }

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, record: Post) => (
        <div style={{ maxWidth: '150px' }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            #{record.id}: {record.title}
          </div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'postType',
      key: 'postType',
      render: (postType: string) => (
        <Tag color={postType === 'DISCUSSION' ? 'green' : 'orange'}>
          {postType === 'DISCUSSION' ? 'Thảo luận' : 'Câu hỏi'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'PUBLISHED' ? 'green' :
            status === 'DRAFT' ? 'orange' : 'red'
        }>
          {status === 'PUBLISHED' ? 'Đã xuất bản' :
            status === 'DRAFT' ? 'Nháp' : 'Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'fieldId',
      key: 'fieldId',
      render: (fieldId: number) => (
        <Tag color="cyan">{getFieldName(fieldId)}</Tag>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicId',
      key: 'topicId',
      render: (topicId: number) => (
        <Tag color="geekblue">{getTopicName(topicId)}</Tag>
      ),
    },
    {
      title: 'Cấp độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId?: number) => (
        levelId ? <Tag color="purple">{getLevelName(levelId)}</Tag> : <span>-</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {FormattedDate(createdAt)}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Post) => (
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
          <Tooltip title="Xóa cuộc thảo luận">
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
          `${range[0]}-${range[1]} của ${total} cuộc thảo luận`,
      }}
    />
  );
};

export default CommunityTable;
