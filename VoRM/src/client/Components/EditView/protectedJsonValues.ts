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

export const protectedJsonValues = (): Extension => [
  json(),
  EditorState.transactionFilter.of(transaction => {
    if (!transaction.docChanged || transaction.annotation(ExternalChange) || transaction.annotation(AllowStructuralChange)) return transaction

    let allowed = true
    transaction.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
      if (!isEditableRange(transaction.startState, fromA, toA, inserted.toString())) allowed = false
    })

    return allowed ? transaction : []
  })
]
