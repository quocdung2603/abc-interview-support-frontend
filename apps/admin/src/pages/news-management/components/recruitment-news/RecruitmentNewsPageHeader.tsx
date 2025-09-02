const RecruitmentNewsPageHeader = () => {
  return (
    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <div>
          <div
            className="text-heading-2 text-gradient-primary"
            style={{ marginBottom: 'var(--spacing-sm)' }}
          >
            � Quản lý tin tức tuyển dụng
          </div>
          <div className="text-body text-neutral-600">
            Quản lý các tin tức tuyển dụng, vị trí công việc và thông báo từ các
            công ty.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentNewsPageHeader;
