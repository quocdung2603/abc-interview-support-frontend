# Environment Variables Configuration Guide

## 📋 Tổng quan

Trong monorepo này, chúng ta sử dụng **1 file .env duy nhất ở root** thay vì nhiều file .env riêng lẻ cho từng app.

## 📁 Cấu trúc File

```
abc-interview-support-frontend/
├── .env                    # ✅ File .env chính (sử dụng file này)
├── .env.example           # Template cho .env
├── apps/
│   ├── sso/.env           # ❌ Không sử dụng (có thể xóa)
│   ├── student/.env       # ❌ Không sử dụng (có thể xóa)
│   ├── recruiter/.env     # ❌ Không sử dụng (có thể xóa)
│   └── admin/.env         # ❌ Không sử dụng (có thể xóa)
└── ...
```

## 🔧 Cấu hình

### File `.env` ở root

```env
# ==================================================
# SHARED ENVIRONMENT VARIABLES FOR ALL APPS
# ==================================================

# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# SSO Configuration
VITE_SSO_ORIGIN=http://localhost:4200

# App URLs
VITE_SSO_URL=http://localhost:4200
VITE_STUDENT_URL=http://localhost:4300
VITE_RECRUITER_URL=http://localhost:4400
VITE_ADMIN_URL=http://localhost:4500

# JWT Token Configuration (in minutes/days)
VITE_ACCESS_TOKEN_EXPIRY=15
VITE_REFRESH_TOKEN_EXPIRY=7

# Optional: API Timeout (in milliseconds)
VITE_API_TIMEOUT=10000
```

## 🚀 Sử dụng trong Code

### Trong React Components

```typescript
// Truy cập biến môi trường
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const ssoUrl = import.meta.env.VITE_SSO_URL;

console.log('API Base URL:', apiBaseUrl);
```

### Trong Services

```typescript
import { createAuthService } from '@abc-interview-support-frontend/services';

// Services tự động sử dụng VITE_API_BASE_URL
const baseURL = import.meta.env.VITE_API_BASE_URL;
const authService = createAuthService(baseURL);
```

### TypeScript Intellisense

Để có auto-complete cho environment variables, tạo file `vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_SSO_URL: string;
  readonly VITE_SSO_ORIGIN: string;
  readonly VITE_STUDENT_URL: string;
  readonly VITE_RECRUITER_URL: string;
  readonly VITE_ADMIN_URL: string;
  readonly VITE_ACCESS_TOKEN_EXPIRY: string;
  readonly VITE_REFRESH_TOKEN_EXPIRY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 🌍 Environments khác nhau

### Development (Local)

File: `.env` hoặc `.env.local`

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_SSO_URL=http://localhost:4200
```

### Staging

File: `.env.staging`

```env
VITE_API_BASE_URL=https://api-staging.yourproject.com
VITE_SSO_URL=https://sso-staging.yourproject.com
VITE_STUDENT_URL=https://student-staging.yourproject.com
VITE_RECRUITER_URL=https://recruiter-staging.yourproject.com
VITE_ADMIN_URL=https://admin-staging.yourproject.com
```

### Production

File: `.env.production`

```env
VITE_API_BASE_URL=https://api.yourproject.com
VITE_SSO_URL=https://sso.yourproject.com
VITE_STUDENT_URL=https://student.yourproject.com
VITE_RECRUITER_URL=https://recruiter.yourproject.com
VITE_ADMIN_URL=https://admin.yourproject.com
```

## 🔒 Security

### .gitignore

File `.gitignore` đã được cấu hình để ignore các file env:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
apps/*/.env
apps/*/.env.local
```

### Best Practices

1. **KHÔNG** commit file `.env` lên Git
2. **CÓ** commit file `.env.example` làm template
3. **CÓ** document tất cả biến trong `.env.example`
4. **KHÔNG** để sensitive data (API keys, secrets) trong code

### .env.example

Tạo file template cho team:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# SSO Configuration
VITE_SSO_ORIGIN=http://localhost:4200

# App URLs
VITE_SSO_URL=http://localhost:4200
VITE_STUDENT_URL=http://localhost:4300
VITE_RECRUITER_URL=http://localhost:4400
VITE_ADMIN_URL=http://localhost:4500

# JWT Token Configuration (in minutes/days)
VITE_ACCESS_TOKEN_EXPIRY=15
VITE_REFRESH_TOKEN_EXPIRY=7

# Optional: API Timeout (in milliseconds)
VITE_API_TIMEOUT=10000
```

## 📦 Nx Monorepo Support

### Tại sao chỉ cần 1 file .env?

Vite tự động đọc file `.env` từ **root của workspace**, không phải từ thư mục của từng app.

**Cách Vite tìm .env:**
1. Tìm từ thư mục root của project
2. Load các file theo thứ tự:
   - `.env`
   - `.env.local`
   - `.env.[mode]`
   - `.env.[mode].local`

### Load thứ tự

```
.env                     # Loaded in all cases
.env.local              # Loaded in all cases, ignored by git
.env.[mode]             # Only loaded in specified mode (dev/prod)
.env.[mode].local       # Only loaded in specified mode, ignored by git
```

## 🛠️ Troubleshooting

### Vấn đề: Environment variables không load

**Giải pháp:**
1. Kiểm tra file `.env` có ở đúng root của workspace không
2. Restart dev server: `Ctrl+C` và chạy lại `nx serve <app-name>`
3. Clear cache: `nx reset`

### Vấn đề: TypeScript không nhận diện biến env

**Giải pháp:**
1. Tạo file `vite-env.d.ts` (xem phần TypeScript Intellisense)
2. Thêm vào `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "types": ["vite/client"]
     }
   }
   ```

### Vấn đề: Mỗi app cần URL khác nhau

**Giải pháp:**

Sử dụng biến `VITE_APP_ORIGIN` để identify app hiện tại:

```typescript
// apps/student/src/main.tsx
const APP_ORIGIN = import.meta.env.VITE_STUDENT_URL;

// apps/recruiter/src/main.tsx  
const APP_ORIGIN = import.meta.env.VITE_RECRUITER_URL;
```

## 📚 References

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Nx Environment Variables](https://nx.dev/recipes/tips-n-tricks/define-environment-variables)
- [TypeScript ImportMeta](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#support-for-importmeta)

## ✅ Checklist

- [ ] Tạo file `.env` ở root
- [ ] Tạo file `.env.example` làm template
- [ ] Xóa các file `.env` trong `apps/*/`
- [ ] Cập nhật `.gitignore`
- [ ] Tạo `vite-env.d.ts` cho TypeScript
- [ ] Test các app với env variables mới
- [ ] Document biến env trong README
