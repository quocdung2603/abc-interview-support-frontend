import React from 'react';
import { Table, Tag, Button, Tooltip, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { NewsItem } from '@abc-interview-support-frontend/types';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface NewsTableProps {
  news: NewsItem[];
  onViewNews: (newsId: number) => void;
  onEditNews: (newsItem: NewsItem) => void;
  onDeleteNews: (newsId: number) => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ news, onViewNews, onEditNews, onDeleteNews }) => {
  const getNewsTypeLabel = (type: string) => {
    return type === 'NEWS' ? 'Tin tức' : 'Tin tuyển dụng';
  };

  const getNewsTypeColor = (type: string) => {
    return type === 'NEWS' ? 'blue' : 'orange';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Bị từ chối';
      case 'PUBLISHED':
        return 'Đã xuất bản';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PUBLISHED':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string | Date) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
  };

  const columns: ColumnsType<NewsItem> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title: string, record: NewsItem) => (
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-500 mt-0.5">ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'newsType',
      key: 'newsType',
      width: 130,
      align: 'center',
      render: (newsType: string) => (
        <Tag color={getNewsTypeColor(newsType)}>
          {getNewsTypeLabel(newsType)}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Lượt hữu ích',
      dataIndex: 'usefulVote',
      key: 'usefulVote',
      width: 120,
      align: 'center',
      render: (votes: number | undefined) => (
        <span className="text-green-600 font-medium">
          👍 {votes || 0}
        </span>
      ),
    },
    {
      title: 'Lượt quan tâm',
      dataIndex: 'interestVote',
      key: 'interestVote',
      width: 120,
      align: 'center',
      render: (votes: number | undefined) => (
        <span className="text-blue-600 font-medium">
          ⭐ {votes || 0}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      align: 'center',
      render: (date: string | Date) => formatDate(date),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: NewsItem) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewNews(record.id)} />
          </Tooltip>
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEditNews(record)}
                  className="text-blue-600"
                />
              </Tooltip>
              <Tooltip title="Xóa tin tức">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa tin tức này?"
                  onConfirm={() => onDeleteNews(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
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
          <span>📰</span>
          <span>Danh sách tin tức — {news.length} tin</span>
        </h3>
      </div>

      <Table
        columns={columns}
        dataSource={news}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} tin`,
          locale: {
            items_per_page: '/ trang',
          },
        }}
        locale={{
          emptyText: (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">📰</div>
              <p className="text-gray-500 text-lg font-medium">
                Chưa có tin tức nào
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Hãy tạo tin tức đầu tiên của bạn!
              </p>
            </div>
          ),
        }}
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default NewsTable;
