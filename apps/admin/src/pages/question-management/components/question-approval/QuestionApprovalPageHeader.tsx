const QuestionBankPageHeader = () => {
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
            📃 Kiểm duyệt câu hỏi
          </div>
          <div className="text-body text-neutral-600">
            Xem, kiểm duyệt câu hỏi đóng góp
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankPageHeader;
