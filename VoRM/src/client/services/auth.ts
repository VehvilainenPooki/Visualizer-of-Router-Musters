const baseUrl = '/api/users'

export interface AuthResponse {
  token: string
  username: string
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error ?? 'Login failed')
  }
  return response.json()
}

export const register = async (username: string, password: string): Promise<{ id: number; username: string }> => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error ?? 'Registration failed')
  }
  return response.json()
}
