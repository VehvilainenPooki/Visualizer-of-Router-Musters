import { Button, CloseButton, Drawer, Group, Stack, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { useAuth } from '../../../../contexts/AuthContext'
import { AuthModal, ProfileModal } from './AuthModal'
import { OVERLAY_BLUR } from '../../../../theme/constants'

export function NavDrawerIcon() {
  return <img src="/vorm.svg" alt="" style={{ height: 'var(--navbar-content-size)', width: 'auto' }} />
}

interface NavDrawerProps {
  defaultOpened?: boolean
}

export function NavDrawer({ defaultOpened = false }: NavDrawerProps) {
  const [opened, { open, close }] = useDisclosure(defaultOpened)
  const [authModalOpened, { open: openAuthModal, close: closeAuthModal }] = useDisclosure(false)
  const { token } = useAuth()
  const navigate = useNavigate()

  const handleProfileClick = () => {
    close()
    openAuthModal()
  }

  const handleAboutClick = () => {
    close()
    navigate({ to: '/' })
  }

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
          <Button leftSection={<User size={16} />} onClick={handleProfileClick}>
            {token ? 'Profile' : 'Login'}
          </Button>
        </Group>
        <Stack>
          <Button variant="subtle" fullWidth>Browse</Button>
          <Button variant="subtle" fullWidth>Create</Button>
          <Button variant="subtle" fullWidth onClick={handleAboutClick}>About</Button>
        </Stack>
      </Drawer>

      {token ? (
        <ProfileModal opened={authModalOpened} onClose={closeAuthModal} />
      ) : (
        <AuthModal opened={authModalOpened} onClose={closeAuthModal} />
      )}
    </>
  )
}
