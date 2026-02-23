import * as d3 from "d3"

export interface NetworkNode extends d3.SimulationNodeDatum {
  id: string
  nodeR: number
  index: number
}

export interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  index: number
}

export interface NetworkGraphData {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

export type NetworkSimulation = d3.Simulation<NetworkNode, NetworkLink>
