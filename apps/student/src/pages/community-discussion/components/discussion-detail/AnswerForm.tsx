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
  postType: 'DISCUSSION' | 'QUESTION';
  remainingComments?: number;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  onSubmit,
  disabled = false,
  placeholder = 'Nhập câu trả lời của bạn...',
  handleAnswerClick,
  postType,
  remainingComments = 3,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting || disabled || (postType === 'QUESTION' && remainingComments <= 0)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
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

  const getRemainingCommentsColor = (remainingComments: number, postType: string) => {
    if (postType === 'DISCUSSION') return 'text-blue-600'; // Màu xanh cho discussion
    if (remainingComments === 0) return 'text-red-600';
    if (remainingComments <= 1) return 'text-orange-600';
    return 'text-green-600';
  };

  const getRemainingCommentsText = (remainingComments: number, postType: string) => {
    if (postType === 'DISCUSSION') {
      return 'Thảo luận tự do - Bình luận thoải mái';
    }
    const usedComments = 3 - remainingComments;
    return `Đã bình luận ${usedComments}/3 lần - Còn ${remainingComments} lượt`;
  };

  const isDisabled = disabled || isSubmitting || !content.trim() || (postType === 'QUESTION' && remainingComments <= 0);

  return (
    <div className="card-elevated max-w-4xl min-w-3xl p-4">
      <div className=" w-full flex justify-between items-center">
        <h3
          className={`text-lg font-semibold  ${getRemainingCommentsColor(
            remainingComments,
            postType
          )} mb-3`}
        >
          {getRemainingCommentsText(remainingComments, postType)}
        </h3>
        <button onClick={handleAnswerClick}>
          <CloseOutlined className="text-lg text-red-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={postType === 'QUESTION' && remainingComments <= 0 ? 'Bạn đã hết lượt bình luận cho câu hỏi này' : placeholder}
            rows={6}
            disabled={disabled || isSubmitting || (postType === 'QUESTION' && remainingComments <= 0)}
            className={`input-field resize-none ${disabled || (postType === 'QUESTION' && remainingComments <= 0) ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-1">
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
            ) : (postType === 'QUESTION' && remainingComments <= 0) ? (
              <span className="text-red-600">
                ⚠️ Bạn đã hết lượt bình luận cho câu hỏi này
              </span>
            ) : (
              <span>💡 Hãy đưa ra câu trả lời chi tiết và hữu ích</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={`btn-primary inline-flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''
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
