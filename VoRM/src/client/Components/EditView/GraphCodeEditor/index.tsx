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
    // edited subset back into the full graph, leaving everything else untouched.
    // parsed.nodes can still contain a just-added target node that hasn't been
    // trimmed back out of the visible doc yet, so dedupe by id (parsed wins)
    // rather than concatenating, or that node ends up counted twice
    const fullData = ForceGraph.getData()
    const nodeMap = new Map(fullData.nodes.filter(n => n.id !== selectedNodeId).map(n => [n.id, n]))
    for (const n of parsed.nodes) nodeMap.set(n.id, n)
    const linkMap = new Map(
      fullData.links.filter(l => l.source !== selectedNodeId && l.target !== selectedNodeId).map(l => [l.id, l])
    )
    for (const l of parsed.links) linkMap.set(l.id, l)
    ForceGraph.applyData({
      nodes: [...nodeMap.values()],
      links: [...linkMap.values()]
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
        extensions={[protectedJsonValues(selectedNodeId ?? undefined), graphLinter(visibleData, externalData), lintGutter(), linkEndpointCompletion(), graphAddButtons(selectedNodeId ?? undefined), graphDeleteButtons(onRequestDelete), nodeIdNavigation()]}
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
