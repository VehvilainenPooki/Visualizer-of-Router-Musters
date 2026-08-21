import { type EditorState, type Extension, type Range, StateField, type Text } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { Decoration, type DecorationSet, EditorView, WidgetType } from '@codemirror/view'
import type { SyntaxNode } from '@lezer/common'
import { AllowStructuralChange } from './protectedJsonValues'
import { parseGraphData } from './graphDataUtils'

type ArrayKind = 'nodes' | 'links'
type GraphData = NonNullable<ReturnType<typeof parseGraphData>>

export interface PendingGraphDeletion {
  title: string
  removedItems: string[]
  apply: () => void
}

const findProperty = (objectNode: SyntaxNode, propertyName: string, doc: Text): SyntaxNode | null => {
  for (let child = objectNode.firstChild; child; child = child.nextSibling) {
    if (child.name !== 'Property') continue
    const nameNode = child.firstChild
    if (!nameNode || nameNode.name !== 'PropertyName') continue
    if (doc.sliceString(nameNode.from + 1, nameNode.to - 1) === propertyName) return child
  }
  return null
}

const describeNode = (node: any) => `Node "${node.label ?? node.id}"`
const describeLink = (link: any) => `Link "${link.label ?? link.id}" (${link.source} → ${link.target})`

const buildDeleteRequest = (view: EditorView, kind: ArrayKind, id: string): PendingGraphDeletion | null => {
  const data = parseGraphData(view.state.doc.toString())
  if (!data) return null

  const remove = (transform: (data: GraphData) => void) => () => {
    const fresh = parseGraphData(view.state.doc.toString())
    if (!fresh) return
    transform(fresh)
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: JSON.stringify(fresh, null, 2) },
      annotations: AllowStructuralChange.of(true)
    })
  }

  if (kind === 'nodes') {
    const node = data.nodes.find((n: any) => n.id === id)
    if (!node) return null
    const affectedLinks = data.links.filter((l: any) => l.source === id || l.target === id)
    return {
      title: `Delete node "${node.label ?? node.id}"?`,
      removedItems: [describeNode(node), ...affectedLinks.map(describeLink)],
      apply: remove(fresh => {
        fresh.nodes = fresh.nodes.filter((n: any) => n.id !== id)
        fresh.links = fresh.links.filter((l: any) => l.source !== id && l.target !== id)
      })
    }
  }

  const link = data.links.find((l: any) => l.id === id)
  if (!link) return null
  return {
    title: `Delete link "${link.label ?? link.id}"?`,
    removedItems: [describeLink(link)],
    apply: remove(fresh => {
      fresh.links = fresh.links.filter((l: any) => l.id !== id)
    })
  }
}

class DeleteWidget extends WidgetType {
  constructor(
    private readonly kind: ArrayKind,
    private readonly id: string,
    private readonly onRequestDelete: (request: PendingGraphDeletion) => void
  ) {
    super()
  }

  eq(other: DeleteWidget) {
    return other.kind === this.kind && other.id === this.id
  }

  toDOM(view: EditorView) {
    const wrap = document.createElement('span')
    wrap.className = 'cm-graph-gap cm-graph-delete-gap'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'cm-graph-gap-button cm-graph-delete-button'
    button.textContent = '-'
    button.title = this.kind === 'nodes' ? 'Delete node' : 'Delete link'
    button.addEventListener('mousedown', e => e.preventDefault())
    button.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      const request = buildDeleteRequest(view, this.kind, this.id)
      if (request) this.onRequestDelete(request)
    })

    wrap.appendChild(button)
    return wrap
  }

  ignoreEvent() {
    return true
  }
}

export const graphDeleteButtons = (onRequestDelete: (request: PendingGraphDeletion) => void): Extension => {
  const buildDeleteGaps = (state: EditorState): DecorationSet => {
    const doc = state.doc
    const root = syntaxTree(state).topNode.firstChild
    if (!root || root.name !== 'Object') return Decoration.none

    const widgets: Range<Decoration>[] = []

    for (const kind of ['nodes', 'links'] as const) {
      const array = findProperty(root, kind, doc)?.lastChild
      if (!array || array.name !== 'Array') continue

      for (let child = array.firstChild; child; child = child.nextSibling) {
        if (child.name !== 'Object') continue
        const idNode = findProperty(child, 'id', doc)?.lastChild
        if (!idNode || idNode.name !== 'String') continue
        const id = doc.sliceString(idNode.from + 1, idNode.to - 1)
        // place right after the opening "{" - free space on that line, doesn't shift the bracket
        widgets.push(
          Decoration.widget({ widget: new DeleteWidget(kind, id, onRequestDelete), side: 1 }).range(child.from + 1)
        )
      }
    }

    widgets.sort((a, b) => a.from - b.from)
    return Decoration.set(widgets, true)
  }

  const deleteField = StateField.define<DecorationSet>({
    create: buildDeleteGaps,
    update: (deco, tr) => (tr.docChanged ? buildDeleteGaps(tr.state) : deco),
    provide: field => EditorView.decorations.from(field)
  })

  return [
    deleteField,
    EditorView.baseTheme({
      '.cm-graph-gap': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle'
      },
      '.cm-graph-delete-gap': {
        marginLeft: '6px'
      },
      '.cm-graph-gap-button': {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        border: 'none',
        background: '#8a8f98',
        color: 'white',
        fontSize: '11px',
        lineHeight: '1',
        cursor: 'pointer',
        padding: '0',
        transition: 'background 120ms ease'
      },
      '.cm-graph-gap-button.cm-graph-delete-button:hover, .cm-graph-gap-button.cm-graph-delete-button:focus-visible': {
        background: '#e03131'
      }
    })
  ]
}
