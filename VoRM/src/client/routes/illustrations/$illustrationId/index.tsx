import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { ViewNavbar } from '../../../Components/Primitives/Navbar/ViewNavbar'

export const Route = createFileRoute('/illustrations/$illustrationId/')({
  component: IllustrationView
})

function IllustrationView() {
  const illustration = useLoaderData({ from: '/illustrations/$illustrationId' })

  return (
    <div>
      <ViewNavbar />
      <p>id: {illustration.id}</p>
      <p>userId: {illustration.userId}</p>
      <p>name: {illustration.name}</p>
      <p>description: {illustration.description ?? ''}</p>
      <pre>{JSON.stringify(illustration.graphcode, null, 2)}</pre>
    </div>
  )
}
