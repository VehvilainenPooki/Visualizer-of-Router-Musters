import * as d3 from 'd3';

type NodeDatum = d3.SimulationNodeDatum & {
  id: string;
};

type LinkDatum = {
  source: string;
  target: string;
};

 const InitForceGraph = ( width:number, height:number, nodeR:number ) => {
  const data = {
    nodes: [
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
      { id: "E" },
      { id: "F" },
      { id: "G" },
      { id: "H" },
      { id: "I" },
    ] as NodeDatum[],
    links: [
      { source: "A", target: "B" },
      { source: "A", target: "D" },
      { source: "B", target: "C" },
      { source: "B", target: "E" },
      { source: "C", target: "F" },
      { source: "D", target: "E" },
      { source: "D", target: "G" },
      { source: "E", target: "F" },
      { source: "E", target: "H" },
      { source: "F", target: "I" },
      { source: "G", target: "H" },
      { source: "H", target: "I" },
    ] as LinkDatum[]
  };

  function boundaryForceX(alpha: number) {
    for (const node of data.nodes) {
      if (node.x! < nodeR) {
        node.x = nodeR;
        node.vx = Math.abs(node.vx!) * 0.5;
      } else if (node.x! > width-nodeR) {
        node.x = width-nodeR;
        node.vx = -Math.abs(node.vx!) * 0.5;
      }
    }
  }

  function boundaryForceY(alpha: number) {
    for (const node of data.nodes) {
      if (node.y! < nodeR) {
        node.y = nodeR;
        node.vy = Math.abs(node.vy!) * 0.5;
      } else if (node.y! > height-nodeR) {
        node.y = height-nodeR;
        node.vy = -Math.abs(node.vy!) * 0.5;
      }
    }
  }

  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => (d as any).id).distance(50))
    .force("charge", d3.forceManyBody().strength(-300))
    //.force("x", d3.forceX(width / 2).strength(0.05))
    //.force("y", d3.forceY(height / 2).strength(0.05))
    .force("boundaryX", boundaryForceX)
    .force("boundaryY", boundaryForceY);

  return {
    simulation: simulation,
    data: data
  }
}

export default InitForceGraph