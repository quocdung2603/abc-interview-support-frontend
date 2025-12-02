import React, { useState } from 'react';
import { User } from '@abc-interview-support-frontend/types';

interface PersonalInfoProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
    address: user.address || '',
  });

  const handleSave = () => {
    onUpdateUser({
      fullName: editForm.fullName,
      email: editForm.email,
      dateOfBirth: editForm.dateOfBirth || undefined,
      address: editForm.address,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '',
      address: user.address || '',
    });
    setIsEditing(false);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(user.status)}`}>
            {user.status}
          </span>
          {!isEditing ? (
            <button
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleSave}
              >
                Lưu
              </button>
              <button
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                onClick={handleCancel}
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Họ và tên
          </label>
          {isEditing ? (
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editForm.fullName}
              onChange={(e) =>
                setEditForm({ ...editForm, fullName: e.target.value })
              }
              placeholder="Nhập họ và tên"
            />
          ) : (
            <p className="text-base text-gray-900 py-2">
              {user.fullName || 'Chưa cập nhật'}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              placeholder="Nhập email"
            />
          ) : (
            <p className="text-base text-gray-900 py-2">
              {user.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          {isEditing ? (
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editForm.dateOfBirth}
              onChange={(e) =>
                setEditForm({ ...editForm, dateOfBirth: e.target.value })
              }
            />
          ) : (
            <p className="text-base text-gray-900 py-2">
              {user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN')
                : 'Chưa cập nhật'}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          {isEditing ? (
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              placeholder="Nhập địa chỉ"
            />
          ) : (
            <p className="text-base text-gray-900 py-2">
              {user.address || 'Chưa cập nhật'}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái học tập
          </label>
          <p className="text-base text-gray-900 py-2">
            {user.isStudying ? 'Đang học' : 'Đã tốt nghiệp'}
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ngày tạo tài khoản
          </label>
          <p className="text-base text-gray-900 py-2">
            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
