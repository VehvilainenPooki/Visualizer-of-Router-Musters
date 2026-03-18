import jwt from 'jsonwebtoken'
import Router from 'express'

import { User } from '../models'

const router = Router()

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, "SECRET")

  response
    .status(200)
    .send({ token, username: user.username })
})

export default router
