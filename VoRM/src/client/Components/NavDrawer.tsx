import { Button, CloseButton, Drawer, Group, Stack, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { User } from 'lucide-react'

const OVERLAY_BLUR = 10

interface NavDrawerProps {
  width: number
  height: number
  defaultOpened?: boolean
}

export function NavDrawer({ width, height, defaultOpened = false }: NavDrawerProps) {
  const [opened, { open, close }] = useDisclosure(defaultOpened)

  const iconSize = 0.1 * Math.min(width, height)
  const padding = iconSize * 0.25

  return (
    <>
      <UnstyledButton
        onClick={open}
        style={{ position: 'absolute', top: padding, left: padding }}
      >
        <img src="/vorm.svg" alt="Open menu" style={{ width: iconSize, height: iconSize }} />
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
