import type { ReactNode } from 'react'
import { useElementSize } from '@mantine/hooks'
import { useLayoutEffect, useRef, useState } from 'react'

interface FitContentProps {
  children: ReactNode
}

export function FitContent({ children }: FitContentProps) {
  const { ref: containerRef, width: containerWidth } = useElementSize()
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content || !containerWidth) return

    const naturalWidth = content.scrollWidth
    setScale(naturalWidth > containerWidth ? containerWidth / naturalWidth : 1)
  }, [containerWidth, children])

  return (
    <div
      ref={containerRef}
      style={{ minWidth: 0, height: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div
        ref={contentRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          flexWrap: 'nowrap',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
