import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import InitForceGraph from "./initForceGraph";
import { InitSvgElements, UpdateSvgElements } from "./renderGraph";

interface Node {
  id: string;
  group?: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const ForceGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRef = useRef<d3.Selection<d3.BaseType | SVGCircleElement, any, SVGGElement, any>>(null);
  const linkRef = useRef<d3.Selection<d3.BaseType | SVGLineElement, any, SVGGElement, any>>(null);
  const textRef = useRef<d3.Selection<d3.BaseType | SVGTextElement, any, SVGGElement, any>>(null);

  const width = 928;
  const height = 600;
  const nodeR = 8;
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  const { simulation, data } = InitForceGraph(width, height, nodeR);
  
  const dragstarted = (event: d3.D3DragEvent<SVGCircleElement, Node, any>) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  };
  const dragged = (event: d3.D3DragEvent<SVGCircleElement, Node, any>) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  };
  const dragended = (event: d3.D3DragEvent<SVGCircleElement, Node, any>) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  };

  useEffect(() => {
    const { link, node, text } = InitSvgElements(
      data,
      svgRef,
      width,
      height,
      nodeR,
      dragstarted,
      dragged,
      dragended
    );
    nodeRef.current = node;
    linkRef.current = link;
    textRef.current = text;
    
    simulation.on("tick", () => {
      UpdateSvgElements(linkRef, nodeRef, textRef);
    });

    return () => {
      simulation.stop();
    };
  }, []);


  const handleAddNode = (event: React.SubmitEvent) => {
    event.preventDefault();
    const nodeName = event.target.nodename.value;

    data.nodes.push({
      id: nodeName,
      index: data.nodes.length,
      x: width / 2 + Math.random() * 100 - 50,
      y: height / 2 + Math.random() * 100 - 50,
      vx: 0,
      vy: 0
    })

    simulation.nodes(data.nodes);

    const nodeSelection = nodeRef.current!.data(data.nodes, (d: any) => d.id);
    const newNode = nodeSelection.enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y) 
      .attr("r", nodeR)
      .attr("fill", (d: any) => color(d.group || 0))
      .call(d3.drag<any, any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    nodeRef.current = nodeSelection.merge(newNode)

    const textSelection = textRef.current!.data(data.nodes, (d: any) => d.id);
    const newText = textSelection.enter()
      .append("text")
      .text((d: any) => d.id)
      .attr("font-size", "12px")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("dx", 12)
      .attr("dy", 4);
    textRef.current = textSelection.merge(newText)

    console.log(nodeName, data.nodes)
  }

  return (
    <div>
      <form onSubmit={handleAddNode}>
        <input name="nodename"></input>
        <button type="submit">add Node</button>
      </form>
      <br></br>
      <svg ref={svgRef} />
    </div>
  );
};

export default ForceGraph;
