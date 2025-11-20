import React, { useState } from 'react';

interface CVManagementProps {
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

const CVManagement: React.FC<CVManagementProps> = ({
  uploadedCVs,
  appliedCompanies,
  onUploadCV,
  onDeleteCV,
  onSetActiveCV,
}) => {
  const [activeTab, setActiveTab] = useState<'uploaded' | 'applied'>(
    'uploaded'
  );
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'var(--color-success)';
      case 'Interview':
        return 'var(--color-accent)';
      case 'Reviewed':
        return 'var(--color-warning)';
      case 'Pending':
        return 'var(--color-neutral-400)';
      case 'Rejected':
        return 'var(--color-danger)';
      default:
        return 'var(--color-neutral-400)';
    }
  };

  const getApplicationStatusText = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'Đã nhận';
      case 'Interview':
        return 'Phỏng vấn';
      case 'Reviewed':
        return 'Đã xem';
      case 'Pending':
        return 'Chờ xử lý';
      case 'Rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        onUploadCV(file);
      } else {
        alert('Vui lòng chỉ tải lên file PDF, DOC hoặc DOCX');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUploadCV(file);
      e.target.value = '';
    }
  };

  const renderUploadedCVs = () => {
    return (
      <div>
        {/* Upload Area */}
        <button
          type="button"
          style={{
            border: `2px dashed ${
              dragActive ? 'var(--color-accent)' : 'var(--color-neutral-300)'
            }`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-lg)',
            backgroundColor: dragActive
              ? 'var(--color-accent-10)'
              : 'var(--color-neutral-50)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            width: '100%',
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('cv-upload')?.click()}
        >
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.6,
            }}
          >
            📄
          </div>
          <h3
            style={{
              margin: '0 0 var(--spacing-xs) 0',
              color: 'var(--color-neutral-700)',
            }}
          >
            Tải lên CV của bạn
          </h3>
          <p
            style={{
              margin: 0,
              color: 'var(--color-neutral-500)',
              fontSize: '0.9rem',
            }}
          >
            Kéo và thả file CV vào đây hoặc click để chọn file
          </p>
          <p
            style={{
              margin: '0.5rem 0 0 0',
              color: 'var(--color-neutral-400)',
              fontSize: '0.8rem',
            }}
          >
            Hỗ trợ: PDF, DOC, DOCX (Tối đa 10MB)
          </p>
          <input
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </button>

        {/* CV List */}
        {uploadedCVs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div
              style={{
                fontSize: '2rem',
                marginBottom: 'var(--spacing-sm)',
                opacity: 0.3,
              }}
            >
              📋
            </div>
            <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
              Bạn chưa tải lên CV nào
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {uploadedCVs.map((cv) => (
              <div
                key={cv.id}
                className="card-interactive"
                style={{
                  padding: 'var(--spacing-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: cv.isActive
                    ? 'var(--color-accent-10)'
                    : 'white',
                  borderColor: cv.isActive
                    ? 'var(--color-accent)'
                    : 'var(--color-neutral-200)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>📄</div>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: '500',
                          color: 'var(--color-neutral-800)',
                        }}
                      >
                        {cv.fileName}
                      </span>
                      {cv.isActive && (
                        <span
                          className="badge-success"
                          style={{ fontSize: '0.75rem' }}
                        >
                          CV chính
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-neutral-500)',
                      }}
                    >
                      Tải lên: {formatDate(cv.uploadDate)} •{' '}
                      {formatFileSize(cv.fileSize)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                  {!cv.isActive && (
                    <button
                      className="btn-accent btn-sm"
                      onClick={() => onSetActiveCV(cv.id)}
                    >
                      Đặt làm CV chính
                    </button>
                  )}
                  <button className="btn-outline btn-sm">Xem</button>
                  <button
                    className="btn-outline btn-sm"
                    onClick={() => onDeleteCV(cv.id)}
                    style={{
                      color: 'var(--color-danger)',
                      borderColor: 'var(--color-danger)',
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppliedCompanies = () => {
    if (appliedCompanies.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            🏢
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Bạn chưa nộp đơn ứng tuyển cho công ty nào
          </p>
        </div>
      );
    }

    return (
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
                }}
              >
                Công ty
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Vị trí
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Ngày nộp
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                CV sử dụng
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {appliedCompanies.map((application) => (
              <tr
                key={application.id}
                style={{ borderBottom: '1px solid var(--color-neutral-200)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    'var(--color-neutral-50)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div
                    style={{
                      fontWeight: '500',
                      color: 'var(--color-neutral-800)',
                    }}
                  >
                    {application.companyName}
                  </div>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    color: 'var(--color-neutral-700)',
                  }}
                >
                  {application.position}
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    className="badge-secondary"
                    style={{
                      backgroundColor: getApplicationStatusColor(
                        application.status
                      ),
                      color: 'white',
                    }}
                  >
                    {getApplicationStatusText(application.status)}
                  </span>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  {formatDate(application.appliedDate)}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  {application.cvUsed}
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <button className="btn-outline btn-sm">Xem chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      className="card-elevated"
      style={{
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <h2
        className="text-heading-1"
        style={{
          color: 'var(--color-primary)',
          margin: '0 0 var(--spacing-md) 0',
        }}
      >
        Quản lý CV & Ứng tuyển
      </h2>

      {/* Tabs */}
      <div
        style={{
          borderBottom: '2px solid var(--color-neutral-200)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={() => setActiveTab('uploaded')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: `3px solid ${
                activeTab === 'uploaded' ? 'var(--color-accent)' : 'transparent'
              }`,
              color:
                activeTab === 'uploaded'
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === 'uploaded' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            CV đã tải lên ({uploadedCVs.length})
          </button>

          <button
            onClick={() => setActiveTab('applied')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: `3px solid ${
                activeTab === 'applied' ? 'var(--color-accent)' : 'transparent'
              }`,
              color:
                activeTab === 'applied'
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === 'applied' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Đã ứng tuyển ({appliedCompanies.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'uploaded' && renderUploadedCVs()}
        {activeTab === 'applied' && renderAppliedCompanies()}
      </div>
    </div>
  );
};

export default CVManagement;
