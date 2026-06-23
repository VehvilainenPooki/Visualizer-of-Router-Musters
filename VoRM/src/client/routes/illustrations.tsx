import { useState, useEffect } from 'react'
import { createRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useAuth } from '../contexts/AuthContext'
import * as illustrationsService from '../services/illustrations'
import type { Illustration } from '../services/illustrations'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/illustrations',
  beforeLoad: () => {
    if (!localStorage.getItem('auth_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: IllustrationsPage
})

function IllustrationsPage() {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()
  const [illustrations, setIllustrations] = useState<Illustration[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    illustrationsService.getIllustrations(token)
      .then(setIllustrations)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
  }, [token])

  const handleCreate = async () => {
    try {
      const newItem = await illustrationsService.createIllustration(token!)
      setIllustrations(prev => [...prev, newItem])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await illustrationsService.deleteIllustration(token!, id)
      setIllustrations(prev => prev.filter(i => i.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Illustrations</h2>
      <p>
        Logged in as <strong>{username}</strong>{' '}
        <button onClick={handleLogout}>Logout</button>
      </p>
      <button onClick={handleCreate}>New Illustration</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {illustrations.map(ill => (
          <li key={ill.id} style={{ margin: '4px 0' }}>
            Illustration #{ill.id}
            <button onClick={() => handleDelete(ill.id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>
      {illustrations.length === 0 && !error && <p style={{ color: '#888' }}>No illustrations yet.</p>}
      <p><Link to="/">Back to main app</Link></p>
    </div>
  )
}
