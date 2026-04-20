import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

type AuthMode = 'login' | 'register'

type LoginForm = {
  email: string
  password: string
}

type RegisterForm = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type MessageState = {
  text: string
  kind: 'success' | 'error'
}

type AuthUser = {
  name: string
  email: string
}

const INITIAL_LOGIN: LoginForm = { email: '', password: '' }
const INITIAL_REGISTER: RegisterForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'
const AUTH_TOKEN_KEY = 'p3-auth-token'

function App() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [loginForm, setLoginForm] = useState<LoginForm>(INITIAL_LOGIN)
  const [registerForm, setRegisterForm] = useState<RegisterForm>(INITIAL_REGISTER)
  const [message, setMessage] = useState<MessageState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)

  const formTitle = useMemo(
    () => (mode === 'login' ? 'Welcome back' : 'Create your account'),
    [mode],
  )

  useEffect(() => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      setIsCheckingSession(false)
      return
    }

    const restoreSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = (await response.json()) as { user?: AuthUser }
        if (!response.ok || !data.user) {
          window.localStorage.removeItem(AUTH_TOKEN_KEY)
          setIsCheckingSession(false)
          return
        }
        setAuthUser(data.user)
      } catch {
        window.localStorage.removeItem(AUTH_TOKEN_KEY)
      } finally {
        setIsCheckingSession(false)
      }
    }

    void restoreSession()
  }, [])

  const onLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!loginForm.email || !loginForm.password) {
      setMessage({ text: 'Please enter both email and password.', kind: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password,
        }),
      })
      const data = (await response.json()) as {
        message?: string
        token?: string
        user?: AuthUser
      }

      if (!response.ok) {
        setMessage({ text: data.message ?? 'Login failed.', kind: 'error' })
        return
      }

      if (data.token) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token)
      }
      if (data.user) {
        setAuthUser(data.user)
      }
      setMessage({ text: data.message ?? 'Login successful.', kind: 'success' })
      setLoginForm(INITIAL_LOGIN)
    } catch {
      setMessage({ text: 'Cannot reach auth server.', kind: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setMessage({ text: 'Please fill all required fields.', kind: 'error' })
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({ text: 'Password and confirm password must match.', kind: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerForm.name.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password,
        }),
      })
      const data = (await response.json()) as {
        message?: string
        token?: string
        user?: AuthUser
      }

      if (!response.ok) {
        setMessage({ text: data.message ?? 'Registration failed.', kind: 'error' })
        return
      }

      // Registration should not auto-login; user must sign in explicitly.
      window.localStorage.removeItem(AUTH_TOKEN_KEY)
      setAuthUser(null)
      setMessage({
        text: data.message ?? 'Registration successful. Please log in with new credentials.',
        kind: 'success',
      })
      setRegisterForm(INITIAL_REGISTER)
      setMode('login')
    } catch {
      setMessage({ text: 'Cannot reach auth server.', kind: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onLogout = () => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    setAuthUser(null)
    setMode('login')
    setMessage({ text: 'You have been logged out.', kind: 'success' })
  }

  if (isCheckingSession) {
    return (
      <main className="grid min-h-screen place-items-center px-4 py-8">
        <p className="text-sm text-slate-300">Checking session...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <span className="inline-flex rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white">
            P3 Creative Studio OS
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Content operations, now browser-first.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
            This screen starts authentication for the React web app architecture from
            your documentation: responsive UI, typed state, and server-side security
            boundaries.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <p>- Mobile-first layout and single codebase</p>
            <p>- Persona-ready design token support</p>
            <p>- Designed for backend API integration next</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          {authUser ? (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
              <p className="text-sm text-emerald-900">
                Signed in as <span className="font-semibold">{authUser.name}</span> ({authUser.email})
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
              >
                Logout
              </button>
            </div>
          ) : null}
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setMessage(null)
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                // Switching to register means creating a new account flow.
                window.localStorage.removeItem(AUTH_TOKEN_KEY)
                setAuthUser(null)
                setMessage(null)
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="mt-6 text-xl font-semibold text-slate-900">{formTitle}</h2>

          {mode === 'login' ? (
            <form className="mt-5 space-y-4" onSubmit={onLoginSubmit}>
              <label className="block text-sm font-medium text-slate-700" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, email: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--persona-accent)] focus:ring-2 focus:ring-[var(--persona-accent)]/30"
                placeholder="you@company.com"
                required
              />

              <label className="block text-sm font-medium text-slate-700" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--persona-accent)] focus:ring-2 focus:ring-[var(--persona-accent)]/30"
                placeholder="Enter password"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-lg bg-[var(--persona-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            <form className="mt-5 space-y-4" onSubmit={onRegisterSubmit}>
              <label className="block text-sm font-medium text-slate-700" htmlFor="register-name">
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                value={registerForm.name}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--persona-accent)] focus:ring-2 focus:ring-[var(--persona-accent)]/30"
                placeholder="Jane Doe"
                required
              />

              <label className="block text-sm font-medium text-slate-700" htmlFor="register-email">
                Work email
              </label>
              <input
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, email: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--persona-accent)] focus:ring-2 focus:ring-[var(--persona-accent)]/30"
                placeholder="you@company.com"
                required
              />

              <label className="block text-sm font-medium text-slate-700" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, password: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--persona-accent)] focus:ring-2 focus:ring-[var(--persona-accent)]/30"
                placeholder="Create password"
                required
              />

              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="register-confirm-password"
              >
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[var(--persona-accent)] focus:ring-2 focus:ring-[var(--persona-accent)]/30"
                placeholder="Confirm password"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-lg bg-[var(--persona-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}

          {message ? (
            <p
              className={`mt-4 rounded-lg px-3 py-2 text-sm ${
                message.kind === 'success'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              {message.text}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}

export default App
