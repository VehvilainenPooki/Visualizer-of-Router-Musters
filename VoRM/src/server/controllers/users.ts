import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { UniqueConstraintError } from 'sequelize'
import { User, type NewUserAttrs } from '../models/index.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { sendVerificationEmail } from '../services/email.js'
import { generateVerificationToken, verifyVerificationToken } from '../services/verification.js'
import { buildAuthPayload } from '../services/auth.js'

const router = Router()

const buildVerificationLink = (token: string): string => {
  const appUrl = process.env.APP_URL ?? 'http://localhost:5173'
  return `${appUrl}/verify/${token}`
}

router.post('/', async (req, res) => {
  const { username, email, password } = req.body as { username: string; email: string; password: string }
  if (!username || !email || !password) {
    res.status(400).json({ error: 'username, email and password required' })
    return
  }
  const passwordHash = await bcrypt.hash(password, 10)

  let user: User
  try {
    const newUser: NewUserAttrs = {
      username,
      email,
      passwordHash,
      lastLogin: new Date(),
      creationDate: new Date()
    }
    user = await User.create(newUser)
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      const field = err.errors[0]?.path
      if (field === 'username') {
        res.status(409).json({ error: 'username already taken' })
        return
      }
      if (field === 'email') {
        res.status(409).json({ error: 'email already taken' })
        return
      }
      res.status(409).json({ error: 'username or email already taken' })
      return
    }
    console.error('failed to create user:', err)
    res.status(500).json({ error: 'failed to create user' })
    return
  }

  res.status(201).json(buildAuthPayload(user))
})

router.get('/verify/:token', async (req, res) => {
  const { token } = req.params

  let userId: number
  try {
    userId = verifyVerificationToken(token)
  } catch {
    res.status(400).json({ error: 'invalid or expired token' })
    return
  }

  const user = await User.findByPk(userId)
  if (!user) {
    res.status(400).json({ error: 'invalid or expired token' })
    return
  }

  if (!user.isVerified) {
    user.isVerified = true
    await user.save()
  }
  res.status(200).json({ verified: true })
})

router.get('/me', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user!.id)
  if (!user) {
    res.status(404).json({ error: 'user not found' })
    return
  }
  res.status(200).json({ id: user.id, username: user.username, isAdmin: user.isAdmin, isVerified: user.isVerified })
})

router.post('/verification-email', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user!.id)
  if (!user) {
    res.status(404).json({ error: 'user not found' })
    return
  }
  if (user.isVerified) {
    res.status(400).json({ error: 'email already verified' })
    return
  }

  try {
    const token = generateVerificationToken(user.id)
    await sendVerificationEmail(user.email, buildVerificationLink(token))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'failed to send verification email' })
    return
  }

  res.status(200).json({})
})

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email', 'lastLogin', 'creationDate', 'isAdmin', 'isVerified']
  })
  res.json(users)
})

export default router
