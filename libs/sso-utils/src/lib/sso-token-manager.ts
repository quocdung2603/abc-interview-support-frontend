import { SSOMessage } from '@abc-interview-support-frontend/types';

export class SSOTokenManager {
  private static readonly HANDSHAKE_TIMEOUT = 5000; // 5 seconds
  private static readonly SSO_READY_MESSAGE = 'SSO_READY';
  private static readonly SSO_AUTH_MESSAGE = 'SSO_AUTH';

  /**
   * SSO App: Send auth token to target app via postMessage with fallback to URL redirect
   */
  static async sendAuthToken(
    targetOrigin: string,
    targetUrl: string,
    ssoAuth: string
  ): Promise<void> {
    // Try postMessage handshake first
    const success = await this.tryPostMessageHandshake(targetOrigin, ssoAuth);

    if (!success) {
      // Fallback to URL parameter redirect
      this.redirectWithToken(targetUrl, ssoAuth);
    }
  }

  /**
   * Try to communicate via postMessage
   */
  private static async tryPostMessageHandshake(
    targetOrigin: string,
    ssoAuth: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        resolve(false);
      }, this.HANDSHAKE_TIMEOUT);

      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== targetOrigin) return;

        const message = event.data as SSOMessage;
        if (message.type === this.SSO_READY_MESSAGE) {
          // Target is ready, send the auth token
          const authMessage: SSOMessage = {
            type: this.SSO_AUTH_MESSAGE,
            payload: { sso_auth: ssoAuth },
            origin: window.location.origin,
          };

          if (event.source) {
            (event.source as Window).postMessage(authMessage, targetOrigin);
          }

          clearTimeout(timeout);
          window.removeEventListener('message', messageHandler);
          resolve(true);
        }
      };

      window.addEventListener('message', messageHandler);

      // Open the target window
      const targetWindow = window.open(targetOrigin, '_blank');
      if (!targetWindow) {
        clearTimeout(timeout);
        window.removeEventListener('message', messageHandler);
        resolve(false);
      }
    });
  }

  /**
   * Fallback: Redirect to target with sso_auth parameter
   */
  private static redirectWithToken(targetUrl: string, ssoAuth: string): void {
    const url = new URL(targetUrl);
    url.searchParams.set('sso_auth', ssoAuth);
    window.location.href = url.toString();
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
