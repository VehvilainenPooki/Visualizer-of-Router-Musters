import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import { Paper } from '@mantine/core'
import * as ForceGraph from '../../ForceGraph'
import CodeMirror from '@uiw/react-codemirror'
import { lintGutter } from '@codemirror/lint'
import { protectedJsonValues } from './protectedJsonValues'
import { linkEndpointLinter } from './linkEndpointLinter'
import { linkEndpointCompletion } from './linkEndpointCompletion'

export default function GraphCodeEditor({ editorWidth}: { editorWidth: number }) {
  const data = useSyncExternalStore(ForceGraph.subscribeToData, ForceGraph.getData)
  const selectedNodeId = useSyncExternalStore(ForceGraph.subscribeToSelection, ForceGraph.getSelectedNodeId)

  const visibleData = selectedNodeId
    ? {
        nodes: data.nodes.filter(n => n.id === selectedNodeId),
        links: data.links.filter(l => l.source === selectedNodeId || l.target === selectedNodeId)
      }
    : data

  const [value, setValue] = useState(() => JSON.stringify(visibleData, null, 2))

  useEffect(() => {
    setValue(JSON.stringify(visibleData, null, 2))
  }, [data, selectedNodeId])

  const onChange = useCallback((val:any, _viewUpdate:any) => {
    console.log('val:', val)
    setValue(val)
  }, [])
  return (
    <Paper style={{
      boxShadow:'var(--shadow-even-xs)',
      width: `${editorWidth}%`,
      height: '100%', minWidth: 0,
      minHeight: 0,
      overflow: 'hidden',
      position: 'relative',
      zIndex: 2,
      borderRadius: '0 var(--mantine-radius-default) var(--mantine-radius-default) 0'
      }}>
      <CodeMirror extensions={[protectedJsonValues(), linkEndpointLinter(), lintGutter(), linkEndpointCompletion()]} value={value} height='100%' style={{ height: '100%', overflow: 'auto' }} onChange={onChange} />
    </Paper>
  )
}
