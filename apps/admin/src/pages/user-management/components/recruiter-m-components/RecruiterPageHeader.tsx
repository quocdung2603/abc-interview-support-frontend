const RecruiterPageHeader = () => {
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
            📃 Quản lý nhà tuyển dụng
          </div>
          <div className="text-body text-neutral-600">
            Xem, chỉnh sửa và quản lý các tài khoản nhà tuyển dụng.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterPageHeader;
