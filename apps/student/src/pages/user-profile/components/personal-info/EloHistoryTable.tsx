import React, { useState } from 'react';
import { EloHistory } from '@abc-interview-support-frontend/types';

interface EloHistoryProps {
  eloHistory: EloHistory[];
}

const EloHistoryTable: React.FC<EloHistoryProps> = ({ eloHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
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
    if (!action) return 'text-gray-600';

    const lowerAction = action.toLowerCase();
    if (
      lowerAction.includes('thắng') ||
      lowerAction.includes('hoàn thành') ||
      lowerAction.includes('chính xác')
    ) {
      return 'text-green-600';
    }
    if (
      lowerAction.includes('thua') ||
      lowerAction.includes('sai') ||
      lowerAction.includes('thất bại')
    ) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const getPointsDisplay = (points: number) => {
    return points > 0 ? `+${points}` : `${points}`;
  };

  const getPointsColor = (points: number) => {
    return points > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (eloHistory.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Lịch sử điểm ELO</h2>
        <div className="text-center py-12">
          <div className="text-4xl mb-4 opacity-30">📈</div>
          <p className="text-gray-500">Chưa có hoạt động nào để hiển thị lịch sử ELO</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Lịch sử điểm ELO</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          Tổng {eloHistory.length} hoạt động
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th
                className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                Thời gian {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('action')}
              >
                Hoạt động {sortField === 'action' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('points')}
              >
                Điểm {sortField === 'points' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Mô tả
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-gray-900 font-medium">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={`font-medium ${getActionColor(item.action)}`}>
                    {item.action || 'Không có thông tin'}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-bold text-lg ${getPointsColor(item.points)}`}>
                    {getPointsDisplay(item.points)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-600">
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
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, eloHistory.length)} trong {eloHistory.length} hoạt động
          </div>

          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
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
                  className={`px-3 py-1 text-sm rounded-md min-w-[2rem] ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
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
