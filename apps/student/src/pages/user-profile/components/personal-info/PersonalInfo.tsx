import React, { useState } from 'react';
import { User } from '../../../../../../../libs/types/src/lib/user-types';

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
      dateOfBirth: editForm.dateOfBirth
        ? new Date(editForm.dateOfBirth)
        : undefined,
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
      case 'Verified':
        return { backgroundColor: 'var(--color-success)', color: 'white' };
      case 'Pending':
        return { backgroundColor: 'var(--color-warning)', color: 'white' };
      case 'Locked':
        return { backgroundColor: 'var(--color-danger)', color: 'white' };
      default:
        return { backgroundColor: 'var(--color-neutral-400)', color: 'white' };
    }
  };

  return (
    <div
      className="card-elevated"
      style={{
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <h2
          className="text-heading-2"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Thông tin cá nhân
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <span
            className="badge-primary"
            style={getStatusBadgeStyle(user.status)}
          >
            {user.status}
          </span>
          {!isEditing ? (
            <button
              className="btn-accent btn-sm"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
              <button className="btn-primary btn-sm" onClick={handleSave}>
                Lưu
              </button>
              <button className="btn-outline btn-sm" onClick={handleCancel}>
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <div>
          <div
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Họ và tên
          </div>
          {isEditing ? (
            <input
              type="text"
              className="input-field"
              value={editForm.fullName}
              onChange={(e) =>
                setEditForm({ ...editForm, fullName: e.target.value })
              }
              placeholder="Nhập họ và tên"
            />
          ) : (
            <p
              style={{
                margin: 0,
                padding: '0.75rem 0',
                color: 'var(--color-neutral-800)',
              }}
            >
              {user.fullName || 'Chưa cập nhật'}
            </p>
          )}
        </div>

        <div>
          <div
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Email
          </div>
          {isEditing ? (
            <input
              type="email"
              className="input-field"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              placeholder="Nhập email"
            />
          ) : (
            <p
              style={{
                margin: 0,
                padding: '0.75rem 0',
                color: 'var(--color-neutral-800)',
              }}
            >
              {user.email}
            </p>
          )}
        </div>

        <div>
          <div
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Ngày sinh
          </div>
          {isEditing ? (
            <input
              type="date"
              className="input-field"
              value={editForm.dateOfBirth}
              onChange={(e) =>
                setEditForm({ ...editForm, dateOfBirth: e.target.value })
              }
            />
          ) : (
            <p
              style={{
                margin: 0,
                padding: '0.75rem 0',
                color: 'var(--color-neutral-800)',
              }}
            >
              {user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN')
                : 'Chưa cập nhật'}
            </p>
          )}
        </div>

        <div>
          <div
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Địa chỉ
          </div>
          {isEditing ? (
            <input
              type="text"
              className="input-field"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              placeholder="Nhập địa chỉ"
            />
          ) : (
            <p
              style={{
                margin: 0,
                padding: '0.75rem 0',
                color: 'var(--color-neutral-800)',
              }}
            >
              {user.address || 'Chưa cập nhật'}
            </p>
          )}
        </div>

        <div>
          <div
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Trạng thái học tập
          </div>
          <p
            style={{
              margin: 0,
              padding: '0.75rem 0',
              color: 'var(--color-neutral-800)',
            }}
          >
            {user.isStudying ? 'Đang học' : 'Đã tốt nghiệp'}
          </p>
        </div>

        <div>
          <div
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Ngày tạo tài khoản
          </div>
          <p
            style={{
              margin: 0,
              padding: '0.75rem 0',
              color: 'var(--color-neutral-800)',
            }}
          >
            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
