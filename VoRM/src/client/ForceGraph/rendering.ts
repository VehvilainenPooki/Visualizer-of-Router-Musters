import * as d3 from "d3"

import * as simulation from "./simulation"

let nodeSelection: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>
let textSelection: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>
let linkSelection: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>

export const initialize = (
  data: any,
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

  linkSelection = svg.append("g")
    .attr("class", "links")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")

    nodeSelection = svg.append("g")
    .attr("class", "nodes")
    .attr("stroke", "#000000")
    .attr("stroke-width", 1.5)
    .selectAll("circle")


  textSelection = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")


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
}

export const updateElements = (data) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10)
  console.log(data)

  nodeSelection = nodeSelection.data(data.nodes)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.nodeR)
    .attr("fill", (d: any) => color(d.group || 0))
    .call(d3.drag<any, any, any>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))

  textSelection = textSelection.data(data.nodes)
    .join("text")
    .text((d: any) => d.id)
    .attr("font-size", "12px")
    .attr("dx", 12)
    .attr("dy", 4)

  linkSelection = linkSelection.data(data.links)
    .join("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke-width", 1)
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