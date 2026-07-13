import type { ReactNode } from 'react'
import { Menubar } from '@mantine/core'
import { NavDrawer } from '../NavDrawer'

interface AppNavbarProps {
  children?: ReactNode
}

export function AppNavbar({ children }: AppNavbarProps) {
  return (
    <Menubar
      h="3rem"
      px="md"
      bg="var(--mantine-color-body)"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--mantine-spacing-md)',
        borderBottom: '1px solid var(--mantine-color-default-border)',
      }}
    >
      <NavDrawer />
      {children}
    </Menubar>
  )
}
