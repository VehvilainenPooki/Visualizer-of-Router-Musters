import * as d3 from "d3"

import type { PlainNetworkGraphData } from "../../common/types/network"

import * as forceSim from "./simulation"
import * as rendering from "./rendering"

const width = 928
const height = 600
const nodeR = 8

let simulation: any
let data: any
let selectedNodeId: string | null = null

const subscribers: Array<() => void> = []

export const subscribe = (cb: () => void) => { subscribers.push(cb) }

const notify = () => subscribers.forEach(cb => cb())

export const getData = (): PlainNetworkGraphData => ({
  nodes: (data?.nodes ?? []).map((n: any) => ({ id: n.id, name: n.name ?? n.id })),
  links: (data?.links ?? []).map((l: any) => ({
    id: l.id ?? `${l.source?.id ?? l.source}-${l.target?.id ?? l.target}`,
    name: l.name ?? l.id ?? `${l.source?.id ?? l.source}-${l.target?.id ?? l.target}`,
    source: l.source?.id ?? l.source,
    target: l.target?.id ?? l.target
  }))
})

export const initialize = (svgDOM: SVGSVGElement) => {

  ({ simulation, data } = forceSim.initialize(width, height))


  rendering.initialize(
    data,
    svgDOM,
    width,
    height
  )

  rendering.setOnNodeClick((id: string | null) => {
    selectedNodeId = id
    rendering.setSelectedNode(id)
  })

    simulation.on("tick", () => {
      rendering.tick()
    })
}

export const stop = () => {
  simulation.stop()
}

export const addNode = (nodename: string) => {
  data.nodes.push({
    id: nodename,
    name: nodename,
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
  notify()
}

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
      name: linkName,
      index: data.links.length,
      source: sourceNode,
      target: targetNode
    })

    simulation.nodes(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => (d as any).id).distance(50))
      .alpha(1)
      .restart()

    rendering.updateElements(data)
    notify()
  }
  return true
}

export const loadData = (newData: PlainNetworkGraphData) => {
  if (!simulation) {
    return
  }

  data.nodes.length = 0
  data.links.length = 0

  newData.nodes.forEach((n, i) => {
    data.nodes.push({
      id: n.id,
      name: n.name,
      nodeR,
      index: i,
      x: width / 2 + Math.random() * 100 - 50,
      y: height / 2 + Math.random() * 100 - 50,
      vx: 0,
      vy: 0
    })
  })

  newData.links.forEach((l, i) => {
    const sourceNode = data.nodes.find((d: any) => d.id === l.source)
    const targetNode = data.nodes.find((d: any) => d.id === l.target)
    if (!sourceNode || !targetNode) {
      return
    }
    data.links.push({ id: l.id, name: l.name, index: i, source: sourceNode, target: targetNode })
  })

  simulation.nodes(data.nodes)
    .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(50))
    .alpha(1)
    .restart()

  rendering.updateElements(data)
  notify()
}

