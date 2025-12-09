import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface CreateQuestionButtonProps {
  onClick: () => void;
}

const CreateQuestionButton: React.FC<CreateQuestionButtonProps> = ({ onClick }) => {
  return (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={onClick}
      size="large"
      className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
    >
      Tạo câu hỏi
    </Button>
  );
};

export default CreateQuestionButton;