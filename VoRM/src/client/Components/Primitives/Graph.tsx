import {useEffect, useRef} from 'react'

import type { FC } from 'react'

import { Scan, Share2 } from 'lucide-react'

import type { PlainNetworkGraphData } from '../../../common/types/network'

import * as ForceGraph from '../../ForceGraph'

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
        position: 'relative',
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
      <button
        type="button"
        onClick={() => ForceGraph.centerView()}
        title="Center view"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          padding: 0,
          border: '1px solid #ccc',
          borderRadius: 4,
          backgroundColor: '#fff',
          cursor: 'pointer'
        }}
      >
        <span style={{ position: 'relative', width: 22, height: 22 }}>
          <Scan size={22} style={{ position: 'absolute', top: 0, left: 0 }} />
          <Share2
            size={12}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </span>
      </button>
    </div>
  )
}

export default Graph
