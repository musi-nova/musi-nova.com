import { apiFetch } from './api';

type LoginFn = (email: string, password: string) => Promise<void>;
type RegisterFn = (email: string, password: string, name: string) => Promise<void>;

type EnsureGuestResult =
  | { success: true; user: any | null }
  | { success: false; reason?: any };

/**
 * Ensure a guest user exists and is logged in. On failure, if pendingKey and pendingData
 * are provided this will persist the pending data and redirect to /payment-credits to
 * allow the user to top up or register.
 */
export async function ensureGuestUser(
  login: LoginFn, 
  register: RegisterFn,
  pendingKey?: string, 
  pendingData?: any
): Promise<EnsureGuestResult> {
  try {
    const userName = `guest_${Date.now()}`;
    const guestPassword = (import.meta as any).env?.VITE_MN_GUEST_DEFAULT_PASSWORD || 'GuestPassword123!';
    const email = `${userName}@musi-nova.com`;

    // Register the guest user
    await register(email, guestPassword, userName);

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
      window.location.href = '/payment-credits';
    }
    return { success: false, reason: err };
  }
}

export default ensureGuestUser;
