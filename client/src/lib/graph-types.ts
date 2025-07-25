export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nextNodeId: number;
}

export type AppMode = 'addNode' | 'addEdge' | 'algorithm';
export type AlgorithmType = 'bfs' | 'dfs';

export interface AlgorithmStep {
  nodeId: string;
  action: 'visit' | 'complete';
  queue?: string[];
  stack?: string[];
}

export interface AlgorithmState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  steps: AlgorithmStep[];
  visitedNodes: Set<string>;
  currentlyVisiting: string | null;
  algorithm: AlgorithmType | null;
  startNode: string | null;
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
}
