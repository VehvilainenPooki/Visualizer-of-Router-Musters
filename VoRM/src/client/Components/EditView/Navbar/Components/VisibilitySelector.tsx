import { SegmentedControl } from '@mantine/core'

export type VisibilityStatus = 'private' | 'public'

interface VisibilitySelectorProps {
  visibility: VisibilityStatus
  onVisibilityChange: (visibility: VisibilityStatus) => void

}

const VISIBILITY_OPTIONS: { value: VisibilityStatus, label: string }[] = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
]


export function VisibilitySelector({ visibility, onVisibilityChange }: VisibilitySelectorProps) {

  return (
    <SegmentedControl
      value={visibility}
      onChange={value => onVisibilityChange(value as VisibilityStatus)}
      data={VISIBILITY_OPTIONS}
    />
  )
}
