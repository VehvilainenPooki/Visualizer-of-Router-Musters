import { useState } from 'react'
import { SegmentedControl, Box, Group, Text, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Settings } from 'lucide-react'
import { AppNavbar } from './AppNavbar'
import { EditIllustrationInfoModal } from '../EditIllustrationInfoModal'

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

  return (
    <Box style={{ position: 'relative', zIndex: 100, isolation: 'isolate' }}>
      <AppNavbar>
        <Group justify="space-between" wrap="nowrap" gap="md">
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
              <Settings size={16} />
            </Group>
          </UnstyledButton>
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
    </Box>
  )
}
