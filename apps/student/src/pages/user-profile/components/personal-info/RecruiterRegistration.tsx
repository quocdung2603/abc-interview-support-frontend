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
        return 'var(--color-warning)';
      case 'approved':
        return 'var(--color-success)';
      case 'rejected':
        return 'var(--color-danger)';
      default:
        return 'var(--color-neutral-600)';
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
              className="text-heading-1"
              style={{ color: 'var(--color-primary)', margin: 0 }}
            >
              Đăng ký nhà tuyển dụng
            </h2>
            <button
              className="btn-accent"
              onClick={handleCreateRegistration}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
              }}
            >
              <PlusOutlined />
              Tạo đơn đăng ký
            </button>
          </div>

          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div
              style={{
                fontSize: '2.5rem',
                marginBottom: 'var(--spacing-sm)',
                opacity: 0.3,
                color: 'var(--color-neutral-400)',
                fontWeight: 'bold',
              }}
            >
              [Danh sách trống]
            </div>
            <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
              Chưa có phiếu đăng ký nào
            </p>
            <p
              style={{
                color: 'var(--color-neutral-400)',
                fontSize: '0.875rem',
                margin: 'var(--spacing-xs) 0 0 0',
              }}
            >
              Tạo phiếu đăng ký đầu tiên để bắt đầu
            </p>
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
        <div>
          <h2
            className="text-heading-1"
            style={{ color: 'var(--color-primary)', margin: 0 }}
          >
            Đăng ký nhà tuyển dụng
          </h2>
          <p
            style={{
              color: 'var(--color-neutral-600)',
              margin: 'var(--spacing-xs) 0 0 0',
              fontSize: '0.875rem',
            }}
          >
            Quản lý các phiếu đăng ký nhà tuyển dụng của bạn
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <div className="badge-secondary">
            Tổng {registrations.length} phiếu
          </div>
          <button
            className="btn-accent"
            onClick={handleCreateRegistration}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
            }}
          >
            <PlusOutlined />
            Tạo đơn đăng ký
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--color-neutral-50)' }}>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                STT
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Mã phiếu
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Tên công ty
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Email liên hệ
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Ngày tạo
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Tình trạng
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: '1px solid var(--color-neutral-200)',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  'var(--color-neutral-50)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div style={{ color: 'var(--color-neutral-800)' }}>
                    {index + 1}
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div style={{ color: 'var(--color-neutral-800)', fontWeight: '500' }}>
                    {item.id}
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div style={{ color: 'var(--color-neutral-800)' }}>
                    {item.companyName}
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div style={{ color: 'var(--color-neutral-600)' }}>
                    {item.contactEmail}
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div style={{ color: 'var(--color-neutral-800)' }}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
                  </div>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    style={{
                      color: getStatusColor(item.status),
                      fontWeight: '500',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `${getStatusColor(item.status)}20`,
                      fontSize: '0.875rem',
                    }}
                  >
                    {getStatusText(item.status)}
                  </span>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-xs)',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      className="btn-outline btn-sm"
                      onClick={() => handleViewRegistration(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.5rem',
                      }}
                    >
                      <EyeOutlined />
                      Xem
                    </button>
                    {item.status === 'pending' && (
                      <button
                        className="btn-accent btn-sm"
                        onClick={() => handleEditRegistration(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)',
                          fontSize: '0.8rem',
                          padding: '0.25rem 0.5rem',
                        }}
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