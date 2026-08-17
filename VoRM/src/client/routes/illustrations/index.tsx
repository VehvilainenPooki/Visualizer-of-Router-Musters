import { useEffect, useState } from 'react'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { Button, SegmentedControl, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { SearchNavbar } from '../../Components/BrowseView/Navbar/SearchNavbar'
import { AuthModal } from '../../Components/Primitives/Navbar/Components/AuthModal'
import { useAuth } from '../../contexts/AuthContext'
import * as illustrationsService from '../../services/illustrations'
import type { Illustration } from '../../../common/types/illustration'

type Scope = 'public' | 'mine'

export const Route = createFileRoute('/illustrations/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : ''
  }),
  component: IllustrationsIndex
})

function IllustrationList({ illustrations }: { illustrations: Illustration[] }) {
  return (
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
  )
}

function IllustrationsIndex() {
  const publicIllustrations = useLoaderData({ from: '/illustrations' })
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { token } = useAuth()
  const [scope, setScope] = useState<Scope>('public')
  const [myIllustrations, setMyIllustrations] = useState<Illustration[] | null>(null)
  const [authModalOpened, { open: openAuthModal, close: closeAuthModal }] = useDisclosure(false)

  useEffect(() => {
    if (scope !== 'mine' || !token) return
    illustrationsService.getIllustrations(token).then(result => {
      if (result.ok) setMyIllustrations(result.data)
    })
  }, [scope, token])

  return (
    <div>
      <SearchNavbar
        value={q}
        onChange={value => navigate({ search: { q: value } })}
        leftSection={
          <SegmentedControl
            value={scope}
            onChange={value => setScope(value as Scope)}
            data={[
              { value: 'public', label: 'Public' },
              { value: 'mine', label: 'My illustrations' }
            ]}
          />
        }
      />
      {scope === 'public' && <IllustrationList illustrations={publicIllustrations} />}
      {scope === 'mine' && (
        token ? (
          <IllustrationList illustrations={myIllustrations ?? []} />
        ) : (
          <Stack align="center" mt="md">
            <Text>Log in to see your illustrations</Text>
            <Button onClick={openAuthModal}>Log in</Button>
          </Stack>
        )
      )}
      <AuthModal opened={authModalOpened} onClose={closeAuthModal} />
    </div>
  )
}
