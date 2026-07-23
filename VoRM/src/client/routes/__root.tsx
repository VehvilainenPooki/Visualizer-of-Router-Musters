import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { AuthProvider } from '../contexts/AuthContext'

const EXEMPT_PATHS = ['/login', '/register', '/verify-pending']

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem('auth_token')
    const isVerified = localStorage.getItem('auth_is_verified')
    const isExempt = EXEMPT_PATHS.includes(location.pathname) || location.pathname.startsWith('/verify/')
    if (token && isVerified === 'false' && !isExempt) {
      throw redirect({ to: '/verify-pending' })
    }
  },
  component: () => (
    <MantineProvider>
      <Notifications />
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </MantineProvider>
  )
})
