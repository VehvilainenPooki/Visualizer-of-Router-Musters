import { useRef, memo } from 'react'
import { useDrag } from '@mantine/hooks'
import { Paper } from '@mantine/core'
import { GripVertical } from 'lucide-react'

interface SplitAdjusterProps {
  containerRef: React.RefObject<HTMLElement | null>
  width: number
  onWidthChange: (width: number) => void
  min?: number
  max?: number
}

function SplitAdjuster({ containerRef, width, onWidthChange, min = 5, max = 80 }: SplitAdjusterProps) {
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
    <Paper
      ref={ref}
      style={{
        width: 30,
        marginLeft: -15,
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
        cursor: 'col-resize',
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 1,
        background: active ? 'var(--mantine-color-gray-filled)' : 'var(--mantine-color-white-filled)',
        boxShadow: 'var(--shadow-even-xs)'
      }}
    >
      <GripVertical size={12} color="var(--mantine-color-gray-5)" />
    </Paper>
  )
}

export default memo(SplitAdjuster)
