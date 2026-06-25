import { createRoute, Link, redirect } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import Graph from '../Components/Graph'
import GraphManager from '../Components/GraphManager'
import ServerTester from '../Components/ServerTester'
import GraphCode from '../Components/GraphCode'
import { useAuth } from '../contexts/AuthContext'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
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
      <GraphManager />
      <Graph />
      <GraphCode />
      <ServerTester />
    </div>
  )
}
