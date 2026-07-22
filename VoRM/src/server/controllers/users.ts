import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { UniqueConstraintError } from 'sequelize'
import { User, type NewUserAttrs } from '../models/index.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { sendVerificationEmail } from '../services/email.js'
import { generateVerificationToken, verifyVerificationToken } from '../services/verification.js'

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

  try {
    const token = generateVerificationToken(user.id)
    await sendVerificationEmail(user.email, buildVerificationLink(token))
  } catch (err) {
    console.error(err)
    await user.destroy()
    res.status(500).json({ error: 'failed to send verification email' })
    return
  }

  res.status(201).json({ id: user.id, username: user.username })
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

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email', 'lastLogin', 'creationDate', 'isAdmin', 'isVerified']
  })
  res.json(users)
})

export default router
