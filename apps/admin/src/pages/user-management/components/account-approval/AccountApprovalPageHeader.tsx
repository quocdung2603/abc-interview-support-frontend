const AccountApprovalPageHeader = () => {
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
            📃 Quản lý Xác thực tài khoản
          </div>
          <div className="text-body text-neutral-600">
            Xem, xác thực, từ chối yêu cầu xác thực tài khoản doanh nghiệp.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountApprovalPageHeader;
