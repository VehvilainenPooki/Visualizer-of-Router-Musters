import { createRoute } from '@tanstack/react-router'
import { Button, CloseButton, Drawer, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BookOpenText, Share2, User } from 'lucide-react'
import { Route as rootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainView
})

function MainView() {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Group p="md">
        <UnstyledButton onClick={open}>
          <img src="/vorm.svg" alt="Open menu" style={{ height: '4em' }} />
        </UnstyledButton>
      </Group>

      <Drawer opened={opened} onClose={close} position="left" withCloseButton={false}>
        <Group justify="space-between" mb="md">
          <CloseButton onClick={close} />
          <Button leftSection={<User size={16} />}>Profile</Button>
        </Group>
        <Stack>
          <Button variant="subtle" fullWidth>Browse</Button>
          <Button variant="subtle" fullWidth>Create</Button>
          <Button variant="subtle" fullWidth>About</Button>
        </Stack>
      </Drawer>

      <Group grow align="stretch" gap="xl" p="xl" style={{ flex: 1 }}>
        <UnstyledButton style={actionCardStyle}>
          <div style={iconWrapperStyle}>
            <BookOpenText size="100%" />
          </div>
          <Text ta="center" fw={500} mt="md">Explore networks and simulations</Text>
        </UnstyledButton>
        <UnstyledButton style={actionCardStyle}>
          <div style={iconWrapperStyle}>
            <Share2 size="100%" />
          </div>
          <Text ta="center" fw={500} mt="md">Create your own network visualization</Text>
        </UnstyledButton>
      </Group>
    </div>
  )
}

const actionCardStyle = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--mantine-color-gray-4)',
  borderRadius: 'var(--mantine-radius-md)',
  padding: 'var(--mantine-spacing-xl)'
}

const iconWrapperStyle = {
  height: '50%',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}
