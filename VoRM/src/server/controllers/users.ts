import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { sendVerificationEmail } from '../services/email.js'
import { generateVerificationToken, verifyVerificationToken } from '../services/emailVerification.js'

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
  try {
    const user = await User.create({
      username,
      email,
      passwordHash,
      lastLogin: new Date(),
      creationDate: new Date(),
      isVerified: false
    })

    const token = generateVerificationToken(user.id)
    await sendVerificationEmail(user.email, buildVerificationLink(token))

    res.status(201).json({ id: user.id, username: user.username })
  } catch {
    res.status(400).json({ error: 'username/email already taken or invalid data' })
  }
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

  user.isVerified = true
  await user.save()
  res.status(200).json({ verified: true })
})

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email', 'lastLogin', 'creationDate', 'isAdmin', 'isVerified']
  })
  res.json(users)
})

export default router
