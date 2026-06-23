import { createContext, useContext, useState } from 'react'
import type { FC, ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  username: string | null
  login: (token: string, username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('auth_username'))

  const login = (token: string, username: string) => {
    setToken(token)
    setUsername(username)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_username', username)
  }

  const logout = () => {
    setToken(null)
    setUsername(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_username')
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
