// filepath: /Users/jamestwose/Coding/musi-nova.com/src/lib/api.ts
const baseUrl = import.meta.env.VITE_MN_API_BASE_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${baseUrl}${endpoint}`;

  const accessToken = localStorage.getItem('access_token'); // Retrieve the token from localStorage (or another storage mechanism)
  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text(); // Get the error message from the response
    console.error('API Error Response:', errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response;
}