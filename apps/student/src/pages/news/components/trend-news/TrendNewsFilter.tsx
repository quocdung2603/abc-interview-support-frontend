import React from 'react';
import { Input, Select, DatePicker, Card } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Field } from '@abc-interview-support-frontend/types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TrendNewsFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  fields: Field[];
  fieldId: number | undefined;
  onFieldChange: (fieldId: number | undefined) => void;
  dateRange: [string, string] | null;
  onDateRangeChange: (dateRange: [string, string] | null) => void;
}

export const TrendNewsFilter: React.FC<TrendNewsFilterProps> = ({
  searchTerm,
  onSearchChange,
  fields,
  fieldId,
  onFieldChange,
  dateRange,
  onDateRangeChange,
}) => {
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      onDateRangeChange(dateStrings);
    } else {
      onDateRangeChange(null);
    }
  };

  const getFieldName = (id: number) => {
    const field = fields.find(f => f.id === id);
    return field ? field.name : 'Không xác định';
  };

  return (
    <Card className="mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FilterOutlined className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Bộ lọc tin tức xu hướng
          </h3>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          📈 {fields.length} lĩnh vực
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm theo tiêu đề
          </label>
          <Input
            placeholder="Nhập tiêu đề tin tức..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
          />
        </div>

        {/* Field Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lĩnh vực
          </label>
          <Select
            placeholder="Chọn lĩnh vực"
            value={fieldId}
            onChange={(value) => onFieldChange(value)}
            allowClear
            className="w-full"
          >
            {fields.map((field) => (
              <Option key={field.id} value={field.id}>
                {field.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian tạo
          </label>
          <RangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            value={dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
            onChange={handleDateRangeChange}
            className="w-full"
            format="DD/MM/YYYY"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || fieldId || dateRange) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Đang lọc:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Tiêu đề: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  aria-label="Xóa bộ lọc tiêu đề"
                >
                  ×
                </button>
              </span>
            )}
            {fieldId && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Lĩnh vực: {getFieldName(fieldId)}
                <button
                  onClick={() => onFieldChange(undefined)}
                  className="ml-2 text-green-600 hover:text-green-800"
                  aria-label="Xóa bộ lọc lĩnh vực"
                >
                  ×
                </button>
              </span>
            )}
            {dateRange && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Thời gian: {dayjs(dateRange[0]).format('DD/MM/YYYY')} - {dayjs(dateRange[1]).format('DD/MM/YYYY')}
                <button
                  onClick={() => onDateRangeChange(null)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                  aria-label="Xóa bộ lọc thời gian"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
