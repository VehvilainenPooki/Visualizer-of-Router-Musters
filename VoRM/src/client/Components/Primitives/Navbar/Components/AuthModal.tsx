import { useState } from 'react'
import { Anchor, Button, Modal, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth } from '../../../../contexts/AuthContext'
import * as authService from '../../../../services/auth'
import { OVERLAY_BLUR } from '../../../../theme/constants'

interface VerifyPendingModalProps {
  opened: boolean
}

export function VerifyPendingModal({ opened }: VerifyPendingModalProps) {
  const { token, login, logout } = useAuth()
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSend = async () => {
    if (!token) return
    setSendStatus('sending')
    const result = await authService.sendVerificationEmail(token)
    if (!result.ok) {
      notifications.show({ color: 'red', title: 'Failed to send', message: result.error })
      setSendStatus('error')
      return
    }
    notifications.show({ color: 'green', title: 'Verification email sent', message: 'Check your inbox.' })
    setSendStatus('sent')
  }

  const handleCheck = async () => {
    if (!token) return
    const result = await authService.refreshToken(token)
    if (!result.ok) {
      notifications.show({ color: 'red', title: 'Check failed', message: result.error })
      return
    }
    login(result.data.token, result.data.username, result.data.isVerified, result.data.userId)
    if (result.data.isVerified) {
      notifications.show({ color: 'green', title: 'Email verified', message: 'Your email has been verified.' })
    } else {
      notifications.show({ color: 'yellow', title: 'Not verified yet', message: 'Still not verified — check your email.' })
    }
  }

  const handleLogout = () => {
    logout()
    notifications.show({ color: 'blue', title: 'Logged out', message: 'You have been logged out.' })
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
        <Button variant="light" onClick={handleCheck} fullWidth>
          I've verified — continue
        </Button>
        <Button color="red" variant="subtle" onClick={handleLogout} fullWidth>
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
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()

  const reset = () => {
    setMode('login')
    setUsername('')
    setEmail('')
    setPassword('')
    setSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const result = mode === 'login'
      ? await authService.login(username, password)
      : await authService.register(username, email, password)
    setSubmitting(false)
    if (!result.ok) {
      notifications.show({
        color: 'red',
        title: mode === 'login' ? 'Login failed' : 'Registration failed',
        message: result.error
      })
      return
    }
    login(result.data.token, result.data.username, result.data.isVerified, result.data.userId)
    notifications.show({
      color: 'green',
      title: mode === 'login' ? 'Logged in' : 'Account created',
      message: mode === 'login' ? `Welcome back, ${result.data.username}.` : `Welcome, ${result.data.username}.`
    })
    handleClose()
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

  const handleLogout = () => {
    logout()
    notifications.show({ color: 'blue', title: 'Logged out', message: 'You have been logged out.' })
    onClose()
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
