import * as d3 from "d3";

export const InitSvgElements = (
  data: any,
  svgRef: React.RefObject<SVGSVGElement | null>,
  width: number,
  height: number,
  nodeR: number,
  dragstarted: (event: d3.D3DragEvent<SVGCircleElement, any, any>) => void,
  dragged: (event: d3.D3DragEvent<SVGCircleElement, any, any>) => void,
  dragended: (event: d3.D3DragEvent<SVGCircleElement, any, any>) => void
) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  d3.select(svgRef.current).selectAll("*").remove();

  const svg = d3.select(svgRef.current)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(data.links)
    .join("line")
    .attr("stroke-width", 1);

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(data.nodes)
    .join("circle")
    .attr("r", nodeR)
    .attr("fill", (d: any) => color(d.group || 0))
    .call(d3.drag<any, any, any>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  const text = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data.nodes)
    .join("text")
    .text((d: any) => d.id)
    .attr("font-size", "12px")
    .attr("dx", 12)
    .attr("dy", 4);

  return {
    link,
    node,
    text
  };
};

export const UpdateSvgElements = (
  link: d3.Selection<d3.BaseType | SVGLineElement, any, SVGGElement, any>,
  node: d3.Selection<d3.BaseType | SVGCircleElement, any, SVGGElement, any>,
  text: d3.Selection<d3.BaseType | SVGTextElement, any, SVGGElement, any>
) => {
  link
    .attr("x1", (d: any) => d.source.x)
    .attr("y1", (d: any) => d.source.y)
    .attr("x2", (d: any) => d.target.x)
    .attr("y2", (d: any) => d.target.y);

  node
    .attr("cx", (d: any) => d.x)
    .attr("cy", (d: any) => d.y);

  text
    .attr("x", (d: any) => d.x)
    .attr("y", (d: any) => d.y);
};