import cors from 'cors'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

type StoredUser = {
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

type AuthTokenPayload = {
  name: string
  email: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const USERS_PATH = path.join(DATA_DIR, 'users.json')
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-only-change-me'

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1),
})

const ensureStorage = async () => {
  await mkdir(DATA_DIR, { recursive: true })
  try {
    await readFile(USERS_PATH, 'utf8')
  } catch {
    await writeFile(USERS_PATH, '[]', 'utf8')
  }
}

const readUsers = async (): Promise<StoredUser[]> => {
  const raw = await readFile(USERS_PATH, 'utf8')
  const parsed = JSON.parse(raw) as StoredUser[]
  return Array.isArray(parsed) ? parsed : []
}

const writeUsers = async (users: StoredUser[]) => {
  await writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf8')
}

const signAuthToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })

const extractToken = (authHeader: string | undefined) => {
  if (!authHeader) return null
  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  return token
}

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }))
app.use(express.json())

app.get('/api/v1/auth/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/v1/auth/me', (req, res) => {
  const token = extractToken(req.header('authorization'))
  if (!token) {
    return res.status(401).json({ message: 'Missing auth token.' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload
    return res.json({ user: { name: payload.name, email: payload.email } })
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
})

app.post('/api/v1/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid registration payload.' })
  }

  const users = await readUsers()
  const alreadyExists = users.some((user) => user.email === parsed.data.email)
  if (alreadyExists) {
    return res.status(409).json({ message: 'User already exists. Please log in.' })
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  const newUser: StoredUser = {
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  await writeUsers(users)
  return res.status(201).json({
    message: 'Registration successful. Please log in.',
    user: { name: newUser.name, email: newUser.email },
  })
})

app.post('/api/v1/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid login payload.' })
  }

  const users = await readUsers()
  const user = users.find((item) => item.email === parsed.data.email)
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = signAuthToken({ name: user.name, email: user.email })

  return res.json({
    message: `Login successful. Welcome, ${user.name}.`,
    user: { name: user.name, email: user.email },
    token,
  })
})

const port = Number(process.env.PORT ?? 4000)

ensureStorage()
  .then(() => {
    app.listen(port, () => {
      console.log(`Auth API running on http://localhost:${port}`)
    })
  })
  .catch((error: unknown) => {
    console.error('Failed to start auth API', error)
    process.exit(1)
  })
