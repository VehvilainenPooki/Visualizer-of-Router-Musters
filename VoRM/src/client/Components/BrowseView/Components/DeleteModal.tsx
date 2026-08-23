import { Button, Group, Modal, Text } from '@mantine/core'
import { OVERLAY_BLUR } from '../../../theme/constants'
import type { Illustration } from '../../../../common/types/illustration'

interface DeleteModalProps {
  illustration: Illustration | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteModal({ illustration, onCancel, onConfirm }: DeleteModalProps) {
  return (
    <Modal opened={!!illustration} onClose={onCancel} title="Delete illustration?" centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <Text size="sm" mb="md">
        Are you sure you want to delete "{illustration?.name}"? This action cannot be undone.
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onCancel}>Cancel</Button>
        <Button color="red" onClick={onConfirm}>Delete</Button>
      </Group>
      <Text size="xs" c="dimmed" mt="sm">Tip: hold Shift while clicking the delete button to skip this confirmation.</Text>
    </Modal>
  )
}
