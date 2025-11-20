import React, { useState } from 'react';

interface Comment {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
}

interface TrendNewsDetailCommentsProps {
  newsId: string;
}

export const TrendNewsDetailComments: React.FC<
  TrendNewsDetailCommentsProps
> = ({ newsId }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      authorName: 'Nguyễn Văn A',
      authorInitials: 'NA',
      content:
        'Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ những thông tin quý giá về xu hướng công nghệ hiện tại.',
      createdAt: new Date('2025-01-14T10:30:00'),
      likes: 5,
      isLiked: false,
    },
    {
      id: '2',
      authorName: 'Trần Thị B',
      authorInitials: 'TB',
      content:
        'Thông tin trong bài viết rất cập nhật và thiết thực. Tôi đã áp dụng một số gợi ý và thấy hiệu quả tích cực.',
      createdAt: new Date('2025-01-14T14:20:00'),
      likes: 3,
      isLiked: true,
    },
    {
      id: '3',
      authorName: 'Lê Văn C',
      authorInitials: 'LC',
      content:
        'Có thể tác giả chia sẻ thêm về cách chuẩn bị cho những xu hướng này không? Rất mong được biết thêm chi tiết.',
      createdAt: new Date('2025-01-14T16:45:00'),
      likes: 2,
      isLiked: false,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const comment: Comment = {
      id: Date.now().toString(),
      authorName: 'Bạn',
      authorInitials: 'B',
      content: newComment.trim(),
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  return (
    <div className="bg-neutral-50 py-10">
      <div className="container-center">
        <div className="max-w-4xl mx-auto">
          <div className="card-elevated p-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-heading-2 text-neutral-800 mb-2 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Bình luận ({comments.length})
              </h2>
              <p className="text-body text-neutral-600">
                Chia sẻ suy nghĩ của bạn về bài viết này
              </p>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  B
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="input-field min-h-[100px] resize-none"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-caption text-neutral-500">
                      {newComment.length}/500 ký tự
                    </span>
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-2 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          Gửi bình luận
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-neutral-100 rounded-full">
                    <svg
                      className="w-8 h-8 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-heading-3 text-neutral-700 mb-2">
                    Chưa có bình luận
                  </h3>
                  <p className="text-body text-neutral-500">
                    Hãy là người đầu tiên bình luận về bài viết này!
                  </p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {comment.authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-body font-semibold text-neutral-800">
                            {comment.authorName}
                          </h4>
                          <time className="text-caption text-neutral-500">
                            {formatDate(comment.createdAt)}
                          </time>
                        </div>
                        <p className="text-body text-neutral-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4 mt-3">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center space-x-1 text-caption transition-colors ${
                            comment.isLiked
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-neutral-500 hover:text-red-500'
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 ${
                              comment.isLiked ? 'fill-current' : ''
                            }`}
                            fill={comment.isLiked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span>{comment.likes}</span>
                        </button>

                        <button className="text-caption text-neutral-500 hover:text-accent transition-colors">
                          Trả lời
                        </button>

                        <button className="text-caption text-neutral-500 hover:text-neutral-700 transition-colors">
                          Báo cáo
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Load More Comments */}
            {comments.length > 0 && (
              <div className="text-center mt-6 pt-8 border-t border-neutral-200">
                <button className="btn-outline">Xem thêm bình luận</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
