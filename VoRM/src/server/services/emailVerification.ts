import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'development-secret'
const VERIFICATION_PURPOSE = 'verify-email'

interface VerificationTokenPayload {
  purpose: typeof VERIFICATION_PURPOSE
  id: number
}

export const generateVerificationToken = (userId: number): string =>
  jwt.sign({ purpose: VERIFICATION_PURPOSE, id: userId }, JWT_SECRET, { expiresIn: '1d' })

export const verifyVerificationToken = (token: string): number => {
  const decoded = jwt.verify(token, JWT_SECRET) as VerificationTokenPayload
  if (decoded.purpose !== VERIFICATION_PURPOSE) {
    throw new Error('invalid token purpose')
  }
  return decoded.id
}
