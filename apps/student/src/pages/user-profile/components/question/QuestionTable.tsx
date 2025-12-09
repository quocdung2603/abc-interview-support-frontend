import React from 'react';
import { Table, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Question } from '@abc-interview-support-frontend/types';

interface QuestionTableProps {
  questions: Question[];
  onViewQuestion: (questionId: number) => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: number) => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  onViewQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'Trắc nghiệm';
      case 'ESSAY':
        return 'Tự luận';
      case 'CODING':
        return 'Lập trình';
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'blue';
      case 'ESSAY':
        return 'green';
      case 'CODING':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Bị từ chối';
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
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateString);
    }
  };

  const columns: ColumnsType<Question> = [
    {
      title: 'Câu hỏi',
      dataIndex: 'questionContent',
      key: 'questionContent',
      width: 300,
      render: (questionContent: string, record: Question) => (
        <div>
          <div className="font-semibold text-gray-900 truncate max-w-[250px]">
            {questionContent}
          </div>
          <div className="text-xs text-gray-500">ID: {record.id}</div>
        </div>
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
      title: 'Lĩnh vực',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 120,
      align: 'center',
      render: (fieldName: string) => (
        <span className="text-sm">{fieldName || '—'}</span>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicName',
      key: 'topicName',
      width: 120,
      align: 'center',
      render: (topicName: string) => (
        <span className="text-sm">{topicName || '—'}</span>
      ),
    },
    {
      title: 'Cấp độ',
      dataIndex: 'levelName',
      key: 'levelName',
      width: 100,
      align: 'center',
      render: (levelName: string) => (
        <span className="text-sm">{levelName || '—'}</span>
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
      render: (_: any, record: Question) => (
        <div className="flex gap-2 justify-center">
          <Button type="link" size="small" onClick={() => onViewQuestion(record.id)}>
            Xem chi tiết
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => onEditQuestion(record)}
                className="text-blue-600"
              >
                Chỉnh sửa
              </Button>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => onDeleteQuestion(record.id)}
              >
                Xóa
              </Button>
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
          <span>❓</span>
          <span>Danh sách câu hỏi — {questions.length} câu</span>
        </h3>
      </div>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
          locale: {
            items_per_page: '/ trang',
            jump_to: 'Đến trang',
            page: '',
          },
        }}
        locale={{
          emptyText: (
            <div className="py-8 text-center">
              <span className="text-4xl mb-2 block" role="img" aria-label="empty">
                ❓
              </span>
              <p className="text-gray-500">Chưa có câu hỏi nào.</p>
            </div>
          ),
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default QuestionTable;