import { Modal, Text } from '@mantine/core'
import { OVERLAY_BLUR } from '../../../../theme/constants'

interface DescriptionModalProps {
  opened: boolean
  onClose: () => void
  description: string
}
export function DescriptionModal({ opened, onClose, description }: DescriptionModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Description" centered overlayProps={{ blur: OVERLAY_BLUR }}>
      <Text size="lg">{description}</Text>
    </Modal>
  )
}
