import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { BrowseView } from '../../Components/BrowseView'

export const Route = createFileRoute('/illustrations/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : ''
  }),
  component: IllustrationsIndex
})

function IllustrationsIndex() {
  const publicIllustrations = useLoaderData({ from: '/illustrations' })
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <BrowseView
      publicIllustrations={publicIllustrations}
      q={q}
      onSearchChange={value => navigate({ search: { q: value } })}
    />
  )
}
