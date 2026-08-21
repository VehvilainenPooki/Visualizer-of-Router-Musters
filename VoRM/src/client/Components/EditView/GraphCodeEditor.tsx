import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import { Paper } from '@mantine/core'
import * as ForceGraph from '../../ForceGraph'
import CodeMirror from '@uiw/react-codemirror'
import { lintGutter } from '@codemirror/lint'
import { protectedJsonValues } from './protectedJsonValues'
import { graphLinter } from './graphLinter'
import { linkEndpointCompletion } from './linkEndpointCompletion'
import { graphAddButtons } from './graphAddButtons'
import { graphDeleteButtons, type PendingGraphDeletion } from './graphDeleteButtons'
import { DeleteGraphItemModal } from './DeleteGraphItemModal'
import { parseGraphData, hasDuplicateIds } from './graphDataUtils'

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

  const onChange = useCallback((val: any, _viewUpdate: any) => {
    setValue(val)

    const parsed = parseGraphData(val)
    if (!parsed || hasDuplicateIds(parsed)) return

    if (!selectedNodeId) {
      ForceGraph.applyData(parsed)
      return
    }

    // editor shows only the selected node + its incident links; merge that
    // edited subset back into the full graph, leaving everything else untouched
    const fullData = ForceGraph.getData()
    const otherNodes = fullData.nodes.filter(n => n.id !== selectedNodeId)
    const otherLinks = fullData.links.filter(l => l.source !== selectedNodeId && l.target !== selectedNodeId)
    ForceGraph.applyData({
      nodes: [...otherNodes, ...parsed.nodes],
      links: [...otherLinks, ...parsed.links]
    })
  }, [selectedNodeId])

  const [pendingDeletion, setPendingDeletion] = useState<PendingGraphDeletion | null>(null)
  const onRequestDelete = useCallback((request: PendingGraphDeletion) => setPendingDeletion(request), [])

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
      <CodeMirror
        extensions={[protectedJsonValues(), graphLinter(visibleData), lintGutter(), linkEndpointCompletion(), graphAddButtons(), graphDeleteButtons(onRequestDelete)]}
        value={value}
        height='100%'
        style={{ height: '100%', overflow: 'auto' }}
        onChange={onChange}
      />
      <DeleteGraphItemModal
        pendingDeletion={pendingDeletion}
        onCancel={() => setPendingDeletion(null)}
        onConfirm={() => {
          pendingDeletion?.apply()
          setPendingDeletion(null)
        }}
      />
    </Paper>
  )
}
