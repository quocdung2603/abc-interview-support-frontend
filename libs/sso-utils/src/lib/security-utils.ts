/**
 * Security utilities for SSO system
 */

/**
 * Generate a random CSRF state token
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

/**
 * Simple encryption for sensitive data in storage
 * Note: This is NOT cryptographically secure, just obfuscation
 * For production, consider using Web Crypto API or server-side encryption
 */
export function encryptData(data: string, key: string): string {
  const textToChars = (text: string) =>
    text.split('').map((c) => c.charCodeAt(0));
  const byteHex = (n: number) => ('0' + Number(n).toString(16)).slice(-2);
  const applySaltToChar = (code: number) =>
    textToChars(key).reduce((a, b) => a ^ b, code);

  return data
    .split('')
    .map(textToChars)
    .flat()
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
}

/**
 * Decrypt data from storage
 */
export function decryptData(encoded: string, key: string): string {
  const textToChars = (text: string) =>
    text.split('').map((c) => c.charCodeAt(0));
  const applySaltToChar = (code: number) =>
    textToChars(key).reduce((a, b) => a ^ b, code);

  return (encoded.match(/.{1,2}/g) || [])
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join('');
}

/**
 * Secure storage with encryption
 */
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'abc-interview-sso-key-2025';

  /**
   * Store data securely in sessionStorage
   */
  static setItem(key: string, value: any): void {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = encryptData(jsonString, this.ENCRYPTION_KEY);
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  }

  /**
   * Retrieve and decrypt data from sessionStorage
   */
  static getItem<T>(key: string): T | null {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = decryptData(encrypted, this.ENCRYPTION_KEY);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  static removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Clear all data
   */
  static clear(): void {
    sessionStorage.clear();
  }
}

/**
 * Validate URL to prevent open redirect vulnerability
 */
export function isValidRedirectUrl(
  url: string,
  allowedOrigins: string[]
): boolean {
  try {
    const urlObj = new URL(url);
    return allowedOrigins.some((origin) => urlObj.origin === origin);
  } catch {
    return false;
  }
}

/**
 * Generate device fingerprint for additional security
 */
export function getDeviceFingerprint(): string {
  const navigator = window.navigator;
  const screen = window.screen;

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
}
