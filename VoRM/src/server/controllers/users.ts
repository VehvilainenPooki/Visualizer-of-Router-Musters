import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.post('/', async (req, res) => {
  const { username, password } = req.body as { username: string; password: string }
  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' })
    return
  }
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const user = await User.create({
      username,
      passwordHash,
      lastLogin: new Date(),
      creationDate: new Date()
    })
    res.status(201).json({ id: user.id, username: user.username })
  } catch {
    res.status(400).json({ error: 'username already taken or invalid data' })
  }
})

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username', 'lastLogin', 'creationDate', 'isAdmin']
  })
  res.json(users)
})

export default router
