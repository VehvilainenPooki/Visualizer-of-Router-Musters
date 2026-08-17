import { Group, Text, UnstyledButton } from '@mantine/core'
import { Settings } from 'lucide-react'

interface TitleButtonProps {
  name: string
  onClick: () => void
}

const BUTTON_STYLE = `
.title-button {
  border-radius: var(--mantine-radius-sm);
  padding: 0.25rem 0.5rem;
}
.title-button:hover {
  background: var(--mantine-color-default-hover);
}
`

export function TitleButton({ name, onClick }: TitleButtonProps) {
  return (
    <>
      <style>{BUTTON_STYLE}</style>
      <UnstyledButton onClick={onClick} className="title-button">
        <Group gap="xs" wrap="nowrap">
          <Text fw="var(--mantine-font-weight-medium)" truncate>{name}</Text>
          <Settings size={'1em'} />
        </Group>
      </UnstyledButton>
    </>
  )
}
