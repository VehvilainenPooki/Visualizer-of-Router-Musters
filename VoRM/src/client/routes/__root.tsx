import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { VerifyPendingModal } from '../Components/AuthModal'

export const Route = createRootRoute({
  component: () => (
    <MantineProvider>
      <Notifications />
      <AuthProvider>
        <RootContent />
      </AuthProvider>
    </MantineProvider>
  )
})

function RootContent() {
  const { token, isVerified } = useAuth()
  return (
    <>
      <VerifyPendingModal opened={!!token && isVerified === false} />
      <Outlet />
    </>
  )
}
