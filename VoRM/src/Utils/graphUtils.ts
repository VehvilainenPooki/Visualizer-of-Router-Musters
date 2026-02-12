import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

export const createSimulation = (nodes: Node[], links: Link[]) => {
  return d3.forceSimulation<Node>(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
};
