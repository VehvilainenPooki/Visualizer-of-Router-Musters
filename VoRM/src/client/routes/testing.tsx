import { createRoute, Link, redirect } from '@tanstack/react-router'
import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Route as rootRoute } from './__root'
import Graph from '../Components/Graph'
import GraphManager from '../Components/GraphManager'
import ServerTester from '../Components/ServerTester'
import GraphCode from '../Components/GraphCode'
import { useAuth } from '../contexts/AuthContext'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testing/',
  beforeLoad: () => {
    if (!localStorage.getItem('auth_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: MainView
})

function MainView() {
  const { username } = useAuth()

  return (
    <div>
      <h1 style={{ fontSize: '48px' }}>
        <img src="/vorm.svg" alt="" style={{ height: '1.2em', verticalAlign: 'top', marginRight: '10px' }} />
        Visualizer of Router Musters
      </h1>
      <p>Welcome, {username}! <Link to="/illustrations">Illustrations</Link></p>
      <Button
        onClick={() =>
          notifications.show({
            title: 'Mantine is working',
            message: 'This notification confirms MantineProvider is wired up.'
          })
        }
      >
        Test notification
      </Button>
      <GraphManager />
      <Graph />
      <GraphCode />
      <ServerTester />
    </div>
  )
}
