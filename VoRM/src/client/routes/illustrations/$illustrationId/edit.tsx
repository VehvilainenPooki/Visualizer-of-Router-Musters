import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { IllustrationEditor } from '../../../Components/IllustrationEditor'

export const Route = createFileRoute('/illustrations/$illustrationId/edit')({
  component: IllustrationEdit
})

function IllustrationEdit() {
  const illustration = useLoaderData({ from: '/illustrations/$illustrationId' })

  return (
    <IllustrationEditor
      initialData={{
        nodes: illustration.graphcode.nodes ?? [],
        links: illustration.graphcode.links ?? []
      }}
    />
  )
}
