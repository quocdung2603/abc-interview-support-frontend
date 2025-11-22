import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

interface Field {
  fieldId: string;
  name: string;
  description?: string;
}

interface Level {
  levelId: string;
  name: 'Fresher' | 'Junior' | 'Senior' | 'Middle';
  description?: string;
}

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedField: string;
  onFieldChange: (fieldId: string) => void;
  selectedLevel: string;
  onLevelChange: (levelId: string) => void;
  fields: Field[];
  levels: Level[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedField,
  onFieldChange,
  selectedLevel,
  onLevelChange,
  fields,
  levels,
}) => {
  const allFields = [
    { fieldId: 'all', name: 'Tất cả lĩnh vực' },
    ...fields,
  ];
  const allLevels = [{ levelId: 'all', name: 'Tất cả cấp độ' }, ...levels];

  return (
    <div className="card-elevated p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Tìm kiếm & Lọc
      </h3>

      {/* Search */}
      <div className="relative mb-4">
        <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài viết, chủ đề..."
          className="input-field pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Field Filter */}
      <div className="mb-4">
        <label
          htmlFor="field-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Lĩnh vực
        </label>
        <select
          id="field-select"
          className="select-field"
          value={selectedField}
          onChange={(e) => onFieldChange(e.target.value)}
        >
          {allFields.map((field) => (
            <option key={field.fieldId} value={field.fieldId}>
              {field.name}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div>
        <label
          htmlFor="level-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Cấp độ
        </label>
        <select
          id="level-select"
          className="select-field"
          value={selectedLevel}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          {allLevels.map((level) => (
            <option key={level.levelId} value={level.levelId}>
              {level.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilters;
