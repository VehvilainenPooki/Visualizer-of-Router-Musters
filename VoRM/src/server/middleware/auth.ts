import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../services/auth.js'

interface TokenPayload {
  username: string
  id: number
  isAdmin: boolean
  isVerified: boolean
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.get('Authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    res.status(401).json({ error: 'token missing' })
    return
  }

  const token = authorization.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'token invalid' })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'admin access required' })
    return
  }
  next()
}

export const requireVerified = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user?.isVerified) {
    res.status(403).json({ error: 'email not verified' })
    return
  }
  next()
}
