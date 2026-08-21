import { type Extension, type Text } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { linter, type Diagnostic } from '@codemirror/lint'
import type { SyntaxNode } from '@lezer/common'
import type { PlainNetworkGraphData } from '../../../common/types/network'

const findProperty = (objectNode: SyntaxNode, propertyName: string, doc: Text): SyntaxNode | null => {
  for (let child = objectNode.firstChild; child; child = child.nextSibling) {
    if (child.name !== 'Property') continue
    const nameNode = child.firstChild
    if (!nameNode || nameNode.name !== 'PropertyName') continue
    if (doc.sliceString(nameNode.from + 1, nameNode.to - 1) === propertyName) return child
  }
  return null
}

interface IdEntry {
  id: string
  from: number
  to: number
  /** true if this entry's id matches what was already at this position before the current edit */
  isUnchanged: boolean
}

// When several entries share an id, blame the one(s) that just changed to
// collide rather than the one that was already there, so the pre-existing
// id stays identifiable. If none (or more than one) match the baseline,
// fall back to blaming every entry but the first.
const flagDuplicates = (entries: IdEntry[], messageFor: (id: string) => string, diagnostics: Diagnostic[]) => {
  const byId = new Map<string, IdEntry[]>()
  for (const entry of entries) {
    const group = byId.get(entry.id)
    if (group) group.push(entry)
    else byId.set(entry.id, [entry])
  }

  for (const group of byId.values()) {
    if (group.length < 2) continue

    const unchanged = group.filter(e => e.isUnchanged)
    const toFlag = unchanged.length === 1 ? group.filter(e => !e.isUnchanged) : group.slice(1)

    for (const entry of toFlag) {
      diagnostics.push({ from: entry.from, to: entry.to, severity: 'error', message: messageFor(entry.id) })
    }
  }
}

export const graphLinter = (baseline?: PlainNetworkGraphData, externalData?: PlainNetworkGraphData): Extension => linter(view => {
  const diagnostics: Diagnostic[] = []
  const doc = view.state.doc

  let data: any
  try {
    data = JSON.parse(doc.toString())
  } catch {
    return diagnostics
  }
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.links)) return diagnostics

  // ids that exist elsewhere in the graph but aren't shown in this editor,
  // so edits here can still be checked against the whole graph
  const externalNodeIds = new Set(externalData?.nodes.map(n => n.id) ?? [])
  const externalLinkIds = new Set(externalData?.links.map(l => l.id) ?? [])

  const nodeIds = new Set([...data.nodes.map((n: any) => n?.id), ...externalNodeIds])

  const root = syntaxTree(view.state).topNode.firstChild
  if (!root || root.name !== 'Object') return diagnostics

  const nodesArray = findProperty(root, 'nodes', doc)?.lastChild
  if (nodesArray && nodesArray.name === 'Array') {
    let nodeIndex = 0
    const nodeIdEntries: IdEntry[] = []
    for (let nodeNode = nodesArray.firstChild; nodeNode; nodeNode = nodeNode.nextSibling) {
      if (nodeNode.name !== 'Object') continue
      const idx = nodeIndex
      const node = data.nodes[nodeIndex++]

      const idProperty = findProperty(nodeNode, 'id', doc)
      const valueNode = idProperty?.lastChild
      const value = node?.id
      const from = valueNode ? valueNode.from : nodeNode.from
      const to = valueNode ? valueNode.to : nodeNode.to
      if (value == null || value === '') {
        diagnostics.push({ from, to, severity: 'error', message: 'Node is missing an id' })
      } else if (externalNodeIds.has(value) || externalLinkIds.has(value)) {
        diagnostics.push({ from, to, severity: 'error', message: `Duplicate node id ${JSON.stringify(value)}: already used elsewhere in the graph` })
      } else {
        nodeIdEntries.push({ id: value, from, to, isUnchanged: baseline?.nodes[idx]?.id === value })
      }
    }
    flagDuplicates(nodeIdEntries, id => `Duplicate node id ${JSON.stringify(id)}`, diagnostics)
  }

  const linksArray = findProperty(root, 'links', doc)?.lastChild
  if (!linksArray || linksArray.name !== 'Array') return diagnostics

  let index = 0
  const linkIdEntries: IdEntry[] = []
  for (let linkNode = linksArray.firstChild; linkNode; linkNode = linkNode.nextSibling) {
    if (linkNode.name !== 'Object') continue
    const idx = index
    const link = data.links[index++]

    const idProperty = findProperty(linkNode, 'id', doc)
    const idValueNode = idProperty?.lastChild
    const from = idValueNode ? idValueNode.from : linkNode.from
    const to = idValueNode ? idValueNode.to : linkNode.to
    if (link?.id == null || link.id === '') {
      diagnostics.push({ from, to, severity: 'error', message: 'Link is missing an id' })
    } else if (nodeIds.has(link.id)) {
      diagnostics.push({ from, to, severity: 'error', message: `Duplicate id ${JSON.stringify(link.id)}: already used by a node` })
    } else if (externalLinkIds.has(link.id)) {
      diagnostics.push({ from, to, severity: 'error', message: `Duplicate link id ${JSON.stringify(link.id)}: already used elsewhere in the graph` })
    } else {
      linkIdEntries.push({ id: link.id, from, to, isUnchanged: baseline?.links[idx]?.id === link.id })
    }

    for (const key of ['source', 'target'] as const) {
      const valueNode = findProperty(linkNode, key, doc)?.lastChild
      if (!valueNode) continue

      const value = link?.[key]
      if (!nodeIds.has(value)) {
        diagnostics.push({
          from: valueNode.from,
          to: valueNode.to,
          severity: 'error',
          message: `No node with id ${JSON.stringify(value)} exists`
        })
      }
    }
  }
  flagDuplicates(linkIdEntries, id => `Duplicate link id ${JSON.stringify(id)}`, diagnostics)

  return diagnostics
})
