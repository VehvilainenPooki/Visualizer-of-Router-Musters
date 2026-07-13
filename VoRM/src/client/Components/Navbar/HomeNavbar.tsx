import { Title } from '@mantine/core'
import { AppNavbar } from './AppNavbar'

export function HomeNavbar() {
  return (
    <AppNavbar>
      <Title order={1} style={titleStyle}>Visualizer of Router Musters</Title>
    </AppNavbar>
  )
}

const titleStyle = {
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden',
  fontSize: 'clamp(1rem, 4vw, 2.125rem)'
}
