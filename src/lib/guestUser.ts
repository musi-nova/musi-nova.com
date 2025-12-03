import { apiFetch } from './api';

type LoginFn = (email: string, password: string) => Promise<void>;

type EnsureGuestResult =
  | { success: true; user: any | null }
  | { success: false; reason?: any };

/**
 * Ensure a guest user exists and is logged in. On failure, if pendingKey and pendingData
 * are provided this will persist the pending data and redirect to /payment-credits to
 * allow the user to top up or register.
 */
export async function ensureGuestUser(login: LoginFn, pendingKey?: string, pendingData?: any): Promise<EnsureGuestResult> {
  try {
    const userName = `guest_${Date.now()}`;
    const guestPassword = (import.meta as any).env?.VITE_MN_GUEST_DEFAULT_PASSWORD;
    const genericUser = {
      name: userName,
      email: `${userName}@musi-nova.com`,
      password: guestPassword,
      created_at: new Date().toISOString(),
      super_user: false,
      plan_1_user: true,
      plan_2_user: false,
      plan_3_user: false,
    };

    const createUserRes = await apiFetch('user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(genericUser),
    });

    if (!createUserRes.ok) {
      throw new Error(`Failed to create guest user: ${createUserRes.statusText}`);
    }

    // Login the newly created user using the provided login helper
    await login(genericUser.email, genericUser.password);

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
