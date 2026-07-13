import { Menu, Menubar } from '@mantine/core'
import { AppNavbar } from './AppNavbar'

export type EditTool = 'node' | 'link'

interface EditNavbarProps {
  tool: EditTool
  onToolChange: (tool: EditTool) => void
}

export function EditNavbar({ tool, onToolChange }: EditNavbarProps) {
  return (
    <AppNavbar>
      <Menubar.Menu>
        <Menubar.Target>Tools</Menubar.Target>
        <Menubar.Dropdown>
          <Menu.RadioGroup value={tool} onChange={value => onToolChange(value as EditTool)}>
            <Menu.RadioItem value="node">Add node</Menu.RadioItem>
            <Menu.RadioItem value="link">Add link</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menubar.Dropdown>
      </Menubar.Menu>
    </AppNavbar>
  )
}
