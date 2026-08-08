import { SegmentedControl, Box } from '@mantine/core'
import { AppNavbar } from './AppNavbar'

export type EditTool = 'node' | 'link' | 'wifi' | 'test' | 'some'

const TOOL_OPTIONS: { value: EditTool, label: string }[] = [
  { value: 'node', label: 'Add node' },
  { value: 'link', label: 'Add link' },
]

interface EditNavbarProps {
  tool: EditTool
  onToolChange: (tool: EditTool) => void
}

export function EditNavbar({ tool, onToolChange }: EditNavbarProps) {
  return (
    <Box style={{ position: 'relative', zIndex: 100, isolation: 'isolate' }}>
      <AppNavbar>
        <SegmentedControl
          value={tool}
          onChange={value => onToolChange(value as EditTool)}
          data={TOOL_OPTIONS}
        />
      </AppNavbar>
    </Box>
  )
}
