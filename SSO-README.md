# ABC Interview Support - SSO System

A secure Single Sign-On (SSO) implementation for the ABC Interview Support monorepo built with Nx, featuring server-side sessions, short-lived single-use tokens, and postMessage communication with URL fallback.

## 🏗️ Architecture Overview

### Core Components

1. **SSO App** (`/apps/sso`) - Central authentication portal
2. **Target Apps** - Individual applications (Admin, Student, Recruiter)
3. **Mock Server** - Backend API with JWT authentication
4. **Shared Libraries** - Common utilities and types

### Security Features

- **Server-side sessions** with configurable TTL
- **Single-use SSO auth tokens** with 60-second expiry
- **PostMessage handshake** with URL parameter fallback
- **Automatic token cleanup** and session management
- **Role-based access control** for different user types

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+

### Installation & Startup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd abc-interview-support-frontend
   npm install
   ```

2. **Start the entire system:**

   **Windows:**

   ```cmd
   scripts\start-all.bat
   ```

   **Linux/Mac:**

   ```bash
   chmod +x scripts/start-all.sh
   ./scripts/start-all.sh
   ```

3. **Access the applications:**
   - **SSO Portal:** http://localhost:4200
   - **Student Portal:** http://localhost:4300
   - **Recruiter Portal:** http://localhost:4400
   - **Admin Portal:** http://localhost:4500
   - **Mock API:** http://localhost:3000

## 👤 Test Accounts

| Role      | Email                 | Password     |
| --------- | --------------------- | ------------ |
| Admin     | admin@example.com     | admin123     |
| Student   | student@example.com   | student123   |
| Recruiter | recruiter@example.com | recruiter123 |

## 🔧 Manual Setup (Alternative)

### 1. Start Mock Server

```bash
cd mock-server
npm install
npm start
```

### 2. Start Frontend Apps

```bash
# In project root
npm run dev
```

This starts all 4 apps concurrently:

- SSO: `nx serve sso`
- Admin: `nx serve admin`
- Student: `nx serve student`
- Recruiter: `nx serve recruiter`

## 🔄 SSO Flow

### 1. Login Process

1. User visits any protected app → redirected to SSO
2. User logs in at SSO portal
3. Server creates session + generates single-use `sso_auth` token
4. SSO stores session data in browser storage

### 2. App Access Process

1. User clicks "Launch App" on SSO dashboard
2. **PostMessage Attempt:**
   - SSO opens target app
   - Target app sends 'SSO_READY' message
   - SSO responds with 'SSO_AUTH' containing token
3. **Fallback (if postMessage fails):**
   - SSO redirects to `targetApp?sso_auth=<token>`
4. **Token Verification:**
   - Target app calls `/api/auth/verify-session`
   - Server validates single-use token
   - Returns access/refresh tokens for target app
   - Token is marked as used
   - URL parameters cleaned from browser

### 3. Token Management

- **Access tokens:** 15 minutes (JWT, client-side)
- **Refresh tokens:** 7 days (server-managed)
- **SSO auth tokens:** 60 seconds, single-use
- **Sessions:** 1 hour (server-side)

## 📁 Project Structure

```
├── apps/
│   ├── sso/                 # SSO Portal
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── DashboardLinks.tsx
│   │   │   └── app.tsx
│   │   └── .env
│   ├── admin/               # Admin Dashboard
│   ├── student/             # Student Portal
│   └── recruiter/           # Recruiter Portal
├── libs/
│   ├── types/               # Shared TypeScript types
│   └── sso-utils/          # SSO utilities
│       ├── src/lib/
│       │   ├── sso-token-manager.ts
│       │   ├── sso-client.ts
│       │   ├── api-client.ts
│       │   └── auth-context.tsx
│       └── src/index.ts
├── mock-server/             # Express.js API server
│   ├── server.js
│   ├── package.json
│   └── .env
└── scripts/                 # Startup/shutdown scripts
    ├── start-all.bat
    ├── start-all.sh
    ├── stop-all.bat
    └── stop-all.sh
```

## 🔌 API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-session` - SSO token verification
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - User logout
- `GET /health` - Health check

### Example Requests

**Login:**

```javascript
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "student123"
}
```

**Verify SSO Token:**

```javascript
POST /api/auth/verify-session
{
  "sso_auth": "abc123xyz"
}
```

## ⚙️ Configuration

### Environment Variables

Each app has its own `.env` file:

**SSO App** (`apps/sso/.env`):

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SSO_ORIGIN=http://localhost:4200
VITE_APP_ORIGIN=http://localhost:4200
VITE_ADMIN_URL=http://localhost:4500
VITE_STUDENT_URL=http://localhost:4300
VITE_RECRUITER_URL=http://localhost:4400
```

**Target Apps** (e.g., `apps/admin/.env`):

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SSO_ORIGIN=http://localhost:4200
VITE_APP_ORIGIN=http://localhost:4500
```

**Mock Server** (`mock-server/.env`):

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_ORIGINS=http://localhost:4200,http://localhost:4300,http://localhost:4400,http://localhost:4500
SESSION_TTL=3600000
SSO_AUTH_TTL=60000
```

## 🧪 Testing the SSO Flow

### Manual Testing Checklist

1. **✅ Basic Login:**

   - Visit http://localhost:4200
   - Login with test credentials
   - Verify you see the dashboard

2. **✅ App Launch (PostMessage):**

   - Click "Launch Admin Dashboard"
   - Check if app opens and user is authenticated
   - Verify URL is clean (no `sso_auth` parameter)

3. **✅ App Launch (Fallback):**

   - Disable JavaScript temporarily
   - Try launching an app
   - Should redirect with URL parameter
   - Re-enable JavaScript, page should clean URL

4. **✅ Direct Access Protection:**

   - Open http://localhost:4500 in incognito mode
   - Should redirect to SSO login
   - After login, should return to intended page

5. **✅ Role-based Access:**

   - Login as Student user
   - Try accessing Admin portal
   - Should show "Access Denied" message

6. **✅ Session Storage Isolation:**
   - Login and access multiple apps
   - Check sessionStorage in DevTools
   - Each app should have separate token keys

### Browser DevTools Inspection

**SessionStorage Keys:**

- `admin_accessToken`
- `admin_refreshToken`
- `admin_user`
- `student_accessToken`
- etc.

**Network Requests:**

- Watch for `/api/auth/verify-session` calls
- Check Authorization headers in API requests

## 🛠️ Development

### Adding New Apps

1. Create new Nx app:

   ```bash
   nx g @nx/react:app new-app
   ```

2. Add `.env` file with SSO configuration

3. Create utils directory with `useSSO.ts` and `apiClient.ts`

4. Wrap app with `AuthProvider` component

5. Update mock server CORS origins

### Extending Authentication

**Custom Claims in JWT:**

```javascript
const accessToken = jwt.sign(
  {
    userId: user.userId,
    email: user.email,
    role: user.role,
    permissions: ['read', 'write'], // Add custom claims
  },
  JWT_SECRET,
  { expiresIn: '15m' }
);
```

**Role-based Route Protection:**

```typescript
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role.roleName)) {
    return <AccessDenied />;
  }

  return children;
}
```

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot find module" errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Port conflicts:**

```bash
# Kill processes on ports
# Windows:
netstat -ano | findstr :4200
taskkill /PID <pid> /F

# Linux/Mac:
lsof -ti:4200 | xargs kill -9
```

**3. CORS errors:**

- Check mock server console for origin logs
- Verify `.env` FRONTEND_ORIGINS matches your URLs
- Restart mock server after changes

**4. PostMessage not working:**

- Check browser console for errors
- Verify both apps are on localhost (not 127.0.0.1)
- Try the URL fallback method

**5. SSO tokens expiring:**

- Tokens expire in 60 seconds by design
- Check server logs for cleanup messages
- Verify system clock synchronization

### Debug Logging

**Enable verbose logging in SSO client:**

```typescript
// In useSSO.ts
const cleanup = SSOClient.initializeClient(ssoOrigin, apiBaseUrl, onAuthReceived, (error) => {
  console.log('SSO Debug:', { ssoOrigin, apiBaseUrl, error });
});
```

**Monitor server sessions:**

```bash
curl http://localhost:3000/health
```

## 🔒 Security Considerations

### Production Deployment

1. **Environment Variables:**

   - Generate strong JWT secrets
   - Use HTTPS URLs
   - Configure proper CORS origins

2. **Token Security:**

   - Consider HttpOnly cookies for refresh tokens
   - Implement token rotation
   - Add rate limiting to auth endpoints

3. **Session Security:**

   - Store sessions in Redis/database
   - Implement session invalidation
   - Add session timeout warnings

4. **Network Security:**
   - Use HTTPS everywhere
   - Implement CSP headers
   - Add request validation/sanitization

### Known Limitations

- Sessions stored in memory (use Redis in production)
- No rate limiting on auth endpoints
- Basic error handling (enhance for production)
- Test users hardcoded (use proper user management)

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**🎉 Happy coding! If you encounter any issues, please check the troubleshooting section or open an issue.**
