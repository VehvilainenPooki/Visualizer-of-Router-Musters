import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Card, SegmentedControl, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { SearchNavbar } from './Navbar/SearchNavbar'
import { AuthModal } from '../Primitives/Navbar/Components/AuthModal'
import { useAuth } from '../../contexts/AuthContext'
import * as illustrationsService from '../../services/illustrations'
import type { Illustration } from '../../../common/types/illustration'

type Scope = 'public' | 'mine'

function IllustrationList({ illustrations }: { illustrations: Illustration[] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} mt="md">
      {illustrations.map(illustration => (
        <Link
          key={illustration.id}
          to="/illustrations/$illustrationId"
          params={{ illustrationId: String(illustration.id) }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Card withBorder shadow="sm" padding="lg">
            <Title order={4}>{illustration.name}</Title>
            <Text size="sm" c="dimmed" lineClamp={3}>
              {illustration.description}
            </Text>
          </Card>
        </Link>
      ))}
    </SimpleGrid>
  )
}

export function BrowseView({
  publicIllustrations,
  q,
  onSearchChange
}: {
  publicIllustrations: Illustration[]
  q: string
  onSearchChange: (value: string) => void
}) {
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
        onChange={onSearchChange}
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
