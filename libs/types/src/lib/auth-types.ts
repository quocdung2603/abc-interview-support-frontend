export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  roleId: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  fullName?: string;
  roleId: string;
  role: {
    roleId: string;
    roleName: 'Student' | 'Recruiter' | 'Admin';
  };
  status: 'Pending' | 'Verified' | 'Locked';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifySessionRequest {
  sso_auth?: string;
  sessionId?: string;
}

export interface VerifySessionResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// SSO Message types for postMessage communication
export interface SSOMessage {
  type: 'SSO_READY' | 'SSO_AUTH' | 'SSO_ERROR';
  payload?: {
    sso_auth?: string;
    error?: string;
  };
  origin?: string;
}

// SSO Session data stored server-side
export interface SSOSession {
  sessionId: string;
  userId: string;
  user: AuthUser;
  tokens: AuthTokens;
  createdAt: number;
  expiresAt: number;
}

// Single-use auth token for SSO handoff
export interface SSOAuthToken {
  sso_auth: string;
  sessionId: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}
