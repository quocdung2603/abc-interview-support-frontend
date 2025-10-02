# Quick Start - Environment Variables

## 🚀 For New Team Members

### Step 1: Copy the environment template

```bash
cp .env.example .env
```

### Step 2: Update values if needed

```bash
# Edit .env file
code .env
```

### Step 3: Start development

```bash
npm run dev
```

That's it! All apps will use the same `.env` file.

---

## 📝 Common Environment Variables

| Variable                    | Default                 | Description                     |
| --------------------------- | ----------------------- | ------------------------------- |
| `VITE_API_BASE_URL`         | `http://localhost:3000` | Backend API URL                 |
| `VITE_SSO_ORIGIN`           | `http://localhost:4200` | SSO Portal URL                  |
| `VITE_SSO_URL`              | `http://localhost:4200` | SSO Portal URL (alias)          |
| `VITE_STUDENT_URL`          | `http://localhost:4300` | Student App URL                 |
| `VITE_RECRUITER_URL`        | `http://localhost:4400` | Recruiter App URL               |
| `VITE_ADMIN_URL`            | `http://localhost:4500` | Admin App URL                   |
| `VITE_ACCESS_TOKEN_EXPIRY`  | `15`                    | Access token lifetime (minutes) |
| `VITE_REFRESH_TOKEN_EXPIRY` | `7`                     | Refresh token lifetime (days)   |
| `VITE_API_TIMEOUT`          | `10000`                 | API request timeout (ms)        |

---

## 🔧 Using Environment Variables in Code

### TypeScript (with auto-complete)

```typescript
// TypeScript will auto-complete these!
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const ssoUrl = import.meta.env.VITE_SSO_ORIGIN;
```

### With Fallback Values

```typescript
// Recommended pattern
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

---

## 📂 File Locations

### ✅ DO use these files:

- `.env` - Main configuration (at project root)
- `.env.example` - Template with comments

### ❌ DON'T create these files:

- `apps/sso/.env` - Not needed!
- `apps/student/.env` - Not needed!
- `apps/recruiter/.env` - Not needed!
- `apps/admin/.env` - Not needed!

> All apps automatically read from the root `.env` file.

---

## 🌍 Different Environments

### Local Development

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Staging

```env
VITE_API_BASE_URL=https://api-staging.example.com
```

### Production

```env
VITE_API_BASE_URL=https://api.example.com
```

### Loading Environment Files

Vite automatically loads files in this order:

1. `.env` - All environments
2. `.env.local` - Local overrides (ignored by git)
3. `.env.[mode]` - Mode-specific (e.g., `.env.production`)
4. `.env.[mode].local` - Mode-specific local overrides

---

## 🐛 Troubleshooting

### Problem: "Environment variable is undefined"

**Solution:**

1. Check `.env` file exists at root
2. Restart dev server (`Ctrl+C` and `npm run dev` again)
3. Clear cache: `npx nx reset`

### Problem: "TypeScript doesn't recognize env variables"

**Solution:**

1. Check `vite-env.d.ts` exists in `apps/[app-name]/src/`
2. Restart TypeScript server in VS Code: `Ctrl+Shift+P` → "Restart TypeScript Server"

### Problem: "Changes to .env not working"

**Solution:**

1. Restart dev server (Vite doesn't hot-reload .env)
2. Clear browser cache
3. Check you're editing the ROOT `.env`, not one in `apps/`

---

## 🔒 Security

### ✅ DO:

- Add `.env` to `.gitignore` (already done)
- Use `.env.example` as template
- Share values securely (not in chat/email)

### ❌ DON'T:

- Commit `.env` to git
- Put secrets in `.env.example`
- Share `.env` file publicly

---

## 📚 More Information

- **Detailed Guide:** [ENV-CONFIGURATION-GUIDE.md](./ENV-CONFIGURATION-GUIDE.md)
- **Migration Report:** [ENV-MIGRATION-REPORT.md](./ENV-MIGRATION-REPORT.md)
- **Verification:** [ENV-MIGRATION-VERIFICATION.md](./ENV-MIGRATION-VERIFICATION.md)

---

## ⚡ Quick Commands

```bash
# Start all apps
npm run dev

# Start specific app
npm run dev:sso
npm run dev:student
npm run dev:recruiter
npm run dev:admin

# Build all apps
npx nx build --all

# Check for errors
npx nx lint --all
```

---

**Last Updated:** October 2, 2025  
**Questions?** Check the documentation files listed above.
