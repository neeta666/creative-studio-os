import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginService } from '@/api/authService'
import type { User, LoginCredentials } from '@/types/auth'

interface AuthState {
  user:            User | null
  token:           string | null
  isAuthenticated: boolean

  login:  (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ── Initial state ──────────────────────────────────────────────────
      user:            null,
      token:           null,
      isAuthenticated: false,

      // ── login ──────────────────────────────────────────────────────────
      // Calls authService, stores result. Throws on failure so the UI
      // can catch and display the error message without try/catch here.
      login: async (credentials: LoginCredentials) => {
        const { user, token } = await loginService(credentials)
        set({ user, token, isAuthenticated: true })
      },

      // ── logout ─────────────────────────────────────────────────────────
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'auth' }   // localStorage key — same pattern as 'active-persona'
  )
)

export default useAuthStore
