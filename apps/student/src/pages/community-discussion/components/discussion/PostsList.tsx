import React, { useState } from 'react';
import DiscussionPostComponent from './DiscussionPost';
import { Field, Level, Post, Topic } from '@abc-interview-support-frontend/types';

interface PostsListProps {
  posts: Post[];
  onPostClick: (postId: number) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const POSTS_PER_PAGE = 9;

const PostsList: React.FC<PostsListProps> = ({
  posts,
  onPostClick,
  fields,
  topics,
  levels,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of posts list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (posts.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <div className="text-gray-400 mb-3">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Chưa có câu hỏi nào
        </h3>
        <p className="text-gray-600">
          Admin sẽ đăng câu hỏi phỏng vấn để mọi người cùng tham gia trả lời!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPosts.map((post) => (
          <DiscussionPostComponent
            key={post.id}
            post={post}
            onPostClick={onPostClick}
            fields={fields}
            topics={topics}
            levels={levels}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 space-y-4">
          {/* Page Info */}
          <div className="text-center text-body text-neutral-600">
            Trang {currentPage} của {totalPages} ({posts.length} bài viết)
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Đầu
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Trước
            </button>

            <div className="flex space-x-1">
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                // Adjust startPage if we're near the end
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-2 py-2 text-neutral-500">
                        ...
                      </span>
                    );
                  }
                }

                // Add visible pages
                for (let page = startPage; page <= endPage; page++) {
                  pages.push(
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                    >
                      {page}
                    </button>
                  );
                }

                // Add last page and ellipsis if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-2 py-2 text-neutral-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau →
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cuối
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;
