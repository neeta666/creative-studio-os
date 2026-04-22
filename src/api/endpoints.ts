// All API endpoint paths defined here once.
// Import from this file — never hardcode paths in service files.

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.creativestudio.app'

export const ENDPOINTS = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    logout: `${BASE_URL}/auth/logout`,
    me: `${BASE_URL}/auth/me`,
  },
} as const
