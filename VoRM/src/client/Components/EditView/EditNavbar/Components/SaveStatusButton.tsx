import { useEffect, useState } from 'react'
import { Save, SaveCheck, SaveOff, type LucideIcon } from 'lucide-react'
import { Tooltip, UnstyledButton } from '@mantine/core'

export type SaveTarget = 'none' | 'server' | 'local'
export type SaveStatus = 'saving' | 'saved' | 'success' | 'failed'

const SUCCESS_DISPLAY_MS = 300

interface SaveStatusIconProps {
  saveTarget: SaveTarget
  saveStatus: SaveStatus
  isFull: boolean
  onClick: () => void
}

const ICON_SIZE = '1.2em'

const BUTTON_STYLE = `
.save-status-icon-button {
  display: flex;
  align-items: center;
  border-radius: var(--mantine-radius-sm);
  padding: 0.25rem;
}
.save-status-icon-button:hover {
  background: var(--mantine-color-default-hover);
}
.save-status-icon-button--pulse {
  animation: save-status-pulse 1.4s ease-in-out infinite;
}
@keyframes save-status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
`

interface Variant {
  label: string
  icon: LucideIcon
  color?: string
  pulse?: boolean
}

function getVariant(saveTarget: SaveTarget, saveStatus: SaveStatus, isFull: boolean): Variant {
  if (isFull && saveTarget === 'server') {
    return { label: "Illustration limit reached — can't save to server", icon: SaveOff, color: 'var(--mantine-color-yellow-6)', pulse: true }
  }
  if (saveTarget === 'none') {
    return { label: 'No save option selected', icon: Save, color: 'var(--mantine-color-red-6)', pulse: true }
  }
  if (saveStatus === 'failed') {
    return { label: 'Save failed', icon: SaveOff, color: 'var(--mantine-color-orange-6)', pulse: true }
  }
  if (saveStatus === 'saving') {
    return { label: 'Saving', icon: Save, color: 'var(--mantine-color-blue-6)' }
  }
  if (saveStatus === 'success') {
    return { label: 'Saved', icon: SaveCheck, color: 'var(--mantine-color-green-6)' }
  }
  return { label: 'All changes saved', icon: SaveCheck}
}

export function SaveStatusButton({ saveTarget, saveStatus, isFull, onClick }: SaveStatusIconProps) {
  const [displayStatus, setDisplayStatus] = useState(saveStatus)

  useEffect(() => {
    setDisplayStatus(saveStatus)
    if (saveStatus !== 'success') return
    const id = setTimeout(() => setDisplayStatus('saved'), SUCCESS_DISPLAY_MS)
    return () => clearTimeout(id)
  }, [saveStatus])

  const { label, icon: Icon, color, pulse } = getVariant(saveTarget, displayStatus, isFull)

  return (
    <>
      <style>{BUTTON_STYLE}</style>
      <Tooltip label={label}>
        <UnstyledButton
          onClick={onClick}
          aria-label={label}
          className={pulse ? 'save-status-icon-button save-status-icon-button--pulse' : 'save-status-icon-button'}
        >
          <Icon size={ICON_SIZE} color={color} />
        </UnstyledButton>
      </Tooltip>
    </>
  )
}
