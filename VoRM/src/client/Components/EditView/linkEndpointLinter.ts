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

export const linkEndpointLinter = (): Extension => linter(view => {
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

  const linksArray = findProperty(root, 'links', doc)?.lastChild
  if (!linksArray || linksArray.name !== 'Array') return diagnostics

  let index = 0
  for (let linkNode = linksArray.firstChild; linkNode; linkNode = linkNode.nextSibling) {
    if (linkNode.name !== 'Object') continue
    const link = data.links[index++]

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
