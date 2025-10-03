import { SSOMessage } from '@abc-interview-support-frontend/types';
import { generateState } from './security-utils';

export class SSOTokenManager {
  private static readonly HANDSHAKE_TIMEOUT = 3000; // 3 seconds (reduced from 5)
  private static readonly SSO_READY_MESSAGE = 'SSO_READY';
  private static readonly SSO_AUTH_MESSAGE = 'SSO_AUTH';
  private static activeWindows: Map<string, Window> = new Map();

  /**
   * Encode UTF-8 string to base64 (safe for Unicode characters)
   */
  private static encodeBase64(str: string): string {
    // Convert UTF-8 string to percent-encoding, then to base64
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  }

  /**
   * Decode base64 to UTF-8 string (safe for Unicode characters)
   */
  private static decodeBase64(str: string): string {
    // Decode base64 to percent-encoding, then to UTF-8
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  /**
   * SSO App: Send auth token to target app via postMessage with fallback to URL redirect
   * @param targetOrigin - Target app origin
   * @param targetUrl - Target app URL
   * @param ssoAuth - SSO auth token
   * @param useNewWindow - Whether to open in new window (default: true)
   */
  static async sendAuthToken(
    targetOrigin: string,
    targetUrl: string,
    ssoAuth: string,
    useNewWindow: boolean = true
  ): Promise<void> {
    // Generate CSRF state
    const state = generateState();
    sessionStorage.setItem(`sso_state_${state}`, Date.now().toString());

    if (useNewWindow) {
      // When opening in new tab with noopener, postMessage won't work
      // Use direct URL redirect with token parameter
      console.log('Opening in new tab with URL token');
      this.redirectWithToken(targetUrl, ssoAuth, state, true);
    } else {
      // Direct redirect in same window
      this.redirectWithToken(targetUrl, ssoAuth, state, false);
    }
  }

  /**
   * Try to communicate via postMessage
   */
  private static async tryPostMessageHandshake(
    targetOrigin: string,
    targetUrl: string,
    ssoAuth: string,
    state: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let targetWindow: Window | null = null;
      let isHandshakeComplete = false;

      const timeout = setTimeout(() => {
        if (!isHandshakeComplete) {
          console.warn('PostMessage handshake timeout');
          window.removeEventListener('message', messageHandler);
          resolve(false);
        }
      }, this.HANDSHAKE_TIMEOUT);

      const messageHandler = (event: MessageEvent) => {
        // Validate origin
        if (event.origin !== targetOrigin) {
          console.warn('Invalid origin:', event.origin);
          return;
        }

        const message = event.data as SSOMessage;

        if (message.type === this.SSO_READY_MESSAGE) {
          console.log('Received SSO_READY from target app');
          isHandshakeComplete = true;

          // Target is ready, send the auth token
          const authMessage: SSOMessage = {
            type: this.SSO_AUTH_MESSAGE,
            payload: {
              sso_auth: ssoAuth,
              state: state,
            },
            origin: window.location.origin,
          };

          if (event.source && targetWindow) {
            console.log('Sending SSO_AUTH via postMessage');
            (event.source as Window).postMessage(authMessage, targetOrigin);
          }

          clearTimeout(timeout);
          window.removeEventListener('message', messageHandler);

          // Store reference to window for potential cleanup
          this.activeWindows.set(targetOrigin, targetWindow as Window);

          resolve(true);
        }
      };

      window.addEventListener('message', messageHandler);

      // Open in new tab instead of popup window
      targetWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer');

      if (!targetWindow) {
        console.error('Failed to open window (popup blocker?)');
        clearTimeout(timeout);
        window.removeEventListener('message', messageHandler);
        resolve(false);
      }
    });
  }

  /**
   * Fallback: Redirect to target with tokens from sessionStorage
   */
  private static redirectWithToken(
    targetUrl: string,
    ssoAuth: string,
    state: string,
    newWindow: boolean = true
  ): void {
    const url = new URL(targetUrl);

    // Get tokens and user data from sessionStorage
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    const userData = sessionStorage.getItem('user');

    if (accessToken) {
      url.searchParams.set('sso_token', accessToken);
    }
    if (refreshToken) {
      url.searchParams.set('sso_refresh', refreshToken);
    }
    if (userData) {
      // Encode user data to base64 for URL safety (supports Unicode/UTF-8)
      url.searchParams.set('sso_user', this.encodeBase64(userData));
    }

    if (newWindow) {
      window.open(url.toString(), '_blank');
    } else {
      window.location.href = url.toString();
    }
  }

  /**
   * Validate state parameter (CSRF protection)
   */
  static validateState(state: string): boolean {
    const stateKey = `sso_state_${state}`;
    const timestamp = sessionStorage.getItem(stateKey);

    if (!timestamp) {
      console.error('Invalid state: not found');
      return false;
    }

    // State should be used within 5 minutes
    const now = Date.now();
    const stateTime = parseInt(timestamp, 10);
    const fiveMinutes = 5 * 60 * 1000;

    if (now - stateTime > fiveMinutes) {
      console.error('Invalid state: expired');
      sessionStorage.removeItem(stateKey);
      return false;
    }

    // Clean up used state
    sessionStorage.removeItem(stateKey);
    return true;
  }

  /**
   * Clean URL parameters after token is processed
   */
  static cleanUrlParams(paramName: string = 'sso_auth'): void {
    const url = new URL(window.location.href);
    if (url.searchParams.has(paramName)) {
      url.searchParams.delete(paramName);
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  /**
   * Get token from URL parameters
   */
  static getTokenFromUrl(paramName: string = 'sso_auth'): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get(paramName);
  }
}
