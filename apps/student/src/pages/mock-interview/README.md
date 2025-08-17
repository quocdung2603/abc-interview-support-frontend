# Mock Interview - Phỏng Vấn Giả Lập

## Tổng quan

Tính năng "Phỏng Vấn Giả Lập" cho phép sinh viên tạo và thực hiện các bài kiểm tra để chuẩn bị cho cuộc phỏng vấn thực tế. Tính năng này giúp người dùng luyện tập với các câu hỏi phỏng vấn theo nhiều lĩnh vực và cấp độ khác nhau.

## Cấu trúc thư mục

```
apps/student/src/pages/mock-interview/
├── MockInterview.tsx          # Component chính
├── mock-interview.css         # CSS tùy chỉnh
└── components/
    ├── ExamCreationForm.tsx   # Form tạo bài kiểm tra
    ├── ExamCard.tsx          # Card hiển thị thông tin bài kiểm tra
    └── ExamList.tsx          # Danh sách bài kiểm tra
```

## Tính năng chính

### 1. Tạo Bài Kiểm Tra Mới

- **Chọn lĩnh vực**: Frontend, Backend, Business Analysis, DevOps, QA
- **Chọn chủ đề**: Tùy theo lĩnh vực (React, Node.js, Docker, v.v.)
- **Chọn cấp độ**: Fresher, Junior, Middle, Senior
- **Loại câu hỏi**: Một lựa chọn, Nhiều lựa chọn, Điền khuyết, Tự luận
- **Số lượng câu hỏi**: Từ 5-50 câu
- **Thời gian**: Từ 10-180 phút

### 2. Hiển thị Bài Kiểm Tra

- **Bài kiểm tra được tạo**: Hiển thị các bài kiểm tra vừa tạo với badge "Mới tạo"
- **Bài kiểm tra có sẵn**: Hiển thị các bài kiểm tra có sẵn trong hệ thống
- **Lọc thông minh**: Tự động lọc bài kiểm tra có sẵn theo tiêu chí đã chọn

### 3. Thông tin chi tiết bài kiểm tra

Mỗi card bài kiểm tra hiển thị:

- 📋 Tiêu đề và vị trí
- 🎯 Chủ đề
- 📝 Loại câu hỏi
- 📊 Số lượng câu hỏi, thời gian, ngôn ngữ
- ⏰ Thời gian bắt đầu/kết thúc (nếu có)
- 🚀 Nút bắt đầu kiểm tra

## Các interface được sử dụng

### ExamFormData

```typescript
interface ExamFormData {
  field: string; // ID lĩnh vực
  topic: string; // ID chủ đề
  level: string; // Cấp độ
  questionTypes: string[]; // Danh sách loại câu hỏi
  questionCount: number; // Số lượng câu hỏi
  duration: number; // Thời gian (phút)
}
```

### Exam (Local Interface)

```typescript
interface Exam {
  examId: string;
  userId?: string;
  examType: 'Virtual' | 'Recruiter';
  title: string;
  position?: string;
  topics: string; // JSON string
  questionTypes: string; // JSON string
  questionCount: number;
  duration: number;
  startTime?: Date;
  endTime?: Date;
  status: 'Active' | 'Inactive' | 'Completed';
  language: string;
  createdAt: Date;
  createdBy: string;
}
```

## Styling và UX

### CSS Classes tùy chỉnh

- `.exam-creation-card`: Card tạo bài kiểm tra với gradient border
- `.question-type-checkbox`: Checkbox tùy chỉnh cho loại câu hỏi
- `.exam-stats-grid`: Grid hiển thị thống kê bài kiểm tra
- `.exam-card-created`: Style đặc biệt cho bài kiểm tra mới tạo
- `.floating-action-button`: Nút floating hiển thị tổng số bài kiểm tra

### Animations

- `fade-in-up`: Animation cho header
- `exam-card-enter`: Animation khi hiển thị card
- `slide-in-right`: Animation cho notifications

### Responsive Design

- Mobile-first approach
- Grid layout tự động điều chỉnh theo kích thước màn hình
- Form controls responsive

## Cách hoạt động

### 1. Luồng tạo bài kiểm tra

1. Người dùng chọn các tiêu chí (field, topic, level, question types, etc.)
2. Hệ thống tự động lọc bài kiểm tra có sẵn theo tiêu chí
3. Người dùng bấm "Tạo Bài Phỏng Vấn"
4. Hệ thống tạo bài kiểm tra mới và hiển thị trong section "Bài Kiểm Tra Được Tạo"

### 2. Luồng tìm kiếm thông minh

- Khi người dùng thay đổi tiêu chí, `onCriteriaChange` được gọi
- `useEffect` trong MockInterview sẽ tự động lọc lại danh sách bài kiểm tra có sẵn
- Hiển thị kết quả phù hợp hoặc thông báo "Không tìm thấy"

### 3. Data mocking

- Mock data cho fields, topics, levels, question types
- Mock data cho available exams
- Trong production, sẽ thay thế bằng API calls

## Tích hợp với hệ thống

### Types Integration

- Sử dụng các interface từ `libs/types/src/lib/exam-types.ts`
- Sử dụng các interface từ `libs/types/src/lib/question-types.ts`

### Styling Integration

- Sử dụng CSS variables từ `apps/student/src/styles.css`
- Component classes (btn-primary, card-elevated, etc.)
- Color system và typography scale

## Các cải tiến có thể thêm

### Tính năng

- [ ] Lưu draft bài kiểm tra
- [ ] Chia sẻ bài kiểm tra
- [ ] Lịch sử bài kiểm tra đã làm
- [ ] Đề xuất bài kiểm tra phù hợp
- [ ] Timer countdown cho bài kiểm tra

### UX/UI

- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Skeleton loading
- [ ] Infinite scroll cho danh sách bài kiểm tra

### Performance

- [ ] Lazy loading components
- [ ] Debounce search
- [ ] Virtual scrolling cho danh sách lớn
- [ ] Image optimization

## Usage Example

```typescript
// Trong component cha
const handleStartExam = (examId: string) => {
  // Navigate đến trang làm bài
  navigate(`/exam/${examId}`);
};

// Import và sử dụng
import MockInterview from './pages/mock-interview/MockInterview';

<MockInterview />;
```
