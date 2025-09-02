const NewsApprovalPageHeader = () => {
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
            📃 Kiểm duyệt tin tức
          </div>
          <div className="text-body text-neutral-600">
            Xét duyệt tin tức xu hướng, tin tức tuyển dụng trên hệ thống.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsApprovalPageHeader;
