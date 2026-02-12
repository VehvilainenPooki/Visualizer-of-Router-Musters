import * as d3 from 'd3';

 const InitForceGraph = ( width:number, height:number, nodeR:number ) => {
  // Sample data
  const data = {
    nodes: [
      { id: "A" },
      { id: "B" },
      { id: "C" },
      { id: "D" },
      { id: "E" },
      { id: "F" }
    ],
    links: [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
      { source: "C", target: "D" },
      { source: "D", target: "E" },
      { source: "B", target: "E" },
      { source: "E", target: "F" },
      { source: "A", target: "F" },
      { source: "C", target: "F" },
      { source: "D", target: "A" }
    ]
  };

  // Add this custom boundary force function instead of the simple ones above:
  function boundaryForceX(alpha: number) {
    for (const node of data.nodes) {
      if (node.x < nodeR) {
        node.x = nodeR;
        node.vx = Math.abs(node.vx) * 0.5; // Bounce effect
      } else if (node.x > width-nodeR) {
        node.x = width-nodeR;
        node.vx = -Math.abs(node.vx) * 0.5; // Bounce effect
      }
    }
  }

  function boundaryForceY(alpha: number) {
    for (const node of data.nodes) {
      if (node.y < nodeR) {
        node.y = nodeR;
        node.vy = Math.abs(node.vy) * 0.5; // Bounce effect
      } else if (node.y > height-nodeR) {
        node.y = height-nodeR;
        node.vy = -Math.abs(node.vy) * 0.5; // Bounce effect
      }
    }
  }

  // Create simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => (d as any).id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    // Boundary forces - keep nodes within canvas
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