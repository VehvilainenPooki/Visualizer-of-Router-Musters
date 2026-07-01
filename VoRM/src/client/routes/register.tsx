import { useState } from 'react'
import { createRoute, Link, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useAuth } from '../contexts/AuthContext'
import * as authService from '../services/auth'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: CreateAccountPage
})

function CreateAccountPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const registerResult = await authService.register(username, password)
    if (!registerResult.ok) {
      setError(registerResult.error)
      return
    }
    const loginResult = await authService.login(username, password)
    if (!loginResult.ok) {
      setError(loginResult.error)
      return
    }
    login(loginResult.data.token, loginResult.data.username)
    navigate({ to: '/' })
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Create Account</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  )
}
