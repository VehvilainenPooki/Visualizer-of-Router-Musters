import { Trash2 } from 'lucide-react'
import { Tooltip, UnstyledButton } from '@mantine/core'

const ICON_SIZE = '1.2em'

const BUTTON_STYLE = `
.delete-illustration-button {
  display: flex;
  align-items: center;
  border-radius: var(--mantine-radius-sm);
  padding: 0.25rem;
  color: var(--mantine-color-gray-6);
}
.delete-illustration-button:hover {
  background: var(--mantine-color-default-hover);
  color: var(--mantine-color-red-6);
}
`

interface DeleteButtonProps {
  onClick: (event: React.MouseEvent) => void
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <>
      <style>{BUTTON_STYLE}</style>
      <Tooltip label="Delete illustration">
        <UnstyledButton onClick={onClick} aria-label="Delete illustration" className="delete-illustration-button">
          <Trash2 size={ICON_SIZE} />
        </UnstyledButton>
      </Tooltip>
    </>
  )
}
