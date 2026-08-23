import { SegmentedControl } from '@mantine/core'

export type VisibilityStatus = 'private' | 'public'

interface VisibilitySelectorProps {
  visibility: VisibilityStatus
  onVisibilityChange: (visibility: VisibilityStatus) => void
  saveVisibility: (value: VisibilityStatus) => void
}

const VISIBILITY_OPTIONS: { value: VisibilityStatus, label: string }[] = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
]


export function VisibilitySelector({ visibility, onVisibilityChange, saveVisibility }: VisibilitySelectorProps) {

  function handleChange(value : VisibilityStatus) {
    onVisibilityChange(value)
    saveVisibility(value)
  }
  return (
    <SegmentedControl
      value={visibility}
      onChange={value => handleChange(value as VisibilityStatus)}
      data={VISIBILITY_OPTIONS}
    />
  )
}
