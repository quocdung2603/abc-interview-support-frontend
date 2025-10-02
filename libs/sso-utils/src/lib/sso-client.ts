import {
  SSOMessage,
  VerifySessionRequest,
  VerifySessionResponse,
} from '@abc-interview-support-frontend/types';
import { SSOTokenManager } from './sso-token-manager';

export class SSOClient {
  private static readonly SSO_READY_MESSAGE = 'SSO_READY';
  private static readonly SSO_AUTH_MESSAGE = 'SSO_AUTH';

  /**
   * Target App: Initialize SSO client and listen for auth messages
   */
  static initializeClient(
    ssoOrigin: string,
    apiBaseUrl: string,
    onAuthReceived: (
      accessToken: string,
      refreshToken: string,
      user: any
    ) => void,
    onError: (error: string) => void
  ): () => void {
    // First check URL for fallback token
    this.checkUrlForToken(apiBaseUrl, onAuthReceived, onError);

    // Then listen for postMessage
    const messageHandler = this.createMessageHandler(
      ssoOrigin,
      apiBaseUrl,
      onAuthReceived,
      onError
    );

    window.addEventListener('message', messageHandler);

    // Send ready signal to parent if we're in a popup/iframe context
    this.sendReadySignal(ssoOrigin);

    // Fallback: Clean URL parameters after a short delay to ensure they're removed
    // even if authentication fails or takes too long
    setTimeout(() => {
      this.cleanUrlParams();
    }, 2000);

    // Return cleanup function
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }

  /**
   * Check URL parameters for sso_auth token (fallback method)
   */
  private static async checkUrlForToken(
    apiBaseUrl: string,
    onAuthReceived: (
      accessToken: string,
      refreshToken: string,
      user: any
    ) => void,
    onError: (error: string) => void
  ): Promise<void> {
    const ssoAuth = this.getTokenFromUrl('sso_auth');
    const state = this.getTokenFromUrl('state');

    if (ssoAuth) {
      // Validate state parameter for CSRF protection
      if (state && !SSOTokenManager.validateState(state)) {
        onError('Invalid or expired state parameter. Possible CSRF attack.');
        this.cleanUrlParams();
        return;
      }

      try {
        const response = await this.verifySession(apiBaseUrl, ssoAuth);
        onAuthReceived(
          response.accessToken,
          response.refreshToken,
          response.user
        );
        this.cleanUrlParams();
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Verification failed');
        this.cleanUrlParams();
      }
    }
  }

  /**
   * Create message handler for postMessage communication
   */
  private static createMessageHandler(
    ssoOrigin: string,
    apiBaseUrl: string,
    onAuthReceived: (
      accessToken: string,
      refreshToken: string,
      user: any
    ) => void,
    onError: (error: string) => void
  ): (event: MessageEvent) => void {
    return (event: MessageEvent) => {
      if (event.origin !== ssoOrigin) return;

      const message = event.data as SSOMessage;
      if (message.type === this.SSO_AUTH_MESSAGE && message.payload?.sso_auth) {
        const { sso_auth, state } = message.payload;

        // Validate state parameter for CSRF protection
        if (state && !SSOTokenManager.validateState(state)) {
          onError('Invalid or expired state parameter. Possible CSRF attack.');
          return;
        }

        this.verifySession(apiBaseUrl, sso_auth)
          .then((response) => {
            onAuthReceived(
              response.accessToken,
              response.refreshToken,
              response.user
            );
            // Clean URL parameters after successful authentication
            this.cleanUrlParams();
          })
          .catch((error) => {
            onError(
              error instanceof Error ? error.message : 'Verification failed'
            );
          });
      }
    };
  }

  /**
   * Send ready signal to SSO parent window
   */
  private static sendReadySignal(ssoOrigin: string): void {
    if (window.opener && window.opener !== window) {
      const readyMessage: SSOMessage = {
        type: this.SSO_READY_MESSAGE,
        origin: window.location.origin,
      };
      window.opener.postMessage(readyMessage, ssoOrigin);
    }
  }

  /**
   * Verify session with backend
   */
  private static async verifySession(
    apiBaseUrl: string,
    ssoAuth: string
  ): Promise<VerifySessionResponse> {
    const request: VerifySessionRequest = { sso_auth: ssoAuth };

    const response = await fetch(`${apiBaseUrl}/api/auth/verify-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get token from URL parameters
   */
  private static getTokenFromUrl(
    paramName: string = 'sso_auth'
  ): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get(paramName);
  }

  /**
   * Clean URL parameters after token is processed
   */
  private static cleanUrlParams(): void {
    const url = new URL(window.location.href);
    let hasChanges = false;

    // Remove both sso_auth and state parameters
    if (url.searchParams.has('sso_auth')) {
      url.searchParams.delete('sso_auth');
      hasChanges = true;
    }
    if (url.searchParams.has('state')) {
      url.searchParams.delete('state');
      hasChanges = true;
    }

    if (hasChanges) {
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  /**
   * Check if user should be redirected to SSO for login
   */
  static shouldRedirectToSSO(accessToken: string | null): boolean {
    return !accessToken;
  }

  /**
   * Redirect to SSO for login
   */
  static redirectToSSO(ssoOrigin: string, returnUrl?: string): void {
    const url = new URL(ssoOrigin);
    if (returnUrl) {
      url.searchParams.set('returnUrl', returnUrl);
    }
    window.location.href = url.toString();
  }
}
