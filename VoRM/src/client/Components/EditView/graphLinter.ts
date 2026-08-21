import { type Extension, type Text } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { linter, type Diagnostic } from '@codemirror/lint'
import type { SyntaxNode } from '@lezer/common'

const findProperty = (objectNode: SyntaxNode, propertyName: string, doc: Text): SyntaxNode | null => {
  for (let child = objectNode.firstChild; child; child = child.nextSibling) {
    if (child.name !== 'Property') continue
    const nameNode = child.firstChild
    if (!nameNode || nameNode.name !== 'PropertyName') continue
    if (doc.sliceString(nameNode.from + 1, nameNode.to - 1) === propertyName) return child
  }
  return null
}

export const graphLinter = (): Extension => linter(view => {
  const diagnostics: Diagnostic[] = []
  const doc = view.state.doc

  let data: any
  try {
    data = JSON.parse(doc.toString())
  } catch {
    return diagnostics
  }
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.links)) return diagnostics

  const nodeIds = new Set(data.nodes.map((n: any) => n?.id))

  const root = syntaxTree(view.state).topNode.firstChild
  if (!root || root.name !== 'Object') return diagnostics

  const nodesArray = findProperty(root, 'nodes', doc)?.lastChild
  if (nodesArray && nodesArray.name === 'Array') {
    let nodeIndex = 0
    for (let nodeNode = nodesArray.firstChild; nodeNode; nodeNode = nodeNode.nextSibling) {
      if (nodeNode.name !== 'Object') continue
      const node = data.nodes[nodeIndex++]

      const idProperty = findProperty(nodeNode, 'id', doc)
      const valueNode = idProperty?.lastChild
      const value = node?.id
      if (value == null || value === '') {
        diagnostics.push({
          from: valueNode ? valueNode.from : nodeNode.from,
          to: valueNode ? valueNode.to : nodeNode.to,
          severity: 'error',
          message: 'Node is missing an id'
        })
      }
    }
  }

  const linksArray = findProperty(root, 'links', doc)?.lastChild
  if (!linksArray || linksArray.name !== 'Array') return diagnostics

  let index = 0
  for (let linkNode = linksArray.firstChild; linkNode; linkNode = linkNode.nextSibling) {
    if (linkNode.name !== 'Object') continue
    const link = data.links[index++]

    const idProperty = findProperty(linkNode, 'id', doc)
    const idValueNode = idProperty?.lastChild
    if (link?.id == null || link.id === '') {
      diagnostics.push({
        from: idValueNode ? idValueNode.from : linkNode.from,
        to: idValueNode ? idValueNode.to : linkNode.to,
        severity: 'error',
        message: 'Link is missing an id'
      })
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

  return diagnostics
})
