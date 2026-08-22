import { type EditorState, type Extension, type Range, StateField, type Text } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import { Decoration, type DecorationSet, EditorView, WidgetType } from '@codemirror/view'
import type { SyntaxNode } from '@lezer/common'
import { AllowStructuralChange } from './protectedJsonValues'
import { nextUniqueId, parseGraphData } from './graphDataUtils'
import * as ForceGraph from '../../../ForceGraph'

type ArrayKind = 'nodes' | 'links'

const findProperty = (objectNode: SyntaxNode, propertyName: string, doc: Text): SyntaxNode | null => {
  for (let child = objectNode.firstChild; child; child = child.nextSibling) {
    if (child.name !== 'Property') continue
    const nameNode = child.firstChild
    if (!nameNode || nameNode.name !== 'PropertyName') continue
    if (doc.sliceString(nameNode.from + 1, nameNode.to - 1) === propertyName) return child
  }
  return null
}

const newNode = (data: any, externalIds: string[] = []) => {
  const id = nextUniqueId('node', new Set([...data.nodes.map((n: any) => n.id), ...externalIds]))
  return { id, label: id }
}

const newLink = (data: any, externalIds: string[] = [], source = '') => {
  const id = nextUniqueId('link', new Set([...data.links.map((l: any) => l.id), ...externalIds]))
  return { id, label: id, source, target: '' }
}

const insertAt = (
  view: EditorView,
  kind: ArrayKind,
  insertIndex: number,
  selectedNodeId?: string
) => {
  const data = parseGraphData(view.state.doc.toString())
  if (!data) return

  // always read ids fresh from the live graph rather than the (possibly stale)
  // externalIds captured when this widget's decorations were last built, so a
  // rapid second click can't reuse an id the first click already committed
  const fullData = ForceGraph.getData()
  const externalIds = {
    nodes: fullData.nodes.filter(n => n.id !== selectedNodeId).map(n => n.id),
    links: fullData.links.filter(l => l.source !== selectedNodeId && l.target !== selectedNodeId).map(l => l.id)
  }

  if (kind === 'nodes') {
    const node = newNode(data, externalIds?.nodes)
    data.nodes.splice(insertIndex, 0, node)
    if (selectedNodeId) {
      const link = newLink(data, externalIds?.links, selectedNodeId)
      link.target = node.id
      data.links.push(link)
    }
  } else {
    const link = newLink(data, externalIds?.links, selectedNodeId ?? '')
    data.links.splice(insertIndex, 0, link)
  }

  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: JSON.stringify(data, null, 2) },
    annotations: AllowStructuralChange.of(true)
  })
}

class AddWidget extends WidgetType {
  constructor(
    private readonly kind: ArrayKind,
    private readonly insertIndex: number,
    private readonly selectedNodeId?: string
  ) {
    super()
  }

  eq(other: AddWidget) {
    return (
      other.kind === this.kind &&
      other.insertIndex === this.insertIndex &&
      other.selectedNodeId === this.selectedNodeId
    )
  }

  toDOM(view: EditorView) {
    const wrap = document.createElement('span')
    wrap.className = 'cm-graph-gap cm-graph-add-gap'

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'cm-graph-gap-button cm-graph-add-button'
    button.textContent = '+'
    button.title = this.kind === 'nodes' ? 'Add node here' : 'Add link here'
    button.addEventListener('mousedown', e => e.preventDefault())
    button.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      insertAt(view, this.kind, this.insertIndex, this.selectedNodeId)
    })

    wrap.appendChild(button)
    return wrap
  }

  ignoreEvent() {
    return true
  }
}

const buildAdditions = (
  state: EditorState,
  selectedNodeId?: string
): DecorationSet => {
  const doc = state.doc
  const root = syntaxTree(state).topNode.firstChild
  if (!root || root.name !== 'Object') return Decoration.none

  const widgets: Range<Decoration>[] = []

  for (const kind of ['nodes', 'links'] as const) {
    const array = findProperty(root, kind, doc)?.lastChild
    if (!array || array.name !== 'Array') continue

    const items: SyntaxNode[] = []
    for (let child = array.firstChild; child; child = child.nextSibling) {
      if (child.name === 'Object') items.push(child)
    }

    if (items.length === 0) {
      widgets.push(
        Decoration.widget({ widget: new AddWidget(kind, 0, selectedNodeId), side: 1 }).range(array.from + 1)
      )
      continue
    }

    items.forEach((item, i) => {
      // place the widget after a trailing comma, if there is one, so "}," stays together and "+" follows it
      const comma = item.nextSibling && item.nextSibling.name === ',' ? item.nextSibling : null
      const pos = comma ? comma.to : item.to
      widgets.push(
        Decoration.widget({ widget: new AddWidget(kind, i + 1, selectedNodeId), side: 1 }).range(pos)
      )
    })
  }

  widgets.sort((a, b) => a.from - b.from)
  return Decoration.set(widgets, true)
}

const additionField = (selectedNodeId?: string) =>
  StateField.define<DecorationSet>({
    create: state => buildAdditions(state, selectedNodeId),
    update: (deco, tr) => (tr.docChanged ? buildAdditions(tr.state, selectedNodeId) : deco),
    provide: field => EditorView.decorations.from(field)
  })

export const graphAddButtons = (selectedNodeId?: string): Extension => [
  additionField(selectedNodeId),
  EditorView.baseTheme({
    '.cm-graph-gap': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle'
    },
    '.cm-graph-add-gap': {
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
    '.cm-graph-gap-button.cm-graph-add-button:hover, .cm-graph-gap-button.cm-graph-add-button:focus-visible': {
      background: '#228be6'
    }
  })
]
