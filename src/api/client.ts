// Base fetch wrapper.
// All API calls go through this — not fetch() directly.
// Attach auth token, handle errors, and parse JSON in one place.

interface RequestOptions extends RequestInit {
  token?: string
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  // Attach bearer token if provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    // Throw a plain object so callers can check status and message
    const error = await response.json().catch(() => ({}))
    throw {
      status: response.status,
      message: error.message ?? 'Something went wrong',
    }
  }

  return response.json() as Promise<T>
}
