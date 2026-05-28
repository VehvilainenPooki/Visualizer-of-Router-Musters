import jwt from 'jsonwebtoken'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret'

router.post('/', async (req, res) => {
  const { username, password } = req.body as { username: string; password: string }

  const user = await User.findOne({ where: { username } })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!user || !passwordCorrect) {
    res.status(401).json({ error: 'invalid username or password' })
    return
  }

  const token = jwt.sign(
    { username: user.username, id: user.id, isAdmin: user.isAdmin },
    JWT_SECRET
  )

  res.status(200).json({ token, username: user.username })
})

export default router
