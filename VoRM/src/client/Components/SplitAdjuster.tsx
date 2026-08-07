import { useRef } from 'react'
import { useDrag } from '@mantine/hooks'

interface SplitAdjusterProps {
  containerRef: React.RefObject<HTMLElement | null>
  width: number
  onWidthChange: (width: number) => void
  min?: number
  max?: number
}

export default function SplitAdjuster({ containerRef, width, onWidthChange, min = 5, max = 80 }: SplitAdjusterProps) {
  const startWidthRef = useRef(width)

  const { ref, active } = useDrag(
    (state) => {
      if (state.first) {
        startWidthRef.current = width
      }
      const containerWidth = containerRef.current?.getBoundingClientRect().width ?? 1
      const deltaPercent = (state.movement[0] / containerWidth) * 100
      const next = Math.min(max, Math.max(min, startWidthRef.current + deltaPercent))
      onWidthChange(next)
    },
    { axis: 'x' }
  )

  return (
    <div
      ref={ref}
      style={{
        width: 6,
        flexShrink: 0,
        cursor: 'col-resize',
        touchAction: 'none',
        userSelect: 'none',
        background: active ? 'var(--mantine-color-gray-filled)' : 'transparent',
      }}
    />
  )
}
