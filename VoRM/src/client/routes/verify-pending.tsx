import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'
import * as authService from '../services/auth'

export const Route = createFileRoute('/verify-pending')({
  component: VerifyPendingPage
})

function VerifyPendingPage() {
  const { token, logout, setVerified } = useAuth()
  const navigate = useNavigate()
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sendError, setSendError] = useState('')
  const [checkMessage, setCheckMessage] = useState('')

  const handleSend = async () => {
    if (!token) return
    setSendStatus('sending')
    setSendError('')
    const result = await authService.sendVerificationEmail(token)
    if (!result.ok) {
      setSendError(result.error)
      setSendStatus('error')
      return
    }
    setSendStatus('sent')
  }

  const handleCheck = async () => {
    if (!token) return
    setCheckMessage('')
    const result = await authService.getMe(token)
    if (!result.ok) {
      setCheckMessage(result.error)
      return
    }
    setVerified(result.data.isVerified)
    if (result.data.isVerified) {
      navigate({ to: '/' })
      return
    }
    setCheckMessage('Still not verified — check your email.')
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Verify your email</h2>
      <p>You need to verify your email address before you can continue.</p>

      <button onClick={handleSend} disabled={sendStatus === 'sending'}>
        {sendStatus === 'sent' || sendStatus === 'error' ? 'Resend verification email' : 'Send verification email'}
      </button>
      {sendStatus === 'sending' && <p>Sending...</p>}
      {sendStatus === 'sent' && <p>Verification email sent — check your inbox.</p>}
      {sendStatus === 'error' && <p style={{ color: 'red' }}>{sendError}</p>}

      <p><button onClick={handleCheck}>I've verified — continue</button></p>
      {checkMessage && <p>{checkMessage}</p>}

      <p><button onClick={handleLogout}>Log out</button></p>
    </div>
  )
}
