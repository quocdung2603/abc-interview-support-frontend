# ABC Interview Support Frontend

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A comprehensive interview preparation platform built with React, TypeScript, and Nx monorepo. This frontend application connects to a Java Spring Boot microservices backend.

## 🏗️ Architecture

- **Monorepo:** Nx workspace managing multiple applications
- **Frontend:** React 19 + TypeScript + Tailwind CSS + Ant Design
- **Backend:** Java Spring Boot Microservices
- **Authentication:** SSO (Single Sign-On) with JWT tokens

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- Java Spring Boot Backend running

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd abc-interview-support-frontend
   npm install
   ```

2. **Configure environment variables:**

   Copy `.env.example` to `.env` at the root directory:

   ```bash
   cp .env.example .env
   ```

   Update values in `.env`:

   ```env
   # API Configuration
   VITE_API_BASE_URL=http://your-backend-api-url

   # SSO Configuration
   VITE_SSO_ORIGIN=http://localhost:4200

   # App URLs
   VITE_SSO_URL=http://localhost:4200
   VITE_STUDENT_URL=http://localhost:4300
   VITE_RECRUITER_URL=http://localhost:4400
   VITE_ADMIN_URL=http://localhost:4500
   ```

   > 📝 **Note:** This monorepo uses a **single .env file at root** instead of separate files for each app. See [ENV-CONFIGURATION-GUIDE.md](./ENV-CONFIGURATION-GUIDE.md) for details.

3. **Start all applications:**

   ```bash
   npm run dev
   ```

4. **Access the applications:**
   - **SSO Portal:** http://localhost:4200
   - **Student Portal:** http://localhost:4300
   - **Recruiter Portal:** http://localhost:4400
   - **Admin Portal:** http://localhost:4500

## 📝 Available Scripts

```bash
# Start individual app
npm run dev:sso          # Start SSO app (port 4200)
npm run dev:student      # Start Student app (port 4300)
npm run dev:recruiter    # Start Recruiter app (port 4400)
npm run dev:admin        # Start Admin app (port 4500)

# Start all apps concurrently
npm run dev              # Start all 4 apps at once

# Build for production
npx nx build sso         # Build specific app
npx nx build --all       # Build all apps

# Run tests
npx nx test sso          # Test specific app
npx nx test --all        # Test all apps

# Lint
npx nx lint sso          # Lint specific app
npx nx lint --all        # Lint all apps
```

## 📦 Project Structure

```
abc-interview-support-frontend/
├── apps/
│   ├── sso/                 # SSO Portal (Authentication)
│   ├── student/             # Student Portal
│   ├── recruiter/           # Recruiter Portal
│   └── admin/               # Admin Dashboard
├── libs/
│   ├── types/               # Shared TypeScript types
│   ├── sso-utils/          # SSO utilities & API client
│   └── services/           # API services layer (NEW!)
├── .env                     # Environment variables (shared)
├── .env.example            # Environment template
├── .github/                 # GitHub Actions CI/CD
├── nx.json                  # Nx configuration
├── package.json             # Root dependencies
└── tsconfig.base.json       # Base TypeScript config
```

## 🎯 Applications

### 1. SSO Portal (`apps/sso`)

Central authentication portal with:

- Login, Register, Forgot Password flows
- Multi-step registration form
- Role-based dashboard
- Single Sign-On token management

### 2. Student Portal (`apps/student`)

For students to:

- Practice interview questions
- Take mock interviews
- View recruitment news
- Participate in community discussions
- Track learning progress

### 3. Recruiter Portal (`apps/recruiter`)

For recruiters to:

- Post job openings
- Create and manage exams
- Review candidate results
- Manage company verification

### 4. Admin Portal (`apps/admin`)

For administrators to:

- Manage users and roles
- Review and approve content
- Monitor system activities
- Configure system settings

## 🛠️ Technology Stack

- **React 19.0.0** - UI library
- **TypeScript 5.8.2** - Type safety
- **Tailwind CSS 4.1.12** - Utility-first CSS
- **Ant Design 5.27.0** - Component library
- **React Router 6.29.0** - Routing
- **React Hook Form 7.62.0** - Form management
- **Axios 1.12.2** - HTTP client
- **Vite 6.0.0** - Build tool
- **Nx 21.4.0** - Monorepo management

## 🔐 Authentication Flow

This project uses a custom SSO (Single Sign-On) implementation:

1. User visits any app → Redirected to SSO Portal
2. User logs in at SSO → Server creates session + generates single-use `sso_auth` token
3. User selects target app from dashboard
4. SSO sends token via:
   - **PostMessage API** (primary)
   - **URL parameter** (fallback)
5. Target app verifies token with backend
6. Backend returns access/refresh tokens
7. Tokens stored in sessionStorage with app-specific keys

**Token Types:**

- **SSO Auth Token:** Single-use, 60s TTL
- **Access Token:** JWT, 15 minutes
- **Refresh Token:** 7 days

## 📚 Shared Libraries

### `@abc-interview-support-frontend/services` ⭐ NEW

Centralized API services layer for all backend calls.

**Features:**

- Unified axios instance with interceptors
- Auto token injection and refresh
- Type-safe API methods
- Single `.env` configuration

**Services:**

- `AuthService` - Login, register, password reset
- `UserService` - User management, profiles
- `ExamService` - Exam CRUD operations
- `QuestionService` - Question bank management
- `NewsService` - News and recruitment posts
- `CareerService` - Career preferences

**Usage:**

```typescript
import { createAuthService } from '@abc-interview-support-frontend/services';

const authService = createAuthService(import.meta.env.VITE_API_BASE_URL);
const response = await authService.login({ email, password });
```

See [libs/services/README.md](./libs/services/README.md) for full documentation.

### `@abc-interview-support-frontend/types`

Shared TypeScript interfaces and types:

- Authentication types (AuthUser, LoginRequest, etc.)
- User and Role types
- Exam and Question types
- News and Career types

### `@abc-interview-support-frontend/sso-utils`

SSO utilities and authentication helpers:

- `SSOClient` - Client-side SSO initialization
- `SSOTokenManager` - Token transmission management
- `ApiClient` - HTTP client with auto token refresh
- `AuthContext` - React authentication context
- `useAuth` - Authentication hook

## 🔧 Backend Integration

This frontend connects to a Java Spring Boot microservices backend. Make sure to:

1. Update `VITE_API_BASE_URL` in `.env` files to point to your backend
2. Ensure backend CORS is configured to allow frontend origins
3. Backend should implement these endpoints:
   - `POST /api/auth/login` - User login
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/verify-session` - SSO token verification
   - `POST /api/auth/refresh` - Token refresh
   - `GET /api/auth/profile` - Get user profile (protected)
   - `POST /api/auth/logout` - User logout

## 🎨 Design System

The project uses a consistent design system with:

- **Color Palette:** Blue/Indigo primary, Slate secondary
- **Typography Scale:** 5 heading levels + body + caption
- **Spacing Scale:** XS to XL (0.5rem to 3rem)
- **Animations:** Fade-in, slide-up, bounce-in effects
- **Glass Morphism:** Backdrop blur + semi-transparent backgrounds

## 🐛 Troubleshooting

**Port conflicts:**

```bash
# Windows: Find and kill process on port
netstat -ano | findstr :4200
taskkill /PID <pid> /F

# Linux/Mac: Kill process on port
lsof -ti:4200 | xargs kill -9
```

**CORS errors:**

- Verify backend CORS configuration allows frontend origins
- Check `VITE_API_BASE_URL` in root `.env` file

**Authentication issues:**

- Clear browser localStorage (tokens may be expired)
- Verify backend `/api/auth/verify-session` endpoint is working
- Check browser console for SSO errors

**Environment variables not loading:**

- Ensure `.env` file is at root (not in app directories)
- Restart dev server after changing `.env`
- See [ENV-CONFIGURATION-GUIDE.md](./ENV-CONFIGURATION-GUIDE.md)

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For more information about Nx:

- [Nx Documentation](https://nx.dev)
- [Nx Console Extension](https://nx.dev/getting-started/editor-setup)
- [Nx Community Discord](https://go.nx.dev/community)

---

**Built with ❤️ using React, TypeScript, and Nx**
