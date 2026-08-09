import { EditorState, type Extension } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { ExternalChange } from '@uiw/react-codemirror'

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
    if (!transaction.docChanged || transaction.annotation(ExternalChange)) return transaction

    let allowed = true
    transaction.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
      if (!isEditableRange(transaction.startState, fromA, toA, inserted.toString())) allowed = false
    })

    return allowed ? transaction : []
  })
]
