# Services Library

Thư viện services dùng chung cho tất cả các app trong monorepo, chứa các hàm gọi API đến backend.

## 📁 Cấu trúc

```
libs/services/
├── src/
│   ├── lib/
│   │   ├── request.config.ts      # Cấu hình axios instance chung
│   │   ├── auth.service.ts        # Authentication APIs
│   │   ├── user.service.ts        # User management APIs
│   │   ├── exam.service.ts        # Exam management APIs
│   │   ├── question.service.ts    # Question management APIs
│   │   ├── news.service.ts        # News & recruitment APIs
│   │   └── career.service.ts      # Career & preferences APIs
│   ├── index.ts                   # Export tất cả services
│   └── vite-env.d.ts             # TypeScript definitions cho Vite env
├── package.json
└── README.md
```

## 🚀 Cách sử dụng

### 1. Import services vào app

```typescript
import {
  createAuthService,
  createUserService,
  createExamService,
  Request, // Default axios instance
} from '@abc-interview-support-frontend/services';
```

### 2. Khởi tạo services

```typescript
// Sử dụng API base URL từ environment variables
const baseURL = import.meta.env.VITE_API_BASE_URL;

const authService = createAuthService(baseURL);
const userService = createUserService(baseURL);
const examService = createExamService(baseURL);
```

### 3. Gọi API

```typescript
// Authentication
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// User management
const user = await userService.getUserById('user-123');
await userService.updateUser('user-123', { fullName: 'New Name' });

// Exam management
const exams = await examService.getAllExams(1, 10);
const exam = await examService.getExamById(123);
```

### 4. Sử dụng Request instance trực tiếp

Nếu cần gọi API custom không có trong services:

```typescript
import { Request } from '@abc-interview-support-frontend/services';

// GET request
const response = await Request.get('/api/custom-endpoint');

// POST request
const result = await Request.post('/api/custom-endpoint', {
  data: 'value',
});
```

## 🔧 Cấu hình

### Environment Variables (.env ở root)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# SSO Configuration
VITE_SSO_URL=http://localhost:4200

# Optional
VITE_API_TIMEOUT=10000
```

### Request Interceptors

Request instance đã được cấu hình sẵn với:

#### Request Interceptor

- Tự động thêm `Authorization: Bearer <token>` header từ localStorage
- Chỉ hoạt động trong browser environment

#### Response Interceptor

- **401 Unauthorized**: Tự động refresh token và retry request
  - Nếu refresh thành công → Retry request với token mới
  - Nếu refresh thất bại → Xóa tokens và redirect về SSO
- **403 Forbidden**: Log lỗi permission
- **404 Not Found**: Log lỗi resource not found
- **500 Server Error**: Log lỗi server

### Token Management

Tokens được lưu trong localStorage:

- `accessToken`: Access token (15 phút)
- `refreshToken`: Refresh token (7 ngày)

Request instance tự động:

1. Lấy `accessToken` từ localStorage
2. Thêm vào header của mỗi request
3. Khi gặp 401, tự động gọi refresh token API
4. Lưu token mới và retry request gốc

## 📦 Services Available

### AuthService

```typescript
- login(credentials: LoginRequest)
- register(userData: RegisterRequest)
- verifySession(request: VerifySessionRequest)
- refreshToken(request: RefreshTokenRequest)
- getProfile(accessToken: string)
- logout(sessionId?, refreshToken?)
- forgotPassword(email: string)
- resetPassword(email, code, newPassword)
- verifyEmail(email, code)
```

### UserService

```typescript
- getUserById(userId: string)
- updateUser(userId: string, data: Partial<User>)
- getAllUsers(page, limit)
- deleteUser(userId: string)
- getEloHistory(userId: string)
- submitRecruiterVerification(data)
- getRecruiterVerification(userId: string)
- updateRecruiterVerification(verificationId, data)
```

### ExamService

```typescript
- getAllExams(page, limit, filters?)
- getExamById(examId: number)
- createExam(data: Partial<Exam>)
- updateExam(examId: number, data)
- deleteExam(examId: number)
- getExamQuestions(examId: number)
- addQuestionToExam(examId, questionId, orderNumber)
- removeQuestionFromExam(examId, questionId)
- reorderExamQuestions(examId, questionOrders)
- getExamsByRecruiter(recruiterId: string)
- updateExamVisibility(examId, isPublic)
```

### QuestionService

```typescript
- getAllQuestions(page, limit, filters?)
- getQuestionById(questionId: number)
- createQuestion(data: Partial<Question>)
- updateQuestion(questionId, data)
- deleteQuestion(questionId)
- getQuestionsByCareer(careerId: number)
- getRandomQuestions(careerId, count, level?)
- searchQuestions(searchTerm, filters?)
- bulkImportQuestions(questions)
- getQuestionStatistics(questionId)
```

### NewsService

```typescript
- getAllNews(page, limit, filters?)
- getNewsById(newsId: number)
- createNews(data: Partial<News>)
- updateNews(newsId, data)
- deleteNews(newsId)
- getNewsByAuthor(authorId: string)
- getNewsByCareer(careerId: number)
- searchNews(searchTerm, filters?)
- getFeaturedNews(limit)
- publishNews(newsId)
- unpublishNews(newsId)
- incrementViewCount(newsId)
- getNewsStatistics(newsId)
```

### CareerService

```typescript
- getAllCareers()
- getCareerById(careerId: number)
- createCareer(data: Partial<Career>)
- updateCareer(careerId, data)
- deleteCareer(careerId)
- getCareerPreferences(userId: string)
- addCareerPreference(userId, careerId)
- removeCareerPreference(userId, careerId)
- updateCareerPreferences(userId, careerIds)
- getCareerStatistics(careerId)
- searchCareers(searchTerm)
```

## 🛠️ Tích hợp vào App

### Trong React Component

```typescript
import { useEffect, useState } from 'react';
import { createUserService } from '@abc-interview-support-frontend/services';
import type { User } from '@abc-interview-support-frontend/types';

const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const userService = createUserService(baseURL);

        const userData = await userService.getUserById(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>{user.email}</p>
    </div>
  );
};
```

### Trong Context/Provider

```typescript
import { createContext, useContext } from 'react';
import { createAuthService } from '@abc-interview-support-frontend/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const authService = createAuthService(baseURL);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  };

  const logout = async () => {
    const sessionId = localStorage.getItem('sessionId');
    const refreshToken = localStorage.getItem('refreshToken');

    await authService.logout(sessionId, refreshToken);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('sessionId');
  };

  return <AuthContext.Provider value={{ login, logout }}>{children}</AuthContext.Provider>;
};
```

## 📝 Migration từ Mock Server

Các file `apiClient.ts` cũ trong mỗi app (`apps/*/src/utils/apiClient.ts`) có thể được thay thế bằng services library này.

**Trước:**

```typescript
// apps/student/src/utils/apiClient.ts
import axios from 'axios';
const api = axios.create({ baseURL: '...' });
```

**Sau:**

```typescript
// Sử dụng services library
import { Request, createUserService } from '@abc-interview-support-frontend/services';
```

## 🔒 Security Notes

- Access token tự động được thêm vào mọi request
- Token refresh tự động khi gặp 401
- Tự động redirect về SSO khi authentication thất bại
- Tokens được lưu trong localStorage (có thể nâng cấp lên httpOnly cookie sau)

## 🧪 Testing

```typescript
import { createRequestInstance } from '@abc-interview-support-frontend/services';

// Tạo instance với mock baseURL cho testing
const mockRequest = createRequestInstance('http://localhost:3001');
```

## 📚 Dependencies

- `axios`: ^1.12.2
- `@abc-interview-support-frontend/types`: Shared type definitions

## 🏗️ Building

Run `nx build services` to build the library.
