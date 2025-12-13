import React from 'react';
import { Card, Input, Select, Button, Tag, Space, Row, Col } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  BankOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';

type SortOption = 'newest' | 'oldest' | 'salary';

interface RecruitmentNewsFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  companyFilter: string;
  onCompanyFilterChange: (company: string) => void;
  locationFilter: string;
  onLocationFilterChange: (location: string) => void;
  salaryFilter: string;
  onSalaryFilterChange: (salary: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const RecruitmentNewsFilter: React.FC<RecruitmentNewsFilterProps> = ({
  searchTerm,
  onSearchChange,
  companyFilter,
  onCompanyFilterChange,
  locationFilter,
  onLocationFilterChange,
  salaryFilter,
  onSalaryFilterChange,
  sortBy,
  onSortChange,
}) => {
  const getCompanyLabel = (value: string) => {
    const labels: Record<string, string> = {
      tech: 'Công ty công nghệ',
      finance: 'Công ty tài chính',
      startup: 'Startup',
      enterprise: 'Doanh nghiệp lớn',
    };
    return labels[value] || value;
  };

  const getLocationLabel = (value: string) => {
    const labels: Record<string, string> = {
      hanoi: 'Hà Nội',
      hcm: 'TP. Hồ Chí Minh',
      danang: 'Đà Nẵng',
      remote: 'Remote',
      hybrid: 'Hybrid',
    };
    return labels[value] || value;
  };

  const getSalaryLabel = (value: string) => {
    const labels: Record<string, string> = {
      'under-15m': 'Dưới 15 triệu',
      '15m-25m': '15 - 25 triệu',
      '25m-40m': '25 - 40 triệu',
      'above-40m': 'Trên 40 triệu',
      negotiate: 'Thỏa thuận',
    };
    return labels[value] || value;
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCompanyFilterChange('');
    onLocationFilterChange('');
    onSalaryFilterChange('');
  };

  const hasActiveFilters = searchTerm || companyFilter || locationFilter || salaryFilter;

  return (
    <Card className="mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* All Filters in One Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-end">
          {/* Search Input - Full width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm việc làm
            </label>
            <Input
              placeholder="Tìm kiếm theo vị trí, công ty..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              allowClear
              size="middle"
            />
          </div>
          {/* Company Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Công ty
            </label>
            <Select
              placeholder="Loại công ty"
              value={companyFilter || undefined}
              onChange={(value) => onCompanyFilterChange(value || '')}
              allowClear
              className="w-full"
              size="middle"
            >
              <Select.Option value="tech">🏢 Công nghệ</Select.Option>
              <Select.Option value="finance">💰 Tài chính</Select.Option>
              <Select.Option value="startup">🚀 Startup</Select.Option>
              <Select.Option value="enterprise">🏛️ DN lớn</Select.Option>
            </Select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Địa điểm
            </label>
            <Select
              placeholder="Địa điểm"
              value={locationFilter || undefined}
              onChange={(value) => onLocationFilterChange(value || '')}
              allowClear
              className="w-full"
              size="middle"
            >
              <Select.Option value="hanoi">📍 Hà Nội</Select.Option>
              <Select.Option value="hcm">🌆 TP.HCM</Select.Option>
              <Select.Option value="danang">🏖️ Đà Nẵng</Select.Option>
              <Select.Option value="remote">🏠 Remote</Select.Option>
              <Select.Option value="hybrid">🏢 Hybrid</Select.Option>
            </Select>
          </div>

          {/* Salary Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Mức lương
            </label>
            <Select
              placeholder="Mức lương"
              value={salaryFilter || undefined}
              onChange={(value) => onSalaryFilterChange(value || '')}
              allowClear
              className="w-full"
              size="middle"
            >
              <Select.Option value="under-15m">💵 &lt;15M</Select.Option>
              <Select.Option value="15m-25m">💰 15-25M</Select.Option>
              <Select.Option value="25m-40m">💎 25-40M</Select.Option>
              <Select.Option value="above-40m">💎 &gt;40M</Select.Option>
              <Select.Option value="negotiate">🤝 Thỏa thuận</Select.Option>
            </Select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sắp xếp
            </label>
            <Select
              value={sortBy}
              onChange={(value) => onSortChange(value)}
              className="w-full"
              size="middle"
            >
              <Select.Option value="newest">🕒 Mới nhất</Select.Option>
              <Select.Option value="oldest">📅 Cũ nhất</Select.Option>
              <Select.Option value="salary">💰 Lương cao</Select.Option>
            </Select>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <div>
              <Button
                type="default"
                icon={<ClearOutlined />}
                onClick={clearAllFilters}
                size="middle"
                className="w-full"
              >
                Xóa tất cả
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 font-medium">Đang lọc:</span>
            <Space wrap>
              {searchTerm && (
                <Tag
                  color="blue"
                  closable
                  onClose={() => onSearchChange('')}
                  className="text-xs"
                >
                  🔍 "{searchTerm}"
                </Tag>
              )}
              {companyFilter && (
                <Tag
                  color="green"
                  closable
                  onClose={() => onCompanyFilterChange('')}
                  className="text-xs"
                >
                  🏢 {getCompanyLabel(companyFilter)}
                </Tag>
              )}
              {locationFilter && (
                <Tag
                  color="purple"
                  closable
                  onClose={() => onLocationFilterChange('')}
                  className="text-xs"
                >
                  📍 {getLocationLabel(locationFilter)}
                </Tag>
              )}
              {salaryFilter && (
                <Tag
                  color="orange"
                  closable
                  onClose={() => onSalaryFilterChange('')}
                  className="text-xs"
                >
                  💰 {getSalaryLabel(salaryFilter)}
                </Tag>
              )}
            </Space>
          </div>
        </div>
      )}
    </Card>
  );
};
