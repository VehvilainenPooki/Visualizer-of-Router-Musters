import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { ViewNavbar } from '../../../Components/Navbar/ViewNavbar'

export const Route = createFileRoute('/illustrations/$illustrationId/')({
  component: IllustrationView
})

function IllustrationView() {
  const illustration = useLoaderData({ from: '/illustrations/$illustrationId' })

  return (
    <div>
      <ViewNavbar />
      <p>Viewing illustration #{illustration.id}</p>
    </div>
  )
}
