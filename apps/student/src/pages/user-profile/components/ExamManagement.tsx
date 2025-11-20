import React, { useState } from 'react';
import {
  Exam,
  ExamRegistration,
  Result,
} from '@abc-interview-support-frontend/types';

interface ExamManagementProps {
  completedExams: (Exam & { result: Result })[];
  registeredExams: (Exam & { registration: ExamRegistration })[];
  upcomingExams: (Exam & { registration: ExamRegistration })[];
}

const ExamManagement: React.FC<ExamManagementProps> = ({
  completedExams,
  registeredExams,
  upcomingExams,
}) => {
  const [activeTab, setActiveTab] = useState<
    'completed' | 'registered' | 'upcoming'
  >('completed');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  const getExamTypeColor = (examType: string) => {
    return examType === 'Virtual'
      ? 'var(--color-accent)'
      : 'var(--color-warning)';
  };

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'var(--color-success)';
      case 'Pending':
        return 'var(--color-warning)';
      case 'Rejected':
        return 'var(--color-danger)';
      default:
        return 'var(--color-neutral-400)';
    }
  };

  const getRegistrationStatusText = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'Đã duyệt';
      case 'Pending':
        return 'Chờ duyệt';
      case 'Rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const renderCompletedExams = () => {
    if (completedExams.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            📝
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Bạn chưa hoàn thành bài kiểm tra nào
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
                Tên bài kiểm tra
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Loại
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Điểm số
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Kết quả
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Thời gian hoàn thành
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
            {completedExams.map((exam) => (
              <tr
                key={exam.examId}
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
                      marginBottom: '0.25rem',
                    }}
                  >
                    {exam.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    {exam.position && `Vị trí: ${exam.position}`}
                  </div>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    className="badge-secondary"
                    style={{
                      backgroundColor: getExamTypeColor(exam.examType),
                      color: 'white',
                    }}
                  >
                    {exam.examType === 'Virtual' ? 'Ảo' : 'Nhà tuyển dụng'}
                  </span>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    style={{
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {exam.result.score}%
                  </span>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    className="badge-secondary"
                    style={{
                      backgroundColor: exam.result.passStatus
                        ? 'var(--color-success)'
                        : 'var(--color-danger)',
                      color: 'white',
                    }}
                  >
                    {exam.result.passStatus ? 'Đạt' : 'Không đạt'}
                  </span>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  {formatDate(exam.result.completedAt)}
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

  const renderRegisteredExams = () => {
    if (registeredExams.length === 0) {
      return (
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
            Bạn chưa đăng ký bài kiểm tra nào
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
                Tên bài kiểm tra
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Loại
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Trạng thái đăng ký
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Thời gian đăng ký
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
            {registeredExams.map((exam) => (
              <tr
                key={exam.examId}
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
                      marginBottom: '0.25rem',
                    }}
                  >
                    {exam.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    {exam.position && `Vị trí: ${exam.position}`} •{' '}
                    {formatDuration(exam.duration)}
                  </div>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    className="badge-secondary"
                    style={{
                      backgroundColor: getExamTypeColor(exam.examType),
                      color: 'white',
                    }}
                  >
                    {exam.examType === 'Virtual' ? 'Ảo' : 'Nhà tuyển dụng'}
                  </span>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    className="badge-secondary"
                    style={{
                      backgroundColor: getRegistrationStatusColor(
                        exam.registration.registrationStatus
                      ),
                      color: 'white',
                    }}
                  >
                    {getRegistrationStatusText(
                      exam.registration.registrationStatus
                    )}
                  </span>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  {formatDate(exam.registration.registeredAt)}
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  {exam.registration.registrationStatus === 'Approved' ? (
                    <button className="btn-primary btn-sm">Vào thi</button>
                  ) : (
                    <button className="btn-outline btn-sm">Xem chi tiết</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUpcomingExams = () => {
    if (upcomingExams.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            ⏰
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Không có bài kiểm tra nào sắp bắt đầu
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
                Tên bài kiểm tra
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Loại
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Thời gian bắt đầu
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Thời lượng
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
            {upcomingExams.map((exam) => (
              <tr
                key={exam.examId}
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
                      marginBottom: '0.25rem',
                    }}
                  >
                    {exam.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    {exam.position && `Vị trí: ${exam.position}`} •{' '}
                    {exam.questionCount} câu hỏi
                  </div>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    className="badge-secondary"
                    style={{
                      backgroundColor: getExamTypeColor(exam.examType),
                      color: 'white',
                    }}
                  >
                    {exam.examType === 'Virtual' ? 'Ảo' : 'Nhà tuyển dụng'}
                  </span>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  {exam.startTime
                    ? formatDate(exam.startTime)
                    : 'Chưa xác định'}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  {formatDuration(exam.duration)}
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <button className="btn-accent btn-sm">Chuẩn bị thi</button>
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
        Quản lý bài kiểm tra
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
            onClick={() => setActiveTab('completed')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: `3px solid ${
                activeTab === 'completed'
                  ? 'var(--color-accent)'
                  : 'transparent'
              }`,
              color:
                activeTab === 'completed'
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === 'completed' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Đã hoàn thành ({completedExams.length})
          </button>

          <button
            onClick={() => setActiveTab('registered')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: `3px solid ${
                activeTab === 'registered'
                  ? 'var(--color-accent)'
                  : 'transparent'
              }`,
              color:
                activeTab === 'registered'
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === 'registered' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Đã đăng ký ({registeredExams.length})
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: `3px solid ${
                activeTab === 'upcoming' ? 'var(--color-accent)' : 'transparent'
              }`,
              color:
                activeTab === 'upcoming'
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === 'upcoming' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Sắp bắt đầu ({upcomingExams.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'completed' && renderCompletedExams()}
        {activeTab === 'registered' && renderRegisteredExams()}
        {activeTab === 'upcoming' && renderUpcomingExams()}
      </div>
    </div>
  );
};

export default ExamManagement;
