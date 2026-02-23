import {useEffect, useRef} from 'react'

import type { FC } from 'react'

import * as ForceGraph from '../ForceGraph'

const Graph: FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!svgRef.current) {
        console.log("not ref")
        return
      }

      ForceGraph.initialize(svgRef.current)
      
      return () => {
        ForceGraph.stop()
      }
  }, [])
  
  return (
    <div>
      <svg ref={svgRef} />
    </div>
  )
}

export default Graph
