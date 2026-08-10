import { Button, Modal, Stack, Text } from '@mantine/core'
import { CloudUpload, FolderDown } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { OVERLAY_BLUR } from '../../../theme/constants'
import type { SaveTarget } from './SaveStatusButton'

interface SaveModalProps {
  opened: boolean
  onClose: () => void
  saveTarget: SaveTarget
  onLogin: () => void
  onSelectServer: () => void
  onSelectLocal: () => void
}

const TARGET_LABEL: Record<SaveTarget, string> = {
  none: 'No save option selected yet.',
  server: 'Currently saving to the server.',
  local: 'Currently saving to this device.'
}

export function SaveModal({ opened, onClose, saveTarget, onLogin, onSelectServer, onSelectLocal }: SaveModalProps) {
  const { token } = useAuth()

  const handleServerClick = () => {
    if (token) {
      onSelectServer()
    } else {
      onLogin()
    }
    onClose()
  }

  const handleSelectLocal = () => {
    onSelectLocal()
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Save" centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <Stack>
        <Text size="sm">{TARGET_LABEL[saveTarget]}</Text>
        <Button leftSection={<CloudUpload size={'1em'} />} onClick={handleServerClick} fullWidth>
          {token ? 'Save on server' : 'Login'}
        </Button>
        <Button leftSection={<FolderDown size={'1em'} />} variant="light" onClick={handleSelectLocal} fullWidth>
          Save on device
        </Button>
      </Stack>
    </Modal>
  )
}
