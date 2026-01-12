import { apiFetch } from './api';

type LoginAnonymouslyFn = () => Promise<void>;

type EnsureGuestResult =
  | { success: true; user: any | null }
  | { success: false; reason?: any };

/**
 * Ensure a guest user exists and is logged in using Firebase Anonymous Auth.
 * On failure, if pendingKey and pendingData are provided this will persist 
 * the pending data.
 */
export async function ensureGuestUser(
  loginAnonymously: LoginAnonymouslyFn,
  email: string,
  pendingKey?: string,
  pendingData?: any
): Promise<EnsureGuestResult> {
  try {
    // If an email was provided, prefer creating a backend guest user using the API.
    // This creates a 'guest' user record and returns an access token so the client
    // can act as that user without relying on Firebase anonymous sign-in.
    if (email && email.trim()) {
      // Try to create the guest user via the backend and fail fast if the API reports an error.
      const res = await apiFetch('auth/firebase/create-anon-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        try {
          if (data.user) localStorage.setItem('musinova_user', JSON.stringify(data.user));
          if (data.access_token) localStorage.setItem('access_token', data.access_token);
        } catch (e) {
          // ignore storage errors
        }

        const stored = localStorage.getItem('musinova_user');
        const user = stored ? JSON.parse(stored) : null;
        return { success: true, user };
      }

      // Read response body for better error messages
      let bodyText = '';
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = `status ${res.status}`;
      }

      if (res.status === 400) {
        // Account exists or bad request - throw so callers can handle specifically
        throw new Error(`Account exists: ${bodyText}`);
      }

      // For other statuses, throw a generic error to avoid silently falling back
      throw new Error(`Failed to create guest user: ${res.status} ${bodyText}`);
    }

    // If no email was provided, fall back to anonymous firebase login for a generic guest.
    await loginAnonymously();

    const stored = localStorage.getItem('musinova_user');
    const user = stored ? JSON.parse(stored) : null;

    return { success: true, user };
  } catch (err) {
    console.error('Failed to create/login guest user', err);
    if (pendingKey && pendingData) {
      try {
        localStorage.setItem(pendingKey, JSON.stringify(pendingData));
      } catch (e) {
        // ignore storage errors
      }
    }
    // If something went wrong, try to redirect to credits purchase (existing behavior)
    try {
      // keep same UX as existing compiled bundle: redirect to payment-credits
      // (caller code sometimes expects a redirect on fatal failure)
      // Note: avoid throwing here to keep return shape predictable.
      (window as any).location.href = '/payment-credits';
    } catch {}
    return { success: false, reason: err };
  }
}

export default ensureGuestUser;
