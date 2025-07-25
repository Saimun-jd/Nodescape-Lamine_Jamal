// Graph Feature Extraction for ML Classification

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
  nextNodeId: number;
}

export interface GraphFeatures {
  nodeCount: number;
  edgeCount: number;
  density: number;
  avgDegree: number;
  maxDegree: number;
  minDegree: number;
  degreeVariance: number;
  hasLoops: number;
  cycleCount: number;
  longestPath: number;
  components: number;
  avgClusteringCoeff: number;
  diameter: number;
  radius: number;
  isConnected: number;
}

export interface GraphStructure {
  adjList: Map<string, Set<string>>;
  inDegree: Map<string, number>;
  outDegree: Map<string, number>;
  nodeCount: number;
  edgeCount: number;
}

export class GraphAnalyzer {
  private buildGraphStructure(graph: GraphData): GraphStructure {
    const adjList = new Map<string, Set<string>>();
    const inDegree = new Map<string, number>();
    const outDegree = new Map<string, number>();

    // Initialize nodes
    for (const node of graph.nodes) {
      adjList.set(node.id, new Set<string>());
      inDegree.set(node.id, 0);
      outDegree.set(node.id, 0);
    }

    // Add edges
    for (const edge of graph.edges) {
      adjList.get(edge.from)?.add(edge.to);
      adjList.get(edge.to)?.add(edge.from); // Treat as undirected for most calculations
      
      outDegree.set(edge.from, (outDegree.get(edge.from) || 0) + 1);
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    return {
      adjList,
      inDegree,
      outDegree,
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length
    };
  }

  private detectCycles(structure: GraphStructure): number {
    const { adjList } = structure;
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    let cycleCount = 0;

    const dfs = (node: string): boolean => {
      visited.add(node);
      recursionStack.add(node);

      const neighbors = adjList.get(node) || new Set<string>();
      for (const neighbor of Array.from(neighbors)) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) {
            cycleCount++;
            return true;
          }
        } else if (recursionStack.has(neighbor)) {
          cycleCount++;
          return true;
        }
      }

      recursionStack.delete(node);
      return false;
    };

    const allNodes = Array.from(adjList.keys());
    for (const node of allNodes) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    return cycleCount;
  }

  private findLongestPath(structure: GraphStructure): number {
    const { adjList } = structure;
    let maxPath = 0;

    const dfs = (node: string, visited: Set<string>, depth: number): number => {
      visited.add(node);
      let maxDepth = depth;

      const neighbors = adjList.get(node) || new Set<string>();
      for (const neighbor of Array.from(neighbors)) {
        if (!visited.has(neighbor)) {
          maxDepth = Math.max(maxDepth, dfs(neighbor, new Set(visited), depth + 1));
        }
      }

      return maxDepth;
    };

    const allNodes = Array.from(adjList.keys());
    for (const node of allNodes) {
      maxPath = Math.max(maxPath, dfs(node, new Set(), 0));
    }

    return maxPath;
  }

  private countComponents(structure: GraphStructure): number {
    const { adjList } = structure;
    const visited = new Set<string>();
    let components = 0;

    const bfs = (start: string) => {
      const queue = [start];
      visited.add(start);

      while (queue.length > 0) {
        const node = queue.shift()!;
        const neighbors = adjList.get(node) || new Set<string>();
        for (const neighbor of Array.from(neighbors)) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    };

    const allNodes = Array.from(adjList.keys());
    for (const node of allNodes) {
      if (!visited.has(node)) {
        components++;
        bfs(node);
      }
    }

    return components;
  }

  private calculateClusteringCoefficient(structure: GraphStructure): number {
    const { adjList } = structure;
    let totalCoeff = 0;
    let nodeCount = 0;

    const adjListEntries = Array.from(adjList.entries());
    for (const [node, neighbors] of adjListEntries) {
      if (neighbors.size < 2) continue;

      let triangles = 0;
      const neighborArray = Array.from(neighbors);

      for (let i = 0; i < neighborArray.length; i++) {
        for (let j = i + 1; j < neighborArray.length; j++) {
          const neighborSet = adjList.get(neighborArray[i]);
          if (neighborSet && neighborSet.has(neighborArray[j])) {
            triangles++;
          }
        }
      }

      const possibleEdges = (neighbors.size * (neighbors.size - 1)) / 2;
      totalCoeff += possibleEdges > 0 ? triangles / possibleEdges : 0;
      nodeCount++;
    }

    return nodeCount > 0 ? totalCoeff / nodeCount : 0;
  }

  private calculateDistanceMetrics(structure: GraphStructure): { diameter: number; radius: number } {
    const { adjList } = structure;
    const nodes = Array.from(adjList.keys());
    let maxDistance = 0;
    let minMaxDistance = Infinity;

    const bfs = (start: string): number => {
      const distances = new Map<string, number>();
      const queue = [start];
      distances.set(start, 0);
      let maxDist = 0;

      while (queue.length > 0) {
        const node = queue.shift()!;
        const currentDist = distances.get(node)!;

        const neighbors = adjList.get(node) || new Set<string>();
        for (const neighbor of Array.from(neighbors)) {
          if (!distances.has(neighbor)) {
            distances.set(neighbor, currentDist + 1);
            maxDist = Math.max(maxDist, currentDist + 1);
            queue.push(neighbor);
          }
        }
      }

      return maxDist;
    };

    for (const node of nodes) {
      const maxDist = bfs(node);
      maxDistance = Math.max(maxDistance, maxDist);
      minMaxDistance = Math.min(minMaxDistance, maxDist);
    }

    return {
      diameter: maxDistance,
      radius: minMaxDistance === Infinity ? 0 : minMaxDistance
    };
  }

  extractFeatures(graph: GraphData): GraphFeatures {
    if (graph.nodes.length === 0) {
      return {
        nodeCount: 0, edgeCount: 0, density: 0, avgDegree: 0, maxDegree: 0,
        minDegree: 0, degreeVariance: 0, hasLoops: 0, cycleCount: 0,
        longestPath: 0, components: 0, avgClusteringCoeff: 0,
        diameter: 0, radius: 0, isConnected: 0
      };
    }

    const structure = this.buildGraphStructure(graph);
    const degrees = Array.from(structure.outDegree.values());
    
    const avgDegree = degrees.reduce((a, b) => a + b, 0) / degrees.length;
    const maxDegree = Math.max(...degrees);
    const minDegree = Math.min(...degrees);
    const degreeVariance = degrees.reduce((acc, deg) => acc + Math.pow(deg - avgDegree, 2), 0) / degrees.length;
    
    const density = structure.nodeCount > 1 
      ? (2 * structure.edgeCount) / (structure.nodeCount * (structure.nodeCount - 1))
      : 0;

    const hasLoops = graph.edges.some((edge: Edge) => edge.from === edge.to) ? 1 : 0;
    const cycleCount = this.detectCycles(structure);
    const longestPath = this.findLongestPath(structure);
    const components = this.countComponents(structure);
    const avgClusteringCoeff = this.calculateClusteringCoefficient(structure);
    const { diameter, radius } = this.calculateDistanceMetrics(structure);
    const isConnected = components === 1 ? 1 : 0;

    return {
      nodeCount: structure.nodeCount,
      edgeCount: structure.edgeCount,
      density,
      avgDegree,
      maxDegree,
      minDegree,
      degreeVariance,
      hasLoops,
      cycleCount,
      longestPath,
      components,
      avgClusteringCoeff,
      diameter,
      radius,
      isConnected
    };
  }
}