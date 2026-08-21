import { type Extension } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { autocompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete'
import * as ForceGraph from '../../ForceGraph'

const sourceOrTarget = (context: CompletionContext): CompletionResult | null => {
  let node = syntaxTree(context.state).resolveInner(context.pos, -1)
  if (node.name !== 'String') node = syntaxTree(context.state).resolveInner(context.pos, 1)
  if (node.name !== 'String') return null

  const from = node.from + 1
  const to = node.to - 1
  if (context.pos < from || context.pos > to) return null

  const propertyName = node.parent?.firstChild
  if (!propertyName || propertyName.name !== 'PropertyName') return null

  const key = context.state.sliceDoc(propertyName.from + 1, propertyName.to - 1)
  if (key !== 'source' && key !== 'target') return null

  const nodeIds = ForceGraph.getData().nodes.map(n => String(n.id))

  return {
    from,
    to: context.pos,
    options: nodeIds.map(id => ({ label: id, type: 'text' })),
    validFor: /^[^"]*$/
  }
}

export const linkEndpointCompletion = (): Extension => autocompletion({ override: [sourceOrTarget] })
