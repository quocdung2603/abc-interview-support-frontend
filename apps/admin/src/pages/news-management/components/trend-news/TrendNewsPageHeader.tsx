const TrendNewsPageHeader = () => {
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
            📃 Quản lý tin tức xu hướng
          </div>
          <div className="text-body text-neutral-600">
            Tạo, chỉnh sửa, các tin tức xu hướng.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendNewsPageHeader;
