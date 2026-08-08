import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { notifications } from '@mantine/notifications'
import * as illustrationsService from '../../../services/illustrations'

export const Route = createFileRoute('/illustrations/$illustrationId')({
  loader: async ({ params }) => {
    const token = localStorage.getItem('auth_token')
    const result = await illustrationsService.getIllustration(token, Number(params.illustrationId))
    if (!result.ok) {
      if (result.status === 403) {
        notifications.show({ color: 'red', title: 'No access', message: 'You do not have access to this illustration.' })
        throw redirect({ to: '/' })
      }
      throw new Error(result.error)
    }
    return result.data
  },
  component: () => <Outlet />
})
