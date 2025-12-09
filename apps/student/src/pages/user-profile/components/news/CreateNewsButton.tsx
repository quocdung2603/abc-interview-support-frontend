import React from 'react';

interface CreateNewsButtonProps {
  onClick: () => void;
}

const CreateNewsButton: React.FC<CreateNewsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
    >
      <span className="text-lg">📰</span>
      <span>Tạo tin tức mới</span>
    </button>
  );
};

export default CreateNewsButton;
