import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import { AuthUser } from '@abc-interview-support-frontend/types';

export interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export interface AuthProviderProps {
  readonly children: ReactNode;
  readonly appName: string; // Used for sessionStorage key isolation
  readonly ssoOrigin: string;
  readonly apiBaseUrl: string;
  readonly onUnauthorized?: () => void;
}

export function AuthProvider({
  children,
  appName,
  ssoOrigin,
  apiBaseUrl,
  onUnauthorized,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = (key: string) => `${appName}_${key}`;

  // Load tokens from sessionStorage on mount
  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem(
      getStorageKey('accessToken')
    );
    const storedRefreshToken = sessionStorage.getItem(
      getStorageKey('refreshToken')
    );
    const storedUser = sessionStorage.getItem(getStorageKey('user'));

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        clearStoredData();
      }
    }

    setIsLoading(false);
  }, [appName]);

  const clearStoredData = () => {
    sessionStorage.removeItem(getStorageKey('accessToken'));
    sessionStorage.removeItem(getStorageKey('refreshToken'));
    sessionStorage.removeItem(getStorageKey('user'));
  };

  const login = (
    newAccessToken: string,
    newRefreshToken: string,
    newUser: AuthUser
  ) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);

    // Store in sessionStorage
    sessionStorage.setItem(getStorageKey('accessToken'), newAccessToken);
    sessionStorage.setItem(getStorageKey('refreshToken'), newRefreshToken);
    sessionStorage.setItem(getStorageKey('user'), JSON.stringify(newUser));
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    clearStoredData();

    // Redirect to SSO for logout
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      window.location.href = ssoOrigin;
    }
  };

  const updateTokens = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    sessionStorage.setItem(getStorageKey('accessToken'), newAccessToken);
    sessionStorage.setItem(getStorageKey('refreshToken'), newRefreshToken);
  };

  const isAuthenticated = !!user && !!accessToken;

  const contextValue: AuthContextType = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateTokens,
    }),
    [user, accessToken, refreshToken, isAuthenticated, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
