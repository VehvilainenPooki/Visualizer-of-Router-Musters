import { useState } from 'react'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { EditNavbar, type EditTool } from '../../../Components/Navbar/EditNavbar'

export const Route = createFileRoute('/illustrations/$illustrationId/edit')({
  component: IllustrationEdit
})

function IllustrationEdit() {
  const [tool, setTool] = useState<EditTool>('node')
  const illustration = useLoaderData({ from: '/illustrations/$illustrationId' })

  return (
    <div>
      <EditNavbar tool={tool} onToolChange={setTool} />
      <p>Editing illustration #{illustration.id}</p>
    </div>
  )
}
