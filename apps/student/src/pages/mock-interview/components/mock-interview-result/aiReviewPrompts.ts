// AI Review system prompt for Gemini AI

interface ExamData {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  timeSpent: number;
  questions: Array<{
    id: number;
    content: string;
    topic: string;
    field: string;
    level: string;
    type: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

/**
 * Generate AI review prompt for exam results
 * @param examData - Exam data including questions, answers, and performance metrics
 * @returns Formatted prompt string for Gemini AI
 */
export const generateAIReviewPrompt = (examData: ExamData): string => {
  return `Bạn là một chuyên gia đánh giá kết quả học tập và định hướng nghề nghiệp. Hãy phân tích kết quả bài kiểm tra sau và đưa ra nhận xét chi tiết, đánh giá năng lực và định hướng phát triển:

**Thông tin bài kiểm tra:**
- Tổng số câu hỏi: ${examData.totalQuestions}
- Số câu trả lời đúng: ${examData.correctAnswers}
- Số câu trả lời sai: ${examData.incorrectAnswers}
- Điểm số: ${examData.scorePercentage}%
- Thời gian hoàn thành: ${examData.timeSpent} phút

**Chi tiết câu hỏi và câu trả lời:**
${examData.questions
  .map(
    (q, idx) => `
Câu ${idx + 1}:
- Nội dung: ${q.content}
- Chủ đề: ${q.topic}
- Lĩnh vực: ${q.field}
- Cấp độ: ${q.level}
- Loại câu hỏi: ${q.type}
- Câu trả lời của thí sinh: ${q.userAnswer}
- Đáp án đúng: ${q.correctAnswer}
`
  )
  .join('\n')}

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
};
