import { Button, Group, List, Modal, Text } from '@mantine/core'
import { OVERLAY_BLUR } from '../../../theme/constants'
import type { PendingGraphDeletion } from './graphDeleteButtons'

interface DeleteGraphItemModalProps {
  pendingDeletion: PendingGraphDeletion | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteGraphItemModal({ pendingDeletion, onCancel, onConfirm }: DeleteGraphItemModalProps) {
  return (
    <Modal opened={!!pendingDeletion} onClose={onCancel} title={pendingDeletion?.title ?? ''} centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <Text size="sm" mb="xs">This will delete:</Text>
      <List size="sm" mb="md">
        {pendingDeletion?.removedItems.map(item => <List.Item key={item}>{item}</List.Item>)}
      </List>
      <Group justify="flex-end">
        <Button variant="default" onClick={onCancel}>Cancel</Button>
        <Button color="red" onClick={onConfirm}>Delete</Button>
      </Group>
      <Text size="xs" c="dimmed" mt="sm">Tip: hold Shift while clicking - to skip this confirmation.</Text>
    </Modal>
  )
}
