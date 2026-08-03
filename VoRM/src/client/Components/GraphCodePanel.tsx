import { useState, useEffect } from 'react'
import { Textarea } from '@mantine/core'
import * as ForceGraph from '../ForceGraph'

// Read-only placeholder for a future CodeMirror-based graph editor.
export default function GraphCodePanel() {
  const [json, setJson] = useState('{\n  "nodes": [],\n  "links": []\n}')

  useEffect(() => {
    setJson(JSON.stringify(ForceGraph.getData(), null, 2))
    ForceGraph.subscribe(() => {
      setJson(JSON.stringify(ForceGraph.getData(), null, 2))
    })
  }, [])

  return (
    <Textarea
      readOnly
      value={json}
      autosize={false}
      styles={{
        root: { width: 400, height: 600 },
        wrapper: { height: '100%' },
        input: { fontFamily: 'monospace', height: '100%', resize: 'none' }
      }}
    />
  )
}
