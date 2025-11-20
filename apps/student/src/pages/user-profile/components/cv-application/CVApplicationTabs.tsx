import React, { useState } from 'react';
import TabNavigation from '../TabNavigation';

interface CVApplicationTabsProps {
  uploadedCVs: Array<{
    id: string;
    fileName: string;
    uploadDate: Date;
    fileSize: number;
    isActive: boolean;
  }>;
  appliedCompanies: Array<{
    id: string;
    companyName: string;
    position: string;
    appliedDate: Date;
    status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected' | 'Accepted';
    cvUsed: string;
  }>;
  onUploadCV: (file: File) => void;
  onDeleteCV: (cvId: string) => void;
  onSetActiveCV: (cvId: string) => void;
}

const CVApplicationTabs: React.FC<CVApplicationTabsProps> = ({
  uploadedCVs,
  appliedCompanies,
  onUploadCV,
  onDeleteCV,
  onSetActiveCV,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('cv-list');

  const subTabs = [
    {
      id: 'cv-list',
      label: 'CV của bạn',
      icon: '',
      description: 'Quản lý danh sách CV',
      badge: uploadedCVs.length || undefined,
    },
    {
      id: 'applications',
      label: 'Đã ứng tuyển',
      icon: '',
      description: 'Theo dõi đơn ứng tuyển',
      badge: appliedCompanies.length || undefined,
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadCV(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'var(--color-success)';
      case 'Interview':
        return 'var(--color-accent)';
      case 'Reviewed':
        return 'var(--color-warning)';
      case 'Rejected':
        return 'var(--color-danger)';
      case 'Pending':
      default:
        return 'var(--color-neutral-600)';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Đang chờ';
      case 'Reviewed':
        return 'Đã xem';
      case 'Interview':
        return 'Phỏng vấn';
      case 'Rejected':
        return 'Từ chối';
      case 'Accepted':
        return 'Chấp nhận';
      default:
        return status;
    }
  };

  const renderCVList = () => (
    <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h3
          className="text-heading-2"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Danh sách CV
        </h3>
        <label className="btn-accent" style={{ cursor: 'pointer' }}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />{' '}
          📁 Tải lên CV mới
        </label>
      </div>

      {uploadedCVs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            📄
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Chưa có CV nào được tải lên
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          {uploadedCVs.map((cv) => (
            <div
              key={cv.id}
              className="card-soft"
              style={{
                padding: 'var(--spacing-md)',
                border: cv.isActive
                  ? '2px solid var(--color-accent)'
                  : '1px solid var(--color-neutral-200)',
                backgroundColor: cv.isActive
                  ? 'var(--color-accent-10)'
                  : 'white',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                }}
              >
                <input
                  type="checkbox"
                  checked={cv.isActive}
                  onChange={() => onSetActiveCV(cv.id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--color-accent)',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: '0 0 0.25rem 0',
                          color: 'var(--color-neutral-800)',
                        }}
                      >
                        {cv.fileName}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          gap: 'var(--spacing-md)',
                          fontSize: '0.875rem',
                          color: 'var(--color-neutral-600)',
                        }}
                      >
                        <span>
                          📅{' '}
                          {new Date(cv.uploadDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span>
                          📊{' '}
                          {typeof cv.fileSize === 'number'
                            ? `${(cv.fileSize / 1024 / 1024).toFixed(1)}MB`
                            : cv.fileSize}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      {cv.isActive && (
                        <span
                          className="badge-accent m-auto"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Đang sử dụng
                        </span>
                      )}
                      <button
                        className="btn-outline btn-sm"
                        onClick={() => onDeleteCV(cv.id)}
                        style={{
                          color: 'var(--color-danger)',
                          borderColor: 'var(--color-danger)',
                        }}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedCVs.some((cv) => cv.isActive) && (
        <div
          style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-accent-10)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-accent-20)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: 'var(--color-accent-dark)',
            }}
          >
            💡 <strong>Lưu ý:</strong> CV được đánh dấu sẽ được hiển thị cho nhà
            tuyển dụng khi bạn ứng tuyển.
          </p>
        </div>
      )}
    </div>
  );

  const renderApplications = () => (
    <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
      <h3
        className="text-heading-2"
        style={{
          color: 'var(--color-primary)',
          margin: '0 0 var(--spacing-lg) 0',
        }}
      >
        Đơn ứng tuyển của bạn
      </h3>

      {appliedCompanies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            📋
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Chưa có đơn ứng tuyển nào
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          {appliedCompanies.map((application) => (
            <div
              key={application.id}
              className="card-soft"
              style={{ padding: 'var(--spacing-md)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 0.25rem 0',
                      color: 'var(--color-neutral-800)',
                    }}
                  >
                    {application.position}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-accent)',
                      fontWeight: '600',
                    }}
                  >
                    {application.companyName}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)',
                      fontSize: '0.875rem',
                      color: 'var(--color-neutral-600)',
                    }}
                  >
                    <span>
                      📅 Ứng tuyển:{' '}
                      {new Date(application.appliedDate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </span>
                    <span>📄 CV: {application.cvUsed}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 'var(--spacing-sm)',
                  }}
                >
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getStatusColor(application.status),
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    {getStatusText(application.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'cv-list':
        return renderCVList();
      case 'applications':
        return renderApplications();
      default:
        return null;
    }
  };

  return (
    <div>
      <TabNavigation
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      <div style={{ minHeight: '400px' }}>{renderSubTabContent()}</div>
    </div>
  );
};

export default CVApplicationTabs;
