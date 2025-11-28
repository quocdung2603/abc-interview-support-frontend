import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

interface ToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  selectedRowKeys: React.Key[];
}

const FieldToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  selectedRowKeys
}) => {

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'end',
      }}
    >
      <Search
        placeholder="Tìm kiếm theo tên lĩnh vực..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
      />
    </div>
  );
};

export default FieldToolbar;
