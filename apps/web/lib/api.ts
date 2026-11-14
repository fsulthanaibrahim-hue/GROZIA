// apps/web/lib/api.ts
export async function apiFetch(path: string, options: RequestInit = {}) {
  // Use a relative path so Nginx routes it to FastAPI
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}