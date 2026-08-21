import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import { Paper } from '@mantine/core'
import * as ForceGraph from '../../../ForceGraph'
import CodeMirror from '@uiw/react-codemirror'
import { lintGutter } from '@codemirror/lint'
import { protectedJsonValues } from './protectedJsonValues'
import { graphLinter, getGraphDiagnostics } from './graphLinter'
import { linkEndpointCompletion } from './linkEndpointCompletion'
import { graphAddButtons } from './graphAddButtons'
import { graphDeleteButtons, type PendingGraphDeletion } from './graphDeleteButtons'
import { nodeIdNavigation } from './nodeIdNavigation'
import { DeleteGraphItemModal } from './DeleteGraphItemModal'
import { parseGraphData, hasDuplicateIds } from './graphDataUtils'

export default function GraphCodeEditor({ editorWidth, saveGraph }: { editorWidth: number, saveGraph: () => void }) {
  const data = useSyncExternalStore(ForceGraph.subscribeToData, ForceGraph.getData)
  const selectedNodeId = useSyncExternalStore(ForceGraph.subscribeToSelection, ForceGraph.getSelectedNodeId)

  const visibleData = selectedNodeId
    ? {
        nodes: data.nodes.filter(n => n.id === selectedNodeId),
        links: data.links.filter(l => l.source === selectedNodeId || l.target === selectedNodeId)
      }
    : data

  // the rest of the graph, not shown in the editor when a node is selected,
  // kept around so the linter can still validate ids and link endpoints against it
  const externalData = selectedNodeId
    ? {
        nodes: data.nodes.filter(n => n.id !== selectedNodeId),
        links: data.links.filter(l => l.source !== selectedNodeId && l.target !== selectedNodeId)
      }
    : { nodes: [], links: [] }

  const [value, setValue] = useState(() => JSON.stringify(visibleData, null, 2))

  useEffect(() => {
    setValue(JSON.stringify(visibleData, null, 2))
  }, [data, selectedNodeId])

  const onChange = useCallback((val: any, viewUpdate: any) => {
    setValue(val)

    const parsed = parseGraphData(val)
    if (!parsed || hasDuplicateIds(parsed)) return

    const noErrors = getGraphDiagnostics(viewUpdate.view, visibleData, externalData).length === 0

    if (!selectedNodeId) {
      ForceGraph.applyData(parsed)
      if (noErrors) saveGraph()
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
    if (noErrors) saveGraph()
  }, [selectedNodeId, visibleData, externalData])

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
        extensions={[protectedJsonValues(selectedNodeId ?? undefined), graphLinter(visibleData, externalData), lintGutter(), linkEndpointCompletion(), graphAddButtons(selectedNodeId ?? undefined, { nodes: externalData.nodes.map(n => n.id), links: externalData.links.map(l => l.id) }), graphDeleteButtons(onRequestDelete), nodeIdNavigation()]}
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
