import * as d3 from "d3"

import type { NetworkGraphData, NetworkNode, NetworkLink } from "../../common/types/network"

import * as simulation from "./simulation"

let nodeSelection: d3.Selection<d3.BaseType, NetworkNode, SVGGElement, unknown>
let textSelection: d3.Selection<d3.BaseType, NetworkNode, SVGGElement, unknown>
let linkSelection: d3.Selection<d3.BaseType, NetworkLink, SVGGElement, unknown>
let linkLabelSelection: d3.Selection<d3.BaseType, NetworkLink, SVGGElement, unknown>

const color = d3.scaleOrdinal(d3.schemeCategory10)
const SELECTED_STROKE = d3.schemeCategory10[3]
const SELECTED_FILL = d3.schemeCategory10[1]

const CLICK_MAX_DISTANCE_PX = 5
const CLICK_MAX_DURATION_MS = 300
let backgroundPointerDown: { x: number, y: number, time: number } | null = null
let selectedNodeId: string | null = null
let onNodeClick: (id: string | null) => void = () => {}

export const setOnNodeClick = (cb: (id: string | null) => void) => {
  onNodeClick = cb
}

export const setSelectedNode = (id: string | null) => {
  selectedNodeId = id
  if (nodeSelection) {
    nodeSelection
      .attr("stroke", (d: any) => d.id === selectedNodeId ? SELECTED_STROKE : "#000000")
      .attr("stroke-width", (d: any) => d.id === selectedNodeId ? 3 : 1.5)
      .attr("fill", (d: any) => d.id === selectedNodeId ? SELECTED_FILL : color(d.group || 0))
  }
}

export const initialize = (
  data: NetworkGraphData,
  svgDOM: SVGSVGElement,
  width: number,
  height: number
) => {
  d3.select(svgDOM).selectAll("*").remove()

  const svg = d3.select(svgDOM)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;")
    .on("mousedown", (event: MouseEvent) => {
      backgroundPointerDown = { x: event.clientX, y: event.clientY, time: Date.now() }
    })
    .on("mouseup", (event: MouseEvent) => {
      if (!backgroundPointerDown) return
      const dx = event.clientX - backgroundPointerDown.x
      const dy = event.clientY - backgroundPointerDown.y
      const distance = Math.hypot(dx, dy)
      const duration = Date.now() - backgroundPointerDown.time
      backgroundPointerDown = null
      if (distance <= CLICK_MAX_DISTANCE_PX && duration <= CLICK_MAX_DURATION_MS) {
        onNodeClick(null)
      }
    })

  linkSelection = svg.append("g")
    .attr("class", "links")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll<d3.BaseType, NetworkLink>("line")

    nodeSelection = svg.append("g")
    .attr("class", "nodes")
    .attr("stroke", "#000000")
    .attr("stroke-width", 1.5)
    .selectAll<d3.BaseType, NetworkNode>("circle")


  textSelection = svg.append("g")
    .attr("class", "labels")
    .style("user-select", "none")
    .style("pointer-events", "none")
    .selectAll<d3.BaseType, NetworkNode>("text")

  linkLabelSelection = svg.append("g")
    .attr("class", "link-labels")
    .style("user-select", "none")
    .style("pointer-events", "none")
    .selectAll<d3.BaseType, NetworkLink>("text")


    updateElements(data)
}

export const tick = () => {
  linkSelection!
    .attr("x1", (d: any) => d.source.x)
    .attr("y1", (d: any) => d.source.y)
    .attr("x2", (d: any) => d.target.x)
    .attr("y2", (d: any) => d.target.y)

  nodeSelection!
    .attr("cx", (d: any) => d.x)
    .attr("cy", (d: any) => d.y)

  textSelection!
    .attr("x", (d: any) => d.x)
    .attr("y", (d: any) => d.y)

  linkLabelSelection!
    .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
    .attr("y", (d: any) => (d.source.y + d.target.y) / 2)
}

export const updateElements = (data: NetworkGraphData) => {
  console.log(data)

  nodeSelection = nodeSelection.data(data.nodes)
    .join("circle")
    .attr("cx", (d: any) => d.x)
    .attr("cy", (d: any) => d.y)
    .attr("r", (d: any) => d.nodeR)
    .attr("fill", (d: any) => d.id === selectedNodeId ? SELECTED_FILL : color(d.group || 0))
    .attr("stroke", (d: any) => d.id === selectedNodeId ? SELECTED_STROKE : "#000000")
    .attr("stroke-width", (d: any) => d.id === selectedNodeId ? 3 : 1.5)
    .call(d3.drag<any, any, any>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .on("click", (event: MouseEvent, d: any) => {
      event.stopPropagation()
      onNodeClick(d.id === selectedNodeId ? null : d.id)
    })

  textSelection = textSelection.data(data.nodes)
    .join("text")
    .text((d: any) => d.label ?? d.id)
    .attr("font-size", "12px")
    .attr("dx", 12)
    .attr("dy", 4)

  linkSelection = linkSelection.data(data.links)
    .join("line")
    .attr("x1", (d: any) => d.source.x)
    .attr("y1", (d: any) => d.source.y)
    .attr("x2", (d: any) => d.target.x)
    .attr("y2", (d: any) => d.target.y)
    .attr("stroke-width", 1)

  linkLabelSelection = linkLabelSelection.data(data.links)
    .join("text")
    .text((d: any) => d.label ?? d.id)
    .attr("font-size", "10px")
    .attr("fill", "#666")
    .attr("text-anchor", "middle")
}

const dragstarted = (event: d3.D3DragEvent<SVGCircleElement, any, any>) => {
  if (!event.active) simulation.restart(0.3)
  event.subject.fx = event.subject.x
  event.subject.fy = event.subject.y
}
const dragged = (event: d3.D3DragEvent<SVGCircleElement, any, any>) => {
  event.subject.fx = event.x
  event.subject.fy = event.y
}
const dragended = (event: d3.D3DragEvent<SVGCircleElement, any, any>) => {
  if (!event.active) simulation.restart(0)
  event.subject.fx = null
  event.subject.fy = null
}