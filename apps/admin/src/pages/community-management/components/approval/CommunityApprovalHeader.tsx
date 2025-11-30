interface PageHeaderProps {
  onCreate: () => void;
}

const CommunityApprovalHeader: React.FC<PageHeaderProps> = ({ onCreate }) => {
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
            Quản lý người dùng
          </div>
          <div className="text-body text-neutral-600">
            Xem, chỉnh sửa và quản lý các tài khoản người dùng.
          </div>
        </div>
      </div>

    </div>
  );
};

export default CommunityApprovalHeader;