import { createFileRoute, Outlet } from '@tanstack/react-router'
import * as illustrationsService from '../../services/illustrations'

export const Route = createFileRoute('/illustrations')({
  loader: async () => {
    const result = await illustrationsService.getPublicIllustrations()
    if (!result.ok) throw new Error(result.error)
    return result.data
  },
  component: () => <Outlet />
})
