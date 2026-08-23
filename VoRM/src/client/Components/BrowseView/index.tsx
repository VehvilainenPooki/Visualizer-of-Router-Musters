import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, Card, Group, SegmentedControl, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { SearchNavbar } from './Navbar/SearchNavbar'
import { DeleteButton } from './Components/DeleteButton'
import { DeleteModal } from './Components/DeleteModal'
import { AuthModal } from '../Primitives/Navbar/Components/AuthModal'
import { useAuth } from '../../contexts/AuthContext'
import * as illustrationsService from '../../services/illustrations'
import type { Illustration } from '../../../common/types/illustration'

type Scope = 'public' | 'mine'

function IllustrationList({
  illustrations,
  isMine,
  onRequestDelete
}: {
  illustrations: Illustration[]
  isMine?: boolean
  onRequestDelete?: (illustration: Illustration, event: React.MouseEvent) => void
}) {
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
            <Group justify="space-between" wrap="nowrap">
              <Title order={4}>{illustration.name}</Title>
              {isMine && (
                <DeleteButton
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    onRequestDelete?.(illustration, event)
                  }}
                />
              )}
            </Group>
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
  const [pendingDeletion, setPendingDeletion] = useState<Illustration | null>(null)

  useEffect(() => {
    if (scope !== 'mine' || !token) return
    illustrationsService.getIllustrations(token).then(result => {
      if (result.ok) setMyIllustrations(result.data)
    })
  }, [scope, token])

  const removeIllustration = (id: number) => {
    setMyIllustrations(current => current?.filter(illustration => illustration.id !== id) ?? current)
  }

  const deleteIllustration = async (illustration: Illustration) => {
    if (!token) return
    const result = await illustrationsService.deleteIllustration(token, illustration.id)
    if (result.ok) {
      removeIllustration(illustration.id)
      notifications.show({ color: 'green', title: 'Illustration deleted', message: `"${illustration.name}" was deleted.` })
    } else {
      notifications.show({ color: 'red', title: 'Delete failed', message: result.error })
    }
  }

  const handleRequestDelete = (illustration: Illustration, event: React.MouseEvent) => {
    if (event.shiftKey) {
      deleteIllustration(illustration)
      return
    }
    setPendingDeletion(illustration)
  }

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
          <IllustrationList illustrations={myIllustrations ?? []} isMine={true} onRequestDelete={handleRequestDelete} />
        ) : (
          <Stack align="center" mt="md">
            <Text>Log in to see your illustrations</Text>
            <Button onClick={openAuthModal}>Log in</Button>
          </Stack>
        )
      )}
      <AuthModal opened={authModalOpened} onClose={closeAuthModal} />
      <DeleteModal
        illustration={pendingDeletion}
        onCancel={() => setPendingDeletion(null)}
        onConfirm={() => {
          if (pendingDeletion) deleteIllustration(pendingDeletion)
          setPendingDeletion(null)
        }}
      />
    </div>
  )
}
