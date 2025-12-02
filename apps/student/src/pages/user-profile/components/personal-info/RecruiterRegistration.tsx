import React, { useState } from 'react';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import RecruiterRegisForm from './RecruiterRegisForm';

interface RegistrationRecord {
  id: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  companyName: string;
  contactEmail: string;
}

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (registrations.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Đăng ký nhà tuyển dụng</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleCreateRegistration}
            >
              <PlusOutlined />
              Tạo đơn đăng ký
            </button>
          </div>

          <div className="text-center py-12">
            <div className="text-4xl mb-4 opacity-30">[Danh sách trống]</div>
            <p className="text-gray-500">Chưa có phiếu đăng ký nào</p>
            <p className="text-gray-400 text-sm">Tạo phiếu đăng ký đầu tiên để bắt đầu</p>
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
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            Tổng {registrations.length} phiếu
          </span>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleCreateRegistration}
          >
            <PlusOutlined />
            Tạo đơn đăng ký
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">STT</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Mã phiếu</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tên công ty</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email liên hệ</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Ngày tạo</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Tình trạng</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-900">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-900 font-medium">{item.id}</div>
                </td>
                <td className="px-4 py-3 text-gray-900">{item.companyName}</td>
                <td className="px-4 py-3 text-gray-600">{item.contactEmail}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-900">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                      onClick={() => handleViewRegistration(item)}
                    >
                      <EyeOutlined />
                      Xem
                    </button>
                    {item.status === 'pending' && (
                      <button
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => handleEditRegistration(item)}
                      >
                        <EditOutlined />
                        Sửa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RecruiterRegisForm
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default RecruiterRegistration;