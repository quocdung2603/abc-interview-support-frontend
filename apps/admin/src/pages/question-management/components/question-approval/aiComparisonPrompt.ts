/**
 * AI Prompt for Question Comparison
 *
 * This prompt is used with Google Gemini 2.5 Flash model to compare two questions
 * and provide detailed analysis on their similarity and suggestions for improvement.
 */

export interface QuestionComparisonInput {
  currentQuestion: {
    content: string;
    answer: string;
    field: string;
    topic: string;
    level: string;
    type: string;
  };
  compareQuestion: {
    content: string;
    answer: string;
    field: string;
    topic: string;
    level: string;
    type: string;
  };
}

export const generateComparisonPrompt = (
  input: QuestionComparisonInput
): string => {
  return `
Bạn là một chuyên gia phân tích và đánh giá câu hỏi phỏng vấn. Nhiệm vụ của bạn là so sánh hai câu hỏi dưới đây và đưa ra đánh giá chi tiết về độ tương đồng, cũng như gợi ý cách xử lý.

---

**CÂU HỎI TRONG NGÂN HÀNG (Đã được duyệt):**

**Lĩnh vực:** ${input.compareQuestion.field}
**Chủ đề:** ${input.compareQuestion.topic}
**Cấp độ:** ${input.compareQuestion.level}
**Loại câu hỏi:** ${input.compareQuestion.type}

**Nội dung câu hỏi:**
${input.compareQuestion.content}

**Đáp án:**
${input.compareQuestion.answer}

---

**CÂU HỎI MỚI (Đang chờ kiểm duyệt):**

**Lĩnh vực:** ${input.currentQuestion.field}
**Chủ đề:** ${input.currentQuestion.topic}
**Cấp độ:** ${input.currentQuestion.level}
**Loại câu hỏi:** ${input.currentQuestion.type}

**Nội dung câu hỏi:**
${input.currentQuestion.content}

**Đáp án:**
${input.currentQuestion.answer}

---

**YÊU CẦU PHÂN TÍCH:**

Hãy phân tích và trả lời theo định dạng JSON sau (chỉ trả về JSON, không thêm text nào khác):

{
  "similarityScore": <số từ 0-100, độ tương đồng giữa 2 câu hỏi>,
  "similarityLevel": "<HIGH/MEDIUM/LOW>",
  "analysis": {
    "contentSimilarity": "<Phân tích độ tương đồng về nội dung câu hỏi>",
    "answerSimilarity": "<Phân tích độ tương đồng về đáp án>",
    "contextSimilarity": "<Phân tích độ tương đồng về ngữ cảnh, lĩnh vực, chủ đề, cấp độ>",
    "keyDifferences": [
      "<Điểm khác biệt chính 1>",
      "<Điểm khác biệt chính 2>",
      "..."
    ]
  },
  "recommendation": {
    "action": "<APPROVE/REJECT/EDIT>",
    "reason": "<Lý do cho hành động được đề xuất>",
    "suggestions": [
      "<Gợi ý cụ thể 1 nếu cần chỉnh sửa>",
      "<Gợi ý cụ thể 2 nếu cần chỉnh sửa>",
      "..."
    ]
  },
  "additionalNotes": "<Các lưu ý bổ sung hoặc nhận xét quan trọng khác>"
}

**HƯỚNG DẪN ĐÁNH GIÁ:**

1. **similarityScore:** Đánh giá từ 0-100%
   - 0-30%: Hai câu hỏi rất khác biệt
   - 31-60%: Có một số điểm tương đồng nhưng vẫn khác biệt đáng kể
   - 61-85%: Tương đồng cao, có thể cùng chủ đề hoặc cách tiếp cận
   - 86-100%: Gần như trùng lặp hoàn toàn

2. **similarityLevel:** 
   - HIGH: similarityScore >= 70%
   - MEDIUM: 40% <= similarityScore < 70%
   - LOW: similarityScore < 40%

3. **recommendation.action:**
   - APPROVE: Câu hỏi mới đủ khác biệt và có giá trị, nên phê duyệt
   - REJECT: Câu hỏi trùng lặp quá nhiều, nên từ chối
   - EDIT: Câu hỏi có tiềm năng nhưng cần chỉnh sửa để tránh trùng lặp

4. **Các yếu tố cần xem xét:**
   - Nội dung câu hỏi có cùng mục đích không?
   - Đáp án có giống nhau không?
   - Kiến thức được kiểm tra có trùng nhau không?
   - Cấp độ và độ khó có khác biệt không?
   - Câu hỏi mới có đóng góp thêm giá trị không?

Hãy phân tích kỹ lưỡng và đưa ra đánh giá công bằng, chính xác.
`.trim();
};

export interface AIComparisonResult {
  similarityScore: number;
  similarityLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  analysis: {
    contentSimilarity: string;
    answerSimilarity: string;
    contextSimilarity: string;
    keyDifferences: string[];
  };
  recommendation: {
    action: 'APPROVE' | 'REJECT' | 'EDIT';
    reason: string;
    suggestions: string[];
  };
  additionalNotes: string;
}
