import { useState } from 'react';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Tag, Space, Tooltip, Empty, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import RecruiterRegisForm from './RecruiterRegisForm';

interface RegistrationRecord {
  id: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  companyName: string;
  contactEmail: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ duyệt';
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Từ chối';
    default:
      return 'Không xác định';
  }
};

const RecruiterRegistration = () => {
  const [registrations] = useState<RegistrationRecord[]>([
    {
      id: 'REG001',
      createdAt: '2025-11-15',
      status: 'pending',
      companyName: 'Công ty ABC',
      contactEmail: 'hr@abc.com'
    },
    {
      id: 'REG002',
      createdAt: '2025-11-10',
      status: 'approved',
      companyName: 'Công ty XYZ',
      contactEmail: 'recruitment@xyz.com'
    },
    {
      id: 'REG003',
      createdAt: '2025-11-05',
      status: 'rejected',
      companyName: 'Công ty DEF',
      contactEmail: 'contact@def.com'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateRegistration = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalSubmit = (values: { companyName: string; taxId: string; address: string; website: string; contactEmail: string }) => {
    console.log('Form submitted:', values);
    setIsModalVisible(false);
    // TODO: Implement API call to submit registration
  };

  const handleViewRegistration = (record: RegistrationRecord) => {
    // TODO: Implement view registration details
    console.log('View registration:', record);
  };

  const handleEditRegistration = (record: RegistrationRecord) => {
    // TODO: Implement edit registration logic
    console.log('Edit registration:', record);
  };

  // Table columns configuration
  const columns: ColumnsType<RegistrationRecord> = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_: any, __: RegistrationRecord, index: number) => index + 1,
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <span className="font-medium text-gray-900">{id}</span>
      ),
    },
    {
      title: 'Tên công ty',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 200,
      render: (companyName: string) => (
        <span className="text-gray-900">{companyName}</span>
      ),
    },
    {
      title: 'Email liên hệ',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
      width: 200,
      render: (contactEmail: string) => (
        <span className="text-gray-600">{contactEmail}</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt: string) => (
        <div>
          <div className="text-gray-900">
            {new Date(createdAt).toLocaleDateString('vi-VN')}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleTimeString('vi-VN')}
          </div>
        </div>
      ),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_: any, record: RegistrationRecord) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewRegistration(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Chỉnh sửa">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditRegistration(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  if (registrations.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Đăng ký nhà tuyển dụng</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateRegistration}
            >
              Tạo đơn đăng ký
            </Button>
          </div>

          <div className="text-center py-12">
            <Empty
              description={
                <div>
                  <p className="text-gray-500">Chưa có phiếu đăng ký nào</p>
                  <p className="text-gray-400 text-sm">Tạo phiếu đăng ký đầu tiên để bắt đầu</p>
                </div>
              }
            />
          </div>
        </div>

        <RecruiterRegisForm
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleModalSubmit}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Đăng ký nhà tuyển dụng</h2>
          <p className="text-gray-600 text-sm mt-1">Quản lý các phiếu đăng ký nhà tuyển dụng của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            count={registrations.length}
            showZero
            style={{ backgroundColor: '#1890ff' }}
          >
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Tổng phiếu
            </span>
          </Badge>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateRegistration}
          >
            Tạo đơn đăng ký
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={registrations}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
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
                📝
              </span>
              <p className="text-gray-500">Không có dữ liệu phù hợp.</p>
            </div>
          ),
        }}
        scroll={{ x: 800 }}
      />

      <RecruiterRegisForm
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default RecruiterRegistration;