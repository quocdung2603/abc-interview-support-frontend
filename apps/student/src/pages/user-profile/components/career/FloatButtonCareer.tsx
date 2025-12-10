import React from 'react';

interface FloatButtonCareerProps {
  onClick?: () => void;
  className?: string;
  isModalOpen?: boolean;
}

const FloatButtonCareer: React.FC<FloatButtonCareerProps> = ({
  onClick,
  className = '',
  isModalOpen = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center font-bold text-lg ${isModalOpen ? 'animate-pulse' : ''
        } ${className}`}
      title="ABC Career Assistant"
    >
      {isModalOpen ? '✖' : 'ABC'}
    </button>
  );
};

export default FloatButtonCareer;