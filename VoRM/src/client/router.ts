import { createRouter } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as loginRoute } from './routes/login'
import { Route as registerRoute } from './routes/register'
import { Route as illustrationsRoute } from './routes/illustrations'
import {Route as testingRoute} from './routes/testing'

const routeTree = rootRoute.addChildren([
  indexRoute,
  testingRoute,
  loginRoute,
  registerRoute,
  illustrationsRoute
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
