import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { SearchNavbar } from '../../Components/Navbar/SearchNavbar'

export const Route = createFileRoute('/illustrations/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : ''
  }),
  component: IllustrationsIndex
})

function IllustrationsIndex() {
  const illustrations = useLoaderData({ from: '/illustrations' })
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <div>
      <SearchNavbar
        value={q}
        onChange={value => navigate({ search: { q: value } })}
      />
      <ul>
        {illustrations.map(illustration => (
          <li key={illustration.id}>
            <Link
              to="/illustrations/$illustrationId"
              params={{ illustrationId: String(illustration.id) }}
            >
              Illustration #{illustration.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
