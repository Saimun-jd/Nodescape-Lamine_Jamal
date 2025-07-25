import { useState, useCallback } from 'react';
import { GraphState, GraphNode, GraphEdge, AppMode } from '@/lib/graph-types';

const initialGraphState: GraphState = {
  nodes: [],
  edges: [],
  nextNodeId: 1,
};

export function useGraph() {
  const [graphState, setGraphState] = useState<GraphState>(initialGraphState);
  const [mode, setMode] = useState<AppMode>('addNode');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [previewEdge, setPreviewEdge] = useState<{ from: string; to: { x: number; y: number } } | null>(null);

  const addNode = useCallback((x: number, y: number) => {
    setGraphState(prev => {
      const newNode: GraphNode = {
        id: prev.nextNodeId.toString(),
        x,
        y,
        label: prev.nextNodeId.toString(),
      };
      
      return {
        ...prev,
        nodes: [...prev.nodes, newNode],
        nextNodeId: prev.nextNodeId + 1,
      };
    });
  }, []);

  const addEdge = useCallback((fromId: string, toId: string) => {
    if (fromId === toId) return; // Prevent self-loops
    
    setGraphState(prev => {
      // Check if edge already exists
      const edgeExists = prev.edges.some(
        edge => (edge.from === fromId && edge.to === toId) || 
                (edge.from === toId && edge.to === fromId)
      );
      
      if (edgeExists) return prev;
      
      const newEdge: GraphEdge = {
        id: `${fromId}-${toId}`,
        from: fromId,
        to: toId,
      };
      
      return {
        ...prev,
        edges: [...prev.edges, newEdge],
      };
    });
  }, []);

  const removeNode = useCallback((nodeId: string) => {
    setGraphState(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      edges: prev.edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId),
    }));
  }, []);

  const removeEdge = useCallback((edgeId: string) => {
    setGraphState(prev => ({
      ...prev,
      edges: prev.edges.filter(edge => edge.id !== edgeId),
    }));
  }, []);

  const clearGraph = useCallback(() => {
    setGraphState(initialGraphState);
    setSelectedNode(null);
    setPreviewEdge(null);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (mode === 'addEdge') {
      if (!selectedNode) {
        setSelectedNode(nodeId);
      } else if (selectedNode !== nodeId) {
        addEdge(selectedNode, nodeId);
        setSelectedNode(null);
        setPreviewEdge(null);
      }
    }
  }, [mode, selectedNode, addEdge]);

  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (mode === 'addNode') {
      addNode(x, y);
    } else if (mode === 'addEdge' && selectedNode) {
      // Cancel edge creation on canvas click
      setSelectedNode(null);
      setPreviewEdge(null);
    }
  }, [mode, addNode, selectedNode]);

  const handleMouseMove = useCallback((x: number, y: number) => {
    if (mode === 'addEdge' && selectedNode) {
      setPreviewEdge({ from: selectedNode, to: { x, y } });
    }
  }, [mode, selectedNode]);

  const cancelEdgeCreation = useCallback(() => {
    setSelectedNode(null);
    setPreviewEdge(null);
  }, []);

  return {
    graphState,
    mode,
    selectedNode,
    previewEdge,
    setMode,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    clearGraph,
    handleNodeClick,
    handleCanvasClick,
    handleMouseMove,
    cancelEdgeCreation,
  };
}
