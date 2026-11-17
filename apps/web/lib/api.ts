// apps/web/lib/api.ts
export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // 👇 CRITICAL: Ensure cookies (JWT/Session) are sent to Python
    credentials: 'include', 
  });

  if (!res.ok) {
    // Handle 403 Forbidden specifically
    if (res.status === 403) {
      throw new Error('Forbidden: You do not have permission to do this.');
    }
    if (res.status === 401) {
      throw new Error('Unauthorized: Please log in again.');
    }
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}