import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Question, Answer } from '@abc-interview-support-frontend/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible && !aiReview) {
      generateAIReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    console.log('Environment variables:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      allEnvKeys: Object.keys(import.meta.env)
    });

    if (!apiKey) {
      console.error('API key is missing. Please check .env file and restart dev server.');
      throw new Error('API key không được cấu hình. Vui lòng kiểm tra file .env và restart lại dev server.');
    }

    try {
      // Initialize Google Generative AI with API key
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the model
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      });

      // Generate content
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log('API Response:', text);
      return text;
    } catch (error: any) {
      console.error('Gemini API Error:', error);

      // Handle rate limit error
      if (error?.message?.includes('429') || error?.message?.includes('quota')) {
        throw new Error('Đã vượt giới hạn quota API. Vui lòng thử lại sau 20 giây hoặc đợi một lát.');
      }

      throw new Error(`Không thể kết nối với AI: ${error?.message || 'Unknown error'}`);
    }
  }; const generateAIReview = async () => {
    setLoading(true);
    setError('');

    try {
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const timeInMinutes = Math.round(timeSpent / 60);

      // Prepare exam data for AI
      const examData = {
        totalQuestions,
        correctAnswers,
        incorrectAnswers: totalQuestions - correctAnswers,
        scorePercentage: percentage,
        timeSpent: timeInMinutes,
        questions: questions.map((q) => ({
          id: q.id,
          content: q.questionContent,
          topic: q.topicName || 'Unknown',
          field: q.fieldName || 'Unknown',
          level: q.levelName || 'Unknown',
          type: q.questionTypeName || 'Unknown',
          userAnswer: userAnswers[q.id] || 'Không trả lời',
          correctAnswer: q.questionAnswer,
        })),
      };

      // Create prompt for Gemini
      const prompt = `Bạn là một chuyên gia đánh giá kết quả học tập và định hướng nghề nghiệp. Hãy phân tích kết quả bài kiểm tra sau và đưa ra nhận xét chi tiết, đánh giá năng lực và định hướng phát triển:

**Thông tin bài kiểm tra:**
- Tổng số câu hỏi: ${examData.totalQuestions}
- Số câu trả lời đúng: ${examData.correctAnswers}
- Số câu trả lời sai: ${examData.incorrectAnswers}
- Điểm số: ${examData.scorePercentage}%
- Thời gian hoàn thành: ${examData.timeSpent} phút

**Chi tiết câu hỏi và câu trả lời:**
${examData.questions.map((q, idx) => `
Câu ${idx + 1}:
- Nội dung: ${q.content}
- Chủ đề: ${q.topic}
- Lĩnh vực: ${q.field}
- Cấp độ: ${q.level}
- Loại câu hỏi: ${q.type}
- Câu trả lời của thí sinh: ${q.userAnswer}
- Đáp án đúng: ${q.correctAnswer}
`).join('\n')}

Hãy phân tích và đưa ra:

1. **ĐÁNH GIÁ TỔNG QUAN** (2-3 câu): Nhận xét về kết quả tổng thể, điểm mạnh và điểm yếu

2. **PHÂN TÍCH CHI TIẾT**:
   - Phân tích theo chủ đề: Chủ đề nào làm tốt, chủ đề nào cần cải thiện
   - Phân tích theo cấp độ: Đánh giá khả năng ở các mức độ khó khác nhau
   - Phân tích theo loại câu hỏi: Loại câu hỏi nào làm tốt nhất

3. **ĐIỂM MẠNH**: Liệt kê 2-3 điểm mạnh cụ thể dựa trên kết quả

4. **ĐIỂM CẦN CẢI THIỆN**: Liệt kê 2-3 điểm cần cải thiện cụ thể và giải thích tại sao

5. **LỘ TRÌNH HỌC TẬP**: 
   - Đề xuất 3-4 hướng học tập ưu tiên
   - Gợi ý tài nguyên học tập phù hợp
   - Thời gian dự kiến để cải thiện

6. **ĐỊNH HƯỚNG NGHỀ NGHIỆP**:
   - Đánh giá mức độ sẵn sàng cho vị trí công việc dựa trên kết quả
   - Gợi ý vị trí phù hợp với năng lực hiện tại
   - Các kỹ năng cần bổ sung để đạt mục tiêu nghề nghiệp

7. **KẾ HOẠCH HÀNH ĐỘNG**: 3-5 bước cụ thể để cải thiện trong 1-3 tháng tới

Hãy viết bằng tiếng Việt, tone thân thiện, động viên và mang tính xây dựng. Sử dụng emoji phù hợp để dễ đọc hơn.`;

      const aiResponse = await callGeminiAPI(prompt);
      setAiReview(aiResponse);
    } catch (err) {
      console.error('Error generating AI review:', err);
      setError('Không thể tạo đánh giá từ AI. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
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
      styles={{
        body: {
          maxHeight: '60vh',
          overflow: 'auto',
          padding: '1.5rem',
        },
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
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Vui lòng đợi trong giây lát
          </div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: '#dc2626', marginBottom: '1rem' }}>
            {error}
          </div>
          <button
            onClick={() => {
              setError('');
              generateAIReview();
            }}
            className="btn-secondary"
          >
            Thử lại
          </button>
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
