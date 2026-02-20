import * as d3 from "d3"

import * as forceSim from "./simulation"
import * as rendering from "./rendering"

const width = 928
const height = 600
const nodeR = 8

let simulation: any
let data: any

export const initialize = (svgDOM: SVGSVGElement) => {

  ({ simulation, data } = forceSim.initialize(width, height))


  rendering.initialize(
    data,
    svgDOM,
    width,
    height
  )

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
}

export const addLink = (source: String, target: string) => {
  if (!simulation) {
    return false
  }
  const sourceNode = data.nodes.find(d => d.id === source)
  const targetNode = data.nodes.find(d => d.id === target)

  if (!sourceNode || !targetNode) {
    console.log("Given nodenames didn't match", source, target)
    return false
  } else {
    console.log(data.links, source, sourceNode, target, targetNode)
    data.links.push({
      index: data.links.length,
      source: sourceNode,
      target: targetNode
    })

    simulation.nodes(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => (d as any).id).distance(50))
      .alpha(1)
      .restart()

    rendering.updateElements(data)
  }
}

