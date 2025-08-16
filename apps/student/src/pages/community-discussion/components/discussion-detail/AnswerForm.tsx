import React, { useState } from 'react';
import {
  SendOutlined,
  LoadingOutlined,
  CloseOutlined,
} from '@ant-design/icons';

interface AnswerFormProps {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  handleAnswerClick: () => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  onSubmit,
  disabled = false,
  placeholder = 'Nhập câu trả lời của bạn...',
  handleAnswerClick,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [counterSend, setCounterSend] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting || disabled || counterSend >= 1) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
      setCounterSend(counterSend + 1);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const getCounterSendColor = (counterSend: number) => {
    if (counterSend === 0) return 'text-green-600';
    return 'text-red-600';
  };

  const isDisabled = disabled || isSubmitting || !content.trim();

  return (
    <div className="card-elevated max-w-4xl min-w-3xl p-6">
      <div className=" w-full flex justify-between items-center">
        <h3
          className={`text-lg font-semibold  ${getCounterSendColor(
            counterSend
          )} mb-4`}
        >
          Còn {1 - counterSend}/1 lượt trả lời
        </h3>
        <button onClick={handleAnswerClick}>
          <CloseOutlined className="text-lg text-red-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={6}
            disabled={disabled || isSubmitting}
            className={`input-field resize-none ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">
              {content.length}/2000 ký tự
              {!disabled && (
                <span className="ml-2">
                  • Nhấn{' '}
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                    Ctrl+Enter
                  </kbd>{' '}
                  để gửi
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {disabled ? (
              <span className="text-red-600">
                ⚠️ Cuộc thảo luận đã kết thúc
              </span>
            ) : (
              <span>💡 Hãy đưa ra câu trả lời chi tiết và hữu ích</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={`btn-primary inline-flex items-center gap-2 ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <LoadingOutlined className="animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <SendOutlined />
                Gửi câu trả lời
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
