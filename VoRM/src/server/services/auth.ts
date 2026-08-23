import jwt from 'jsonwebtoken'
import type { User } from '../models/index.js'
import type {AuthPayload} from '../../common/types/auth.js'

export const JWT_SECRET = process.env.JWT_SECRET ?? 'development-secret'

export const signAuthToken = (user: User): string =>
  jwt.sign({ username: user.username, id: user.id, isAdmin: user.isAdmin, isVerified: user.isVerified }, JWT_SECRET)

export const buildAuthPayload = (user: User): AuthPayload => ({
  token: signAuthToken(user),
  username: user.username,
  isVerified: user.isVerified,
  userId: user.id
})
