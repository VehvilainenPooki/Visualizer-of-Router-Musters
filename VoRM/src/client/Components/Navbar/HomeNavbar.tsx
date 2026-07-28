import { Title } from '@mantine/core'
import { AppNavbar, NAVBAR_CONTENT_SIZE } from './AppNavbar'

export function HomeNavbar() {
  return (
    <AppNavbar>
      <Title order={1} style={titleStyle}>Visualizer of Router Musters</Title>
    </AppNavbar>
  )
}

const titleStyle = {
  fontSize: NAVBAR_CONTENT_SIZE,
  lineHeight: 1,
  margin: 0,
  textWrap: 'nowrap' as const
}
