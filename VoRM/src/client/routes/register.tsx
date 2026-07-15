import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as authService from '../services/auth'

export const Route = createFileRoute('/register')({
  component: CreateAccountPage
})

function CreateAccountPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const registerResult = await authService.register(username, email, password)
    if (!registerResult.ok) {
      setError(registerResult.error)
      return
    }
    setRegistered(true)
  }

  if (registered) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
        <h2>Check your email</h2>
        <p>We sent a verification link to {email}. Click it to activate your account, then log in.</p>
        <p><Link to="/login">Go to login</Link></p>
      </div>
    )
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
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
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
