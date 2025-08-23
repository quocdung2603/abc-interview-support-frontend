import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionDetailHeader } from './components/interview-question-detail/QuestionDetailHeader';
import { AnswersSection } from './components/interview-question-detail/AnswersSection';
import { QuestionNavigation } from './components/interview-question-detail/QuestionNavigation';
import {
  Answer,
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';
import { RouterLink } from '../../utils/RouterLink';

export const InterviewQuestionDetail: React.FC = () => {
  const { id: questionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Loading question with ID:', questionId);

        // Mock fields data
        const mockFields: Field[] = [
          {
            fieldId: 'frontend',
            fieldName: 'Frontend Development',
            description: 'Frontend development questions',
          },
          {
            fieldId: 'backend',
            fieldName: 'Backend Development',
            description: 'Backend development questions',
          },
        ];

        // Mock topics data
        const mockTopics: Topic[] = [
          {
            topicId: 'react',
            topicName: 'React.js',
            description: 'React.js related questions',
            fieldId: 'frontend',
          },
          {
            topicId: 'javascript',
            topicName: 'JavaScript',
            description: 'JavaScript fundamentals',
            fieldId: 'frontend',
          },
          {
            topicId: 'nodejs',
            topicName: 'Node.js',
            description: 'Node.js backend development',
            fieldId: 'backend',
          },
        ];

        // Mock levels data
        const mockLevels: Level[] = [
          {
            levelId: 'fresher',
            levelName: 'Fresher',
            description: 'Entry level questions',
          },
          {
            levelId: 'junior',
            levelName: 'Junior',
            description: 'Junior level questions',
          },
          {
            levelId: 'middle',
            levelName: 'Middle',
            description: 'Mid-level questions',
          },
          {
            levelId: 'senior',
            levelName: 'Senior',
            description: 'Senior level questions',
          },
        ];

        // Mock questions data that matches InterviewRevision.tsx
        const mockQuestions: Question[] = [
          {
            questionId: 'q1',
            userId: 'system',
            questionContent: 'React là gì và tại sao nó lại phổ biến?',
            fieldId: 'frontend',
            topicId: 'react',
            levelId: 'fresher',
            questionTypeId: 'References',
            status: 'Approved',
            language: 'vi',
            usefulVote: 15,
            unusefulVote: 2,
            createdAt: new Date('2025-01-10'),
          },
          {
            questionId: 'q2',
            userId: 'system',
            questionContent:
              'Hooks trong React là gì? Giải thích useEffect và useState.',
            fieldId: 'frontend',
            topicId: 'react',
            levelId: 'middle',
            questionTypeId: 'References',
            status: 'Approved',
            language: 'vi',
            usefulVote: 22,
            unusefulVote: 1,
            createdAt: new Date('2025-01-09'),
          },
          {
            questionId: 'q3',
            userId: 'system',
            questionContent:
              'Var, let và const khác nhau như thế nào trong JavaScript?',
            fieldId: 'frontend',
            topicId: 'javascript',
            levelId: 'junior',
            questionTypeId: 'References',
            status: 'Approved',
            language: 'vi',
            usefulVote: 18,
            unusefulVote: 3,
            createdAt: new Date('2025-01-08'),
          },
          {
            questionId: 'q4',
            userId: 'system',
            questionContent: 'Event Loop trong Node.js hoạt động như thế nào?',
            fieldId: 'backend',
            topicId: 'nodejs',
            levelId: 'middle',
            questionTypeId: 'References',
            status: 'Approved',
            language: 'vi',
            usefulVote: 25,
            unusefulVote: 2,
            createdAt: new Date('2025-01-07'),
          },
        ];

        // Mock answers data - chỉ câu trả lời mẫu
        const mockAnswers: Answer[] = [
          {
            answerId: 'a1',
            userId: 'expert-1',
            questionId: 'q1',
            questionTypeId: 'References',
            answerContent: `React là một thư viện JavaScript được phát triển bởi Facebook để xây dựng giao diện người dùng, đặc biệt là các ứng dụng web.

**Các khái niệm cốt lõi:**
1. **Kiến trúc dựa trên Component**: Ứng dụng React được xây dựng bằng các component có thể tái sử dụng
2. **Virtual DOM**: React sử dụng một biểu diễn ảo của DOM để cập nhật hiệu quả
3. **Lập trình Declarative**: Bạn mô tả UI nên trông như thế nào, không phải cách thực hiện

**Tại sao React phổ biến:**
- **Hiệu suất cao**: Virtual DOM giúp tối ưu hóa việc cập nhật giao diện
- **Cộng đồng lớn**: Nhiều tài liệu, thư viện hỗ trợ
- **Linh hoạt**: Có thể tích hợp với các thư viện khác dễ dàng
- **Developer Experience**: Công cụ phát triển tuyệt vời

**Ví dụ đơn giản:**
\`\`\`jsx
function Welcome(props) {
  return <h1>Xin chào, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Đức" />
      <Welcome name="Mai" />
    </div>
  );
}
\`\`\``,
            isSampleAnswer: true,
            usefulVote: 45,
            unusefulVote: 2,
            createdAt: new Date('2025-01-11'),
          },
          {
            answerId: 'a3',
            userId: 'expert-2',
            questionId: 'q2',
            questionTypeId: 'References',
            answerContent: `React Hooks là các hàm đặc biệt cho phép bạn "hook into" các tính năng của React từ function components.

**useState Hook:**
\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Bạn đã click {count} lần</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

**useEffect Hook:**
\`\`\`jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Chạy sau mỗi render
    fetchUser(userId).then(setUser);
  }, [userId]); // Chỉ chạy lại khi userId thay đổi
  
  return user ? <div>Xin chào {user.name}</div> : <div>Đang tải...</div>;
}
\`\`\`

**Quy tắc của Hooks:**
1. Chỉ gọi Hooks ở top level của function
2. Chỉ gọi Hooks từ React functions
3. Sử dụng ESLint plugin để đảm bảo quy tắc`,
            isSampleAnswer: true,
            usefulVote: 38,
            unusefulVote: 1,
            createdAt: new Date('2025-01-10'),
          },
          {
            answerId: 'a4',
            userId: 'expert-3',
            questionId: 'q3',
            questionTypeId: 'References',
            answerContent: `Trong JavaScript có 3 cách để khai báo biến: var, let và const. Mỗi cách có đặc điểm riêng:

**var:**
- **Scope**: Function scope hoặc global scope
- **Hoisting**: Được hoisted và initialized với undefined
- **Re-declaration**: Có thể khai báo lại trong cùng scope

\`\`\`javascript
function example() {
  console.log(x); // undefined (không lỗi)
  var x = 1;
  var x = 2; // OK - có thể khai báo lại
}
\`\`\`

**let:**
- **Scope**: Block scope
- **Hoisting**: Được hoisted nhưng không initialized (Temporal Dead Zone)
- **Re-declaration**: Không thể khai báo lại trong cùng scope

\`\`\`javascript
function example() {
  console.log(y); // ReferenceError
  let y = 1;
  // let y = 2; // SyntaxError - không thể khai báo lại
}
\`\`\`

**const:**
- **Scope**: Block scope
- **Hoisting**: Được hoisted nhưng không initialized
- **Re-assignment**: Không thể gán lại giá trị
- **Re-declaration**: Không thể khai báo lại

\`\`\`javascript
const z = 1;
// z = 2; // TypeError - không thể gán lại
// const z = 2; // SyntaxError - không thể khai báo lại
\`\`\`

**Khuyến nghị sử dụng:**
1. Sử dụng const mặc định
2. Sử dụng let khi cần thay đổi giá trị
3. Tránh sử dụng var trong code hiện đại`,
            isSampleAnswer: true,
            usefulVote: 32,
            unusefulVote: 1,
            createdAt: new Date('2025-01-09'),
          },
          {
            answerId: 'a5',
            userId: 'expert-4',
            questionId: 'q4',
            questionTypeId: 'References',
            answerContent: `Event Loop là cơ chế cho phép Node.js thực hiện các thao tác I/O không đồng bộ mặc dù JavaScript là single-threaded.

**Cách hoạt động:**

**1. Call Stack:**
- Nơi thực thi các function calls
- Hoạt động theo nguyên tắc LIFO (Last In, First Out)

**2. Event Queue (Task Queue):**
- Chứa các callback functions chờ được thực thi
- Bao gồm: Timer Queue, I/O Queue, Check Queue

**3. Event Loop Process:**
\`\`\`javascript
// Ví dụ minh họa
console.log('Start'); // 1

setTimeout(() => {
  console.log('Timeout'); // 4
}, 0);

setImmediate(() => {
  console.log('Immediate'); // 5
});

process.nextTick(() => {
  console.log('Next Tick'); // 3
});

console.log('End'); // 2

// Output: Start -> End -> Next Tick -> Timeout -> Immediate
\`\`\`

**Thứ tự ưu tiên:**
1. **Call Stack** - Thực thi code đồng bộ
2. **Process.nextTick Queue** - Ưu tiên cao nhất
3. **Promise Queue** (Microtasks)
4. **Timer Queue** - setTimeout, setInterval
5. **I/O Queue** - File system, network operations  
6. **Check Queue** - setImmediate

**Ý nghĩa:**
- Cho phép Node.js xử lý hàng ngàn kết nối đồng thời
- Tránh blocking khi thực hiện I/O operations
- Đảm bảo performance cao cho server applications`,
            isSampleAnswer: true,
            usefulVote: 41,
            unusefulVote: 2,
            createdAt: new Date('2025-01-08'),
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Find current question
        const currentQuestion = mockQuestions.find(
          (q) => q.questionId === questionId
        );

        console.log('Found question:', currentQuestion);

        if (!currentQuestion) {
          console.log('Question not found for ID:', questionId);
          setError('Question not found');
          return;
        }

        // Filter answers for current question
        const questionAnswers = mockAnswers.filter(
          (a) => a.questionId === questionId
        );

        console.log('Found answers:', questionAnswers);

        // Set state
        setQuestion(currentQuestion);
        setAnswers(questionAnswers);
        setAllQuestions(mockQuestions);
        setFields(mockFields);
        setTopics(mockTopics);
        setLevels(mockLevels);

        console.log('Data loaded successfully');
      } catch (err) {
        console.error('Error loading question:', err);
        setError('Failed to load question data');
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchData();
    } else {
      console.log('No questionId provided');
      setLoading(false);
      setError('No question ID provided');
    }
  }, [questionId]);

  // Navigation handlers
  const handleBackToList = () => {
    navigate(RouterLink.InterviewRevision);
  };

  const handleQuestionClick = (newQuestionId: string) => {
    navigate(`/student/interview-question-detail/${newQuestionId}`);
  };

  const handleVoteQuestion = (
    questionId: string,
    voteType: 'useful' | 'unuseful'
  ) => {
    if (!question) return;

    // Mock vote handling - replace with actual API call
    setQuestion((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        usefulVote:
          voteType === 'useful' ? prev.usefulVote + 1 : prev.usefulVote,
        unusefulVote:
          voteType === 'unuseful' ? prev.unusefulVote + 1 : prev.unusefulVote,
      };
    });
  };

  const handleVoteAnswer = (
    answerId: string,
    voteType: 'useful' | 'unuseful'
  ) => {
    // Mock vote handling - replace with actual API call
    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.answerId === answerId) {
          return {
            ...answer,
            usefulVote:
              voteType === 'useful' ? answer.usefulVote + 1 : answer.usefulVote,
            unusefulVote:
              voteType === 'unuseful'
                ? answer.unusefulVote + 1
                : answer.unusefulVote,
          };
        }
        return answer;
      })
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !question) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Không tìm thấy câu hỏi
          </h1>
          <p className="text-neutral-600 mb-6">
            Câu hỏi bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button onClick={handleBackToList} className="btn-primary">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Question Header */}
          <QuestionDetailHeader
            question={question}
            field={fields.find((f) => f.fieldId === question.fieldId)}
            topic={topics.find((t) => t.topicId === question.topicId)}
            level={levels.find((l) => l.levelId === question.levelId)}
            onBack={handleBackToList}
            onVote={handleVoteQuestion}
          />

          {/* Answers Section - chỉ hiển thị câu trả lời mẫu */}
          <AnswersSection answers={answers} onAnswerVote={handleVoteAnswer} />

          {/* Question Navigation - điều hướng giữa các câu hỏi */}
          <QuestionNavigation
            currentQuestionId={question.questionId}
            allQuestions={allQuestions.map((q) => ({
              questionId: q.questionId,
              questionContent: q.questionContent,
            }))}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </div>
  );
};
