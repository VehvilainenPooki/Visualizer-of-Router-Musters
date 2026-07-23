import { createContext, useContext, useState } from 'react'
import type { FC, ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  username: string | null
  isVerified: boolean | null
  login: (token: string, username: string, isVerified: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const readIsVerified = (): boolean | null => {
  const stored = localStorage.getItem('auth_is_verified')
  if (stored === null) return null
  return stored === 'true'
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('auth_username'))
  const [isVerified, setIsVerified] = useState<boolean | null>(readIsVerified)

  const login = (token: string, username: string, isVerified: boolean) => {
    setToken(token)
    setUsername(username)
    setIsVerified(isVerified)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_username', username)
    localStorage.setItem('auth_is_verified', String(isVerified))
  }

  const logout = () => {
    setToken(null)
    setUsername(null)
    setIsVerified(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_username')
    localStorage.removeItem('auth_is_verified')
  }

  return (
    <AuthContext.Provider value={{ token, username, isVerified, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
