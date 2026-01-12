const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${baseUrl}${endpoint}`;

  const accessToken = localStorage.getItem('access_token'); // Retrieve the token from localStorage (or another storage mechanism)
  const headers = { ...options.headers } as Record<string, string>;

  if (accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  const response = await fetch(url, config);
  console.log('API Request:', {
    url,
    method: config.method,
    headers: config.headers,
    body: config.body,
  });

  if (!response.ok) {
    const errorText = await response.text(); // Get the error message from the response
    console.error('API Error Response:', errorText);
    // redirect to login if 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('access_token'); // Remove the token
      localStorage.removeItem('musinova_user'); // Remove user data
      window.location.href = '/login'; // Redirect to login page
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response;
}

export type CheckEmailResult = {
  exists: boolean;
  providers?: string[];
};

/**
 * POST /auth/check-email helper
 * Uses the same baseUrl as apiFetch but does not attach the stored access token.
 */
export async function checkEmail(email: string): Promise<CheckEmailResult> {
  const url = `${baseUrl}auth/check-email`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`checkEmail failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data as CheckEmailResult;
}