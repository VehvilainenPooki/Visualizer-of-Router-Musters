import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'
import { buildAuthPayload } from '../services/auth.js'

const router = Router()

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

  res.status(200).json(buildAuthPayload(user))
})

export default router
