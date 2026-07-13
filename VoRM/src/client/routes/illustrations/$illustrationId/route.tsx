import { createFileRoute, Outlet } from '@tanstack/react-router'
import * as illustrationsService from '../../../services/illustrations'

export const Route = createFileRoute('/illustrations/$illustrationId')({
  loader: async ({ params }) => {
    const token = localStorage.getItem('auth_token')!
    const result = await illustrationsService.getIllustration(token, Number(params.illustrationId))
    if (!result.ok) throw new Error(result.error)
    return result.data
  },
  component: () => <Outlet />
})
