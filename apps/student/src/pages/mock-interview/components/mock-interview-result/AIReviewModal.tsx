import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Question, Answer } from '@abc-interview-support-frontend/types';

interface AIReviewModalProps {
  visible: boolean;
  onClose: () => void;
  questions: Question[];
  answers: Record<string, Answer[]>;
  userAnswers: Record<string, string>;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
}

const AIReviewModal: React.FC<AIReviewModalProps> = ({
  visible,
  onClose,
  questions,
  answers,
  userAnswers,
  correctAnswers,
  totalQuestions,
  timeSpent,
}) => {
  const [aiReview, setAiReview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && !aiReview) {
      generateAIReview();
    }
  }, [visible]);

  const generateAIReview = async () => {
    setLoading(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeInMinutes = Math.round(timeSpent / 60);

    // Analyze mistakes
    const incorrectQuestions = questions.filter((q) => {
      const userAnswer = userAnswers[q.id];
      const questionAnswers = answers[q.id] || [];

      if (!userAnswer) return true; // No answer = incorrect

      if (q.questionTypeName === 'SingleChoice') {
        const correctAnswer = questionAnswers.find((a) => a.isCorrect);
        return userAnswer !== correctAnswer?.answerId.toString();
      } else if (q.questionTypeName === 'MultipleChoice') {
        const correctAnswerIds = questionAnswers
          .filter((a) => a.isCorrect)
          .map((a) => a.answerId.toString());
        const userAnswerIds = userAnswer.split('|');
        return !arraysEqual(correctAnswerIds.sort(), userAnswerIds.sort());
      } else if (q.questionTypeName === 'FillInTheBlank') {
        const correctAnswers = questionAnswers
          .filter((a) => a.isCorrect)
          .map((a) => a.answerContent);
        const userAnswersArray = userAnswer.split('|');
        return !correctAnswers.every(
          (correct, index) =>
            userAnswersArray[index]?.toLowerCase() === correct.toLowerCase()
        );
      }

      return false;
    });

    // Count question types
    const questionTypes = questions.reduce((acc, q) => {
      acc[q.questionTypeName] = (acc[q.questionTypeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Analyze topic performance
    const topicAnalysis = questions.reduce((acc, q) => {
      const isCorrect = !incorrectQuestions.some(
        (iq) => iq.id === q.id
      );
      const topicKey = q.topicName || q.topicId.toString();
      if (!acc[topicKey]) {
        acc[topicKey] = { correct: 0, total: 0 };
      }
      acc[topicKey].total++;
      if (isCorrect) acc[topicKey].correct++;
      return acc;
    }, {} as Record<string, { correct: number; total: number }>);

    let review = `🎯 **Phân tích kết quả tổng quan**\n\n`;

    if (percentage >= 80) {
      review += `✨ **Xuất sắc!** Bạn đã đạt được ${percentage}% điểm số, cho thấy sự hiểu biết vững chắc về các kiến thức được kiểm tra.\n\n`;
    } else if (percentage >= 60) {
      review += `👍 **Khá tốt!** Với ${percentage}% điểm số, bạn đã nắm vững phần lớn kiến thức, nhưng vẫn còn một số điểm cần cải thiện.\n\n`;
    } else if (percentage >= 40) {
      review += `📚 **Trung bình.** ${percentage}% điểm số cho thấy bạn có hiểu biết cơ bản, nhưng cần học tập thêm để nâng cao kiến thức.\n\n`;
    } else {
      review += `💪 **Cần cải thiện.** ${percentage}% điểm số cho thấy bạn cần dành thêm thời gian để ôn tập và củng cố kiến thức cơ bản.\n\n`;
    }

    review += `⏱️ **Phân tích thời gian:**\n`;
    review += `- Thời gian hoàn thành: ${timeInMinutes} phút\n`;
    if (timeInMinutes < 30) {
      review += `- Bạn hoàn thành khá nhanh. Hãy chắc chắn rằng bạn đã đọc kỹ từng câu hỏi.\n\n`;
    } else if (timeInMinutes > 50) {
      review += `- Bạn sử dụng gần hết thời gian. Hãy luyện tập để tăng tốc độ giải bài.\n\n`;
    } else {
      review += `- Thời gian hoàn thành hợp lý, cho thấy sự cân bằng giữa tốc độ và độ chính xác.\n\n`;
    }

    review += `📊 **Phân tích theo loại câu hỏi:**\n`;
    Object.entries(questionTypes).forEach(([type, count]) => {
      let typeLabel;
      if (type === 'SingleChoice') {
        typeLabel = 'Trắc nghiệm 1 đáp án';
      } else if (type === 'MultipleChoice') {
        typeLabel = 'Trắc nghiệm nhiều đáp án';
      } else if (type === 'FillInTheBlank') {
        typeLabel = 'Điền vào chỗ trống';
      } else {
        typeLabel = 'Tự luận';
      }

      const correctCount = questions.filter(
        (q) =>
          q.questionTypeName === type &&
          !incorrectQuestions.some((iq) => iq.id === q.id)
      ).length;
      review += `- ${typeLabel}: ${correctCount}/${count} câu đúng\n`;
    });

    review += `\n🎯 **Phân tích theo chủ đề:**\n`;
    Object.entries(topicAnalysis).forEach(([topicId, data]) => {
      const percentage = Math.round((data.correct / data.total) * 100);
      review += `- ${topicId}: ${data.correct}/${data.total} câu (${percentage}%)\n`;
    });

    if (incorrectQuestions.length > 0) {
      review += `\n🔍 **Những điểm cần cải thiện:**\n`;

      const mostMissedTopics = Object.entries(topicAnalysis)
        .filter(([, data]) => data.correct / data.total < 0.7)
        .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
        .slice(0, 3);

      if (mostMissedTopics.length > 0) {
        review += `\n**Chủ đề cần ôn tập ưu tiên:**\n`;
        mostMissedTopics.forEach(([topicId, data]) => {
          const percentage = Math.round((data.correct / data.total) * 100);
          review += `• ${topicId} (${percentage}% đúng)\n`;
        });
      }

      review += `\n**Gợi ý cải thiện:**\n`;
      review += `• Xem lại giải thích của ${incorrectQuestions.length} câu bạn làm sai\n`;
      review += `• Tập trung ôn tập các chủ đề có tỷ lệ đúng thấp\n`;
      review += `• Luyện tập thêm với các câu hỏi tương tự\n`;
      review += `• Đọc kỹ đề bài trước khi trả lời\n`;
    }

    review += `\n🚀 **Lời khuyên cho lần thi tiếp theo:**\n`;
    review += `• Dành thời gian đều cho từng câu hỏi\n`;
    review += `• Kiểm tra lại đáp án trước khi nộp bài\n`;
    review += `• Không bỏ trống câu nào, hãy đoán nếu không chắc chắn\n`;
    review += `• Thực hành thường xuyên để cải thiện kỹ năng\n\n`;

    review += `💡 **Kết luận:** ${percentage >= 70
      ? 'Bạn đã có nền tảng tốt! Hãy tiếp tục duy trì và hoàn thiện thêm.'
      : 'Đây là cơ hội tuyệt vời để học hỏi và phát triển. Hãy tiếp tục cố gắng!'
      }`;

    setAiReview(review);
    setLoading(false);
  };

  const arraysEqual = (arr1: string[], arr2: string[]) => {
    return (
      arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i])
    );
  };

  const formatReviewText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div
            key={index}
            style={{ fontWeight: '600', margin: '0.5rem 0', color: '#1e293b' }}
          >
            {line.replace(/\*\*/g, '')}
          </div>
        );
      } else if (line.startsWith('•') || line.startsWith('-')) {
        return (
          <div
            key={index}
            style={{
              margin: '0.25rem 0',
              paddingLeft: '1rem',
              color: '#64748b',
            }}
          >
            {line}
          </div>
        );
      } else if (
        line.startsWith('🎯') ||
        line.startsWith('⏱️') ||
        line.startsWith('📊') ||
        line.startsWith('🔍') ||
        line.startsWith('🚀') ||
        line.startsWith('💡')
      ) {
        return (
          <div
            key={index}
            style={{
              fontWeight: '600',
              margin: '1rem 0 0.5rem 0',
              color: '#0ea5e9',
              fontSize: '1.1rem',
            }}
          >
            {line}
          </div>
        );
      } else if (line.trim() === '') {
        return <div key={index} style={{ height: '0.5rem' }} />;
      }

      return (
        <div
          key={index}
          style={{ margin: '0.25rem 0', color: '#374151', lineHeight: '1.6' }}
        >
          {line}
        </div>
      );
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <span>AI Đánh giá và Định hướng</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          Đóng
        </button>,
      ]}
      width={800}
      style={{ maxHeight: '80vh', overflow: 'auto' }}
      bodyStyle={{
        maxHeight: '60vh',
        overflow: 'auto',
        padding: '1.5rem',
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              border: '3px solid #f3f4f6',
              borderTop: '3px solid #0ea5e9',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <div style={{ color: '#64748b' }}>
            🤖 AI đang phân tích kết quả của bạn...
          </div>
        </div>
      ) : (
        <div
          style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
          }}
        >
          {formatReviewText(aiReview)}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Modal>
  );
};

export default AIReviewModal;
