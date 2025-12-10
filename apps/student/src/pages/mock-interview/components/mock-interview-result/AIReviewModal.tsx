import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Question, Answer } from '@abc-interview-support-frontend/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { generateAIReviewPrompt } from './aiReviewPrompts';

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

      // Generate prompt using imported function
      const prompt = generateAIReviewPrompt(examData);

      const aiResponse = await callGeminiAPI(prompt);
      setAiReview(aiResponse);
    } catch (err) {
      console.error('Error generating AI review:', err);
      setError('Không thể tạo đánh giá từ AI. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
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
          className="prose prose-sm max-w-none"
        >
          <ReactMarkdown
            components={{
              // Custom styling for markdown elements
              p: ({ children }) => (
                <p style={{ margin: '0.5rem 0', color: '#374151', lineHeight: '1.6' }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', listStyleType: 'decimal' }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ margin: '0.25rem 0', color: '#64748b' }}>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: '600', color: '#1e293b' }}>
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em style={{ fontStyle: 'italic', color: '#64748b' }}>
                  {children}
                </em>
              ),
              code: ({ children }) => (
                <code
                  style={{
                    background: '#e2e8f0',
                    padding: '0.125rem 0.25rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    color: '#0f172a',
                  }}
                >
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre
                  style={{
                    background: '#e2e8f0',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    overflowX: 'auto',
                    margin: '1rem 0',
                  }}
                >
                  {children}
                </pre>
              ),
              h1: ({ children }) => (
                <h1
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: '1.5rem 0 0.75rem 0',
                    color: '#0ea5e9',
                  }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    margin: '1.25rem 0 0.5rem 0',
                    color: '#0ea5e9',
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: '1rem 0 0.5rem 0',
                    color: '#0284c7',
                  }}
                >
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: '0.75rem 0 0.5rem 0',
                    color: '#0369a1',
                  }}
                >
                  {children}
                </h4>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  style={{
                    borderLeft: '4px solid #0ea5e9',
                    paddingLeft: '1rem',
                    fontStyle: 'italic',
                    margin: '1rem 0',
                    color: '#64748b',
                  }}
                >
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #e2e8f0',
                    margin: '1.5rem 0',
                  }}
                />
              ),
            }}
          >
            {aiReview}
          </ReactMarkdown>
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
