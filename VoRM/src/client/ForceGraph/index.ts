import * as d3 from "d3"

import type { PlainNetworkGraphData } from "../../common/types/network"

import * as forceSim from "./simulation"
import * as rendering from "./rendering"
import { makeSubscription } from "./subscription"

const width = 4000
const height = 4000
const nodeR = 8

let simulation: any
let data: any
let selectedNodeId: string | null = null
let dataSnapshot: PlainNetworkGraphData = { nodes: [], links: [] }

const dataStore = makeSubscription()
const selectionStore = makeSubscription()

export const subscribeToData = dataStore.subscribe
export const subscribeToSelection = selectionStore.subscribe

export const getSelectedNodeId = () => selectedNodeId

export const getData = () => dataSnapshot

const computeDataSnapshot = (): PlainNetworkGraphData => ({
  nodes: (data?.nodes ?? []).map((n: any) => ({ id: n.id, label: n.label ?? n.id })),
  links: (data?.links ?? []).map((l: any) => ({
    id: l.id ?? `${l.source?.id ?? l.source}-${l.target?.id ?? l.target}`,
    label: l.label ?? l.id ?? `${l.source?.id ?? l.source}-${l.target?.id ?? l.target}`,
    source: l.source?.id ?? l.source,
    target: l.target?.id ?? l.target
  }))
})

const notifyDataChanged = () => {
  dataSnapshot = computeDataSnapshot()
  dataStore.notify()
}

export const initialize = (svgDOM: SVGSVGElement, viewWidth: number, viewHeight: number) => {

  ({ simulation, data } = forceSim.initialize(width, height))


  rendering.initialize(
    data,
    svgDOM,
    width,
    height,
    viewWidth,
    viewHeight
  )

  rendering.setOnNodeClick((id: string | null) => {
    selectedNodeId = id
    rendering.setSelectedNode(id)
    selectionStore.notify()
  })

    simulation.on("tick", () => {
      rendering.tick()
    })
}

export const resize = (viewWidth: number, viewHeight: number) => {
  rendering.resize(viewWidth, viewHeight)
}

export const stop = () => {
  simulation.stop()
}

//TODO: update to current spec
export const addNode = (nodename: string) => {
  data.nodes.push({
    id: nodename,
    label: nodename,
    nodeR: nodeR,
    index: data.nodes.length + 1,
    x: width / 2 + Math.random() * 100 - 50,
    y: height / 2 + Math.random() * 100 - 50,
    vx: 0,
    vy: 0
  })
  console.log(data)
  simulation.nodes(data.nodes)
  rendering.updateElements(data)
  simulation.alpha(1).restart()
  console.log(nodename, data.nodes)
  notifyDataChanged()
}

//TODO: update to current spec
export const addLink = (source: String, target: string, name?: string) => {
  if (!simulation) {
    return false
  }
  const sourceNode = data.nodes.find((d: any) => d.id === source)
  const targetNode = data.nodes.find((d: any) => d.id === target)

  if (!sourceNode || !targetNode) {
    console.log("Given nodenames didn't match", source, target)
    return false
  } else {
    console.log(data.links, source, sourceNode, target, targetNode)
    const linkName = name ?? `${source}-${target}`
    data.links.push({
      id: `${source}-${target}-${data.links.length}`,
      label: linkName,
      index: data.links.length,
      source: sourceNode,
      target: targetNode
    })

    simulation.nodes(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => (d as any).id).distance(50))
      .alpha(1)
      .restart()

    rendering.updateElements(data)
    notifyDataChanged()
  }
  return true
}

export const applyData = (newData: PlainNetworkGraphData) => {
  if (!simulation) {
    return
  }

  const existingNodesById = new Map<string, any>(data.nodes.map((n: any) => [n.id, n]))
  const validNodes = newData.nodes.filter(n => n.id != null)
  const nextIds = new Set(validNodes.map(n => n.id))
  const nodesChanged =
    data.nodes.length !== validNodes.length ||
    data.nodes.some((n: any) => !nextIds.has(n.id))

  const nextNodes = validNodes.map((n, i) => {
    const existing = existingNodesById.get(n.id)
    if (existing) {
      existing.label = n.label
      existing.index = i
      return existing
    }
    return {
      id: n.id,
      label: n.label,
      nodeR,
      index: i,
      x: width / 2 + Math.random() * 100 - 50,
      y: height / 2 + Math.random() * 100 - 50,
      vx: 0,
      vy: 0
    }
  })

  const nextNodesById = new Map<string, any>(nextNodes.map(n => [n.id, n]))

  const existingLinksById = new Map<string, any>(data.links.map((l: any) => [l.id, l]))
  const validLinks = newData.links.filter(l => nextNodesById.has(l.source) && nextNodesById.has(l.target))
  const validLinkIds = new Set(validLinks.map(l => l.id))
  const linksChanged =
    data.links.length !== validLinks.length ||
    data.links.some((l: any) => !validLinkIds.has(l.id))

  const nextLinks = validLinks.map((l, i) => {
    const sourceNode = nextNodesById.get(l.source)
    const targetNode = nextNodesById.get(l.target)
    const existing = existingLinksById.get(l.id)
    if (existing) {
      existing.label = l.label
      existing.index = i
      existing.source = sourceNode
      existing.target = targetNode
      return existing
    }
    return { id: l.id, label: l.label, index: i, source: sourceNode, target: targetNode }
  })

  data.nodes.length = 0
  data.nodes.push(...nextNodes)
  data.links.length = 0
  data.links.push(...nextLinks)

  simulation.nodes(data.nodes)
    .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(50))

  if (nodesChanged || linksChanged) {
    simulation.alpha(1).restart()
  }

  rendering.updateElements(data)

  // preserve authored (possibly dangling) links in the published snapshot so the
  // editor text isn't clobbered while a link's source/target is still being typed;
  // only the simulation/rendering-facing `data.links` above is filtered to valid links
  dataSnapshot = {
    nodes: nextNodes.map(n => ({ id: n.id, label: n.label ?? n.id })),
    links: newData.links.map(l => ({ id: l.id, label: l.label ?? l.id, source: l.source, target: l.target }))
  }
  dataStore.notify()
}

export const loadData = (newData: PlainNetworkGraphData) => {
  applyData(newData)
}

