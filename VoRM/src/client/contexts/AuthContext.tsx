import { createContext, useContext, useState } from 'react'
import type { FC, ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  username: string | null
  isVerified: boolean | null
  userId: number | null
  login: (token: string, username: string, isVerified: boolean, userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const readIsVerified = (): boolean | null => {
  const stored = localStorage.getItem('auth_is_verified')
  if (stored === null) return null
  return stored === 'true'
}

const readUserId = (): number | null => {
  const stored = localStorage.getItem('auth_user_id')
  if (stored === null) return null
  return Number(stored)
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('auth_username'))
  const [isVerified, setIsVerified] = useState<boolean | null>(readIsVerified)
  const [userId, setUserId] = useState<number | null>(readUserId)

  const login = (token: string, username: string, isVerified: boolean, userId: number) => {
    setToken(token)
    setUsername(username)
    setIsVerified(isVerified)
    setUserId(userId)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_username', username)
    localStorage.setItem('auth_is_verified', String(isVerified))
    localStorage.setItem('auth_user_id', String(userId))
  }

  const logout = () => {
    setToken(null)
    setUsername(null)
    setIsVerified(null)
    setUserId(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_username')
    localStorage.removeItem('auth_is_verified')
    localStorage.removeItem('auth_user_id')
  }

  return (
    <AuthContext.Provider value={{ token, username, isVerified, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
