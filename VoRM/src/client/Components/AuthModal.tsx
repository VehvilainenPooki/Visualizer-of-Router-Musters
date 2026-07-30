import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Alert, Anchor, Button, Modal, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { useAuth } from '../contexts/AuthContext'
import * as authService from '../services/auth'
import { OVERLAY_BLUR } from './NavDrawer'

interface VerifyPendingModalProps {
  opened: boolean
}

export function VerifyPendingModal({ opened }: VerifyPendingModalProps) {
  const { token, login, logout } = useAuth()
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
    const result = await authService.refreshToken(token)
    if (!result.ok) {
      setCheckMessage(result.error)
      return
    }
    login(result.data.token, result.data.username, result.data.isVerified)
    if (!result.data.isVerified) {
      setCheckMessage('Still not verified — check your email.')
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => {}}
      title="Verify your email"
      centered
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      overlayProps={{ blur: OVERLAY_BLUR }}
    >
      <Stack>
        <Text>You need to verify your email address before you can continue.</Text>
        <Button onClick={handleSend} loading={sendStatus === 'sending'} fullWidth>
          {sendStatus === 'sent' || sendStatus === 'error' ? 'Resend verification email' : 'Send verification email'}
        </Button>
        {sendStatus === 'sent' && <Alert color="green">Verification email sent — check your inbox.</Alert>}
        {sendStatus === 'error' && <Alert color="red">{sendError}</Alert>}
        <Button variant="light" onClick={handleCheck} fullWidth>
          I've verified — continue
        </Button>
        {checkMessage && <Text size="sm">{checkMessage}</Text>}
        <Button color="red" variant="subtle" onClick={logout} fullWidth>
          Log out
        </Button>
      </Stack>
    </Modal>
  )
}

interface AuthModalProps {
  opened: boolean
  onClose: () => void
}

export function AuthModal({ opened, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const reset = () => {
    setMode('login')
    setUsername('')
    setEmail('')
    setPassword('')
    setError('')
    setSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = mode === 'login'
      ? await authService.login(username, password)
      : await authService.register(username, email, password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    login(result.data.token, result.data.username, result.data.isVerified)
    handleClose()
    if (mode === 'login' && result.data.isVerified) {
      navigate({ to: '/' })
    }
  }

  return (
    <Modal opened={opened} onClose={handleClose} title={mode === 'login' ? 'Login' : 'Create Account'} centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          {mode === 'register' && (
            <TextInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          )}
          <PasswordInput label="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Alert color="red">{error}</Alert>}
          <Button type="submit" loading={submitting} fullWidth>
            {mode === 'login' ? 'Login' : 'Create Account'}
          </Button>
          <Text size="sm" ta="center">
            {mode === 'login' ? (
              <>No account? <Anchor component="button" type="button" onClick={() => setMode('register')}>Create one</Anchor></>
            ) : (
              <>Already have an account? <Anchor component="button" type="button" onClick={() => setMode('login')}>Log in</Anchor></>
            )}
          </Text>
        </Stack>
      </form>
    </Modal>
  )
}

interface ProfileModalProps {
  opened: boolean
  onClose: () => void
}

export function ProfileModal({ opened, onClose }: ProfileModalProps) {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    navigate({ to: '/' })
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Profile" centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <Stack>
        <Text>Logged in as <strong>{username}</strong></Text>
        <Button color="red" variant="light" onClick={handleLogout} fullWidth>
          Logout
        </Button>
      </Stack>
    </Modal>
  )
}
