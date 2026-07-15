import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import * as authService from '../services/auth'

export const Route = createFileRoute('/verify/$token')({
  component: VerifyEmailPage
})

function VerifyEmailPage() {
  const { token } = Route.useParams()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    authService.verifyEmail(token).then(result => {
      if (!result.ok) {
        setError(result.error)
        setStatus('error')
        return
      }
      setStatus('success')
    })
  }, [token])

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Email Verification</h2>
      {status === 'pending' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <>
          <p>Your email has been verified.</p>
          <p><Link to="/login">Go to login</Link></p>
        </>
      )}
      {status === 'error' && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
