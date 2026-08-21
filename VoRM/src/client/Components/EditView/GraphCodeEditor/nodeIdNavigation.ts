import { type Extension, StateEffect, StateField } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view'
import * as ForceGraph from '../../../ForceGraph'

type Match = { from: number; to: number; id: string; color: string }

const setHighlight = StateEffect.define<Match | null>()

const highlightField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    for (const effect of tr.effects) {
      if (!effect.is(setHighlight)) continue
      if (!effect.value) return Decoration.none
      const { from, to, id, color } = effect.value
      return Decoration.set([
        Decoration.mark({
          class: 'cm-node-id-link',
          attributes: {
            title: `Select "${id}" node`,
            style: `text-decoration-color: ${color}`
          }
        }).range(from, to)
      ])
    }
    return deco.map(tr.changes)
  },
  provide: field => EditorView.decorations.from(field)
})

// the highlighted token's color lives on a span nested inside our own decoration,
// so `currentColor` at our span would resolve to the default text color instead;
// read the token's actual rendered color and set it explicitly
const colorAtPos = (view: EditorView, pos: number): string => {
  const { node } = view.domAtPos(pos)
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement
  return el ? getComputedStyle(el).color : 'currentColor'
}

const findNodeIdStringAt = (view: EditorView, pos: number): Match | null => {
  let node = syntaxTree(view.state).resolveInner(pos, -1)
  if (node.name !== 'String') node = syntaxTree(view.state).resolveInner(pos, 1)
  if (node.name !== 'String') return null

  const from = node.from + 1
  const to = node.to - 1
  if (pos < from || pos > to) return null

  const id = view.state.sliceDoc(from, to)
  const nodeIds = ForceGraph.getData().nodes.map(n => String(n.id))
  if (!nodeIds.includes(id)) return null

  return { from, to, id, color: colorAtPos(view, from) }
}

export const nodeIdNavigation = (): Extension => {
  let lastX = 0
  let lastY = 0

  const clear = (view: EditorView) => {
    if (view.state.field(highlightField).size) view.dispatch({ effects: setHighlight.of(null) })
  }

  const refresh = (view: EditorView) => {
    const pos = view.posAtCoords({ x: lastX, y: lastY })
    const match = pos == null ? null : findNodeIdStringAt(view, pos)
    view.dispatch({ effects: setHighlight.of(match) })
  }

  return [
    highlightField,
    EditorView.domEventHandlers({
      mousemove: (event, view) => {
        lastX = event.clientX
        lastY = event.clientY
        if (event.ctrlKey || event.metaKey) refresh(view)
        else clear(view)
        return false
      },
      keydown: (event, view) => {
        if (event.key === 'Control' || event.key === 'Meta') refresh(view)
        return false
      },
      keyup: (event, view) => {
        if (event.key === 'Control' || event.key === 'Meta') clear(view)
        return false
      },
      mouseleave: (_event, view) => {
        clear(view)
        return false
      },
      blur: (_event, view) => {
        clear(view)
        return false
      },
      mousedown: (event, view) => {
        if (!(event.ctrlKey || event.metaKey)) return false
        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
        const match = pos == null ? null : findNodeIdStringAt(view, pos)
        if (!match) return false

        event.preventDefault()
        clear(view)
        ForceGraph.selectNode(match.id)
        return true
      }
    }),
    EditorView.baseTheme({
      '.cm-node-id-link': {
        textDecoration: 'underline',
        cursor: 'pointer'
      }
    })
  ]
}
