import { useState, useEffect } from 'react'
import * as ForceGraph from '../ForceGraph'

export default function GraphCode() {
  const [json, setJson] = useState('{\n  "nodes": [],\n  "links": []\n}')

  useEffect(() => {
    ForceGraph.subscribe(() => {
      setJson(JSON.stringify(ForceGraph.getData(), null, 2))
    })
  }, [])

  return (
    <textarea
      readOnly
      value={json}
      style={{
        fontFamily: 'monospace',
        width: '33vw',
        height: '100%',
        position: 'fixed',
        top: 0,
        right: 0,
        resize: 'none',
        boxSizing: 'border-box'
      }}
    />
  )
}
