import React, { useState } from 'react';
import { Modal, Typography, Divider, Space, Tag, Card, Tabs, Button, Spin, Alert, message } from 'antd';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import { generateComparisonPrompt, AIComparisonResult, QuestionComparisonInput } from './aiComparisonPrompt';

const { Title, Text, Paragraph } = Typography;

interface QuestionComparisonModalProps {
  visible: boolean;
  onClose: () => void;
  currentQuestion: Question | null;
  compareQuestion: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionComparisonModal: React.FC<QuestionComparisonModalProps> = ({
  visible,
  onClose,
  currentQuestion,
  compareQuestion,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [activeTab, setActiveTab] = useState('currentQuestion');
  const [aiResult, setAiResult] = useState<AIComparisonResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const getFieldName = (fieldId: number) => {
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.name || 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    return level?.name || 'N/A';
  };

  const getQuestionTypeName = (questionTypeId: number) => {
    const type = questionTypes.find((t) => t.id === questionTypeId);
    return type?.name || 'N/A';
  };

  const handleRunAIComparison = async () => {
    if (!currentQuestion || !compareQuestion) {
      message.error('Thiếu thông tin câu hỏi để so sánh');
      return;
    }

    setIsLoadingAI(true);
    setAiError(null);
    setAiResult(null);

    // Helper function to call Gemini with retry and fallback
    const callGeminiWithRetry = async (maxRetries = 2) => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Không tìm thấy API key của Gemini. Vui lòng kiểm tra file .env');
      }

      const genAI = new GoogleGenerativeAI(apiKey);

      // List of models to try (in order of preference)
      const modelsToTry = [
        'gemini-2.5-flash',
      ];

      // Prepare input data
      const input: QuestionComparisonInput = {
        currentQuestion: {
          content: currentQuestion.questionContent,
          answer: currentQuestion.questionAnswer || '',
          field: getFieldName(currentQuestion.fieldId),
          topic: getTopicName(currentQuestion.topicId),
          level: getLevelName(currentQuestion.levelId),
          type: getQuestionTypeName(currentQuestion.questionTypeId),
        },
        compareQuestion: {
          content: compareQuestion.questionContent,
          answer: compareQuestion.questionAnswer || '',
          field: getFieldName(compareQuestion.fieldId),
          topic: getTopicName(compareQuestion.topicId),
          level: getLevelName(compareQuestion.levelId),
          type: getQuestionTypeName(compareQuestion.questionTypeId),
        },
      };

      const prompt = generateComparisonPrompt(input);

      // Try each model
      for (let modelIndex = 0; modelIndex < modelsToTry.length; modelIndex++) {
        const modelName = modelsToTry[modelIndex];

        // Retry logic for each model
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            console.log(`Attempting with model: ${modelName}, attempt: ${attempt + 1}`);

            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              throw new Error('AI không trả về định dạng JSON hợp lệ');
            }

            const aiData: AIComparisonResult = JSON.parse(jsonMatch[0]);
            return { success: true, data: aiData, modelUsed: modelName };
          } catch (error: any) {
            const isOverloaded = error.message?.includes('overloaded') || error.message?.includes('503');
            const isRateLimited = error.message?.includes('429') || error.message?.includes('rate limit');

            console.warn(`Error with ${modelName} (attempt ${attempt + 1}):`, error.message);

            // If overloaded or rate limited, wait before retry
            if ((isOverloaded || isRateLimited) && attempt < maxRetries) {
              const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
              console.log(`Waiting ${waitTime}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }

            // If this is the last retry for this model, try next model
            if (attempt === maxRetries) {
              if (modelIndex < modelsToTry.length - 1) {
                console.log(`Switching to next model...`);
                break; // Go to next model
              } else {
                // This was the last model and last retry
                throw error;
              }
            }
          }
        }
      }

      throw new Error('Tất cả models đều không khả dụng. Vui lòng thử lại sau.');
    };

    try {
      const result = await callGeminiWithRetry();
      setAiResult(result.data);
      message.success(`Phân tích AI hoàn tất! (Model: ${result.modelUsed})`);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);

      // Provide user-friendly error messages
      let errorMessage = 'Có lỗi xảy ra khi gọi AI. Vui lòng thử lại.';

      if (error.message?.includes('overloaded') || error.message?.includes('503')) {
        errorMessage = 'Dịch vụ AI đang quá tải. Vui lòng thử lại sau vài phút.';
      } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        errorMessage = 'Đã vượt quá giới hạn số lần gọi API. Vui lòng thử lại sau.';
      } else if (error.message?.includes('API key')) {
        errorMessage = 'Lỗi xác thực API key. Vui lòng kiểm tra cấu hình.';
      } else if (error.message?.includes('JSON')) {
        errorMessage = 'AI trả về định dạng không hợp lệ. Vui lòng thử lại.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAiError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const renderQuestionContent = (question: Question, isCurrentQuestion = false) => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Title level={5}>Nội dung câu hỏi</Title>
        <Paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
          {question.questionContent}
        </Paragraph>
      </div>

      {question.questionAnswer && (
        <div>
          <Title level={5}>Đáp án</Title>
          <Paragraph style={{ fontSize: '12px', lineHeight: '1.6' }}>
            {question.questionAnswer}
          </Paragraph>
        </div>
      )}

      <Divider />

      <div>
        <Title level={5}>Thông tin phân loại</Title>
        <Space wrap style={{ marginTop: '8px' }}>
          <Tag color="blue">{getFieldName(question.fieldId)}</Tag>
          <Tag color="green">{getTopicName(question.topicId)}</Tag>
          <Tag color="orange">{getLevelName(question.levelId)}</Tag>
          <Tag color="purple">{getQuestionTypeName(question.questionTypeId)}</Tag>
        </Space>
      </div>

      <Divider />

      <div>
        <Title level={5}>Thông tin khác</Title>
        <div style={{ display: 'grid', gap: '4px', marginTop: '8px' }}>
          <div>
            <Text strong>Người tạo:</Text> User #{question.userId}
          </div>
          <div>
            <Text strong>Trạng thái:</Text> {question.status}
          </div>
          <div>
            <Text strong>Ngày tạo:</Text>{' '}
            {new Date(question.createdAt).toLocaleDateString('vi-VN')}
          </div>
          <div>
            <Text strong>Lượt vote:</Text>{' '}
            <Text style={{ color: '#52c41a' }}>+{question.usefulVote}</Text>
            <Text style={{ color: '#ff4d4f', marginLeft: '8px' }}>
              -{question.unusefulVote}
            </Text>
          </div>
          {isCurrentQuestion && question.similarityScore !== undefined && question.similarityScore !== null && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ padding: '4px 8px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px', display: 'inline-block' }}>
                <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
                  Tương đồng: {question.similarityScore.toFixed(1)}%
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </Space>
  );

  const renderAIComparison = () => (
    <div style={{ padding: '20px' }}>
      <Title level={4}>So sánh bằng AI</Title>
      <Paragraph>
        Chức năng so sánh thông minh bằng AI sẽ phân tích độ tương đồng giữa hai câu hỏi
        và đưa ra gợi ý về việc có nên chấp nhận câu hỏi mới hay không.
      </Paragraph>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          type="primary"
          size="large"
          onClick={handleRunAIComparison}
          loading={isLoadingAI}
          disabled={isLoadingAI}
        >
          {isLoadingAI ? 'Đang phân tích...' : 'Chạy AI So sánh'}
        </Button>
      </div>

      {isLoadingAI && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '12px' }}>
            <Text type="secondary">AI đang phân tích và so sánh hai câu hỏi...</Text>
          </div>
        </div>
      )}

      {aiError && (
        <Alert
          message="Lỗi"
          description={aiError}
          type="error"
          showIcon
          style={{ marginTop: '20px' }}
        />
      )}

      {aiResult && !isLoadingAI && (
        <div style={{ marginTop: '20px' }}>
          {/* Similarity Score */}
          <Card
            title="Độ tương đồng"
            style={{ marginBottom: '16px' }}
            headStyle={{ backgroundColor: '#f0f5ff' }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: aiResult.similarityLevel === 'HIGH' ? '#ff4d4f' :
                    aiResult.similarityLevel === 'MEDIUM' ? '#faad14' : '#52c41a'
                }}>
                  {aiResult.similarityScore}%
                </div>
                <Tag
                  color={aiResult.similarityLevel === 'HIGH' ? 'red' :
                    aiResult.similarityLevel === 'MEDIUM' ? 'orange' : 'green'}
                  style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                  {aiResult.similarityLevel === 'HIGH' ? 'Tương đồng cao' :
                    aiResult.similarityLevel === 'MEDIUM' ? 'Tương đồng trung bình' : 'Tương đồng thấp'}
                </Tag>
              </div>
            </Space>
          </Card>

          {/* Analysis */}
          <Card
            title="Phân tích chi tiết"
            style={{ marginBottom: '16px' }}
            headStyle={{ backgroundColor: '#f6ffed' }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <Text strong>Nội dung câu hỏi:</Text>
                <Paragraph style={{ marginTop: '8px', marginBottom: '8px' }}>
                  {aiResult.analysis.contentSimilarity}
                </Paragraph>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong>Đáp án:</Text>
                <Paragraph style={{ marginTop: '8px', marginBottom: '8px' }}>
                  {aiResult.analysis.answerSimilarity}
                </Paragraph>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong>Ngữ cảnh:</Text>
                <Paragraph style={{ marginTop: '8px', marginBottom: '8px' }}>
                  {aiResult.analysis.contextSimilarity}
                </Paragraph>
              </div>
              {aiResult.analysis.keyDifferences.length > 0 && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <div>
                    <Text strong>Điểm khác biệt chính:</Text>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {aiResult.analysis.keyDifferences.map((diff, index) => (
                        <li key={index} style={{ marginBottom: '4px' }}>
                          <Text>{diff}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </Space>
          </Card>

          {/* Recommendation */}
          <Card
            title="Gợi ý xử lý"
            style={{ marginBottom: '16px' }}
            headStyle={{
              backgroundColor: aiResult.recommendation.action === 'APPROVE' ? '#f6ffed' :
                aiResult.recommendation.action === 'REJECT' ? '#fff1f0' : '#fffbe6'
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Tag
                  color={aiResult.recommendation.action === 'APPROVE' ? 'green' :
                    aiResult.recommendation.action === 'REJECT' ? 'red' : 'orange'}
                  style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                  {aiResult.recommendation.action === 'APPROVE' ? 'NÊN PHÊ DUYỆT' :
                    aiResult.recommendation.action === 'REJECT' ? 'NÊN TỪ CHỐI' : 'CẦN CHỈNH SỬA'}
                </Tag>
              </div>
              <div>
                <Text strong>Lý do:</Text>
                <Paragraph style={{ marginTop: '8px' }}>
                  {aiResult.recommendation.reason}
                </Paragraph>
              </div>
              {aiResult.recommendation.suggestions.length > 0 && (
                <div>
                  <Text strong>Gợi ý cụ thể:</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {aiResult.recommendation.suggestions.map((suggestion, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        <Text>{suggestion}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Space>
          </Card>

          {/* Additional Notes */}
          {aiResult.additionalNotes && (
            <Alert
              message="Lưu ý bổ sung"
              description={aiResult.additionalNotes}
              type="info"
              showIcon
            />
          )}
        </div>
      )}

      {!aiResult && !isLoadingAI && !aiError && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
          <Text type="secondary">
            Nhấn nút "Chạy AI So sánh" để bắt đầu phân tích...
          </Text>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      title="So sánh câu hỏi"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1400}
      zIndex={1002}
      centered
    >
      {currentQuestion && compareQuestion && (
        <div style={{ display: 'flex', height: '600px' }}>
          {/* Sidebar */}
          <div style={{
            width: '300px',
            borderRight: '1px solid #d9d9d9',
            backgroundColor: '#fafafa',
            padding: '16px 0'
          }}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabPosition="left"
              style={{ height: '100%' }}
              items={[
                {
                  key: 'currentQuestion',
                  label: 'Câu hỏi mới',
                  children: null,
                },
                {
                  key: 'compareQuestion',
                  label: 'Câu hỏi ngân hàng',
                  children: null,
                },
                {
                  key: 'aiComparison',
                  label: 'AI So sánh',
                  children: null,
                },
              ]}
            />
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {activeTab === 'currentQuestion' && currentQuestion && (
              <div>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  Câu hỏi đang kiểm duyệt
                </Title>
                {renderQuestionContent(currentQuestion, true)}
              </div>
            )}

            {activeTab === 'compareQuestion' && compareQuestion && (
              <div>
                <Title level={4} style={{ marginBottom: '16px' }}>
                  Câu hỏi trong ngân hàng
                </Title>
                {renderQuestionContent(compareQuestion)}
              </div>
            )}

            {activeTab === 'aiComparison' && renderAIComparison()}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default QuestionComparisonModal;