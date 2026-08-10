import type { CSSProperties, ReactNode } from 'react'
import { Paper } from '@mantine/core'
import { FitContent } from '../Primitives/FitContent'
import { NavDrawer, NavDrawerIcon } from './Components/NavDrawer'

interface AppNavbarProps {
  children?: ReactNode
}

export const NAVBAR_CONTENT_SIZE = '2.7rem'
const NAVBAR_PADDING = `calc(${NAVBAR_CONTENT_SIZE} * 0.1)`

export function AppNavbar({ children }: AppNavbarProps) {
  return (
    <Paper
      component="header"
      bg="var(--mantine-color-body)"
      radius={0}
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: NAVBAR_PADDING,
        padding: NAVBAR_PADDING,
        borderBottom: '1px solid var(--mantine-color-default-border)',
        '--navbar-content-size': NAVBAR_CONTENT_SIZE,
        boxShadow: 'var(--shadow-even-xs)'
      } as CSSProperties}
    >
      <NavDrawer />
      <div style={{ minWidth: 0, height: NAVBAR_CONTENT_SIZE }}>
        <FitContent>{children}</FitContent>
      </div>
      {/* A bit of a jank centering trick for navbar elements */}
      <div aria-hidden style={{ visibility: 'hidden', pointerEvents: 'none' }}>
        <NavDrawerIcon />
      </div>
    </Paper>
  )
}
