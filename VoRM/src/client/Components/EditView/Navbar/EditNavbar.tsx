import { useEffect, useState } from 'react'
import { Box, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '../../../contexts/AuthContext'
import { AppNavbar } from '../../Primitives/Navbar/AppNavbar'
import { AuthModal } from '../../Primitives/Navbar/Components/AuthModal'
import { EditIllustrationInfoModal } from './Components/EditIllustrationInfoModal'
import { SaveModal } from './Components/SaveModal'
import { SaveStatusButton } from './Components/SaveStatusButton'
import type { SaveStatus, SaveTarget } from './Components/SaveStatusButton'
import { TitleButton } from './Components/TitleButton'
import { VisibilitySelector } from './Components/VisibilitySelector'
import type { VisibilityStatus } from './Components/VisibilitySelector'



interface EditNavbarProps {
  visibility: VisibilityStatus
  onVisibilityChange: (visibility: VisibilityStatus) => void
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
            <TitleButton name={name} onClick={openInfoModal} />
          </Group>
          <VisibilitySelector 
            visibility={visibility}
            onVisibilityChange={onVisibilityChange}
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
