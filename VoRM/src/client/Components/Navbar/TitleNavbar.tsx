import { Title } from '@mantine/core'
import { AppNavbar, NAVBAR_CONTENT_SIZE } from './AppNavbar'

interface TitleNavbarProps {
  title: string
}

export function TitleNavbar({ title }: TitleNavbarProps) {
  return (
    <AppNavbar>
      <Title order={1} style={titleStyle}>{title}</Title>
    </AppNavbar>
  )
}

const titleStyle = {
  fontSize: NAVBAR_CONTENT_SIZE,
  lineHeight: 1,
  margin: 0,
  textWrap: 'nowrap' as const
}
