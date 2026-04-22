import type { LoginCredentials, AuthResponse } from '@/types/auth'

// Mock delay helper — simulates real network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock user returned for any valid login
const MOCK_USER = {
  id: 'user_001',
  name: 'Jay',
  email: 'jay@uden.tech',
}

// ── login ───────────────────────────────────────────────────────────────────
// Swap the function body for a real apiRequest() call when the backend is ready.
// The store and callers don't need to change — only this function.

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  await delay(600)

  // Basic mock validation — any non-empty email + password succeeds
  if (!credentials.email || !credentials.password) {
    throw { status: 400, message: 'Email and password are required' }
  }

  return {
    user: { ...MOCK_USER, email: credentials.email },
    token: 'mock_token_xyz_123',
  }
}

// ── register ────────────────────────────────────────────────────────────────

export async function register(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  await delay(600)

  if (!credentials.email || !credentials.password) {
    throw { status: 400, message: 'Email and password are required' }
  }

  return {
    user: { ...MOCK_USER, email: credentials.email },
    token: 'mock_token_xyz_456',
  }
}

/*
  When switching to a real backend, replace each function body like this:

  import { apiRequest } from './client'
  import { ENDPOINTS }  from './endpoints'

  export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(ENDPOINTS.auth.login, {
      method: 'POST',
      body:   JSON.stringify(credentials),
    })
  }
*/
