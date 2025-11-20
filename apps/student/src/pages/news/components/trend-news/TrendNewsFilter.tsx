interface TrendNewsFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  authorFilter: string;
  onAuthorFilterChange: (author: string) => void;
  sortBy: 'newest' | 'oldest';
  onSortChange: (sort: 'newest' | 'oldest') => void;
}

export const TrendNewsFilter = ({
  searchTerm,
  onSearchChange,
  authorFilter,
  onAuthorFilterChange,
  sortBy,
  onSortChange,
}: TrendNewsFilterProps) => {
  const getAuthorLabel = (author: string) => {
    switch (author) {
      case 'admin':
        return 'Quản trị viên';
      case 'recruiter':
        return 'Nhà tuyển dụng';
      case 'user':
        return 'Người dùng';
      default:
        return author;
    }
  };

  return (
    <div className="card-elevated p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-heading-3 text-neutral-800">
          Bộ lọc tin tức xu hướng
        </h3>
        <span className="badge-neutral">📈 Chỉ tin tức xu hướng</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search Input */}
        <div>
          <label
            htmlFor="search"
            className="block text-caption font-medium mb-2 text-neutral-700"
          >
            Tìm kiếm
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="input-field pl-10"
              placeholder="Tìm kiếm tin tức..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Author Filter */}
        <div>
          <label
            htmlFor="author"
            className="block text-caption font-medium mb-2 text-neutral-700"
          >
            Tác giả
          </label>
          <select
            id="author"
            className="select-field"
            value={authorFilter}
            onChange={(e) => onAuthorFilterChange(e.target.value)}
          >
            <option value="">Tất cả tác giả</option>
            <option value="admin">Quản trị viên</option>
            <option value="recruiter">Nhà tuyển dụng</option>
            <option value="user">Người dùng</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label
            htmlFor="sort"
            className="block text-caption font-medium mb-2 text-neutral-700"
          >
            Sắp xếp theo
          </label>
          <select
            id="sort"
            className="select-field"
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'newest' | 'oldest')
            }
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || authorFilter) && (
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-caption text-neutral-600">Đang lọc:</span>
            {searchTerm && (
              <span className="badge-secondary">
                Từ khóa: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
                  aria-label="Xóa bộ lọc từ khóa"
                >
                  ×
                </button>
              </span>
            )}
            {authorFilter && (
              <span className="badge-secondary">
                Tác giả: {getAuthorLabel(authorFilter)}
                <button
                  onClick={() => onAuthorFilterChange('')}
                  className="ml-2 text-neutral-500 hover:text-neutral-700 transition-colors"
                  aria-label="Xóa bộ lọc tác giả"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
