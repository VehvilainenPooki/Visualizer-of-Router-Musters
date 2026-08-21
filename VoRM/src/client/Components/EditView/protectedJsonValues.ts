import { Annotation, EditorState, type Extension } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { ExternalChange } from '@uiw/react-codemirror'

// Marks a programmatic edit (e.g. inserting a node/link via a gap button) that
// restructures the JSON, so it can skip the string-only edit restriction below
// while still running through onChange like a normal edit.
export const AllowStructuralChange = Annotation.define<boolean>()

const breaksStringValue = /["\\]/

const isEditableRange = (state: EditorState, from: number, to: number, inserted: string) => {
  let node = syntaxTree(state).resolveInner(from, 1)
  while (node && (node.from > from || node.to < to)) {
    node = node.parent as typeof node
  }
  if (!node || node.name !== 'String') return false

  return from > node.from && to < node.to && !breaksStringValue.test(inserted)
}

// When the editor shows only one selected node, its "id" value node is
// off-limits so a rename can't desync the node from the selection that
// scoped the editor to it in the first place.
const findSelectedNodeIdRange = (state: EditorState, selectedNodeId: string): [number, number] | null => {
  const root = syntaxTree(state).topNode.firstChild
  if (!root || root.name !== 'Object') return null

  for (let child = root.firstChild; child; child = child.nextSibling) {
    if (child.name !== 'Property') continue
    const nameNode = child.firstChild
    if (!nameNode || nameNode.name !== 'PropertyName') continue
    if (state.doc.sliceString(nameNode.from + 1, nameNode.to - 1) !== 'nodes') continue

    const nodesArray = child.lastChild
    if (!nodesArray || nodesArray.name !== 'Array') return null

    for (let nodeNode = nodesArray.firstChild; nodeNode; nodeNode = nodeNode.nextSibling) {
      if (nodeNode.name !== 'Object') continue
      for (let prop = nodeNode.firstChild; prop; prop = prop.nextSibling) {
        if (prop.name !== 'Property') continue
        const propName = prop.firstChild
        if (!propName || propName.name !== 'PropertyName') continue
        if (state.doc.sliceString(propName.from + 1, propName.to - 1) !== 'id') continue

        const valueNode = prop.lastChild
        if (!valueNode || state.doc.sliceString(valueNode.from + 1, valueNode.to - 1) !== selectedNodeId) continue
        return [valueNode.from, valueNode.to]
      }
    }
    return null
  }
  return null
}

export const protectedJsonValues = (selectedNodeId?: string): Extension => [
  json(),
  EditorState.transactionFilter.of(transaction => {
    if (!transaction.docChanged || transaction.annotation(ExternalChange) || transaction.annotation(AllowStructuralChange)) return transaction

    const protectedIdRange = selectedNodeId ? findSelectedNodeIdRange(transaction.startState, selectedNodeId) : null

    let allowed = true
    transaction.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
      if (!isEditableRange(transaction.startState, fromA, toA, inserted.toString())) allowed = false
      if (protectedIdRange && fromA >= protectedIdRange[0] && toA <= protectedIdRange[1]) allowed = false
    })

    return allowed ? transaction : []
  })
]
