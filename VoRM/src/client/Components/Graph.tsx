import {useEffect, useRef} from 'react'

import type { FC } from 'react'

import type { PlainNetworkGraphData } from '../../common/types/network'

import * as ForceGraph from '../ForceGraph'

interface GraphProps {
  data?: PlainNetworkGraphData
}

const Graph: FC<GraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) {
        console.log("not ref")
        return
      }

      const { clientWidth, clientHeight } = containerRef.current

      ForceGraph.initialize(svgRef.current, clientWidth, clientHeight)
      if (data) {
        ForceGraph.loadData(data)
      }

      const resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect
        ForceGraph.resize(width, height)
      })
      resizeObserver.observe(containerRef.current)

      return () => {
        resizeObserver.disconnect()
        ForceGraph.stop()
      }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#f1f3f5',
        backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundAttachment: 'fixed'
      }}
    >
      <svg ref={svgRef} />
    </div>
  )
}

export default Graph
