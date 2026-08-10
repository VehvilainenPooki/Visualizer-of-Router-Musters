import { useEffect, useState } from 'react'
import { Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core'
import { OVERLAY_BLUR } from '../../../theme/constants'

interface EditIllustrationInfoModalProps {
  opened: boolean
  onClose: () => void
  name: string
  description: string | null
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string | null) => void
}

export function EditIllustrationInfoModal({
  opened,
  onClose,
  name,
  description,
  onNameChange,
  onDescriptionChange
}: EditIllustrationInfoModalProps) {
  const [draftName, setDraftName] = useState(name)
  const [draftDescription, setDraftDescription] = useState(description ?? '')

  useEffect(() => {
    if (opened) {
      setDraftName(name)
      setDraftDescription(description ?? '')
    }
  }, [opened, name, description])

  const handleSave = () => {
    onNameChange(draftName)
    onDescriptionChange(draftDescription === '' ? null : draftDescription)
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Edit illustration info" centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <Stack>
        <TextInput label="Name" value={draftName} onChange={e => setDraftName(e.target.value)} />
        <Textarea label="Description" value={draftDescription} onChange={e => setDraftDescription(e.target.value)} autosize minRows={2} />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
