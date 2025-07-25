import { GraphNode, GraphEdge, AlgorithmStep } from './graph-types';

export function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>();
  
  // Initialize all nodes
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });
  
  // Add edges
  edges.forEach(edge => {
    adjacencyList.get(edge.from)?.push(edge.to);
    adjacencyList.get(edge.to)?.push(edge.from); // Undirected graph
  });
  
  return adjacencyList;
}

export function bfsTraversal(
  nodes: GraphNode[], 
  edges: GraphEdge[], 
  startNodeId: string
): AlgorithmStep[] {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  const steps: AlgorithmStep[] = [];
  
  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    
    if (visited.has(currentNodeId)) continue;
    
    visited.add(currentNodeId);
    steps.push({
      nodeId: currentNodeId,
      action: 'visit',
      queue: [...queue]
    });
    
    const neighbors = adjacencyList.get(currentNodeId) || [];
    neighbors.forEach(neighborId => {
      if (!visited.has(neighborId) && !queue.includes(neighborId)) {
        queue.push(neighborId);
      }
    });
    
    steps.push({
      nodeId: currentNodeId,
      action: 'complete',
      queue: [...queue]
    });
  }
  
  return steps;
}

export function dfsTraversal(
  nodes: GraphNode[], 
  edges: GraphEdge[], 
  startNodeId: string
): AlgorithmStep[] {
  const adjacencyList = buildAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  const stack: string[] = [startNodeId];
  const steps: AlgorithmStep[] = [];
  
  while (stack.length > 0) {
    const currentNodeId = stack.pop()!;
    
    if (visited.has(currentNodeId)) continue;
    
    visited.add(currentNodeId);
    steps.push({
      nodeId: currentNodeId,
      action: 'visit',
      stack: [...stack]
    });
    
    const neighbors = adjacencyList.get(currentNodeId) || [];
    // Add neighbors in reverse order to maintain left-to-right traversal
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighborId = neighbors[i];
      if (!visited.has(neighborId) && !stack.includes(neighborId)) {
        stack.push(neighborId);
      }
    }
    
    steps.push({
      nodeId: currentNodeId,
      action: 'complete',
      stack: [...stack]
    });
  }
  
  return steps;
}
