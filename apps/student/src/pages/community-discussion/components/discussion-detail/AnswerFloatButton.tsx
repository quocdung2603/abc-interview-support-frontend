interface AnswerFloatButtonProps {
  handleFloatButtonClick: () => void;
}

const AnswerFloatButton: React.FC<AnswerFloatButtonProps> = ({
  handleFloatButtonClick,
}) => {
  return (
    <button
      className="fixed bottom-10 right-10 z-50 btn-secondary"
      onClick={handleFloatButtonClick}
    >
      Gửi câu trả lời của bạn
    </button>
  );
};

export default AnswerFloatButton;
