import * as d3 from "d3"

export interface NetworkNode extends d3.SimulationNodeDatum {
  id: string
  name?: string
  nodeR: number
  index: number
}

export interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  id?: string
  name?: string
  index: number
}

export interface NetworkGraphData {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

export type NetworkSimulation = d3.Simulation<NetworkNode, NetworkLink>

export interface PlainNetworkNode {
  id: string
  label: string
}

export interface PlainNetworkLink {
  id: string
  label: string
  source: string
  target: string
}

export interface PlainNetworkGraphData {
  nodes: PlainNetworkNode[]
  links: PlainNetworkLink[]
}
