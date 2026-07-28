import { Button, CloseButton, Drawer, Group, Stack, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { User } from 'lucide-react'

const OVERLAY_BLUR = 10

export function NavDrawerIcon() {
  return <img src="/vorm.svg" alt="" style={{ height: 'var(--navbar-content-size)', width: 'auto' }} />
}

interface NavDrawerProps {
  defaultOpened?: boolean
}

export function NavDrawer({ defaultOpened = false }: NavDrawerProps) {
  const [opened, { open, close }] = useDisclosure(defaultOpened)

  return (
    <>
      <UnstyledButton
        onClick={open}
        aria-label="Open menu"
        style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
      >
        <NavDrawerIcon />
      </UnstyledButton>

      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        withCloseButton={false}
        overlayProps={{ blur: OVERLAY_BLUR }}
      >
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
    </>
  )
}
