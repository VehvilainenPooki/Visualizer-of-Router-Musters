import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  username: string
  id: number
  isAdmin: boolean
}

declare module 'express' {
  interface Request {
    user?: TokenPayload
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'development-secret'

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
