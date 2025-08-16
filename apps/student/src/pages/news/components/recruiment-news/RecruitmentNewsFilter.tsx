import React from 'react';

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
  return (
    <div className="card-elevated p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-heading-3 text-neutral-800">
          Bộ lọc tin tức tuyển dụng
        </h3>
        <span className="badge-primary">💼 Cơ hội việc làm</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-3">
          <label
            htmlFor="search"
            className="block text-caption font-medium mb-2 text-neutral-700"
          >
            Tìm kiếm việc làm
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="input-field pl-10"
              placeholder="Tìm kiếm theo vị trí, công ty..."
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

        {/* Company Filter */}
        <div>
          <label
            htmlFor="company"
            className="block text-caption font-medium mb-2 text-neutral-700"
          >
            Công ty
          </label>
          <select
            id="company"
            className="select-field"
            value={companyFilter}
            onChange={(e) => onCompanyFilterChange(e.target.value)}
          >
            <option value="">Tất cả công ty</option>
            <option value="tech">Công ty công nghệ</option>
            <option value="finance">Công ty tài chính</option>
            <option value="startup">Startup</option>
            <option value="enterprise">Doanh nghiệp lớn</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label
            htmlFor="location"
            className="block text-caption font-medium mb-2 text-neutral-700"
          >
            Địa điểm
          </label>
          <select
            id="location"
            className="select-field"
            value={locationFilter}
            onChange={(e) => onLocationFilterChange(e.target.value)}
          >
            <option value="">Tất cả địa điểm</option>
            <option value="hanoi">Hà Nội</option>
            <option value="hcm">TP. Hồ Chí Minh</option>
            <option value="danang">Đà Nẵng</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Salary Filter */}
        <div>
          <label
            htmlFor="salary"
            className="block text-caption font-medium mb-2 text-neutral-700"
          >
            Mức lương
          </label>
          <select
            id="salary"
            className="select-field"
            value={salaryFilter}
            onChange={(e) => onSalaryFilterChange(e.target.value)}
          >
            <option value="">Tất cả mức lương</option>
            <option value="under-15m">Dưới 15 triệu</option>
            <option value="15m-25m">15 - 25 triệu</option>
            <option value="25m-40m">25 - 40 triệu</option>
            <option value="above-40m">Trên 40 triệu</option>
            <option value="negotiate">Thỏa thuận</option>
          </select>
        </div>
      </div>

      {/* Sort and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-neutral-200">
        <div className="flex items-center space-x-3">
          <label className="text-caption font-medium text-neutral-700">
            Sắp xếp:
          </label>
          <select
            className="select-field min-w-[140px]"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="salary">Lương cao nhất</option>
          </select>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {searchTerm && (
            <div className="flex items-center bg-accent-10 text-accent px-3 py-1 rounded-full text-caption">
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="ml-2 text-accent hover:text-accent-dark"
                type="button"
              >
                ×
              </button>
            </div>
          )}

          {companyFilter && (
            <div className="flex items-center bg-accent-10 text-accent px-3 py-1 rounded-full text-caption">
              <span>
                Công ty:{' '}
                {companyFilter === 'tech'
                  ? 'Công nghệ'
                  : companyFilter === 'finance'
                  ? 'Tài chính'
                  : companyFilter === 'startup'
                  ? 'Startup'
                  : companyFilter === 'enterprise'
                  ? 'Doanh nghiệp lớn'
                  : companyFilter}
              </span>
              <button
                onClick={() => onCompanyFilterChange('')}
                className="ml-2 text-accent hover:text-accent-dark"
                type="button"
              >
                ×
              </button>
            </div>
          )}

          {locationFilter && (
            <div className="flex items-center bg-accent-10 text-accent px-3 py-1 rounded-full text-caption">
              <span>
                Địa điểm:{' '}
                {locationFilter === 'hanoi'
                  ? 'Hà Nội'
                  : locationFilter === 'hcm'
                  ? 'TP.HCM'
                  : locationFilter === 'danang'
                  ? 'Đà Nẵng'
                  : locationFilter === 'remote'
                  ? 'Remote'
                  : locationFilter === 'hybrid'
                  ? 'Hybrid'
                  : locationFilter}
              </span>
              <button
                onClick={() => onLocationFilterChange('')}
                className="ml-2 text-accent hover:text-accent-dark"
                type="button"
              >
                ×
              </button>
            </div>
          )}

          {salaryFilter && (
            <div className="flex items-center bg-accent-10 text-accent px-3 py-1 rounded-full text-caption">
              <span>
                Lương:{' '}
                {salaryFilter === 'under-15m'
                  ? 'Dưới 15M'
                  : salaryFilter === '15m-25m'
                  ? '15-25M'
                  : salaryFilter === '25m-40m'
                  ? '25-40M'
                  : salaryFilter === 'above-40m'
                  ? 'Trên 40M'
                  : salaryFilter === 'negotiate'
                  ? 'Thỏa thuận'
                  : salaryFilter}
              </span>
              <button
                onClick={() => onSalaryFilterChange('')}
                className="ml-2 text-accent hover:text-accent-dark"
                type="button"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
