import type { Result } from '../../common/types/result'

const baseUrl = '/api/users'

export interface AuthResponse {
  token: string
  username: string
  isVerified: boolean
}

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`
})

export const login = async (username: string, password: string): Promise<Result<AuthResponse>> => {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Login failed', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const register = async (username: string, email: string, password: string): Promise<Result<AuthResponse>> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Registration failed', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const verifyEmail = async (token: string): Promise<Result<{ verified: boolean }>> => {
  try {
    const response = await fetch(`${baseUrl}/verify/${token}`)
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Verification failed', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export const sendVerificationEmail = async (token: string): Promise<Result<void>> => {
  try {
    const response = await fetch(`${baseUrl}/verification-email`, {
      method: 'POST',
      headers: authHeaders(token)
    })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Failed to send verification email', status: response.status }
    }
    return { ok: true, data: undefined, status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}

export interface MeResponse {
  id: number
  username: string
  isAdmin: boolean
  isVerified: boolean
}

export const getMe = async (token: string): Promise<Result<MeResponse>> => {
  try {
    const response = await fetch(`${baseUrl}/me`, { headers: authHeaders(token) })
    if (!response.ok) {
      const data = await response.json()
      return { ok: false, error: data.error ?? 'Failed to fetch user', status: response.status }
    }
    return { ok: true, data: await response.json(), status: response.status }
  } catch {
    return { ok: false, error: 'Network error', status: 0 }
  }
}
