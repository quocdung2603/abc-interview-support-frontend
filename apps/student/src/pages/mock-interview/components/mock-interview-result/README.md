# Mock Interview Result Components

Đây là tập hợp các components để hiển thị kết quả bài kiểm tra mock interview.

## Components

### 1. MockInterviewResult.tsx (Main Component)

- Component chính chứa toàn bộ logic và layout của trang kết quả
- Tính toán điểm số và phân loại kết quả
- Quản lý state của AI modal và dữ liệu exam

### 2. ExamSummary.tsx

- Hiển thị tóm tắt kết quả bài kiểm tra
- Thông tin exam (title, position, topics, etc.)
- Điểm số, số câu đúng/sai, thời gian làm bài
- Cards với màu sắc tương ứng với mức độ (xanh/vàng/đỏ)

### 3. QuestionResultItem.tsx

- Hiển thị từng câu hỏi với kết quả chi tiết
- Đáp án của user vs đáp án đúng
- Toggle để xem/ẩn giải thích
- Visual indicators (đúng/sai)
- Hỗ trợ tất cả loại câu hỏi: Single/Multiple Choice, Fill-in-blank, Open-ended

### 4. AIReviewModal.tsx

- Modal hiển thị đánh giá và định hướng từ AI
- Phân tích chi tiết theo topic, loại câu hỏi
- Gợi ý cải thiện dựa trên kết quả
- Loading animation khi AI đang phân tích

### 5. AIReviewButton.tsx

- Float button với animation để mở AI review
- Hover effects và tooltip
- Positioned fixed ở góc phải màn hình

## Features

### ✅ Đã implement:

- Tính toán điểm số tự động
- Phân loại kết quả (Xuất sắc/Khá/Trung bình/Cần cải thiện)
- Hiển thị chi tiết từng câu hỏi
- Toggle giải thích cho từng câu
- AI review với phân tích chi tiết
- Float button với animation
- Responsive design
- Integration với routing system
- LocalStorage để lưu kết quả

### 🎨 Styling:

- Sử dụng styles.css system (CSS variables)
- Inline styles cho components specific
- Card-based layout với shadow effects
- Color-coded results (green/orange/red)
- Professional animations và transitions

### 📱 Responsive:

- Grid layout tự động adjust
- Mobile-friendly cards
- Readable font sizes
- Touch-friendly buttons

## Usage

```typescript
// Từ MockInterviewDetail, khi user submit:
const examResult = {
  exam: mockExam,
  questions: mockQuestions,
  answers: mockAnswers,
  userAnswers: userAnswers,
  timeSpent: timeSpent,
  completedAt: new Date().toISOString(),
};
localStorage.setItem(`examResult_${examId}`, JSON.stringify(examResult));
navigate(`/student/mock-interview-result/${examId}`);
```

## Data Flow

1. **MockInterviewDetail** → Submit exam → Store result in localStorage → Navigate to result page
2. **MockInterviewResult** → Load from localStorage → Calculate scores → Render components
3. **User interactions** → Toggle explanations, open AI review, navigate back

## Mock Data Structure

Sử dụng cấu trúc dữ liệu từ `libs/types`:

- `Exam`: Thông tin bài kiểm tra
- `Question[]`: Danh sách câu hỏi
- `Answer[]`: Đáp án cho mỗi câu hỏi
- `Record<string, string>`: User answers (questionId → answer string)

## Customization

### Thay đổi logic scoring:

```typescript
const calculateResults = () => {
  // Custom logic here
};
```

### Thay đổi AI review content:

```typescript
const generateAIReview = async () => {
  // Custom AI analysis logic
};
```

### Thay đổi styling:

- Update CSS variables trong `styles.css`
- Override inline styles trong components
- Modify color schemes trong các condition checks
