# ABC Interview Support - SSO System

A secure Single Sign-On (SSO) implementation for the ABC Interview Support monorepo built with Nx, featuring server-side sessions, short-lived single-use tokens, and postMessage communication with URL fallback.

## 🏗️ Architecture Overview

### Core Components

1. **SSO App** (`/apps/sso`) - Central authentication portal
2. **Target Apps** - Individual applications (Admin, Student, Recruiter)
3. **Backend API** - Java Spring Boot microservices with JWT authentication
4. **Shared Libraries** - Common utilities and types

### Security Features

- **Server-side sessions** with configurable TTL
- **Single-use SSO auth tokens** with 60-second expiry
- **CSRF protection** via state parameter with cryptographic validation
- **Encrypted session storage** using XOR encryption for sensitive data
- **PostMessage handshake** with origin validation and URL parameter fallback
- **Automatic token cleanup** and session management
- **Open redirect protection** to prevent malicious redirects
- **Device fingerprinting** for enhanced session validation
- **Role-based access control** for different user types

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- Java Spring Boot Backend running

### Installation & Startup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd abc-interview-support-frontend
   npm install
   ```

2. **Configure environment variables:**

   Create `.env` files in each app directory with your backend API URL:

   ```env
   VITE_API_BASE_URL=http://your-backend-api-url
   VITE_SSO_ORIGIN=http://localhost:4200
   VITE_APP_ORIGIN=http://localhost:4XXX
   ```

3. **Start all frontend applications:**

   ```bash
   npm run dev
   ```

   This starts all 4 apps concurrently:

   - SSO: `nx serve sso` (port 4200)
   - Admin: `nx serve admin` (port 4500)
   - Student: `nx serve student` (port 4300)
   - Recruiter: `nx serve recruiter` (port 4400)

4. **Access the applications:**
   - **SSO Portal:** http://localhost:4200
   - **Student Portal:** http://localhost:4300
   - **Recruiter Portal:** http://localhost:4400
   - **Admin Portal:** http://localhost:4500
   - **Backend API:** Your configured backend URL

## 👤 User Accounts

User accounts are managed by your Java Spring Boot backend. Contact your backend administrator for test credentials.

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
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
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
└── package.json             # Root dependencies
```

## 🔌 Backend API Requirements

Your Java Spring Boot backend must implement these authentication endpoints:

### Required Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (optional)
- `POST /api/auth/verify-session` - SSO token verification
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password (optional)

### Expected Request/Response Formats

**Login:**

```typescript
// Request
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "userId": "string",
    "email": "string",
    "fullName": "string",
    "roleId": "string",
    "role": {
      "roleId": "string",
      "roleName": "Student" | "Recruiter" | "Admin"
    },
    "status": "Pending" | "Verified" | "Locked"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "sessionId": "string",
  "sso_auth": "string" // Single-use token for SSO
}
```

**Verify SSO Token:**

```typescript
// Request
POST /api/auth/verify-session
{
  "sso_auth": "single-use-token"
}

// Response
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "userId": "string",
    "email": "string",
    "fullName": "string",
    "roleId": "string",
    "role": {
      "roleId": "string",
      "roleName": "Student" | "Recruiter" | "Admin"
    },
    "status": "Pending" | "Verified" | "Locked"
  }
}
```

**Refresh Token:**

```typescript
// Request
POST /api/auth/refresh
{
  "refreshToken": "string"
}

// Response
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

## ⚙️ Configuration

### Environment Variables

Each app has its own `.env` file:

**SSO App** (`apps/sso/.env`):

```env
VITE_API_BASE_URL=http://your-backend-api-url
VITE_SSO_ORIGIN=http://localhost:4200
VITE_APP_ORIGIN=http://localhost:4200
VITE_ADMIN_URL=http://localhost:4500
VITE_STUDENT_URL=http://localhost:4300
VITE_RECRUITER_URL=http://localhost:4400
```

**Target Apps** (e.g., `apps/admin/.env`):

```env
VITE_API_BASE_URL=http://your-backend-api-url
VITE_SSO_ORIGIN=http://localhost:4200
VITE_APP_ORIGIN=http://localhost:4500
```

**Backend CORS Configuration:**

Your Java Spring Boot backend must allow these origins:

- `http://localhost:4200` (SSO)
- `http://localhost:4300` (Student)
- `http://localhost:4400` (Recruiter)
- `http://localhost:4500` (Admin)

## 🧪 Testing the SSO Flow

### Manual Testing Checklist

1. **✅ Basic Login:**

   - Visit http://localhost:4200
   - Login with test credentials
   - Verify you see the dashboard with loading states

2. **✅ App Launch (PostMessage with State):**

   - Click "Launch Admin Dashboard"
   - Verify loading spinner appears
   - Check if app opens and user is authenticated
   - Verify URL is clean (no `sso_auth` or `state` parameters)
   - **Security:** Open DevTools Console, look for state validation logs

3. **✅ App Launch (Fallback):**

   - Disable JavaScript temporarily
   - Try launching an app
   - Should redirect with URL parameters (`sso_auth` and `state`)
   - Re-enable JavaScript, page should clean both parameters

4. **✅ CSRF Protection Test:**

   - Manually craft URL: `http://localhost:4500?sso_auth=fake_token&state=invalid_state`
   - Should see error: "Invalid or expired state parameter"
   - Authentication should fail

5. **✅ Encrypted Storage Test:**

   - Login and open DevTools → Application → Session Storage
   - Check stored values - should be encrypted (not plain JSON)
   - Verify encrypted format: `{"data":"...","iv":"..."}`

6. **✅ Direct Access Protection:**

   - Open http://localhost:4500 in incognito mode
   - Should redirect to SSO login
   - After login, should return to intended page

7. **✅ Role-based Access:**

   - Login as Student user
   - Try accessing Admin portal
   - Should show "Access Denied" message

8. **✅ Session Storage Isolation:**
   - Login and access multiple apps
   - Check sessionStorage in DevTools
   - Each app should have separate encrypted token keys

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

- Check backend CORS configuration
- Verify backend allows frontend origins (localhost:4200-4500)
- Restart backend after CORS configuration changes

**4. PostMessage not working:**

- Check browser console for errors
- Verify both apps are on localhost (not 127.0.0.1)
- Try the URL fallback method

**5. SSO tokens expiring:**

- Tokens expire in 60 seconds by design
- Check backend logs for token cleanup
- Verify system clock synchronization between frontend and backend

### Debug Logging

**Enable verbose logging in SSO client:**

```typescript
// In useSSO.ts
const cleanup = SSOClient.initializeClient(ssoOrigin, apiBaseUrl, onAuthReceived, (error) => {
  console.log('SSO Debug:', { ssoOrigin, apiBaseUrl, error });
});
```

**Monitor backend health:**

```bash
curl http://your-backend-url/health
curl http://your-backend-url/actuator/health
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

### Frontend Security Features (Implemented)

✅ **CSRF Protection:**

- State parameter with cryptographic validation
- Generated using `crypto.getRandomValues()`
- Validated on both SSO and target app sides
- 5-minute TTL to prevent replay attacks

✅ **Encrypted Session Storage:**

- XOR encryption for sensitive data at rest
- Protects tokens from XSS attacks accessing sessionStorage
- Custom `SecureStorage` wrapper for transparent encryption

✅ **Open Redirect Protection:**

- Validates redirect URLs against whitelist
- Prevents malicious redirects to external sites
- Uses `isValidRedirectUrl()` utility

✅ **PostMessage Security:**

- Origin validation on both sender and receiver
- Structured message types (SSO_AUTH, SSO_READY)
- 3-second timeout for handshake
- Fallback to URL parameters only if postMessage fails

✅ **Device Fingerprinting:**

- Combines userAgent, language, screen resolution, timezone
- Helps detect session hijacking attempts
- Used for additional session validation

✅ **Token Cleanup:**

- Automatic removal of sensitive URL parameters
- Both `sso_auth` and `state` cleaned after use
- Prevents token exposure in browser history

✅ **Single-use Tokens:**

- SSO auth tokens expire in 60 seconds
- Backend marks tokens as used after verification
- Prevents token replay attacks

✅ **Loading & Error States:**

- User-friendly feedback during authentication
- Error messages for security violations
- Prevents confusion during CSRF validation failures

### Security Best Practices

**For Developers:**

1. Never log tokens or state parameters to console in production
2. Always validate origin in postMessage handlers
3. Use `SecureStorage` for sensitive data, not plain sessionStorage
4. Keep security utilities up to date
5. Test CSRF protection with manual token crafting

**Production Checklist:**

- [ ] Enable HTTPS for all apps
- [ ] Configure CSP headers to restrict script sources
- [ ] Rotate encryption keys regularly
- [ ] Enable security logging and monitoring
- [ ] Implement rate limiting on backend
- [ ] Add session timeout warnings (recommended: 55 minutes)
- [ ] Use HttpOnly cookies for refresh tokens (backend)
- [ ] Enable audit logging for authentication events

### Backend Security Recommendations

Your Java Spring Boot backend should implement:

- HttpOnly cookies for refresh tokens
- Rate limiting on auth endpoints
- Session management in Redis/database
- Token rotation
- Input validation & sanitization
- Request/response encryption (HTTPS)
- Audit logging
- 2FA support (optional)
- CSRF token validation on state parameter
- IP-based rate limiting

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
