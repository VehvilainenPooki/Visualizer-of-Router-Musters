import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Anchor, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core'
import { CircleCheck, CircleX } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import * as authService from '../services/auth'
import { TitleNavbar } from '../Components/Primitives/Navbar/TitleNavbar'

export const Route = createFileRoute('/verify/$token')({
  component: VerifyEmailPage
})

function VerifyEmailPage() {
  const { token } = Route.useParams()
  const { login } = useAuth()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    authService.verifyEmail(token).then(result => {
      if (!result.ok) {
        setError(result.error)
        setStatus('error')
        return
      }
      login(result.data.token, result.data.username, result.data.isVerified)
      setStatus('success')
    })
  }, [token])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TitleNavbar title="Visualizer of Router Musters" />
      <Center style={{ flex: 1 }}>
        <Paper withBorder shadow="sm" p="xl" radius="md" w={400}>
          <Stack align="center" ta="center">
            <Title order={2}>Email Verification</Title>
            {status === 'pending' && (
              <>
                <Loader />
                <Text>Verifying your email...</Text>
              </>
            )}
            {status === 'success' && (
              <>
                <CircleCheck color="var(--mantine-color-green-6)" size={48} />
                <Text>Your email has been verified.</Text>
                <Anchor component={Link} to="/">Go to homepage</Anchor>
              </>
            )}
            {status === 'error' && (
              <>
                <CircleX color="var(--mantine-color-red-6)" size={48} />
                <Text c="red">{error}</Text>
              </>
            )}
          </Stack>
        </Paper>
      </Center>
    </div>
  )
}
