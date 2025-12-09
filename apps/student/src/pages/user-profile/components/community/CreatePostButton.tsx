import React from 'react';

interface CreatePostButtonProps {
  onClick: () => void;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
    >
      <span className="text-lg">✍️</span>
      <span>Tạo bài thảo luận</span>
    </button>
  );
};

export default CreatePostButton;
