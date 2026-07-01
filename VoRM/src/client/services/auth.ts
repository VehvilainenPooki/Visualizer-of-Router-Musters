import type { Result } from '../../common/types/result'

const baseUrl = '/api/users'

export interface AuthResponse {
  token: string
  username: string
}

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

export const register = async (username: string, password: string): Promise<Result<{ id: number; username: string }>> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
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
