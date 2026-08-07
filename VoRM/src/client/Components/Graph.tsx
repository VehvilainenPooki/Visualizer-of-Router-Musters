import {useEffect, useRef} from 'react'

import type { FC } from 'react'

import type { PlainNetworkGraphData } from '../../common/types/network'

import * as ForceGraph from '../ForceGraph'

interface GraphProps {
  data?: PlainNetworkGraphData
}

const Graph: FC<GraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) {
        console.log("not ref")
        return
      }

      ForceGraph.initialize(svgRef.current)
      if (data) {
        ForceGraph.loadData(data)
      }

      return () => {
        ForceGraph.stop()
      }
  }, [])
  
  return (
    <div style={{ flex: 1, height: '100%' }}>
      <svg ref={svgRef} />
    </div>
  )
}

export default Graph
