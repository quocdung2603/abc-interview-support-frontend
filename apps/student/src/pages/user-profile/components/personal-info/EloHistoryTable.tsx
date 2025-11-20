import React, { useState } from 'react';
import { EloHistory } from '@abc-interview-support-frontend/types';

interface EloHistoryProps {
  eloHistory: EloHistory[];
}

const EloHistoryTable: React.FC<EloHistoryProps> = ({ eloHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof EloHistory>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sort data
  const sortedData = [...eloHistory].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
    if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof EloHistory) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getActionColor = (action: string | undefined) => {
    if (!action) return 'var(--color-neutral-600)';

    const lowerAction = action.toLowerCase();
    if (
      lowerAction.includes('thắng') ||
      lowerAction.includes('hoàn thành') ||
      lowerAction.includes('chính xác')
    ) {
      return 'var(--color-success)';
    }
    if (
      lowerAction.includes('thua') ||
      lowerAction.includes('sai') ||
      lowerAction.includes('thất bại')
    ) {
      return 'var(--color-danger)';
    }
    return 'var(--color-neutral-600)';
  };

  const getPointsDisplay = (points: number) => {
    return points > 0 ? `+${points}` : `${points}`;
  };

  const getPointsColor = (points: number) => {
    return points > 0 ? 'var(--color-success)' : 'var(--color-danger)';
  };

  if (eloHistory.length === 0) {
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
          Lịch sử điểm ELO
        </h2>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            📈
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Chưa có hoạt động nào để hiển thị lịch sử ELO
          </p>
        </div>
      </div>
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
        <h2
          className="text-heading-1"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Lịch sử điểm ELO
        </h2>
        <div className="badge-secondary">
          Tổng {eloHistory.length} hoạt động
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
                  cursor: 'pointer',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
                onClick={() => handleSort('createdAt')}
              >
                Thời gian{' '}
                {sortField === 'createdAt' &&
                  (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
                onClick={() => handleSort('action')}
              >
                Hoạt động{' '}
                {sortField === 'action' &&
                  (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                  color: 'var(--color-neutral-700)',
                }}
                onClick={() => handleSort('points')}
              >
                Điểm{' '}
                {sortField === 'points' &&
                  (sortDirection === 'asc' ? '↑' : '↓')}
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
                Mô tả
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.eloHistoryId}
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
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div
                    style={{
                      color: getActionColor(item.action),
                      fontWeight: '500',
                    }}
                  >
                    {item.action || 'Không có thông tin'}
                  </div>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <span
                    style={{
                      color: getPointsColor(item.points),
                      fontWeight: '600',
                      fontSize: '1rem',
                    }}
                  >
                    {getPointsDisplay(item.points)}
                  </span>
                </td>
                <td style={{ padding: 'var(--spacing-sm)' }}>
                  <div style={{ color: 'var(--color-neutral-600)' }}>
                    {item.description || 'Không có mô tả'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-sm) 0',
            borderTop: '1px solid var(--color-neutral-200)',
          }}
        >
          <div
            style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}
          >
            Hiển thị {startIndex + 1} -{' '}
            {Math.min(startIndex + itemsPerPage, eloHistory.length)} trong{' '}
            {eloHistory.length} hoạt động
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            <button
              className="btn-outline btn-sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Trước
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }

              return (
                <button
                  key={page}
                  className={
                    currentPage === page
                      ? 'btn-accent btn-sm'
                      : 'btn-outline btn-sm'
                  }
                  onClick={() => setCurrentPage(page)}
                  style={{ minWidth: '2rem' }}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="btn-outline btn-sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              style={{
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EloHistoryTable;
