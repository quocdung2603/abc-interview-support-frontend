import React from 'react';
import { Table, Tag, Button, Tooltip, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Post } from '@abc-interview-support-frontend/types';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface PostTableProps {
  posts: Post[];
  onViewPost: (postId: number) => void;
  onEditPost: (postId: number) => void;
  onDeletePost: (postId: number) => void;
}

const PostTable: React.FC<PostTableProps> = ({ posts, onViewPost, onEditPost, onDeletePost }) => {
  const getPostTypeLabel = (type: string) => {
    return type === 'DISCUSSION' ? 'Thảo luận' : 'Câu hỏi';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Nháp';
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'LOCKED':
        return 'Đã khóa';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
  };

  const columns: ColumnsType<Post> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title: string, record: Post) => (
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-500 mt-0.5">ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'postType',
      key: 'postType',
      width: 120,
      align: 'center',
      render: (postType: string) => (
        <Tag color={postType === 'DISCUSSION' ? 'blue' : 'purple'}>
          {getPostTypeLabel(postType)}
        </Tag>
      ),
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 150,
      align: 'center',
      render: (fieldName: string) => {
        return <Tag>{fieldName}</Tag>
      }
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicName',
      key: 'topicName',
      width: 150,
      align: 'center',
      render: (topicName: string) => {
        return <Tag>{topicName}</Tag>
      }
    },
    {
      title: 'Cấp độ',
      dataIndex: 'levelName',
      key: 'levelName',
      width: 120,
      align: 'center',
      render: (levelName: string) => {
        return <Tag>{levelName}</Tag>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status: string) => {
        let color = 'default';
        if (status === 'PUBLISHED') color = 'green';
        else if (status === 'LOCKED') color = 'red';
        else if (status === 'DRAFT') color = 'default';

        return <Tag color={color}>{getStatusLabel(status)}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: Post) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewPost(record.id)}
            />
          </Tooltip>
          {record.status === 'DRAFT' && (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  size="small"
                  onClick={() => onEditPost(record.id)}
                  className="text-blue-600 hover:text-blue-800"
                  icon={<EditOutlined />}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa bài thảo luận này?"
                  onConfirm={() => onDeletePost(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    className="text-red-600 hover:text-red-800"
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>💬</span>
          <span>Danh sách bài thảo luận — {posts.length} bài</span>
        </h3>
      </div>

      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} bài`,
          locale: {
            items_per_page: '/ trang',
          },
        }}
        locale={{
          emptyText: (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">📝</div>
              <p className="text-gray-500 text-lg font-medium">
                Chưa có bài thảo luận nào
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Hãy tạo bài thảo luận đầu tiên của bạn!
              </p>
            </div>
          ),
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default PostTable;
