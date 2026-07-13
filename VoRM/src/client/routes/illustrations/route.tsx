import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import * as illustrationsService from '../../services/illustrations'

export const Route = createFileRoute('/illustrations')({
  beforeLoad: () => {
    if (!localStorage.getItem('auth_token')) {
      throw redirect({ to: '/login' })
    }
  },
  loader: async () => {
    const token = localStorage.getItem('auth_token')!
    const result = await illustrationsService.getIllustrations(token)
    if (!result.ok) throw new Error(result.error)
    return result.data
  },
  component: () => <Outlet />
})
