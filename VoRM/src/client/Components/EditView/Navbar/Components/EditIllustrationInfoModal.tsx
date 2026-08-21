import { Group, Modal, Stack, Textarea, TextInput } from '@mantine/core'
import { OVERLAY_BLUR } from '../../../../theme/constants'

interface EditIllustrationInfoModalProps {
  opened: boolean
  onClose: () => void
  name: string
  description: string | null
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string | null) => void
  saveInfo: () => void
}

export function EditIllustrationInfoModal({
  opened,
  onClose,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  saveInfo
}: EditIllustrationInfoModalProps) {

  function handleClose(): void {
    onClose()
    saveInfo()
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Edit illustration info" centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <Stack>
        <TextInput label="Name" value={name} onChange={e => onNameChange(e.target.value)} />
        <Textarea label="Description" value={description ? description : ""} onChange={e => onDescriptionChange(e.target.value)} autosize minRows={2} />
        <Group justify="flex-end">
        </Group>
      </Stack>
    </Modal>
  )
}
