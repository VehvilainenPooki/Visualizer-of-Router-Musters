import { useEffect, useState } from 'react'
import { SegmentedControl, Box, Group, Text, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { AppNavbar } from './AppNavbar'
import { EditIllustrationInfoModal } from '../EditIllustrationInfoModal'
import { AuthModal } from '../AuthModal'
import { SaveModal } from '../SaveModal'
import { SaveStatusButton } from './SaveStatusButton'
import type { SaveStatus, SaveTarget } from './SaveStatusButton'

export type visibilityStatus = 'private' | 'public'

const VISIBILITY_OPTIONS: { value: visibilityStatus, label: string }[] = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
]

interface EditNavbarProps {
  visibility: visibilityStatus
  onVisibilityChange: (visibility: visibilityStatus) => void
  name: string
  description: string | null
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string | null) => void
}

export function EditNavbar({
  visibility,
  onVisibilityChange,
  name,
  description,
  onNameChange,
  onDescriptionChange
}: EditNavbarProps) {
  const [infoModalOpened, { open: openInfoModal, close: closeInfoModal }] = useDisclosure(false)
  const [titleHovered, setTitleHovered] = useState(false)
  const [saveModalOpened, { open: openSaveModal, close: closeSaveModal }] = useDisclosure(false)
  const [authModalOpened, { open: openAuthModal, close: closeAuthModal }] = useDisclosure(false)
  const [saveTarget, setSaveTarget] = useState<SaveTarget>('none')
  const [saveStatus] = useState<SaveStatus>('saved')
  const { token } = useAuth()

  useEffect(() => {
    if (token && saveTarget === 'none') setSaveTarget('server')
  }, [token, saveTarget])

  const handleSelectServer = () => {
    setSaveTarget('server')
  }

  const handleSelectLocal = () => {
    setSaveTarget('local')
  }

  return (
    <Box style={{ position: 'relative', zIndex: 100, isolation: 'isolate' }}>
      <AppNavbar>
        <Group justify="space-between" wrap="nowrap" gap="md">
          <Group gap="xs" wrap="nowrap">
            <SaveStatusButton saveTarget={saveTarget} saveStatus={saveStatus} onClick={openSaveModal} />
            <UnstyledButton
              onClick={openInfoModal}
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
              style={{
                borderRadius: 'var(--mantine-radius-sm)',
                padding: '0.25rem 0.5rem',
                background: titleHovered ? 'var(--mantine-color-default-hover)' : 'transparent'
              }}
            >
              <Group gap="xs" wrap="nowrap">
                <Text fw={600} truncate>{name}</Text>
                <Settings size={'1em'} />
              </Group>
            </UnstyledButton>
          </Group>
          <SegmentedControl
            value={visibility}
            onChange={value => onVisibilityChange(value as visibilityStatus)}
            data={VISIBILITY_OPTIONS}
          />
        </Group>
      </AppNavbar>
      <EditIllustrationInfoModal
        opened={infoModalOpened}
        onClose={closeInfoModal}
        name={name}
        description={description}
        onNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
      />
      <SaveModal
        opened={saveModalOpened}
        onClose={closeSaveModal}
        saveTarget={saveTarget}
        onLogin={openAuthModal}
        onSelectServer={handleSelectServer}
        onSelectLocal={handleSelectLocal}
      />
      <AuthModal opened={authModalOpened} onClose={closeAuthModal} />
    </Box>
  )
}
