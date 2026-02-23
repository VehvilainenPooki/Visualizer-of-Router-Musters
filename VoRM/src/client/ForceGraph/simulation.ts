import * as d3 from 'd3'

import type { NetworkGraphData, NetworkSimulation } from '../../common/types/network'

const data: NetworkGraphData = {
  nodes: [],
  links: []
}

let width: number
let height: number

let simulation: NetworkSimulation

export const initialize = ( canvasWidth:number, canvasHeight:number ) => {
  width = canvasWidth
  height = canvasHeight
  simulation = d3.forceSimulation(data.nodes)
  .force("link", d3.forceLink(data.links).id(d => (d as any).id).distance(50))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("boundaryX", boundaryForceX)
  .force("boundaryY", boundaryForceY)

  return {
    simulation: simulation,
    data: data
  }
}

export const restart = (alpha: number) => {
  if (!simulation) {
    return false
  }
  simulation.alphaTarget(alpha).restart()
  return true
}

const boundaryForceX = (alpha: number) => {
  for (const node of data.nodes) {
    if (node.x! < node.nodeR) {
      node.x = node.nodeR
      node.vx = Math.abs(node.vx!) * 0.5
    } else if (node.x! > width-node.nodeR) {
      node.x = width-node.nodeR
      node.vx = -Math.abs(node.vx!) * 0.5
    }
  }
}

const boundaryForceY = (alpha: number) => {
  for (const node of data.nodes) {
    if (node.y! < node.nodeR) {
      node.y = node.nodeR
      node.vy = Math.abs(node.vy!) * 0.5
    } else if (node.y! > height-node.nodeR) {
      node.y = height-node.nodeR
      node.vy = -Math.abs(node.vy!) * 0.5
    }
  }
}
