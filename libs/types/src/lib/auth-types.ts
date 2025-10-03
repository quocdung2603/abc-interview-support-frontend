export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  roleId: number;
  dateOfBirth: string;
  address: string;
  isStudying: boolean;
}

// Backend response structure from /users/login
export interface BackendUserResponse {
  id: number;
  roleId: number;
  roleName: 'USER' | 'ADMIN' | 'RECRUITER';
  email: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  status: 'VERIFIED' | 'PENDING' | 'LOCKED';
  isStudying: boolean;
  eloScore: number;
  eloRank: string;
  createdAt: string;
  verifyToken: string | null;
}

// Frontend AuthUser structure (normalized)
export interface AuthUser {
  userId: string;
  email: string;
  fullName?: string;
  roleId: string;
  roleName: 'User' | 'Recruiter' | 'Admin';
  status: 'Pending' | 'Verified' | 'Locked';
  dateOfBirth?: string;
  address?: string;
  isStudying?: boolean;
  eloScore?: number;
  eloRank?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// Combined response with both tokens and user data
export interface LoginWithTokensResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user?: BackendUserResponse;
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
    state?: string;
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

/**
 * Transform backend user response to frontend AuthUser format
 */
export function transformBackendUserToAuthUser(
  backendUser: BackendUserResponse
): AuthUser {
  // Map backend role names to frontend format
  const roleNameMap: Record<string, 'User' | 'Recruiter' | 'Admin'> = {
    USER: 'User',
    RECRUITER: 'Recruiter',
    ADMIN: 'Admin',
  };

  // Map backend status to frontend format
  const statusMap: Record<string, 'Pending' | 'Verified' | 'Locked'> = {
    PENDING: 'Pending',
    VERIFIED: 'Verified',
    LOCKED: 'Locked',
  };

  return {
    userId: backendUser.id.toString(),
    email: backendUser.email,
    fullName: backendUser.fullName,
    roleId: backendUser.roleId.toString(),
    roleName: roleNameMap[backendUser.roleName] || 'User',
    status: statusMap[backendUser.status] || 'Pending',
    dateOfBirth: backendUser.dateOfBirth,
    address: backendUser.address,
    isStudying: backendUser.isStudying,
    eloScore: backendUser.eloScore,
    eloRank: backendUser.eloRank,
  };
}
