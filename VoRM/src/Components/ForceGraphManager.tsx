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

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 928;
    const height = 600;
    const nodeR = 8;

    const { simulation, data } = InitForceGraph(width, height, nodeR);

    // Drag functions
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

    // Initialize SVG elements
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

    // Simulation tick
    simulation.on("tick", () => {
      UpdateSvgElements(link, node, text);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
};

export default ForceGraph;